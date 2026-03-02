# MKP Mobile Backend Contract v1.1

This document extends `backend/contract-v1.md` and becomes the canonical backend contract for the next implementation phase.

Use this contract for:
- Firebase Auth
- Firestore schema
- Firestore security rules
- Firestore indexes
- Cloud Functions
- Cloud Storage access policy for sermon media
- shared backend behavior used by the mobile app and the pastor dashboard

This contract is additive. It does not change the core privacy posture already locked for MVP.

---

## 1. Scope

Backend responsibilities in this phase:
- authentication and session restoration
- church membership and tenant isolation
- church-scoped content delivery
- care requests
- one-time private care follow-up threads
- church-wide inbound-only messages
- sermon media pipeline scaffolding
- STT/transcription scaffolding
- formation generation scaffolding
- aggregate analytics only
- notification scaffolding
- feature and tier gating at the church level

The backend does **not** own:
- personal journals
- personal reflection text
- mood notes
- private pastoral notes on members

---

## 2. Privacy Boundaries

### 2.1 Local-only data

These remain local-only in MVP and must not have Firestore collections:
- journals
- reflection text
- mood notes
- personal archive retrieval state

### 2.2 Server-backed data

These are server-backed:
- church metadata
- memberships and roles
- sermons and transcript artifacts
- formation weeks
- care requests
- care threads/messages
- church-wide messages
- aggregate analytics
- notification preferences and tokens

### 2.3 Explicit privacy rules

- There is no public prayer wall.
- There is no member-visible group prayer feed.
- There are no "I'm praying" counts.
- There is no server-side journal storage in MVP.
- There is no server-side mood-note storage in MVP.
- There are no hidden freeform pastoral notes on members in MVP.
- Care follow-up is a constrained workflow, not open chat.

---

## 3. Auth and Identity

### 3.1 Member auth (MVP)

Supported in MVP:
- email/password sign up
- email/password sign in
- password reset
- auth session restoration
- logout

Not in MVP:
- member SSO

### 3.2 Staff auth

Not required for MVP mobile implementation.

Later option:
- Google or Microsoft SSO for pastor dashboard staff users
- if introduced, it should be gated by church plan/features

### 3.3 Identity binding

All church-scoped reads and writes require:
- a Firebase Auth user
- an active membership record at `/churches/{churchId}/members/{uid}`

The user profile at `/users/{uid}` is global and minimal.
Church authority is determined by the church membership document, not by client state.

---

## 4. Multi-Tenancy and Tenant Isolation

MKP uses church-scoped nested Firestore paths for tenant isolation.

Canonical tenant boundary:
- `/churches/{churchId}/...`

Isolation requirements:
- deny by default
- no cross-church reads
- no cross-church writes
- no client-side church lookup by join code
- all membership-sensitive operations validated in Cloud Functions
- pastor dashboard uses the same backend and must obey the same church boundary model

This is logical tenant isolation, not SQL schema isolation. It is still the canonical and secure approach for Firestore if rules and functions are written correctly.

---

## 5. Canonical Role Model

The canonical church-scoped role set is:
- `member`
- `pastor`
- `admin`
- `care_team`
- `communications`
- `media_team`

### 5.1 Role intent

`member`
- standard member app access
- may read only own private care follow-up thread(s)
- may not publish church content
- may not access church-wide care queues

`pastor`
- may access care queues and care threads
- may publish church messages
- may manage sermon/content lifecycle
- may access analytics for their church

`admin`
- full church administration within the church tenant
- may manage roles, church settings, messages, sermons, analytics, and care flows

`care_team`
- may access care requests and care threads
- may send the one allowed church reply in a care thread
- may not manage sermons unless separately granted later
- may not publish church-wide messages unless separately granted later

`communications`
- may publish church-wide messages
- may not access care queues unless also pastor/admin in a later model
- may not manage sermon media unless separately granted later

`media_team`
- may manage sermon media upload/source metadata only
- may not access care requests
- may not send care replies
- may not publish church-wide messages unless separately granted later

### 5.2 Role model constraints

MVP uses one effective role value on the membership document.
If multi-role assignment is needed later, it should be introduced intentionally and documented in a future contract version.

---

