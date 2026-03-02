/**
 * MKP Mobile Cloud Functions
 *
 * Contract:  backend/contract-v1.1.md
 * Roadmap:   backend/roadmap-v1.md
 * Test plan: backend/test-plan-v1.md
 *
 * Phase 1 (complete): joinChurch
 * Phase 3 (complete): submitCareRequest, respondToCareThread
 * Phase 4 (next):     publishChurchMessage
 * Phase 5 (next):     notifyMemberCareReply, notifyChurchMessagePublished
 * Phase 7 (next):     transcribeOnUpload
 * Phase 8 (next):     generateFormationContent
 * Phase 9 (next):     computeWeeklyAnalytics
 */

import * as admin from "firebase-admin";
import * as crypto from "crypto";
import { onCall, HttpsError } from "firebase-functions/v2/https";

admin.initializeApp();

const db = admin.firestore();

// ---------------------------------------------------------------------------
// Internal types
// ---------------------------------------------------------------------------

interface MemberData {
  role: string;
  status: string;
  displayName: string;
  email: string;
}

interface ChurchData {
  name?: string;
  features?: {
    careThreads?: boolean;
    churchMessages?: boolean;
    mediaPipeline?: boolean;
    sermonTranscription?: boolean;
    formationGeneration?: boolean;
    dashboardSSO?: boolean;
  };
}

interface CareThreadData {
  status: string;
  churchReplyCount: number;
  maxChurchReplies: number;
  memberUserId: string;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Hash a join code against a stored salt using SHA-256.
 * The same normalization (trim only, no case folding) must be applied both
 * when the hash is stored and when it is validated here.
 *
 * TODO: evaluate bcrypt for production if higher-entropy join codes are not
 * guaranteed. SHA-256 + salt is adequate for codes with ≥6 alphanumeric
 * characters under function-rate-limiting, but bcrypt is more resistant to
 * offline brute-force if the config document were ever exposed.
 */
function hashJoinCode(salt: string, code: string): string {
  return crypto.createHash("sha256").update(salt + code).digest("hex");
}

/**
 * Read and validate a church member document.
 * Throws HttpsError if the member doesn't exist or is not active.
 * Returns the member data for role checks.
 */
async function requireActiveMember(
  churchId: string,
  uid: string
): Promise<MemberData> {
  const snap = await db.doc(`churches/${churchId}/members/${uid}`).get();
  if (!snap.exists) {
    throw new HttpsError("permission-denied", "Not a member of this church.");
  }
  const data = snap.data() as MemberData;
  if (data.status !== "active") {
    throw new HttpsError("permission-denied", "Membership is not active.");
  }
  return data;
}

/**
 * Read church document and return its data.
 * Throws HttpsError if the church does not exist.
 */
async function requireChurch(churchId: string): Promise<ChurchData> {
  const snap = await db.doc(`churches/${churchId}`).get();
  if (!snap.exists) {
    throw new HttpsError("not-found", "Church not found.");
  }
  return snap.data() as ChurchData;
}

// Roles that may access care queues and respond to care threads (contract §5.1).
const CARE_STAFF_ROLES = new Set(["pastor", "admin", "care_team"]);

// ---------------------------------------------------------------------------
// Phase 1: joinChurch
// ---------------------------------------------------------------------------

/**
 * joinChurch
 *
 * Validates a church join code and creates or restores the calling user's
 * membership in the specified church.
 *
 * Join code lookup is function-only. The /churches/{id}/private/config
 * document is blocked from all client SDK reads by Firestore rules.
 *
 * Request data:
 *   { churchId: string, joinCode: string }
 *
 * Returns:
 *   { churchId: string, churchName: string, role: string }
 *
 * Errors:
 *   unauthenticated   – caller has no Firebase Auth session
 *   invalid-argument  – missing or empty churchId / joinCode
 *   not-found         – invalid join code (generic; does not confirm whether
 *                       the church exists to avoid enumeration)
 *   permission-denied – member is blocked, or join code hash mismatch
 */
export const joinChurch = onCall(
  {
    // TODO: set enforceAppCheck: true once Firebase App Check is configured
    // for production. App Check binds calls to known app binaries, providing
    // an additional layer of protection against join-code brute-force.
    enforceAppCheck: false,
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "Must be signed in to join a church."
      );
    }

