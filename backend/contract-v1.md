# MKP Mobile Backend Contract v1

This document defines the canonical Firestore schema for MKP Mobile MVP.
All collections (except `/users`) are church-scoped under `/churches/{churchId}/`.

## Data Boundaries

| Data Type | Storage | Notes |
|-----------|---------|-------|
| Church metadata | Firestore | Server-backed |
| Member profiles | Firestore | Scoped to church |
| Sermons + transcripts | Firestore | Server-backed |
| Formation weeks | Firestore | Server-backed |
| Care requests | Firestore | Pastor-visible only |
| Analytics | Firestore | Aggregated weekly |
| **Journals** | **Local only** | AsyncStorage, no sync |
| **Mood notes** | **Local only** | AsyncStorage, no sync |

---

## Canonical Firestore Paths

### `/churches/{churchId}`

Church tenant root document (client-readable by members).

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Display name |
| `logoUrl` | string? | Church logo URL |
| `timezone` | string | IANA timezone (e.g., "America/New_York") |
| `createdAt` | timestamp | Creation timestamp |

**Note**: Join code is NOT stored here. See `/churches/{churchId}/private/config`.

---

### `/churches/{churchId}/private/config`

Server-only document. **No client read access** - Cloud Functions only.

| Field | Type | Description |
|-------|------|-------------|
| `joinCodeHash` | string | SHA-256 hash of join code |
| `joinCodeSalt` | string | Salt for hash verification |
| `codeGeneratedAt` | timestamp | When code was last regenerated |

**Join Code Lookup Flow**:
1. Client calls `joinChurch` Cloud Function with plaintext code
2. Function queries all churches' private/config docs (admin SDK)
3. Function hashes input with each salt, compares to stored hash
4. On match: creates membership; returns church ID
5. On failure: returns error (no church info leaked)

---

### `/churches/{churchId}/members/{uid}`

Church membership record. UID matches Firebase Auth UID.

| Field | Type | Description |
|-------|------|-------------|
| `displayName` | string | Member display name |
| `email` | string | Member email |
| `role` | string | "member" \| "leader" \| "pastor" \| "admin" |
| `status` | string | "active" \| "inactive" \| "pending" |
| `joinedAt` | timestamp | When member joined church |
| `lastActiveAt` | timestamp? | Last app activity |

---

### `/churches/{churchId}/sermons/{sermonId}`

Sunday sermon metadata.

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Sermon title |
| `preacherName` | string | Who preached |
| `date` | timestamp | Sermon date (Sunday) |
| `listenUrl` | string? | Audio/video link |
| `bibleRef` | string? | Scripture reference |
| `createdAt` | timestamp | Record creation |

---

### `/churches/{churchId}/sermons/{sermonId}/transcripts/{versionId}`

Sermon transcript versions (for AI processing).

| Field | Type | Description |
|-------|------|-------------|
| `version` | number | Transcript version |
| `content` | string | Full transcript text |
| `source` | string | "manual" \| "auto" |
| `createdAt` | timestamp | Upload timestamp |

---

### `/churches/{churchId}/formationWeeks/{weekId}`

Weekly formation content anchored to a Sunday.

`weekId` format: `YYYY-MM-DD` (Sunday date)

| Field | Type | Description |
|-------|------|-------------|
| `sermonId` | string | Reference to sermon |
| `sundayRecap` | string | Brief sermon summary |
| `days` | map | Day-keyed content (see below) |
| `createdAt` | timestamp | Record creation |

**`days` map structure** (keys: "monday" through "saturday"):

```
days.monday: {
  prompt: string,      // Reflection prompt
  prayer: string,      // Daily prayer
  truth: string        // Scripture/truth to meditate on
}
```

---

### `/churches/{churchId}/careRequests/{requestId}`

Care/prayer requests from members. Pastor/admin read-only.

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | "prayer" \| "testimony" \| "care_support" |
| `submitterId` | string | UID of submitter |
| `submitterName` | string | Display name (denormalized) |
| `content` | string | Request content |
| `status` | string | "pending" \| "in_progress" \| "resolved" |
| `isAnonymous` | boolean | Hide submitter from display |
| `createdAt` | timestamp | Submission timestamp |
| `resolvedAt` | timestamp? | Resolution timestamp |
| `resolvedBy` | string? | UID of resolver |
| `categoryId` | string | "pastor_conversation" \| "discipleship_next_steps" \| "accountability_support" \| "baptism_request" \| "baby_dedication_request" \| "difficult_season" \| "new_believer" \| "other" |
| `preferredChannel` | string | "in_app" \| "email" |
| `threadId` | string? | Private thread created for in-app follow-up |

