# MKP Firebase Staging Setup

This is the step-by-step staging setup guide for the real Firebase environment used before TestFlight release.

Scope locked for staging:

- Church-scoped tenant isolation is mandatory.
- Journals, mood notes, and reflection text remain local-only.
- No public prayer wall.
- No pastoral notes system.
- Canonical roles remain:
  - `member`
  - `pastor`
  - `admin`
  - `care_team`
  - `communications`
  - `media_team`

---

## 0. What you are creating

Use three environments:

- Local emulator project alias: `mkp-mobile-dev`
- Real staging project: `mkp-mobile-staging`
- Real production project later: `mkp-mobile-prod`

Staging is the only real Firebase project you should connect the app to right now.

---

## 1. Before you touch Firebase

Do this first:

1. Confirm the repo is clean.
2. Commit and push current work on `main`.
3. Do not seed or deploy anything until that push is complete.

Helpful commands:

```bash
git status
git add .
git commit -m "Prepare MKP staging Firebase setup"
git push origin main
```

---

## 2. Create the Firebase projects

Create these project IDs in Firebase Console:

1. `mkp-mobile-staging`
2. `mkp-mobile-prod`

Only `mkp-mobile-staging` needs full setup right now.

In `mkp-mobile-staging`, enable:

1. Authentication
2. Firestore Database
3. Storage
4. Cloud Functions
5. Billing on Blaze plan

For Authentication:

1. Go to `Build` -> `Authentication`.
2. Click `Get started`.
3. Enable `Email/Password`.

For Firestore:

1. Go to `Build` -> `Firestore Database`.
2. Click `Create database`.
3. Choose `Production mode`.
4. Pick a U.S. region consistent with your team preference.

For Storage:

1. Go to `Build` -> `Storage`.
2. Click `Get started`.
3. Use the same general region family as Firestore when possible.

---

## 3. Register the staging iOS app

Because the immediate goal is TestFlight readiness:

1. In Firebase Console for `mkp-mobile-staging`, click `Add app`.
2. Choose `iOS`.
3. Use staging bundle ID such as `com.mkp.mobile.staging`.
4. Download the config file if Firebase offers it, even if the current app only uses REST calls.

Also collect the Firebase Web API key from project settings because the current app uses it directly for Auth REST calls.

You need these values from staging:

- Firebase project ID
- Web API key
- Functions base URL

For this repo, the expected Functions URL format is:

```text
https://us-central1-mkp-mobile-staging.cloudfunctions.net
```

---

## 4. Point the Firebase CLI at the right project

From `backend/`:

```bash
firebase login
firebase use staging
```

If needed, verify aliases:

```bash
cat .firebaserc
```

Expected aliases:

- `dev`
- `staging`
- `prod`

---

## 5. Deploy staging in the right order

From `backend/`, deploy in this order:

1. Firestore rules
2. Storage rules
3. Firestore indexes
4. Functions

Commands:

```bash
firebase use staging
firebase deploy --only firestore:rules
firebase deploy --only storage
firebase deploy --only firestore:indexes
firebase deploy --only functions
```

Why this order:

- Rules lock down the project first.
- Indexes prevent avoidable query failures.
- Functions deploy after the boundaries are in place.

---

## 6. Configure the app for local vs staging

The app now expects environment-driven backend selection.

Local emulator config:

```bash
cp .env.local.example .env.local
```

Staging config:

```bash
cp .env.staging.example .env.staging.local
```

Then edit `.env.staging.local` and replace:

- `REPLACE_WITH_STAGING_WEB_API_KEY`

Required staging values:

- `EXPO_PUBLIC_APP_ENV=staging`
- `EXPO_PUBLIC_USE_FIREBASE_EMULATORS=false`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID=mkp-mobile-staging`
- `EXPO_PUBLIC_FIREBASE_API_KEY=<staging web api key>`
- `EXPO_PUBLIC_FIREBASE_FUNCTIONS_BASE_URL=https://us-central1-mkp-mobile-staging.cloudfunctions.net`

Important:

- Do not set `EXPO_PUBLIC_USE_FIREBASE_EMULATORS=true` in staging.
- Do not point TestFlight builds at `mkp-mobile-prod` yet.

---

## 7. Seed real staging church data

Do not use `backend/functions/seed.js` against staging.

That file is emulator-only by design.

For staging, create these records safely:

1. Two churches:
   - one fully enabled church
   - one secondary church for cross-tenant isolation checks
2. One user per canonical role
3. Membership docs per church
4. Private join-code config docs with salted hashed join codes

Minimum church feature flags for the main staging church:

- `careThreads: true`
- `churchMessages: true`
- `mediaPipeline: true`
- `sermonTranscription: true`
- `formationGeneration: true`
- `dashboardSSO: false`

Secondary church:

- use either the same flags or reduced flags if you want feature-gate testing

Use randomized staging join codes, not the emulator test values.

---

## 8. Validate the core staging flows

### Auth

1. Create a fresh user in the app.
2. Sign in.
3. Close and reopen the app.
4. Confirm the session restores.

Expected result:

- no church connected before join
- `getSessionContext` works

### Church join

1. Enter the real staging church join code.
2. Confirm the user joins the correct church.
3. Try a bad join code and confirm it fails.

Expected result:

- `/users/{uid}.currentChurchId` is set
- `/churches/{churchId}/members/{uid}` exists and is `active`

### Firestore tenant isolation

Verify:

1. church A member cannot read church B data
2. church A staff cannot operate on church B records
3. local-only reflection/journal data never appears in Firestore

### Functions

Validate these callables in staging:

1. `getSessionContext`
2. `joinChurch`
3. `saveCommunicationPreferences`
4. `submitCareRequest`
5. `respondToCareThread`
6. `publishChurchMessage`
7. `createSermonUpload`
8. `completeSermonUpload`
9. `transcribeOnUpload`
10. `generateFormationContent`
11. `updateFormationWeekStatus`
12. `computeWeeklyAnalytics`

### Storage

As a `media_team`, `pastor`, or `admin` user:

1. create sermon upload metadata
2. upload a file to the returned path
3. complete the upload

As a `member` user:

1. attempt the same flow
2. confirm it is blocked

---

## 9. What to set now vs later

Set now:

- Firebase staging project
- Auth provider
- Firestore
- Storage
- Functions
- project aliases
- app env values
- staging church docs
- staging join code hashes and salts
- staging test users and memberships

Set later:

- App Check
- APNs / push notifications
- email delivery provider
- external transcription provider secrets
- TTS proxy secrets

---

## 10. Known risks before first staging deploy

1. App Check is still off for all callables.
2. Join codes are salted SHA-256 today, which is acceptable for staging but should be reviewed again before production hardening.
3. Notification delivery is still scaffolded and not true push.
4. There is no safe real-project seed script yet.
5. TestFlight readiness still needs Apple signing/build configuration outside Firebase.

---

## 11. Recommended first-pass execution sequence

1. Commit and push current repo state.
2. Create `mkp-mobile-staging`.
3. Enable Auth, Firestore, Storage, and billing.
4. Register the staging iOS app.
5. Collect project ID and Web API key.
6. Set local staging env file values.
7. Deploy rules, indexes, and functions to staging.
8. Seed two churches and role-based accounts.
9. Test auth and join flow.
10. Test church isolation.
11. Test care, church messages, formation, analytics, and Storage upload.
12. Only after that, prepare the TestFlight build.

---

## 12. What Codex should do next

Recommended next tasks in order:

1. Create a safe staging seed script that can write real staging church data.
2. Add a short deployment checklist command reference.
3. Add a staging build profile once Apple/TestFlight setup is ready.
