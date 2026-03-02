# MKP Backend Roadmap v1

This roadmap translates `backend/contract-v1.1.md` into an implementation sequence.

## Principles

- Build in contract order, not convenience order.
- Do not move journals or mood notes to Firestore.
- Enforce tenant isolation and workflow integrity in rules and functions.
- Keep the mobile app backend first; pastor dashboard follows the same backend once core flows are stable.
- Avoid overbuilding dashboard-only features before mobile backend MVP is testable.

---

## Phase 0: Contract Lock

### Goal
Freeze backend behavior before implementation expands.

### Inputs
- `backend/contract-v1.md`
- `backend/contract-v1.1.md`

### Done when
- `contract-v1.1.md` is treated as canonical for the next backend pass
- role model is fixed
- care thread and church message schema is fixed
- privacy boundaries are fixed

---

## Phase 1: Auth and Membership

### Goal
Enable secure sign-in and tenant-aware church membership.

### Work
- implement `joinChurch`
- validate join codes via `/churches/{churchId}/private/config`
- create/update `/churches/{churchId}/members/{uid}`
- update `/users/{uid}` with `currentChurchId`
- define session restore expectations for client

### Files
- `backend/functions/src/index.ts`
- `backend/firestore.rules`
- `backend/contract-v1.1.md` if a field correction is needed

### Dependencies
- existing Firebase scaffold
- join code hashing design already in contract

### Done when
- a signed-in user can join a church securely
- no client can query join codes directly
- only active members can read church-scoped data

---

## Phase 2: Rules and Index Alignment

### Goal
Bring rules and indexes up to v1.1 contract.

### Work
- extend rules for:
  - `careThreads`
  - `careThreads/{threadId}/messages`
  - `churchMessages`
  - expanded roles
  - church feature gates where practical
- add indexes for:
  - care threads by status/date
  - care thread messages by time if needed
  - church messages by created date/kind

### Files
- `backend/firestore.rules`
- `backend/firestore.indexes.json`

### Dependencies
- Phase 0 complete

### Done when
- members can only see their own care threads/messages
- church staff roles are scoped correctly
- `media_team` has no care/message access
- queries used by mobile flows are indexed

---

## Phase 3: Care Requests and Care Threads

### Goal
Support private care requests and one-time encouragement replies.

### Work
- implement `submitCareRequest`
- create `careRequests/{requestId}`
- create `careThreads/{threadId}` when allowed
- seed first member message
- implement `respondToCareThread`
- enforce `churchReplyCount < 1`
- close thread after church reply

### Files
- `backend/functions/src/index.ts`
- possibly helper files under `backend/functions/src/`
- `backend/firestore.rules`

### Dependencies
- Phases 1 and 2 complete

### Done when
- member can submit care request
- optional in-app thread is created correctly
- church can reply once
- no open-ended chat is possible

---

## Phase 4: Church Messages

### Goal
Support church-wide inbound-only broadcasts.

### Work
- implement `publishChurchMessage`
- write `/churches/{churchId}/churchMessages/{messageId}`
- enforce publish permissions for `pastor`, `admin`, `communications`
- confirm member read-only behavior

### Files
- `backend/functions/src/index.ts`
- `backend/firestore.rules`
- `backend/firestore.indexes.json`

### Dependencies
- Phase 2 complete

### Done when
- approved staff roles can publish church messages
- members can read only church-scoped messages
- members cannot write or reply

---

## Phase 5: Notification Scaffolding

### Goal
Prepare backend-driven notifications without blocking core app flows.

### Work
- define `/users/{uid}/preferences/communication`
- define `/users/{uid}/fcmTokens/{tokenId}`
- stub notification hooks:
  - `notifyMemberCareReply`
  - `notifyChurchMessagePublished`
- keep implementation minimal if FCM setup is not ready yet

### Files
- `backend/functions/src/index.ts`
- `backend/contract-v1.1.md` only if needed for field clarification

### Dependencies
- Phases 3 and 4 complete

### Done when
- preference/token schema is stable
- hooks are scaffolded for later wiring

---

## Phase 6: Sermon Media Pipeline

### Goal
Create the secure entry point for sermon media and metadata.

### Work
- define Storage rules for sermon media
- allow upload authority only for `media_team`, `pastor`, `admin`
- finalize sermon source fields
- wire sermon upload metadata flow

### Files
- `backend/storage.rules` if introduced
- `backend/functions/src/index.ts`
- `backend/contract-v1.1.md` only if needed

### Dependencies
- roles finalized
- Firebase Storage config ready

### Done when
- unauthorized users cannot upload sermon media
- authorized roles can create the sermon source lifecycle safely

---

## Phase 7: STT / Transcription

### Goal
Support transcription lifecycle without leaking raw sermon content indefinitely.

### Work
- scaffold `transcribeOnUpload`
- integrate Deepgram later in this phase
- store transcript artifacts in `/transcripts/{versionId}`
- set retention delete timestamps
- handle failure states

### Files
- `backend/functions/src/index.ts`
- helper modules under `backend/functions/src/`

### Dependencies
- Phase 6 complete
- provider credentials available

### Done when
- uploaded sermon can move to `transcribing`
- transcript record can be written
- retention policy is represented in data

---

## Phase 8: Formation Generation

### Goal
Turn sermon material into structured formation content.

### Work
- scaffold `generateFormationContent`
- create/update `formationWeeks/{weekId}`
- preserve EN/ES handling
- support approval before publish

### Files
- `backend/functions/src/index.ts`
- helper generation modules

### Dependencies
- transcript data available

### Done when
- backend can create a valid `formationWeeks` object from sermon inputs
- approval/publish states are represented

---

## Phase 9: Analytics

### Goal
Produce aggregate-only analytics with no private journal leakage.

### Work
- implement `computeWeeklyAnalytics`
- compute:
  - active members
  - formation views if instrumented
  - care counts
  - church message counts
  - new believer starts if tracked
- keep output weekly and aggregate only

### Files
- `backend/functions/src/index.ts`
- analytics helpers

### Dependencies
- earlier domain events/collections stable

### Done when
- weekly analytics docs can be computed safely
- no local-only data is pulled into backend analytics

---

## Phase 10: Emulator Validation

### Goal
Prove the backend works before app wiring expands.

### Work
- run Firestore/Functions emulators
- validate auth/membership flow
- validate care request flow
- validate church message flow
- validate role boundaries
- validate one-reply-max enforcement

### Dependencies
- phases 1 through 9 as needed

### Done when
- critical happy paths and permission boundaries pass locally

---

## Phase 11: Mobile App Wiring

### Goal
Replace local placeholders with real backend calls where intended.

### Work
- connect auth/session restore
- connect join church
- connect care request submission
- connect care inbox/thread retrieval
- connect church messages feed
- keep journals and moods local-only

### Dependencies
- backend emulator flows proven

### Done when
- mobile app can use backend-backed church flows safely
- local-only privacy boundaries remain intact

---

## Phase 12: Pastor Dashboard Start

### Goal
Begin dashboard work only after backend surfaces are stable.

### Work
- consume existing backend from a separate web app
- build care queue
- build church message publishing
- build sermon/media workflow
- add analytics views later

### Dependencies
- backend core stable

### Done when
- dashboard work does not force schema churn in the mobile backend

---

## Recommended Immediate Order

1. Auth + membership (`joinChurch`)
2. Rules/index alignment
3. Care requests + care threads
4. Church messages
5. Notification scaffolding
6. Media upload security
7. STT/transcription scaffolding
8. Formation generation scaffolding
9. Analytics scaffolding
10. Emulator tests
11. Mobile app wiring
12. Dashboard build
