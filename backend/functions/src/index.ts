/**
 * MKP Mobile Cloud Functions
 *
 * Contract:  backend/contract-v1.1.md
 * Roadmap:   backend/roadmap-v1.md
 * Test plan: backend/test-plan-v1.md
 *
 * Phase 1 (this file): joinChurch
 * Phase 3 (next):      submitCareRequest, respondToCareThread
 * Phase 4 (next):      publishChurchMessage
 * Phase 5 (next):      notifyMemberCareReply, notifyChurchMessagePublished
 * Phase 7 (next):      transcribeOnUpload
 * Phase 8 (next):      generateFormationContent
 * Phase 9 (next):      computeWeeklyAnalytics
 */

import * as admin from "firebase-admin";
import * as crypto from "crypto";
import { onCall, HttpsError } from "firebase-functions/v2/https";

admin.initializeApp();

const db = admin.firestore();

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

    // ------------------------------------------------------------------
    // 1. Read private config via Admin SDK.
    //    Firestore rules block ALL client access to /private/{docId}.
    //    Only Cloud Functions (admin credentials) can read this path.
    // ------------------------------------------------------------------
    const configRef = db.doc(`churches/${churchId}/private/config`);
    const configSnap = await configRef.get();

    if (!configSnap.exists) {
      // Return generic error – do not confirm whether the church exists.
      throw new HttpsError("not-found", "Invalid join code.");
    }

    const config = configSnap.data() as {
      joinCodeHash?: string;
      joinCodeSalt?: string;
      codeGeneratedAt?: admin.firestore.Timestamp;
    };

    if (!config.joinCodeHash || !config.joinCodeSalt) {
      // Config exists but is missing required fields – treat as invalid.
      throw new HttpsError("not-found", "Invalid join code.");
    }

    // ------------------------------------------------------------------
    // 2. Validate join code.
    // ------------------------------------------------------------------
    const computedHash = hashJoinCode(config.joinCodeSalt, normalizedCode);
    if (computedHash !== config.joinCodeHash) {
      throw new HttpsError("permission-denied", "Invalid join code.");
    }

    // ------------------------------------------------------------------
    // 3. Load church root document to return name in context.
    // ------------------------------------------------------------------
    const churchRef = db.doc(`churches/${churchId}`);
    const churchSnap = await churchRef.get();

    if (!churchSnap.exists) {
      // Should not happen if private/config exists, but guard anyway.
      throw new HttpsError("not-found", "Church not found.");
    }

    const church = churchSnap.data() as { name?: string };

    // ------------------------------------------------------------------
    // 4. Load Firebase Auth record for display name / email.
    // ------------------------------------------------------------------
    const userRecord = await admin.auth().getUser(uid);
    const now = admin.firestore.FieldValue.serverTimestamp();

    // ------------------------------------------------------------------
    // 5. Create or restore the membership document.
    // ------------------------------------------------------------------
    const memberRef = db.doc(`churches/${churchId}/members/${uid}`);
    const memberSnap = await memberRef.get();
    let role = "member";

    if (memberSnap.exists) {
      const existing = memberSnap.data() as { status: string; role: string };

      if (existing.status === "blocked") {
        throw new HttpsError("permission-denied", "Unable to join this church.");
      }

      role = existing.role;

      // Re-activate a member who previously left or became inactive.
      await memberRef.update({ status: "active", lastActiveAt: now });
    } else {
      // New membership – always starts as 'member'.
      // Role elevation (pastor, admin, etc.) is done by church admins,
      // never through the join flow.
      await memberRef.set({
        displayName: userRecord.displayName ?? userRecord.email ?? uid,
        email: userRecord.email ?? "",
        role: "member",
        status: "active",
        joinedAt: now,
        lastActiveAt: now,
      });
    }

    // ------------------------------------------------------------------
    // 6. Update the user's global profile.
    //    merge:true preserves existing fields (email, displayName, etc.)
    // ------------------------------------------------------------------
    const userRef = db.doc(`users/${uid}`);
    await userRef.set(
      {
        currentChurchId: churchId,
        lastLoginAt: now,
      },
      { merge: true }
    );

    return {
      churchId,
      churchName: church.name ?? "",
      role,
    };
  }
);

// ---------------------------------------------------------------------------
// Phase 3 (deferred): submitCareRequest
// ---------------------------------------------------------------------------
// TODO: implement submitCareRequest
//   Input:  { churchId, type, content, isAnonymous, preferredChannel, categoryId? }
//   - verify active membership (role: member+)
//   - write careRequests/{requestId} with submitterId = uid, status = 'pending'
//   - if preferredChannel == 'in_app' && church.features.careThreads == true:
//       create careThreads/{threadId}  (maxChurchReplies: 1, churchReplyCount: 0)
//       seed first message: { senderType: 'member', senderUserId: uid, body: content }
//   - return { requestId, threadId? }

// ---------------------------------------------------------------------------
// Phase 3 (deferred): respondToCareThread
// ---------------------------------------------------------------------------
// TODO: implement respondToCareThread
//   Input:  { churchId, threadId, body }
//   - verify caller role is pastor | admin | care_team
//   - verify church.features.careThreads == true
//   - read careThreads/{threadId}; reject if churchReplyCount >= maxChurchReplies (1)
//   - write messages/{messageId}: { senderType: 'church', senderUserId: uid, body }
//   - atomically increment churchReplyCount and set status = 'closed'
//   - trigger notifyMemberCareReply (Phase 5)

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