## 6. Feature and Tier Gating

Church-level feature availability is controlled at the church document level.

Recommended church fields:

```ts
plan: 'standard' | 'growth' | 'enterprise'
features: {
  careThreads: boolean,
  churchMessages: boolean,
  mediaPipeline: boolean,
  sermonTranscription: boolean,
  formationGeneration: boolean,
  dashboardSSO: boolean
}
```

Gating model:
- roles determine who may do something
- plan/features determine whether the church has access to that capability at all

Security rule:
- frontend hiding is not sufficient
- feature gates must be enforced in Cloud Functions and, where practical, rules

---

## 7. Canonical Firestore Paths

All collections except `/users` are church-scoped.

### 7.1 `/users/{uid}`

Global, minimal identity profile.

Required fields:
- `email`
- `displayName`
- `currentChurchId`
- `createdAt`
- `lastLoginAt`
- `preferredLanguage`

Optional future fields:
- `isStaff`
- `newBelieverStartedAt`

### 7.2 `/users/{uid}/preferences/communication`

Optional synced communication preferences.

Fields:
- `churchMessagesEnabled`
- `careReplyNotificationsEnabled`
- `formationNotificationsEnabled`
- `updatedAt`

### 7.3 `/users/{uid}/fcmTokens/{tokenId}`

Optional FCM token storage.

Fields:
- `token`
- `platform`
- `createdAt`
- `lastUsedAt`

### 7.4 `/churches/{churchId}`

Church tenant root document.

Required fields:
- `name`
- `slug`
- `timezone`
- `defaultLanguage`
- `supportedLanguages`
- `plan`
- `features`
- `branding`
- `createdAt`
- `updatedAt`

Recommended fields:
- `logoUrl`
- `iconUrl`
- `listenBaseUrl`

### 7.5 `/churches/{churchId}/private/config`

Server-only config. No client read access.

Fields:
- `joinCodeHash`
- `joinCodeSalt`
- `codeGeneratedAt`

### 7.6 `/churches/{churchId}/members/{uid}`

Church membership record.

Required fields:
- `displayName`
- `email`
- `role`
- `status`
- `joinedAt`
- `lastActiveAt`

Allowed status values:
- `active`
- `inactive`
- `pending`
- `blocked`
- `left`

### 7.7 `/churches/{churchId}/sermons/{sermonId}`

Sunday sermon metadata.

Required fields:
- `title`
- `preacherName`
- `date`
- `language`
- `status`
- `sourceType`
- `createdAt`
- `updatedAt`

Recommended fields:
- `series`
- `partNumber`
- `listenUrl`
- `bibleRefs`
- `audioStoragePath`
- `transcriptionStatus`
- `formationStatus`
- `approvedBy`
- `approvedAt`
- `publishedAt`

Allowed status values:
- `draft`
- `uploaded`
- `transcribing`
- `transcribed`
- `formation_generated`
- `approved`
- `published`
- `failed`

### 7.8 `/churches/{churchId}/sermons/{sermonId}/transcripts/{versionId}`

Transcript artifact for STT and content generation.

Required fields:
- `provider`
- `language`
- `createdAt`
- `retentionDeleteAfter`

Recommended fields:
- `content`
- `segments`
- `confidence`
- `source`
- `status`
- `errorCode`
- `errorMessage`

Retention rule:
- transcript retention target is 7 days unless later overridden intentionally

### 7.9 `/churches/{churchId}/formationWeeks/{weekId}`

Formation week derived from a sermon anchor.

Required fields:
- `weekStartDate`
- `sermonId`
- `language`
- `status`
- `createdAt`
- `updatedAt`

Recommended nested content:
- `sunday`
- `days.monday` through `days.saturday`
- `listen`
- `truths`
- `scriptureRefs`

Allowed status values:
- `draft`
- `generated`
- `approved`
- `published`

### 7.10 `/churches/{churchId}/careRequests/{requestId}`

Explicit care request submitted by a member.

Canonical fields:
- `type`
- `submitterId`
- `submitterName`
- `content`
- `status`
- `isAnonymous`
- `createdAt`
- `resolvedAt`
- `resolvedBy`
- `categoryId`
- `preferredChannel`
- `threadId`