---

### `/churches/{churchId}/careThreads/{threadId}`

Private one-to-one care follow-up thread between a member and the church team.

| Field | Type | Description |
|-------|------|-------------|
| `requestId` | string | Parent care request |
| `memberUserId` | string | Member UID |
| `categoryId` | string | Care support category |
| `preferredChannel` | string | "in_app" \| "email" |
| `status` | string | "awaiting_reply" \| "closed" |
| `maxChurchReplies` | number | Always `1` in MVP |
| `churchReplyCount` | number | Count of church replies sent |
| `lastMessageAt` | timestamp | Most recent message timestamp |
| `createdAt` | timestamp | Thread creation timestamp |
| `updatedAt` | timestamp | Last update timestamp |

**MVP constraint**:
- Church teams may send **one in-app reply maximum** per thread.
- After the first church reply, the thread becomes `closed`.
- This preserves MKP as a formation-first app rather than an ongoing chat surface.

---

### `/churches/{churchId}/careThreads/{threadId}/messages/{messageId}`

Messages within a private care thread.

| Field | Type | Description |
|-------|------|-------------|
| `senderType` | string | "member" \| "church" |
| `senderUserId` | string? | UID if applicable |
| `body` | string | Message content |
| `createdAt` | timestamp | Message timestamp |

**MVP messaging rule**:
- Message 1: member request
- Message 2: optional church reply
- No ongoing conversation thread beyond that second message

---

### `/churches/{churchId}/analyticsWeekly/{weekStartDate}`

Aggregated weekly analytics (pastor dashboard).

`weekStartDate` format: `YYYY-MM-DD` (Monday)

| Field | Type | Description |
|-------|------|-------------|
| `activeMembers` | number | Unique active members |
| `reflectionsCompleted` | number | Total reflections |
| `careRequestsSubmitted` | number | New care requests |
| `careRequestsResolved` | number | Resolved requests |
| `computedAt` | timestamp | When stats computed |

---

### `/users/{uid}`

Global user profile (cross-church, minimal).

| Field | Type | Description |
|-------|------|-------------|
| `email` | string | User email |
| `displayName` | string | Display name |
| `currentChurchId` | string? | Active church membership |
| `createdAt` | timestamp | Account creation |
| `lastLoginAt` | timestamp | Last authentication |

---

## Local-Only Data (No Firestore Collection)

### Journals

Stored in AsyncStorage under key `mkp_journals`.

```typescript
interface JournalEntry {
  id: string;           // UUID
  date: string;         // ISO date
  content: string;      // Journal text
  promptId?: string;    // Formation prompt reference
  createdAt: string;    // ISO timestamp
  updatedAt: string;    // ISO timestamp
}
```

**Rationale**: Journals are private spiritual reflections. MVP keeps them device-local
to maximize privacy and minimize backend complexity. Cloud sync deferred to post-MVP.

### Mood Notes

Stored in AsyncStorage under key `mkp_mood_notes`.

```typescript
interface MoodNote {
  id: string;           // UUID
  date: string;         // ISO date
  mood: number;         // 1-5 scale
  note?: string;        // Optional private note
  createdAt: string;    // ISO timestamp
}
```

**Rationale**: Mood tracking is personal and non-shareable. Local-only storage
protects sensitive mental health adjacent data.

---

## Security Model Summary

1. **Deny by default**: All paths require explicit allow rules
2. **Church isolation**: Members can only access their own church's data
3. **Role-based access**: Care requests visible only to pastor/admin roles
4. **No public paths**: No unauthenticated read access anywhere
5. **Join code protection**: Hashed storage in `/private/config` (function-only read); client lookup via Cloud Function only
6. **No journal paths**: Journals have no Firestore collection (local-only)

---

## Deferred to BE-05+

- Cloud Function: `joinChurch` (validate code, create membership)
- Cloud Function: `submitCareRequest` (server timestamp, validation)
- Cloud Function: `notifyPastor` (push notification for care escalation)
- Cloud Function: `computeWeeklyAnalytics` (scheduled aggregation)
- Storage rules for sermon audio uploads
- Backup/export functionality
