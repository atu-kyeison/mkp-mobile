# MKP Mobile – Project Memory

## Stack
- React Native (mobile app)
- Firebase: Auth, Firestore, Cloud Functions (Node 20), Storage
- TypeScript throughout
- Cloud Functions: firebase-functions v5 (v2 API), firebase-admin v12

## Backend canonical docs
- `backend/contract-v1.1.md` – schema, roles, privacy boundaries (canonical)
- `backend/roadmap-v1.md` – phase-by-phase implementation plan
- `backend/test-plan-v1.md` – emulator test plan

## Backend phase status (as of 2026-03-02)
- Phase 0: Contract locked ✓
- Phase 1: `joinChurch` implemented ✓
- Phase 2: Rules + indexes aligned to v1.1 ✓
- Phase 3: `submitCareRequest`, `respondToCareThread` implemented ✓
- Phase 4: `publishChurchMessage` implemented ✓
- Phase 5: notification scaffolding implemented ✓
- Phase 6: sermon media pipeline implemented ✓
- Phase 7: STT/transcription scaffold implemented ✓
- Phase 8: formation generation implemented ✓
- Phase 9: analytics implemented ✓

## Key backend architecture decisions
- Journals / mood notes / reflection text: LOCAL ONLY, no Firestore paths
- Firestore roles: member | pastor | admin | care_team | communications | media_team
- Join code validation: function-only (SHA-256 + salt); stored at /churches/{id}/private/config
- Care threads: maxChurchReplies=1, enforced in functions not rules
- careRequests.create: function-only (blocked in rules, Phase 3 implements submitCareRequest)
- churchMessages: client-readable, function/role-gated writes enforced server-side
- careThreads/messages: member sees own thread only (get() on parent in rules)
- Indexes: COLLECTION scope for careThreads + churchMessages (church-always-scoped)

## Cloud Functions import pattern (v2)
```typescript
import { onCall, HttpsError } from "firebase-functions/v2/https";
```

## Notable TODOs in backend
- enforceAppCheck: false → set true when App Check configured
- crypto/SHA-256 join code hashing → evaluate bcrypt for production
- wire real FCM delivery into Phase 5 scaffold once Firebase Messaging/App Check setup is ready
- wire Storage emulator/rules integration tests if we want automated direct-upload rule validation beyond callable lifecycle tests
- replace the Phase 7 transcription scaffold with a real Storage-triggered Deepgram path when provider credentials are ready
- add scheduled automation for weekly analytics once deployment/runtime scheduling is configured

## Mobile app features already implemented (local/placeholder)
- Care inbox (local)
- Church messages feed (local)
- Mood history with journal linking (local)
- Communication toggles wired to real behavior