Allowed type values:
- `prayer`
- `testimony`
- `care_support`

Allowed preferred channel values:
- `in_app`
- `email`

Allowed status values:
- `pending`
- `in_progress`
- `resolved`
- `closed`

### 7.11 `/churches/{churchId}/careThreads/{threadId}`

Private one-time care follow-up thread.

Canonical fields:
- `requestId`
- `memberUserId`
- `categoryId`
- `preferredChannel`
- `status`
- `maxChurchReplies`
- `churchReplyCount`
- `lastMessageAt`
- `createdAt`
- `updatedAt`

Allowed status values:
- `awaiting_reply`
- `closed`

MVP rule:
- `maxChurchReplies` is always `1`
- `churchReplyCount` must never exceed `1`

### 7.12 `/churches/{churchId}/careThreads/{threadId}/messages/{messageId}`

Messages inside a private care follow-up thread.

Canonical fields:
- `senderType`
- `senderUserId`
- `body`
- `createdAt`

Allowed sender types:
- `member`
- `church`

MVP message shape:
- message 1: member submission
- message 2: optional church reply
- no open-ended thread after that second message

### 7.13 `/churches/{churchId}/churchMessages/{messageId}`

Church-wide inbound-only message feed.

Canonical fields:
- `title`
- `body`
- `kind`
- `createdAt`
- `publishedBy`
- `audience`
- `expiresAt`

Allowed kind values:
- `pastoral`
- `announcement`
- `reminder`

MVP rule:
- church messages are inbound-only broadcasts
- members do not reply in this collection

### 7.14 `/churches/{churchId}/analyticsWeekly/{weekStartDate}`

Weekly aggregate analytics.

Canonical fields:
- `weekStartDate`
- `activeMembers`
- `formationViews`
- `careRequestsSubmitted`
- `careRequestsResolved`
- `churchMessagesPublished`
- `computedAt`

Analytics must remain aggregate-only.
There is no journal text, no mood-note text, and no pastoral note corpus.

---

## 8. Care Workflows

### 8.1 Submit care request

Flow:
1. member submits care request
2. backend validates active membership
3. backend writes `careRequests/{requestId}`
4. if `preferredChannel == in_app` and church feature `careThreads == true`, backend creates a care thread
5. backend seeds the first message from the member
6. backend returns `requestId` and optional `threadId`

### 8.2 One-time encouragement rule

This is a locked MVP behavior.

- Church may send one reply maximum in-app.
- After the church reply, the thread closes.
- Members do not continue an open-ended in-app conversation after that.
- If more support is needed, a new explicit care request must be created.

This rule must be enforced by Cloud Functions, not just client behavior.

### 8.3 No hidden pastoral records

The care system must not become a hidden pastoral notes database.

Not supported in MVP:
- freeform private staff-only notes on members
- unbounded counseling logs
- long-term private profile annotations

Allowed operational fields:
- `status`
- `assignedTo`
- `categoryId`
- timestamps
- structured workflow tags if explicitly approved later

---

## 9. Church Messages

Church messages are a separate church-wide inbound-only broadcast feed.

Requirements:
- active members may read church messages for their church only
- members may not write church messages
- only `pastor`, `admin`, or `communications` may publish/update/delete church messages
- `media_team` may not publish church messages unless future role expansion explicitly changes this

This collection will be consumed by:
- mobile member app
- pastor dashboard / church staff web app

---

## 10. Sermon Media and STT Pipeline

### 10.1 Media upload

Sermon media is church-scoped.

Recommended storage path:
- `sermons/{churchId}/{sermonId}/original/*`

Upload authority:
- `media_team`
- `pastor`
- `admin`

### 10.2 STT pipeline

Provider target in current architecture:
- Deepgram for transcription

Pipeline stages:
1. sermon media upload
2. sermon metadata write/update
3. `transcribeOnUpload` (or equivalent server pipeline trigger)
4. transcript artifact stored in `transcripts/{versionId}`
5. transcript retention timer set
6. `generateFormationContent` may run after successful transcript generation

### 10.3 Retention

Locked target retention policy:
- original uploaded sermon audio: 24 hours after successful processing, unless later contract revision changes this
- transcript artifact retention: 7 days
- formation output is retained
- approved sermon metadata is retained

