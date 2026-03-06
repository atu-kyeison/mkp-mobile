# MKP Interim Church Submission Handling (Staging)

Date: 2026-03-04

## 1) Implementation plan (interim)

1. Keep Firestore as the system of record under each church tenant:
   - `/churches/{churchId}/careRequests/{requestId}`
2. On each submission, enqueue a church mailbox alert record:
   - `/churches/{churchId}/submissionMailboxAlerts/{requestId}`
3. If `churches/{churchId}/private/config.submissionMailbox` is configured, also write a handoff email doc:
   - `/mail/{autoId}` (Firebase Trigger Email extension-compatible)
4. Use role-gated callable updates for assignment + lifecycle (`updateCareRequestLifecycle`) instead of direct client writes.
5. Preserve existing care thread behavior (`respondToCareThread`) and auto-close linked request when church reply is sent.

## 2) Minimal schema/state for lifecycle

`careRequests` now tracks:
- `status`: `new | assigned | in_progress | closed`
- `ownerUserId`: nullable
- `ownerRole`: nullable
- `assignedAt`: timestamp|null
- `closedAt`: timestamp|null
- `closedBy`: uid|null
- `lastActionAt`: timestamp
- `lastActionBy`: uid
- `resolvedAt`, `resolvedBy` (kept for analytics compatibility)
- `mailboxDeliveryState`: `queued | not_configured`

`submissionMailboxAlerts` tracks:
- `status`: `queued`
- `queuedAt`, `updatedAt`, `deliveredAt`
- `mailboxAddress`
- `deliveryTarget`: `firebase_trigger_email_extension | manual_church_queue`
- `deliveryError` when mailbox is not configured
- Submission context fields (`type`, `categoryId`, `preferredChannel`, `contentPreview`, etc.)

## 3) Role-based visibility/ownership model

Visibility:
- `pastor`, `admin`, `care_team`: read `careRequests`, `careThreads`, `submissionMailboxAlerts`
- `member`, `communications`, `media_team`: no read access to church care queues

Ownership + lifecycle actions:
- `pastor`, `admin`: can assign/unassign anyone in care staff and change status
- `care_team`: can assign to self and change status if unassigned or assigned to self
- `member`: cannot mutate lifecycle

## 4) Function/rule updates required

Implemented:
- `submitCareRequest`
  - Adds lifecycle defaults (`status: new`, owner fields)
  - Writes `submissionMailboxAlerts/{requestId}`
  - Writes `/mail` handoff doc when mailbox configured
- `updateCareRequestLifecycle` (new callable)
  - Validates role + membership + status transitions
  - Enforces assignment rules and close/reopen semantics
- `respondToCareThread`
  - Auto-closes linked care request and sets resolution metadata
- Firestore rules
  - `careRequests` client `update` blocked (function-only)
  - Added read-only `submissionMailboxAlerts` path for care staff

## 5) Operational runbook for church staff

Intake:
1. Monitor `submissionMailboxAlerts` queue (or inbox if Trigger Email extension is active).
2. Open corresponding `careRequests/{requestId}`.

Triage:
1. Pastor/admin assigns owner via `updateCareRequestLifecycle` with `ownerUserId` + `status: assigned`.
2. Owner sets `status: in_progress` when follow-up begins.

Follow-up:
1. If in-app thread exists, respond once through `respondToCareThread`.
2. For email-channel submissions, follow church policy outside app.

Close:
1. Set `status: closed` via `updateCareRequestLifecycle`.
2. Confirm `closedAt`, `closedBy`, `resolvedAt`, `resolvedBy` are present.

## 6) Staging validation checklist (end-to-end)

1. Member submits each in-scope type:
   - prayer
   - testimony/gratitude
   - new believer follow-up
   - baptism interest
   - unsure next step
2. Verify each submission creates:
   - `careRequests/{requestId}` with `status: new`
   - `submissionMailboxAlerts/{requestId}` with `status: queued`
3. Verify `/mail` doc created when mailbox configured.
4. Verify `care_team` can read queues but cannot reassign to other users.
5. Verify `pastor/admin` can assign to care staff and close/reopen.
6. Verify cross-tenant isolation: church A staff cannot read church B submissions.
7. Verify `respondToCareThread` closes linked request and enforces one church reply max.
8. Verify no local-only data (journals/mood/reflections) appears in Firestore.

## 7) Risks / open items before TestFlight

1. Mail delivery depends on Trigger Email extension (or equivalent) being installed and monitored.
2. Mailbox queue is interim; no provider-level retry/webhook reconciliation in this phase.
3. App Check remains disabled on callables.
4. No dedicated church staff dashboard UI yet; operations rely on Firestore/admin tooling.
5. Ownership audit trail is minimal (latest action fields only, no full event log).