    const uid = request.auth.uid;
    const { churchId, joinCode } = request.data as {
      churchId?: unknown;
      joinCode?: unknown;
    };

    if (!churchId || typeof churchId !== "string" || churchId.trim() === "") {
      throw new HttpsError("invalid-argument", "churchId is required.");
    }
    if (!joinCode || typeof joinCode !== "string" || joinCode.trim() === "") {
      throw new HttpsError("invalid-argument", "joinCode is required.");
    }

    const normalizedCode = joinCode.trim();

    // Read private config via Admin SDK.
    // Firestore rules block ALL client access to /private/{docId}.
    const configRef = db.doc(`churches/${churchId}/private/config`);
    const configSnap = await configRef.get();

    if (!configSnap.exists) {
      // Generic error – do not confirm whether the church exists.
      throw new HttpsError("not-found", "Invalid join code.");
    }

    const config = configSnap.data() as {
      joinCodeHash?: string;
      joinCodeSalt?: string;
      codeGeneratedAt?: admin.firestore.Timestamp;
    };

    if (!config.joinCodeHash || !config.joinCodeSalt) {
      throw new HttpsError("not-found", "Invalid join code.");
    }

    const computedHash = hashJoinCode(config.joinCodeSalt, normalizedCode);
    if (computedHash !== config.joinCodeHash) {
      throw new HttpsError("permission-denied", "Invalid join code.");
    }

    const church = await requireChurch(churchId);

    const userRecord = await admin.auth().getUser(uid);
    const now = admin.firestore.FieldValue.serverTimestamp();

    const memberRef = db.doc(`churches/${churchId}/members/${uid}`);
    const memberSnap = await memberRef.get();
    let role = "member";

    if (memberSnap.exists) {
      const existing = memberSnap.data() as MemberData;
      if (existing.status === "blocked") {
        throw new HttpsError("permission-denied", "Unable to join this church.");
      }
      role = existing.role;
      await memberRef.update({ status: "active", lastActiveAt: now });
    } else {
      await memberRef.set({
        displayName: userRecord.displayName ?? userRecord.email ?? uid,
        email: userRecord.email ?? "",
        role: "member",
        status: "active",
        joinedAt: now,
        lastActiveAt: now,
      });
    }

    // Update global user profile; merge preserves existing fields.
    await db.doc(`users/${uid}`).set(
      { currentChurchId: churchId, lastLoginAt: now },
      { merge: true }
    );

    return { churchId, churchName: church.name ?? "", role };
  }
);

// ---------------------------------------------------------------------------
// Phase 3: submitCareRequest
// ---------------------------------------------------------------------------

/**
 * submitCareRequest
 *
 * Creates a care request for the calling member. If the request channel is
 * in-app and the church has careThreads enabled, a private care thread is
 * created and the member's initial message is seeded. All care writes are
 * function-only; the client cannot write to careRequests or careThreads.
 *
 * Request data:
 *   {
 *     churchId:         string,
 *     type:             'prayer' | 'testimony' | 'care_support',
 *     content:          string,
 *     isAnonymous:      boolean,
 *     preferredChannel: 'in_app' | 'email',
 *     categoryId?:      string
 *   }
 *
 * Returns:
 *   { requestId: string, threadId?: string }
 *
 * Errors:
 *   unauthenticated      – no auth session
 *   invalid-argument     – missing or invalid fields
 *   permission-denied    – not an active member
 *   not-found            – church not found
 */