### 10.4 Approval

Formation content generated from sermon material should support a pastor approval step before publish.

---

## 11. Analytics

Analytics are aggregate-only.

Allowed analytics categories in MVP:
- active members
- formation view counts
- care request counts
- care resolution counts
- church message counts
- new believer starts

Later dashboard work may expand presentation and drill-down, but not the privacy boundary.

Explicitly disallowed analytics inputs in MVP:
- raw journal text
- raw reflection text
- mood note text
- private pastoral notes

---

## 12. Notifications

Notification support may use FCM and/or notification documents later.

MVP backend targets:
- care reply notification to a member when a church reply is sent
- church message notification when a church-wide message is published
- formation notification scaffolding later

Notification preferences may be stored under `/users/{uid}/preferences/communication`.

---

## 13. Cloud Functions Contract

### 13.1 Immediate implementation targets

`joinChurch`
- validates join code via `/private/config`
- creates membership
- returns church context

`submitCareRequest`
- validates active membership
- creates care request
- creates care thread when allowed
- seeds first message when thread is created

`respondToCareThread`
- church-side only
- validates role
- validates feature gate
- validates `churchReplyCount < 1`
- writes one church reply message
- increments reply count
- closes thread

`publishChurchMessage`
- church-side only
- validates role
- validates church feature gate
- writes church message

### 13.2 Deferred but planned

`notifyMemberCareReply`
- notification hook after church reply

`notifyChurchMessagePublished`
- broadcast hook for church messages

`transcribeOnUpload`
- STT pipeline trigger

`generateFormationContent`
- sermon-to-formation generation step

`computeWeeklyAnalytics`
- scheduled weekly aggregation

### 13.3 Enforcement rule

Business rules that matter for security or workflow integrity must be enforced in functions, not trusted to the client.

Examples:
- one church reply max
- role checks for publish/respond actions
- feature/tier gating
- join code validation

---

## 14. Firestore Rules Intent

Rules must enforce:
- deny by default
- active membership required for church-scoped reads/writes
- members read only their own care threads and care-thread messages
- members may create only their own care requests
- only `pastor`, `admin`, and `care_team` may read church care queues and care threads
- only `pastor`, `admin`, and `communications` may write church messages
- `media_team` does not gain care or church-message access
- analytics are readable only by allowed church staff roles
- no Firestore rules scope exists for journals or mood notes because those remain local-only

Rules should remain conservative. Complex workflow constraints should be enforced in functions.

---

## 15. Encryption and Sensitive Data Handling

Firebase provides:
- encryption in transit
- encryption at rest

MVP posture relies on:
- strict tenant isolation
- local-only journals and mood notes
- deny-by-default rules
- narrow explicit server-side care submissions only
- no sensitive freeform pastoral notes store

Do not introduce app-level encrypted private pastoral notes in MVP.
That would create a new privacy and governance surface that is explicitly out of scope.

---

## 16. Pastor Dashboard Boundary

The pastor dashboard is a separate web application.
It is not part of the mobile app codebase, but it will consume the same Firebase backend.

Requirements:
- same tenant isolation rules
- same role model
- same feature/tier gating
- no server-side journal access because journals are not stored server-side
- no hidden member-note system added implicitly through the dashboard

Dashboard work may proceed after backend contract and core mobile backend flows are stable.

---

## 17. MVP vs Later

### MVP backend target
- auth
- church membership
- care requests
- one-time care reply threads
- church messages
- role-safe tenant isolation
- sermon media scaffolding
- STT/transcription scaffolding
- formation generation scaffolding
- aggregate analytics scaffolding

### Later
- member SSO
- staff/dashboard SSO
- multi-role memberships
- advanced analytics presentation
- expanded notification orchestration
- richer media management workflows
- cloud sync for journals
- pastoral notes system

---

## 18. Implementation Order

The next backend implementation order should be:
1. lock this contract
2. update rules and indexes to match
3. scaffold/extend functions
4. implement care request / care thread / church message flows
5. implement membership/join flow if still missing
6. implement sermon media and STT scaffolding
7. implement analytics and notification scaffolding
8. run emulator tests
9. wire frontend to stable backend flows

