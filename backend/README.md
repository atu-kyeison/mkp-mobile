# MKP Mobile Backend

Firebase backend for MKP Mobile app.

Contract: `contract-v1.1.md` (canonical)
Roadmap:  `roadmap-v1.md`
Tests:    `test-plan-v1.md`

---

## Prerequisites

- Node.js 20+
- Firebase CLI: `npm install -g firebase-tools`
- Java 11+ (required by Firebase emulators)

---

## Setup

```bash
# Install function dependencies (run once, or after package.json changes)
cd functions
npm install
cd ..

# Login to Firebase (one time)
firebase login
```

---

## Local Emulator Testing

### Step 1 — Start the emulators

Run from the `backend/` directory:

```bash
firebase emulators:start
```

Emulator UI: http://localhost:4000

| Service   | Port |
|-----------|------|
| Auth      | 9099 |
| Firestore | 8080 |
| Functions | 5001 |
| Storage   | 9199 |
| UI        | 4000 |

Wait until all emulators report **ready** before continuing.

---

### Step 2 — Build the functions

Run from `backend/functions/`:

```bash
npm run build
```

The emulator loads compiled JS from `lib/`. Rebuild after any TypeScript change.

---

### Step 3 — Seed test data

Run from `backend/functions/` (emulators must be running):

```bash
npm run seed
```

This creates:

**church-alpha** — Grace Community Church
- `features.careThreads = true`
- `features.churchMessages = true`
- `features.mediaPipeline = true`
- `features.sermonTranscription = true`
- `features.formationGeneration = true`
- Join code: `GRACE2024`

**church-beta** — River of Life Church
- `features.careThreads = false`  ← for feature-gate tests
- `features.churchMessages = false`
- `features.mediaPipeline = false`
- `features.sermonTranscription = false`
- `features.formationGeneration = false`
- Join code: `RIVER2024`

**Test users** (all passwords: `password123`):

| uid         | email             | role           | church       |
|-------------|-------------------|----------------|--------------|
| uid-alice   | alice@test.com    | member         | church-alpha |
| uid-bob     | bob@test.com      | pastor         | church-alpha |
| uid-carol   | carol@test.com    | care_team      | church-alpha |
| uid-dave    | dave@test.com     | communications | church-alpha |
| uid-eve     | eve@test.com      | media_team     | church-alpha |
| uid-frank   | frank@test.com    | admin          | church-alpha |
| uid-grace   | grace@test.com    | member         | church-beta  |
| uid-henry   | henry@test.com    | pastor         | church-beta  |

Seed is idempotent — safe to re-run.

---

### Step 4 — Run emulator tests

Run from `backend/functions/` (emulators running + seed loaded + build complete):

```bash
npm run test:emulator
```

The test runner covers:
- `joinChurch` — valid code, wrong code, unauthenticated, missing args
- `saveCommunicationPreferences` — preference persistence at contract path
- `registerFcmToken` / `deleteFcmToken` — token lifecycle at contract path
- `submitCareRequest` — thread creation, email channel, feature-disabled church, bad type
- `respondToCareThread` — member blocked, media_team blocked, one reply allowed, second reply blocked, notification hook scaffold
- `publishChurchMessage` — member blocked, media_team blocked, pastor/communications allowed, feature gate, bad kind, notification preference gating
- `createSermonUpload` / `completeSermonUpload` — sermon source metadata flow, role gating, feature gating, upload path validation
- `transcribeOnUpload` — transcription scaffold, transcript artifact writes, retention metadata, failure-state handling
- `generateFormationContent` / `updateFormationWeekStatus` — formation week generation plus approval/publish transitions
- `computeWeeklyAnalytics` — aggregate weekly analytics with no local-only data access

---

## Manual Function Calls (curl)

### 1. Get an ID token from the Auth emulator

```bash
curl -s -X POST \
  'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=fake-key' \
  -H 'Content-Type: application/json' \
  -d '{"email":"alice@test.com","password":"password123","returnSecureToken":true}' \
  | grep -o '"idToken":"[^"]*"'
```

### 2. Call a function