export const submitCareRequest = onCall(
  { enforceAppCheck: false },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be signed in.");
    }

    const uid = request.auth.uid;
    const {
      churchId,
      type,
      content,
      isAnonymous,
      preferredChannel,
      categoryId,
    } = request.data as {
      churchId?: unknown;
      type?: unknown;
      content?: unknown;
      isAnonymous?: unknown;
      preferredChannel?: unknown;
      categoryId?: unknown;
    };

    // Input validation
    if (!churchId || typeof churchId !== "string" || churchId.trim() === "") {
      throw new HttpsError("invalid-argument", "churchId is required.");
    }
    if (!type || !["prayer", "testimony", "care_support"].includes(type as string)) {
      throw new HttpsError(
        "invalid-argument",
        "type must be prayer, testimony, or care_support."
      );
    }
    if (!content || typeof content !== "string" || content.trim() === "") {
      throw new HttpsError("invalid-argument", "content is required.");
    }
    if (!preferredChannel || !["in_app", "email"].includes(preferredChannel as string)) {
      throw new HttpsError(
        "invalid-argument",
        "preferredChannel must be in_app or email."
      );
    }
    if (categoryId !== undefined && typeof categoryId !== "string") {
      throw new HttpsError("invalid-argument", "categoryId must be a string.");
    }

    // Verify active membership
    const member = await requireActiveMember(churchId, uid);

    // Load church to check feature flags
    const church = await requireChurch(churchId);

    const now = admin.firestore.FieldValue.serverTimestamp();
    const shouldCreateThread =
      preferredChannel === "in_app" &&
      church.features?.careThreads === true;

    // Pre-generate document references so IDs are known before any write.
    const requestRef = db.collection(`churches/${churchId}/careRequests`).doc();
    const requestId = requestRef.id;

    let threadId: string | undefined;
    let threadRef: admin.firestore.DocumentReference | undefined;
    let messageRef: admin.firestore.DocumentReference | undefined;

    if (shouldCreateThread) {
      threadRef = db.collection(`churches/${churchId}/careThreads`).doc();
      threadId = threadRef.id;
      messageRef = threadRef.collection("messages").doc();
    }

    // Write all docs atomically.
    const batch = db.batch();

    batch.set(requestRef, {
      type,
      submitterId: uid,
      // submitterName is stored server-side regardless of isAnonymous.
      // The isAnonymous flag controls display in the pastoral interface;
      // it does not remove the record from the care workflow (contract §7.10).
      submitterName: member.displayName,
      content: (content as string).trim(),
      status: "pending",
      isAnonymous: isAnonymous === true,
      preferredChannel,
      categoryId: (categoryId as string | undefined) ?? null,
      threadId: threadId ?? null,
      createdAt: now,
      resolvedAt: null,
      resolvedBy: null,
    });

    if (shouldCreateThread && threadRef && messageRef && threadId) {
      batch.set(threadRef, {
        requestId,
        memberUserId: uid,
        categoryId: (categoryId as string | undefined) ?? null,
        preferredChannel,
        status: "awaiting_reply",
        maxChurchReplies: 1,    // locked MVP value (contract §7.11)
        churchReplyCount: 0,
        lastMessageAt: now,
        createdAt: now,
        updatedAt: now,
      });

      batch.set(messageRef, {
        senderType: "member",
        senderUserId: uid,
        body: (content as string).trim(),
        createdAt: now,
      });
    }

    await batch.commit();

    const result: { requestId: string; threadId?: string } = { requestId };
    if (threadId) result.threadId = threadId;
    return result;
  }
);

// ---------------------------------------------------------------------------
// Phase 3: respondToCareThread
// ---------------------------------------------------------------------------

/**
 * respondToCareThread
 *
 * Allows an authorized church staff member to send the one permitted church
 * reply in a private care thread. The thread is closed after this reply.
 *
 * The one-reply-max rule is enforced inside a Firestore transaction to
 * prevent race conditions if two staff members attempt to reply simultaneously
 * (contract §8.2, §13.3).
 *
 * Request data:
 *   { churchId: string, threadId: string, body: string }
 *
 * Returns:
 *   { threadId: string, messageId: string }
 *
 * Errors:
 *   unauthenticated      – no auth session
 *   invalid-argument     – missing or invalid fields
 *   permission-denied    – not active care staff
 *   not-found            – church or thread not found, or feature disabled
 *   failed-precondition  – thread already closed or reply limit reached
 */
