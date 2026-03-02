# MKP Backend Test Plan v1

This test plan validates the backend defined in `backend/contract-v1.1.md`.

## Test Environment

Use Firebase emulators for:
- Auth
- Firestore
- Functions
- Storage when media upload work begins

Use test users across at least two churches:
- Church A member
- Church A pastor/admin
- Church A care_team
- Church A communications
- Church A media_team
- Church B member
- Church B pastor/admin

The purpose is to prove tenant isolation as well as role boundaries.

---

## 1. Auth Tests

### 1.1 Sign up
- create email/password account
- verify user document creation expectations

### 1.2 Sign in
- sign in with valid credentials
- reject invalid credentials

### 1.3 Password reset
- initiate password reset successfully
- reject invalid email format

### 1.4 Session restore
- verify authenticated session can restore cleanly on app relaunch

Pass criteria:
- valid users authenticate
- invalid users do not gain access

---

## 2. Join Church and Membership Tests

### 2.1 Valid join code
- call `joinChurch` with valid code
- create active membership doc
- set or update `/users/{uid}.currentChurchId`

### 2.2 Invalid join code
- call `joinChurch` with invalid code
- return error without leaking church details

### 2.3 Client cannot read join code config
- direct client read to `/churches/{churchId}/private/config` must fail

Pass criteria:
- membership created only through valid function path
- join code secrets stay server-only

---

## 3. Tenant Isolation Tests

### 3.1 Cross-church read denial
- Church A member cannot read Church B documents
- Church A pastor cannot read Church B care queues

### 3.2 Cross-church write denial
- Church A staff cannot write into Church B subcollections

### 3.3 Dashboard-equivalent staff isolation
- Church A pastor/admin access remains limited to Church A

Pass criteria:
- no cross-tenant access succeeds

---

## 4. Role Boundary Tests

### 4.1 Member restrictions
- member cannot read church-wide care queue
- member cannot publish church messages
- member can read only own care thread/messages

### 4.2 Care team restrictions
- `care_team` can read care requests/threads
- `care_team` cannot publish church messages
- `care_team` cannot upload sermon media

### 4.3 Communications restrictions
- `communications` can publish church messages
- `communications` cannot read care queue unless contract changes later
- `communications` cannot upload sermon media

### 4.4 Media team restrictions
- `media_team` can access sermon/media workflow only
- `media_team` cannot read care requests or care threads
- `media_team` cannot publish church messages

### 4.5 Pastor/Admin
- `pastor` and `admin` can access authorized church scopes

Pass criteria:
- each role only accesses its intended surfaces

---

## 5. Care Request Tests

### 5.1 Submit care request
- member submits valid care request
- request stored with correct submitter identity

### 5.2 Member impersonation denial
- member cannot submit request on behalf of another uid

### 5.3 Preferred channel = in_app
- if `careThreads` feature enabled, thread created and first message seeded

### 5.4 Preferred channel = email
- no in-app thread created when contract logic says not to

Pass criteria:
- requests are valid, scoped, and correctly seeded

---

## 6. Care Thread Tests

### 6.1 Member read own thread
- member can read only own care thread and messages

### 6.2 Church reply once
- authorized church role sends one reply successfully

### 6.3 Church second reply denied
- second church reply fails
- thread remains closed after first church reply

### 6.4 Member open-ended reply denial
- member cannot convert the thread into an open chat if workflow forbids it

Pass criteria:
- one-reply-max rule holds under function enforcement

---

## 7. Church Message Tests

### 7.1 Publish church message
- `pastor`, `admin`, or `communications` can publish

### 7.2 Member read church messages
- active member can read church-scoped messages

### 7.3 Member write denial
- member cannot create/update/delete church messages

### 7.4 Media team denial
- `media_team` cannot publish church messages

Pass criteria:
- broadcast feed is inbound-only for members

---

## 8. Feature / Tier Gating Tests

### 8.1 Disabled feature blocks function
- disabled `careThreads` feature prevents thread creation
- disabled `churchMessages` feature prevents publish flow

### 8.2 Role alone is not enough
- authorized role without church feature enabled is still blocked

### 8.3 Feature enabled but wrong role
- feature enabled does not override role restriction

Pass criteria:
- roles and church features both gate behavior correctly

---

## 9. Sermon Media Tests

### 9.1 Upload authority
- only `media_team`, `pastor`, `admin` can upload/manage sermon media

### 9.2 Unauthorized upload denial
- member/care_team/communications cannot upload sermon media

### 9.3 Sermon metadata consistency
- sermon doc records source metadata correctly

Pass criteria:
- media pipeline entry is secure and role-scoped

---

## 10. STT / Transcript Tests

### 10.1 Upload trigger path
- sermon media upload moves sermon into transcribing flow

### 10.2 Transcript write
- transcript artifact written to `transcripts/{versionId}`

### 10.3 Failure handling
- failed transcription writes a failure state without exposing secrets

### 10.4 Retention metadata
- transcript artifact includes retention delete timestamp

Pass criteria:
- transcript lifecycle is represented safely even before full production rollout

---

## 11. Formation Generation Tests

### 11.1 Formation output created
- valid transcript/sermon inputs can generate `formationWeeks/{weekId}`

### 11.2 Language handling
- language fields remain correct for EN/ES paths

### 11.3 Approval state
- generated formation content can remain draft/approved/published as contract requires

Pass criteria:
- formation docs are structurally valid and stateful

---

## 12. Analytics Tests

### 12.1 Aggregate generation
- weekly analytics doc created with aggregate counts

### 12.2 No local-only leakage
- analytics job does not read journals or mood-note text

### 12.3 Role visibility
- only approved staff roles can read analytics docs

Pass criteria:
- analytics remain aggregate-only and privacy-safe

---

## 13. Notification Tests

### 13.1 Care reply notification hook
- member notification path triggers when church reply is created

### 13.2 Church message notification hook
- notification path triggers when church message is published

### 13.3 Preference gating
- notifications respect stored communication preferences when implemented

Pass criteria:
- notification scaffolding is aligned with backend flows

---

## 14. Explicit Privacy Regression Tests

These must always remain true:
- there is no Firestore collection for journals
- there is no Firestore collection for mood notes
- there is no public prayer wall collection
- there is no member-visible group prayer feed
- there is no staff-only freeform pastoral notes collection introduced silently

Pass criteria:
- backend remains within the locked privacy boundary

---

## 15. Exit Criteria for Mobile Backend MVP

The backend is ready for mobile app integration when all of the following are true:
- auth works
- join church works
- tenant isolation holds
- care requests work
- care thread one-reply-max works
- church messages work
- role boundaries hold
- feature/tier gates hold
- sermon upload security is defined
- STT and formation scaffolding exist without breaking privacy boundaries
- emulator validation passes for critical flows