```bash
# joinChurch
curl -X POST \
  'http://127.0.0.1:5001/mkp-mobile-dev/us-central1/joinChurch' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {ID_TOKEN}' \
  -d '{"data":{"churchId":"church-alpha","joinCode":"GRACE2024"}}'

# saveCommunicationPreferences
curl -X POST \
  'http://127.0.0.1:5001/mkp-mobile-dev/us-central1/saveCommunicationPreferences' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {ID_TOKEN}' \
  -d '{"data":{"churchMessagesEnabled":true,"careReplyNotificationsEnabled":true,"formationNotificationsEnabled":false}}'

# registerFcmToken
curl -X POST \
  'http://127.0.0.1:5001/mkp-mobile-dev/us-central1/registerFcmToken' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {ID_TOKEN}' \
  -d '{"data":{"tokenId":"device-alpha","token":"fcm-token-alpha","platform":"ios"}}'

# createSermonUpload  (requires pastor/admin/media_team — use bob@test.com, eve@test.com, or frank@test.com)
curl -X POST \
  'http://127.0.0.1:5001/mkp-mobile-dev/us-central1/createSermonUpload' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {EVE_TOKEN}' \
  -d '{"data":{"churchId":"church-alpha","title":"The Narrow Way","preacherName":"Bob Pastor","date":"2026-03-01T16:00:00.000Z","language":"en","sourceType":"audio_upload","fileName":"narrow-way.mp3","series":"Kingdom Rhythms","partNumber":2,"bibleRefs":["Matthew 7:13-14"]}}'

# submitCareRequest
curl -X POST \
  'http://127.0.0.1:5001/mkp-mobile-dev/us-central1/submitCareRequest' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {ID_TOKEN}' \
  -d '{"data":{"churchId":"church-alpha","type":"prayer","content":"Please pray for me.","isAnonymous":false,"preferredChannel":"in_app"}}'

# respondToCareThread  (requires pastor/admin/care_team token — use bob@test.com)
curl -X POST \
  'http://127.0.0.1:5001/mkp-mobile-dev/us-central1/respondToCareThread' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {BOB_TOKEN}' \
  -d '{"data":{"churchId":"church-alpha","threadId":"{THREAD_ID}","body":"We are praying for you."}}'

# publishChurchMessage  (requires pastor/admin/communications — use bob@test.com or dave@test.com)
curl -X POST \
  'http://127.0.0.1:5001/mkp-mobile-dev/us-central1/publishChurchMessage' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {BOB_TOKEN}' \
  -d '{"data":{"churchId":"church-alpha","title":"Sunday Service","body":"Join us at 10am.","kind":"announcement","audience":"all"}}'

# completeSermonUpload  (after client upload to the returned uploadPath)
curl -X POST \
  'http://127.0.0.1:5001/mkp-mobile-dev/us-central1/completeSermonUpload' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {BOB_TOKEN}' \
  -d '{"data":{"churchId":"church-alpha","sermonId":"{SERMON_ID}","audioStoragePath":"sermons/church-alpha/{SERMON_ID}/original/narrow-way.mp3"}}'

# transcribeOnUpload  (Phase 7 scaffold; requires pastor/admin)
curl -X POST \
  'http://127.0.0.1:5001/mkp-mobile-dev/us-central1/transcribeOnUpload' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {BOB_TOKEN}' \
  -d '{"data":{"churchId":"church-alpha","sermonId":"{SERMON_ID}","transcriptText":"Blessed are the peacemakers."}}'

# generateFormationContent  (requires pastor/admin)
curl -X POST \
  'http://127.0.0.1:5001/mkp-mobile-dev/us-central1/generateFormationContent' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {BOB_TOKEN}' \
  -d '{"data":{"churchId":"church-alpha","sermonId":"{SERMON_ID}"}}'

# updateFormationWeekStatus  (generated -> approved -> published)
curl -X POST \
  'http://127.0.0.1:5001/mkp-mobile-dev/us-central1/updateFormationWeekStatus' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {BOB_TOKEN}' \
  -d '{"data":{"churchId":"church-alpha","weekId":"{WEEK_ID}","status":"approved"}}'

# computeWeeklyAnalytics  (requires pastor/admin)
curl -X POST \
  'http://127.0.0.1:5001/mkp-mobile-dev/us-central1/computeWeeklyAnalytics' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {BOB_TOKEN}' \
  -d '{"data":{"churchId":"church-alpha","weekStartDate":"2026-03-01"}}'

# deleteFcmToken
curl -X POST \
  'http://127.0.0.1:5001/mkp-mobile-dev/us-central1/deleteFcmToken' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {ID_TOKEN}' \
  -d '{"data":{"tokenId":"device-alpha"}}'
```

---

## Deploy

```bash
# Rules only
firebase deploy --only firestore:rules

# Indexes only
firebase deploy --only firestore:indexes

# Storage rules only
firebase deploy --only storage

# Functions only
firebase deploy --only functions

# Everything
firebase deploy
```

---

## Structure

```
backend/
├── firebase.json               Firebase configuration + emulator ports
├── firestore.rules             Security rules (contract §14)
├── firestore.indexes.json      Composite indexes
├── storage.rules               Cloud Storage rules for sermon uploads
├── contract-v1.1.md            Canonical backend contract
├── roadmap-v1.md               Phase-by-phase implementation plan
├── test-plan-v1.md             Emulator test plan
├── .firebaserc                 Project aliases
└── functions/
    ├── package.json
    ├── tsconfig.json
    ├── seed.js                 Emulator seed script
    ├── emulator-test.js        Emulator test runner
    └── src/
        └── index.ts            Cloud Functions (Phases 1–9 complete)
```

---

## Phase Status

| Phase | Description                               | Status      |
|-------|-------------------------------------------|-------------|
| 0     | Contract lock                             | ✓ complete  |
| 1     | `joinChurch`                              | ✓ complete  |
| 2     | Rules + index alignment                   | ✓ complete  |
| 3     | `submitCareRequest`, `respondToCareThread`| ✓ complete  |
| 4     | `publishChurchMessage`                    | ✓ complete  |
| 5     | Notification scaffolding                  | ✓ complete  |
| 6     | Sermon media pipeline                     | ✓ complete  |
| 7     | STT / transcription                       | ✓ complete  |
| 8     | Formation generation                      | ✓ complete  |
| 9     | Analytics                                 | ✓ complete  |
| 10    | Emulator validation                       | ✓ complete through Phase 9 |
| 11    | Mobile app wiring                         | pending     |

---

## Privacy Boundaries (locked)

- Journals, mood notes, and reflection text are **local-only**. No Firestore paths exist for them.
- There is no public prayer wall.
- There is no server-side pastoral notes system.
- Care thread replies are capped at 1 per thread, enforced in Cloud Functions.
- All church-scoped data requires active membership (validated in rules and functions).