export const respondToCareThread = onCall(
  { enforceAppCheck: false },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be signed in.");
    }

    const uid = request.auth.uid;
    const { churchId, threadId, body } = request.data as {
      churchId?: unknown;
      threadId?: unknown;
      body?: unknown;
    };

    // Input validation
    if (!churchId || typeof churchId !== "string" || churchId.trim() === "") {
      throw new HttpsError("invalid-argument", "churchId is required.");
    }
    if (!threadId || typeof threadId !== "string" || threadId.trim() === "") {
      throw new HttpsError("invalid-argument", "threadId is required.");
    }
    if (!body || typeof body !== "string" || body.trim() === "") {
      throw new HttpsError("invalid-argument", "body is required.");
    }

    // Verify active membership and role
    const member = await requireActiveMember(churchId, uid);
    if (!CARE_STAFF_ROLES.has(member.role)) {
      throw new HttpsError(
        "permission-denied",
        "Not authorized to respond to care threads."
      );
    }

    // Verify church feature gate
    const church = await requireChurch(churchId);
    if (church.features?.careThreads !== true) {
      throw new HttpsError(
        "not-found",
        "Care threads are not enabled for this church."
      );
    }

    const threadRef = db.doc(`churches/${churchId}/careThreads/${threadId}`);

    // Use a transaction to atomically enforce the one-reply-max rule.
    // Without a transaction, two simultaneous calls could both pass the
    // count check and write two replies.
    const messageId = await db.runTransaction(async (tx) => {
      const threadSnap = await tx.get(threadRef);

      if (!threadSnap.exists) {
        throw new HttpsError("not-found", "Care thread not found.");
      }

      const thread = threadSnap.data() as CareThreadData;

      if (thread.status === "closed") {
        throw new HttpsError(
          "failed-precondition",
          "This care thread is already closed."
        );
      }

      if (thread.churchReplyCount >= thread.maxChurchReplies) {
        // Should not normally be reached if status transitions are correct,
        // but guard defensively to enforce the contract hard limit.
        throw new HttpsError(
          "failed-precondition",
          "Maximum church replies already sent for this thread."
        );
      }

      const msgRef = threadRef.collection("messages").doc();
      const now = admin.firestore.FieldValue.serverTimestamp();

      tx.set(msgRef, {
        senderType: "church",
        senderUserId: uid,
        body: (body as string).trim(),
        createdAt: now,
      });

      tx.update(threadRef, {
        churchReplyCount: admin.firestore.FieldValue.increment(1),
        status: "closed",
        lastMessageAt: now,
        updatedAt: now,
      });

      return msgRef.id;
    });

    // TODO (Phase 5): trigger notifyMemberCareReply
    //   - read memberUserId from thread (requires a separate read after tx)
    //   - check /users/{memberUserId}/preferences/communication.careReplyNotificationsEnabled
    //   - send FCM push if token exists and preference is true

    return { threadId: threadId as string, messageId };
  }
);

// ---------------------------------------------------------------------------
// Phase 4 (deferred): publishChurchMessage
// ---------------------------------------------------------------------------
// TODO: implement publishChurchMessage
//   Input:  { churchId, title, body, kind, audience, expiresAt? }
//   - verify caller role is pastor | admin | communications
//   - verify church.features.churchMessages == true
//   - write churchMessages/{messageId}: { title, body, kind, audience,
//       publishedBy: uid, createdAt, expiresAt? }
//   - trigger notifyChurchMessagePublished (Phase 5)

// ---------------------------------------------------------------------------
// Phase 5 (deferred): notification hooks
// ---------------------------------------------------------------------------
// TODO: notifyMemberCareReply
//   - read target member's /users/{uid}/fcmTokens and /preferences/communication
//   - send FCM push if careReplyNotificationsEnabled == true

// TODO: notifyChurchMessagePublished
//   - fan-out FCM push to all active church members who have tokens and
//     churchMessagesEnabled == true

// ---------------------------------------------------------------------------
// Phase 7 (deferred): transcribeOnUpload
// ---------------------------------------------------------------------------
// TODO: implement transcribeOnUpload (Storage onObject trigger)
//   - triggered by sermon audio upload to sermons/{churchId}/{sermonId}/original/*
//   - update sermon status → 'transcribing'
//   - call Deepgram STT API
//   - write transcripts/{versionId} with retentionDeleteAfter = now + 7 days
//   - update sermon status → 'transcribed' or 'failed'

// ---------------------------------------------------------------------------
// Phase 8 (deferred): generateFormationContent
// ---------------------------------------------------------------------------
// TODO: implement generateFormationContent
//   - triggered after successful transcription
//   - derive formationWeeks/{weekId} from sermon + transcript
//   - preserve EN/ES language handling
//   - set status = 'generated' (requires pastor approval before 'published')

// ---------------------------------------------------------------------------
// Phase 9 (deferred): computeWeeklyAnalytics
// ---------------------------------------------------------------------------
// TODO: implement computeWeeklyAnalytics (scheduled function, weekly)
//   - aggregate: activeMembers, formationViews, careRequestsSubmitted,
//     careRequestsResolved, churchMessagesPublished, newBelieverStarts
//   - write analyticsWeekly/{weekStartDate}
//   - MUST NOT read local-only data (journals, mood notes are not in Firestore)
