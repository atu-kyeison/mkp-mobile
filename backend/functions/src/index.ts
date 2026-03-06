/**
 * MKP Mobile Cloud Functions
 *
 * Contract:  backend/contract-v1.1.md
 * Roadmap:   backend/roadmap-v1.md
 * Test plan: backend/test-plan-v1.md
 *
 * Phase 1 (complete): joinChurch
 * Phase 3 (complete): submitCareRequest, respondToCareThread
 * Phase 4 (complete): publishChurchMessage
 * Phase 5 (complete): saveCommunicationPreferences, registerFcmToken,
 *                     deleteFcmToken, notifyMemberCareReply,
 *                     notifyChurchMessagePublished
 * Phase 6 (complete): createSermonUpload, completeSermonUpload
 * Phase 7 (complete): transcribeOnUpload
 * Phase 8 (complete): generateFormationContent, updateFormationWeekStatus
 * Phase 9 (complete): computeWeeklyAnalytics
 */

import * as admin from "firebase-admin";
import {
  getFirestore,
  FieldValue,
  Timestamp,
  DocumentReference,
} from "firebase-admin/firestore";
import * as crypto from "crypto";
import { onCall, HttpsError } from "firebase-functions/v2/https";

admin.initializeApp();

const db = getFirestore();

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
  requestId?: string;
  status: string;
  churchReplyCount: number;
  maxChurchReplies: number;
  memberUserId: string;
  preferredChannel?: string;
  categoryId?: string | null;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

interface CommunicationPreferences {
  churchMessagesEnabled: boolean;
  careReplyNotificationsEnabled: boolean;
  formationNotificationsEnabled: boolean;
}

interface FcmTokenData {
  token: string;
  platform: string;
}

interface SermonData {
  title: string;
  preacherName: string;
  date: Timestamp;
  language: string;
  status: string;
  sourceType: string;
  audioStoragePath?: string;
  listenUrl?: string | null;
  bibleRefs?: string[];
  formationStatus?: string;
}

interface NotificationHookResult {
  hookTriggered: boolean;
  deliveryMode: "scaffold";
  targetUserCount: number;
  eligibleUserCount: number;
  tokenCount: number;
  deliveredCount: number;
  skippedReason: string | null;
}

interface UserProfileData {
  currentChurchId?: string;
  displayName?: string;
  email?: string;
  preferredLanguage?: string;
}

interface CareRequestData {
  status?: string;
  ownerUserId?: string | null;
  threadId?: string | null;
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

async function requireUserProfile(uid: string): Promise<UserProfileData> {
  const snap = await db.doc(`users/${uid}`).get();
  if (!snap.exists) {
    throw new HttpsError("not-found", "User profile not found.");
  }
  return snap.data() as UserProfileData;
}

async function requireCurrentChurchId(uid: string): Promise<string> {
  const profile = await requireUserProfile(uid);
  if (
    typeof profile.currentChurchId !== "string" ||
    profile.currentChurchId.trim() === ""
  ) {
    throw new HttpsError(
      "failed-precondition",
      "User is not connected to a church yet."
    );
  }
  return profile.currentChurchId;
}

// Roles that may access care queues and respond to care threads (contract §5.1).
const CARE_STAFF_ROLES = new Set(["pastor", "admin", "care_team"]);

// Roles that may publish church-wide messages (contract §9).
// media_team is explicitly excluded.
const CHURCH_MESSAGE_ROLES = new Set(["pastor", "admin", "communications"]);

// Roles that may manage sermon media upload/source metadata (contract §10.1).
const SERMON_MEDIA_ROLES = new Set(["pastor", "admin", "media_team"]);
const SERMON_LIFECYCLE_ROLES = new Set(["pastor", "admin"]);

const COMMUNICATION_DEFAULTS: CommunicationPreferences = {
  churchMessagesEnabled: false,
  careReplyNotificationsEnabled: false,
  formationNotificationsEnabled: false,
};

const FCM_PLATFORMS = new Set(["ios", "android", "web"]);
const SERMON_SOURCE_TYPES = new Set(["audio_upload"]);
const SERMON_LANGUAGES = new Set(["en", "es"]);
const TRANSCRIPT_RETENTION_DAYS = 7;
const FORMATION_STATUSES = new Set(["draft", "generated", "approved", "published"]);
const CARE_REQUEST_TYPES = new Set([
  "prayer",
  "testimony",
  "care_support",
]);
const CARE_REQUEST_CHANNELS = new Set(["in_app", "email"]);
const CARE_REQUEST_STATUSES = new Set([
  "new",
  "assigned",
  "in_progress",
  "closed",
]);
const CHURCH_ADMIN_ROLES = new Set(["pastor", "admin"]);

function ensureNonEmptyString(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new HttpsError("invalid-argument", `${fieldName} is required.`);
  }
  return value.trim();
}

function ensureBoolean(value: unknown, fieldName: string): boolean {
  if (typeof value !== "boolean") {
    throw new HttpsError("invalid-argument", `${fieldName} must be a boolean.`);
  }
  return value;
}

function ensureOptionalString(
  value: unknown,
  fieldName: string
): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value !== "string") {
    throw new HttpsError("invalid-argument", `${fieldName} must be a string.`);
  }
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

function ensureOptionalPositiveInteger(
  value: unknown,
  fieldName: string
): number | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (!Number.isInteger(value) || (value as number) <= 0) {
    throw new HttpsError(
      "invalid-argument",
      `${fieldName} must be a positive integer.`
    );
  }
  return value as number;
}

function ensureOptionalStringArray(
  value: unknown,
  fieldName: string
): string[] | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (!Array.isArray(value)) {
    throw new HttpsError("invalid-argument", `${fieldName} must be an array.`);
  }
  const normalized = value.map((entry) => ensureNonEmptyString(entry, fieldName));
  return normalized.length > 0 ? normalized : undefined;
}

function ensureIsoDate(value: unknown, fieldName: string): Timestamp {
  const iso = ensureNonEmptyString(value, fieldName);
  const parsed = Date.parse(iso);
  if (isNaN(parsed)) {
    throw new HttpsError(
      "invalid-argument",
      `${fieldName} must be a valid ISO date string.`
    );
  }
  return Timestamp.fromDate(new Date(parsed));
}

function ensureEnumValue(
  value: unknown,
  fieldName: string,
  allowed: Set<string>,
  helpText: string
): string {
  const normalized = ensureNonEmptyString(value, fieldName);
  if (!allowed.has(normalized)) {
    throw new HttpsError("invalid-argument", helpText);
  }
  return normalized;
}

function isValidEmailAddress(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function canTransitionCareRequestStatus(
  currentStatus: string | undefined,
  nextStatus: string
): boolean {
  const normalizedCurrent =
    currentStatus && CARE_REQUEST_STATUSES.has(currentStatus)
      ? currentStatus
      : "new";

  const allowedTransitions: Record<string, Set<string>> = {
    new: new Set(["new", "assigned", "in_progress", "closed"]),
    assigned: new Set(["assigned", "in_progress", "closed", "new"]),
    in_progress: new Set(["in_progress", "assigned", "closed", "new"]),
    closed: new Set(["closed", "assigned", "in_progress"]),
  };

  return allowedTransitions[normalizedCurrent]?.has(nextStatus) === true;
}

async function getSubmissionMailboxAddress(
  churchId: string
): Promise<string | null> {
  const configSnap = await db.doc(`churches/${churchId}/private/config`).get();
  if (!configSnap.exists) {
    return null;
  }

  const raw = (configSnap.data() as { submissionMailbox?: unknown })
    .submissionMailbox;
  if (typeof raw !== "string") {
    return null;
  }

  const normalized = raw.trim().toLowerCase();
  if (!isValidEmailAddress(normalized)) {
    return null;
  }
  return normalized;
}

function sanitizeFileName(fileName: string): string {
  const safeName = fileName.replace(/[^A-Za-z0-9._-]/g, "_");
  return safeName === "" ? "upload.bin" : safeName;
}

function buildSermonUploadPath(
  churchId: string,
  sermonId: string,
  fileName: string
): string {
  return `sermons/${churchId}/${sermonId}/original/${sanitizeFileName(fileName)}`;
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function formatDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function startOfDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function getWeekStartDate(date: Date): Date {
  const day = date.getUTCDay();
  return addDays(startOfDay(date), -day);
}

function parseDateOnly(value: unknown, fieldName: string): Date {
  const normalized = ensureNonEmptyString(value, fieldName);
  const parsed = new Date(`${normalized}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    throw new HttpsError(
      "invalid-argument",
      `${fieldName} must be a valid YYYY-MM-DD date string.`
    );
  }
  return parsed;
}

function parseCommunicationPreferencePatch(
  input: Record<string, unknown>
): Partial<CommunicationPreferences> {
  const patch: Partial<CommunicationPreferences> = {};

  if (Object.prototype.hasOwnProperty.call(input, "churchMessagesEnabled")) {
    patch.churchMessagesEnabled = ensureBoolean(
      input.churchMessagesEnabled,
      "churchMessagesEnabled"
    );
  }
  if (
    Object.prototype.hasOwnProperty.call(
      input,
      "careReplyNotificationsEnabled"
    )
  ) {
    patch.careReplyNotificationsEnabled = ensureBoolean(
      input.careReplyNotificationsEnabled,
      "careReplyNotificationsEnabled"
    );
  }
  if (
    Object.prototype.hasOwnProperty.call(
      input,
      "formationNotificationsEnabled"
    )
  ) {
    patch.formationNotificationsEnabled = ensureBoolean(
      input.formationNotificationsEnabled,
      "formationNotificationsEnabled"
    );
  }

  if (Object.keys(patch).length === 0) {
    throw new HttpsError(
      "invalid-argument",
      "At least one communication preference must be provided."
    );
  }

  return patch;
}

async function getCommunicationPreferences(
  uid: string
): Promise<CommunicationPreferences> {
  const snap = await db.doc(`users/${uid}/preferences/communication`).get();
  if (!snap.exists) {
    return { ...COMMUNICATION_DEFAULTS };
  }

  const data = snap.data() as Partial<CommunicationPreferences>;
  return {
    churchMessagesEnabled: data.churchMessagesEnabled === true,
    careReplyNotificationsEnabled: data.careReplyNotificationsEnabled === true,
    formationNotificationsEnabled: data.formationNotificationsEnabled === true,
  };
}

async function getValidFcmTokens(uid: string): Promise<FcmTokenData[]> {
  const snap = await db.collection(`users/${uid}/fcmTokens`).get();
  return snap.docs
    .map((doc) => doc.data() as Partial<FcmTokenData>)
    .filter(
      (token): token is FcmTokenData =>
        typeof token.token === "string" &&
        token.token.trim() !== "" &&
        typeof token.platform === "string" &&
        token.platform.trim() !== ""
    )
    .map((token) => ({
      token: token.token.trim(),
      platform: token.platform.trim(),
    }));
}

async function notifyMemberCareReply(uid: string): Promise<NotificationHookResult> {
  const prefs = await getCommunicationPreferences(uid);
  if (!prefs.careReplyNotificationsEnabled) {
    return {
      hookTriggered: true,
      deliveryMode: "scaffold",
      targetUserCount: 1,
      eligibleUserCount: 0,
      tokenCount: 0,
      deliveredCount: 0,
      skippedReason: "care_reply_notifications_disabled",
    };
  }

  const tokens = await getValidFcmTokens(uid);
  if (tokens.length === 0) {
    return {
      hookTriggered: true,
      deliveryMode: "scaffold",
      targetUserCount: 1,
      eligibleUserCount: 1,
      tokenCount: 0,
      deliveredCount: 0,
      skippedReason: "no_fcm_tokens",
    };
  }

  return {
    hookTriggered: true,
    deliveryMode: "scaffold",
    targetUserCount: 1,
    eligibleUserCount: 1,
    tokenCount: tokens.length,
    deliveredCount: tokens.length,
    skippedReason: null,
  };
}

async function notifyChurchMessagePublished(
  churchId: string,
  publishedByUid: string
): Promise<NotificationHookResult> {
  const membersSnap = await db
    .collection(`churches/${churchId}/members`)
    .where("status", "==", "active")
    .get();

  const targetUids = membersSnap.docs
    .map((doc) => doc.id)
    .filter((uid) => uid !== publishedByUid);

  let eligibleUserCount = 0;
  let tokenCount = 0;

  for (const uid of targetUids) {
    const prefs = await getCommunicationPreferences(uid);
    if (!prefs.churchMessagesEnabled) {
      continue;
    }

    eligibleUserCount += 1;
    const tokens = await getValidFcmTokens(uid);
    tokenCount += tokens.length;
  }

  return {
    hookTriggered: true,
    deliveryMode: "scaffold",
    targetUserCount: targetUids.length,
    eligibleUserCount,
    tokenCount,
    deliveredCount: tokenCount,
    skippedReason:
      eligibleUserCount === 0
        ? "church_message_notifications_disabled"
        : tokenCount === 0
          ? "no_fcm_tokens"
          : null,
  };
}

// ---------------------------------------------------------------------------
// Phase 5: notification setup
// ---------------------------------------------------------------------------

export const saveCommunicationPreferences = onCall(
  { enforceAppCheck: false },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be signed in.");
    }

    const patch = parseCommunicationPreferencePatch(
      (request.data ?? {}) as Record<string, unknown>
    );
    const uid = request.auth.uid;
    const now = FieldValue.serverTimestamp();
    const nextPrefs = {
      ...(await getCommunicationPreferences(uid)),
      ...patch,
    };

    await db.doc(`users/${uid}/preferences/communication`).set(
      {
        ...nextPrefs,
        updatedAt: now,
      },
      { merge: true }
    );

    return nextPrefs;
  }
);

export const registerFcmToken = onCall(
  { enforceAppCheck: false },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be signed in.");
    }

    const uid = request.auth.uid;
    const data = (request.data ?? {}) as Record<string, unknown>;
    const tokenId = ensureNonEmptyString(data.tokenId, "tokenId");
    const token = ensureNonEmptyString(data.token, "token");
    const platform = ensureNonEmptyString(data.platform, "platform");

    if (!FCM_PLATFORMS.has(platform)) {
      throw new HttpsError(
        "invalid-argument",
        "platform must be ios, android, or web."
      );
    }

    const now = FieldValue.serverTimestamp();
    await db.doc(`users/${uid}/fcmTokens/${tokenId}`).set(
      {
        token,
        platform,
        createdAt: now,
        lastUsedAt: now,
      },
      { merge: true }
    );

    return { tokenId, platform };
  }
);

export const deleteFcmToken = onCall(
  { enforceAppCheck: false },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be signed in.");
    }

    const uid = request.auth.uid;
    const data = (request.data ?? {}) as Record<string, unknown>;
    const tokenId = ensureNonEmptyString(data.tokenId, "tokenId");

    await db.doc(`users/${uid}/fcmTokens/${tokenId}`).delete();

    return { tokenId };
  }
);

export const getSessionContext = onCall(
  { enforceAppCheck: false },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be signed in.");
    }

    const uid = request.auth.uid;
    const profile = await requireUserProfile(uid);
    const currentChurchId =
      typeof profile.currentChurchId === "string" && profile.currentChurchId.trim() !== ""
        ? profile.currentChurchId
        : null;

    let churchName: string | null = null;
    let role: string | null = null;
    if (currentChurchId) {
      const church = await requireChurch(currentChurchId);
      churchName = church.name ?? null;
      const member = await requireActiveMember(currentChurchId, uid);
      role = member.role;
    }

    return {
      uid,
      email: request.auth.token.email ?? profile.email ?? null,
      displayName: request.auth.token.name ?? profile.displayName ?? null,
      preferredLanguage: profile.preferredLanguage ?? "en",
      currentChurchId,
      churchName,
      role,
      communicationPreferences: await getCommunicationPreferences(uid),
    };
  }
);

export const getCareInbox = onCall(
  { enforceAppCheck: false },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be signed in.");
    }

    const uid = request.auth.uid;
    const churchId = await requireCurrentChurchId(uid);
    await requireActiveMember(churchId, uid);

    const threadsSnap = await db
      .collection(`churches/${churchId}/careThreads`)
      .where("memberUserId", "==", uid)
      .orderBy("lastMessageAt", "desc")
      .get();

    const threads = await Promise.all(
      threadsSnap.docs.map(async (doc) => {
        const thread = doc.data() as CareThreadData;
        const messagesSnap = await doc.ref
          .collection("messages")
          .orderBy("createdAt", "asc")
          .get();

        return {
          id: doc.id,
          churchId,
          categoryId: thread.categoryId ?? "general_support",
          preferredChannel: thread.preferredChannel ?? "in_app",
          requestPreview: messagesSnap.docs[0]?.data().body ?? "",
          status: thread.status,
          maxChurchReplies: thread.maxChurchReplies,
          churchReplyCount: thread.churchReplyCount,
          createdAt: (thread.createdAt as Timestamp | undefined)?.toDate().toISOString() ?? new Date(0).toISOString(),
          updatedAt: (thread.updatedAt as Timestamp | undefined)?.toDate().toISOString() ?? new Date(0).toISOString(),
          messages: messagesSnap.docs.map((messageDoc) => {
            const message = messageDoc.data() as {
              senderType: string;
              body: string;
              createdAt?: Timestamp;
            };
            return {
              id: messageDoc.id,
              sender: message.senderType === "church" ? "church" : "member",
              body: message.body,
              createdAt:
                message.createdAt?.toDate().toISOString() ?? new Date(0).toISOString(),
            };
          }),
        };
      })
    );

    return { threads };
  }
);

export const getChurchMessagesFeed = onCall(
  { enforceAppCheck: false },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be signed in.");
    }

    const uid = request.auth.uid;
    const churchId = await requireCurrentChurchId(uid);
    await requireActiveMember(churchId, uid);

    const messagesSnap = await db
      .collection(`churches/${churchId}/churchMessages`)
      .orderBy("createdAt", "desc")
      .limit(25)
      .get();

    return {
      messages: messagesSnap.docs.map((doc) => {
        const message = doc.data() as {
          title: string;
          body: string;
          kind: string;
          createdAt?: Timestamp;
        };
        return {
          id: doc.id,
          title: message.title,
          body: message.body,
          kind: message.kind,
          createdAt:
            message.createdAt?.toDate().toISOString() ?? new Date(0).toISOString(),
        };
      }),
    };
  }
);

export const getCurrentFormationWeek = onCall(
  { enforceAppCheck: false },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be signed in.");
    }

    const uid = request.auth.uid;
    const churchId = await requireCurrentChurchId(uid);
    await requireActiveMember(churchId, uid);

    const now = new Date();
    const currentWeekId = formatDateOnly(getWeekStartDate(now));
    const formationRef = db.doc(`churches/${churchId}/formationWeeks/${currentWeekId}`);
    const formationSnap = await formationRef.get();

    if (!formationSnap.exists) {
      return { week: null };
    }

    const data = formationSnap.data() as Record<string, unknown>;
    if (data.status !== "published") {
      return { week: null };
    }

    return {
      week: {
        weekId: currentWeekId,
        ...data,
      },
    };
  }
);

// ---------------------------------------------------------------------------
// Phase 6: sermon media pipeline
// ---------------------------------------------------------------------------

export const createSermonUpload = onCall(
  { enforceAppCheck: false },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be signed in.");
    }

    const uid = request.auth.uid;
    const data = (request.data ?? {}) as Record<string, unknown>;
    const churchId = ensureNonEmptyString(data.churchId, "churchId");
    const title = ensureNonEmptyString(data.title, "title");
    const preacherName = ensureNonEmptyString(data.preacherName, "preacherName");
    const language = ensureEnumValue(
      data.language,
      "language",
      SERMON_LANGUAGES,
      "language must be en or es."
    );
    const sourceType = ensureEnumValue(
      data.sourceType,
      "sourceType",
      SERMON_SOURCE_TYPES,
      "sourceType must be audio_upload."
    );
    const fileName = ensureNonEmptyString(data.fileName, "fileName");
    const date = ensureIsoDate(data.date, "date");
    const series = ensureOptionalString(data.series, "series");
    const partNumber = ensureOptionalPositiveInteger(data.partNumber, "partNumber");
    const bibleRefs = ensureOptionalStringArray(data.bibleRefs, "bibleRefs");

    const member = await requireActiveMember(churchId, uid);
    if (!SERMON_MEDIA_ROLES.has(member.role)) {
      throw new HttpsError(
        "permission-denied",
        "Not authorized to manage sermon media."
      );
    }

    const church = await requireChurch(churchId);
    if (church.features?.mediaPipeline !== true) {
      throw new HttpsError(
        "not-found",
        "Sermon media pipeline is not enabled for this church."
      );
    }

    const sermonRef = db.collection(`churches/${churchId}/sermons`).doc();
    const uploadPath = buildSermonUploadPath(churchId, sermonRef.id, fileName);
    const now = FieldValue.serverTimestamp();

    await sermonRef.set({
      title,
      preacherName,
      date,
      language,
      status: "draft",
      sourceType,
      audioStoragePath: uploadPath,
      series: series ?? null,
      partNumber: partNumber ?? null,
      bibleRefs: bibleRefs ?? [],
      createdAt: now,
      updatedAt: now,
    });

    return {
      sermonId: sermonRef.id,
      uploadPath,
      status: "draft",
      sourceType,
    };
  }
);

export const completeSermonUpload = onCall(
  { enforceAppCheck: false },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be signed in.");
    }

    const uid = request.auth.uid;
    const data = (request.data ?? {}) as Record<string, unknown>;
    const churchId = ensureNonEmptyString(data.churchId, "churchId");
    const sermonId = ensureNonEmptyString(data.sermonId, "sermonId");
    const audioStoragePath = ensureNonEmptyString(
      data.audioStoragePath,
      "audioStoragePath"
    );

    const member = await requireActiveMember(churchId, uid);
    if (!SERMON_MEDIA_ROLES.has(member.role)) {
      throw new HttpsError(
        "permission-denied",
        "Not authorized to manage sermon media."
      );
    }

    const church = await requireChurch(churchId);
    if (church.features?.mediaPipeline !== true) {
      throw new HttpsError(
        "not-found",
        "Sermon media pipeline is not enabled for this church."
      );
    }

    const sermonRef = db.doc(`churches/${churchId}/sermons/${sermonId}`);
    const sermonSnap = await sermonRef.get();
    if (!sermonSnap.exists) {
      throw new HttpsError("not-found", "Sermon not found.");
    }

    const sermon = sermonSnap.data() as SermonData;
    if (sermon.sourceType !== "audio_upload") {
      throw new HttpsError(
        "failed-precondition",
        "Sermon sourceType is not audio_upload."
      );
    }

    const expectedPrefix = `sermons/${churchId}/${sermonId}/original/`;
    if (!audioStoragePath.startsWith(expectedPrefix)) {
      throw new HttpsError(
        "invalid-argument",
        "audioStoragePath must stay within the sermon original upload path."
      );
    }

    await sermonRef.update({
      audioStoragePath,
      status: "uploaded",
      updatedAt: FieldValue.serverTimestamp(),
    });

    return {
      sermonId,
      status: "uploaded",
      audioStoragePath,
    };
  }
);

export const transcribeOnUpload = onCall(
  { enforceAppCheck: false },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be signed in.");
    }

    const uid = request.auth.uid;
    const data = (request.data ?? {}) as Record<string, unknown>;
    const churchId = ensureNonEmptyString(data.churchId, "churchId");
    const sermonId = ensureNonEmptyString(data.sermonId, "sermonId");
    const transcriptText = ensureOptionalString(data.transcriptText, "transcriptText");
    const simulateFailure = data.simulateFailure === true;

    const member = await requireActiveMember(churchId, uid);
    if (!SERMON_LIFECYCLE_ROLES.has(member.role)) {
      throw new HttpsError(
        "permission-denied",
        "Not authorized to manage sermon transcription."
      );
    }

    const church = await requireChurch(churchId);
    if (church.features?.sermonTranscription !== true) {
      throw new HttpsError(
        "not-found",
        "Sermon transcription is not enabled for this church."
      );
    }

    const sermonRef = db.doc(`churches/${churchId}/sermons/${sermonId}`);
    const sermonSnap = await sermonRef.get();
    if (!sermonSnap.exists) {
      throw new HttpsError("not-found", "Sermon not found.");
    }

    const sermon = sermonSnap.data() as SermonData;
    if (sermon.status !== "uploaded") {
      throw new HttpsError(
        "failed-precondition",
        "Sermon must be in uploaded status before transcription."
      );
    }
    if (sermon.sourceType !== "audio_upload") {
      throw new HttpsError(
        "failed-precondition",
        "Only audio_upload sermons can enter transcription."
      );
    }
    if (
      typeof sermon.audioStoragePath !== "string" ||
      !sermon.audioStoragePath.startsWith(`sermons/${churchId}/${sermonId}/original/`)
    ) {
      throw new HttpsError(
        "failed-precondition",
        "Sermon audioStoragePath is missing or invalid."
      );
    }

    await sermonRef.update({
      status: "transcribing",
      transcriptionStatus: "transcribing",
      updatedAt: FieldValue.serverTimestamp(),
    });

    const transcriptRef = sermonRef.collection("transcripts").doc();
    const retentionDeleteAfter = Timestamp.fromDate(
      addDays(new Date(), TRANSCRIPT_RETENTION_DAYS)
    );
    const now = FieldValue.serverTimestamp();

    if (simulateFailure) {
      await transcriptRef.set({
        provider: "deepgram_scaffold",
        language: sermon.language,
        createdAt: now,
        retentionDeleteAfter,
        source: sermon.audioStoragePath,
        status: "failed",
        errorCode: "TRANSCRIPTION_SCAFFOLD_FAILURE",
        errorMessage: "Simulated transcription scaffold failure.",
      });

      await sermonRef.update({
        status: "failed",
        transcriptionStatus: "failed",
        updatedAt: FieldValue.serverTimestamp(),
      });

      return {
        sermonId,
        transcriptId: transcriptRef.id,
        status: "failed",
      };
    }

    await transcriptRef.set({
      provider: "deepgram_scaffold",
      language: sermon.language,
      createdAt: now,
      retentionDeleteAfter,
      source: sermon.audioStoragePath,
      status: "completed",
      content:
        transcriptText ??
        `Scaffold transcript for sermon ${sermonId}. Provider integration pending.`,
      segments: [],
    });

    await sermonRef.update({
      status: "transcribed",
      transcriptionStatus: "transcribed",
      updatedAt: FieldValue.serverTimestamp(),
    });

    return {
      sermonId,
      transcriptId: transcriptRef.id,
      status: "transcribed",
    };
  }
);

export const generateFormationContent = onCall(
  { enforceAppCheck: false },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be signed in.");
    }

    const uid = request.auth.uid;
    const data = (request.data ?? {}) as Record<string, unknown>;
    const churchId = ensureNonEmptyString(data.churchId, "churchId");
    const sermonId = ensureNonEmptyString(data.sermonId, "sermonId");

    const member = await requireActiveMember(churchId, uid);
    if (!SERMON_LIFECYCLE_ROLES.has(member.role)) {
      throw new HttpsError(
        "permission-denied",
        "Not authorized to generate formation content."
      );
    }

    const church = await requireChurch(churchId);
    if (church.features?.formationGeneration !== true) {
      throw new HttpsError(
        "not-found",
        "Formation generation is not enabled for this church."
      );
    }

    const sermonRef = db.doc(`churches/${churchId}/sermons/${sermonId}`);
    const sermonSnap = await sermonRef.get();
    if (!sermonSnap.exists) {
      throw new HttpsError("not-found", "Sermon not found.");
    }

    const sermon = sermonSnap.data() as SermonData;
    if (sermon.status !== "transcribed") {
      throw new HttpsError(
        "failed-precondition",
        "Sermon must be transcribed before formation generation."
      );
    }

    const transcriptsSnap = await sermonRef
      .collection("transcripts")
      .where("status", "==", "completed")
      .limit(1)
      .get();

    if (transcriptsSnap.empty) {
      throw new HttpsError(
        "failed-precondition",
        "A completed transcript is required before formation generation."
      );
    }

    const transcript = transcriptsSnap.docs[0].data() as {
      content?: string;
      language?: string;
    };
    const transcriptContent =
      typeof transcript.content === "string" && transcript.content.trim() !== ""
        ? transcript.content.trim()
        : "Formation scaffold transcript unavailable.";

    const sermonDate = sermon.date.toDate();
    const weekStartDate = formatDateOnly(getWeekStartDate(sermonDate));
    const formationRef = db.doc(
      `churches/${churchId}/formationWeeks/${weekStartDate}`
    );
    const now = FieldValue.serverTimestamp();
    const listenUrl = sermon.listenUrl ?? null;
    const scriptureRefs = Array.isArray(sermon.bibleRefs) ? sermon.bibleRefs : [];

    await formationRef.set(
      {
        weekStartDate,
        sermonId,
        language: sermon.language,
        status: "generated",
        sunday: {
          title: sermon.title,
          preacherName: sermon.preacherName,
          summary: `Generated from sermon transcript for ${sermon.title}.`,
        },
        days: {
          monday: {
            title: "Remember",
            prompt: `Recall the core invitation from ${sermon.title}.`,
          },
          tuesday: {
            title: "Receive",
            prompt: transcriptContent.slice(0, 140),
          },
          wednesday: {
            title: "Reflect",
            prompt: "Notice what truth is asking for your attention this week.",
          },
          thursday: {
            title: "Respond",
            prompt: "Take one concrete step of obedience shaped by Sunday.",
          },
          friday: {
            title: "Practice",
            prompt: "Return to the scripture and practice its way quietly.",
          },
          saturday: {
            title: "Prepare",
            prompt: "Come ready to gather again with gratitude and expectancy.",
          },
        },
        listen: {
          url: listenUrl,
          audioStoragePath: sermon.audioStoragePath ?? null,
        },
        truths: [
          `Week anchored in ${sermon.title}.`,
          transcriptContent.slice(0, 180),
        ],
        scriptureRefs,
        createdAt: now,
        updatedAt: now,
      },
      { merge: true }
    );

    await sermonRef.update({
      status: "formation_generated",
      formationStatus: "generated",
      updatedAt: FieldValue.serverTimestamp(),
    });

    return {
      sermonId,
      weekId: weekStartDate,
      status: "generated",
    };
  }
);

export const updateFormationWeekStatus = onCall(
  { enforceAppCheck: false },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be signed in.");
    }

    const uid = request.auth.uid;
    const data = (request.data ?? {}) as Record<string, unknown>;
    const churchId = ensureNonEmptyString(data.churchId, "churchId");
    const weekId = ensureNonEmptyString(data.weekId, "weekId");
    const status = ensureEnumValue(
      data.status,
      "status",
      FORMATION_STATUSES,
      "status must be draft, generated, approved, or published."
    );

    const member = await requireActiveMember(churchId, uid);
    if (!SERMON_LIFECYCLE_ROLES.has(member.role)) {
      throw new HttpsError(
        "permission-denied",
        "Not authorized to update formation status."
      );
    }

    const formationRef = db.doc(`churches/${churchId}/formationWeeks/${weekId}`);
    const formationSnap = await formationRef.get();
    if (!formationSnap.exists) {
      throw new HttpsError("not-found", "Formation week not found.");
    }

    const formation = formationSnap.data() as {
      status: string;
      sermonId: string;
    };

    if (status === "approved" && formation.status !== "generated") {
      throw new HttpsError(
        "failed-precondition",
        "Formation week must be generated before approval."
      );
    }
    if (status === "published" && formation.status !== "approved") {
      throw new HttpsError(
        "failed-precondition",
        "Formation week must be approved before publish."
      );
    }

    await formationRef.update({
      status,
      updatedAt: FieldValue.serverTimestamp(),
    });

    await db.doc(`churches/${churchId}/sermons/${formation.sermonId}`).update({
      formationStatus: status,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return { weekId, status };
  }
);

export const computeWeeklyAnalytics = onCall(
  { enforceAppCheck: false },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be signed in.");
    }

    const uid = request.auth.uid;
    const data = (request.data ?? {}) as Record<string, unknown>;
    const churchId = ensureNonEmptyString(data.churchId, "churchId");
    const weekStartDate = formatDateOnly(
      parseDateOnly(data.weekStartDate, "weekStartDate")
    );

    const member = await requireActiveMember(churchId, uid);
    if (!SERMON_LIFECYCLE_ROLES.has(member.role)) {
      throw new HttpsError(
        "permission-denied",
        "Not authorized to compute analytics."
      );
    }

    const weekStart = new Date(`${weekStartDate}T00:00:00.000Z`);
    const weekEnd = addDays(weekStart, 7);
    const weekStartTs = Timestamp.fromDate(weekStart);
    const weekEndTs = Timestamp.fromDate(weekEnd);

    const [
      activeMembersSnap,
      careSubmittedSnap,
      careResolvedSnap,
      churchMessagesSnap,
    ] = await Promise.all([
      db
        .collection(`churches/${churchId}/members`)
        .where("status", "==", "active")
        .get(),
      db
        .collection(`churches/${churchId}/careRequests`)
        .where("createdAt", ">=", weekStartTs)
        .where("createdAt", "<", weekEndTs)
        .get(),
      db
        .collection(`churches/${churchId}/careRequests`)
        .where("resolvedAt", ">=", weekStartTs)
        .where("resolvedAt", "<", weekEndTs)
        .get(),
      db
        .collection(`churches/${churchId}/churchMessages`)
        .where("createdAt", ">=", weekStartTs)
        .where("createdAt", "<", weekEndTs)
        .get(),
    ]);

    const formationViews = 0;
    const analyticsRef = db.doc(
      `churches/${churchId}/analyticsWeekly/${weekStartDate}`
    );

    await analyticsRef.set({
      weekStartDate,
      activeMembers: activeMembersSnap.size,
      formationViews,
      careRequestsSubmitted: careSubmittedSnap.size,
      careRequestsResolved: careResolvedSnap.size,
      churchMessagesPublished: churchMessagesSnap.size,
      computedAt: FieldValue.serverTimestamp(),
    });

    return {
      weekStartDate,
      activeMembers: activeMembersSnap.size,
      formationViews,
      careRequestsSubmitted: careSubmittedSnap.size,
      careRequestsResolved: careResolvedSnap.size,
      churchMessagesPublished: churchMessagesSnap.size,
    };
  }
);

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
      codeGeneratedAt?: Timestamp;
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
    const now = FieldValue.serverTimestamp();

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
    const normalizedType = ensureEnumValue(
      type,
      "type",
      CARE_REQUEST_TYPES,
      "type must be prayer, testimony, or care_support."
    );
    const normalizedContent = ensureNonEmptyString(content, "content");
    const normalizedPreferredChannel = ensureEnumValue(
      preferredChannel,
      "preferredChannel",
      CARE_REQUEST_CHANNELS,
      "preferredChannel must be in_app or email."
    );
    if (categoryId !== undefined && typeof categoryId !== "string") {
      throw new HttpsError("invalid-argument", "categoryId must be a string.");
    }

    // Verify active membership
    const member = await requireActiveMember(churchId, uid);

    // Load church to check feature flags
    const church = await requireChurch(churchId);
    const mailboxAddress = await getSubmissionMailboxAddress(churchId);

    const now = FieldValue.serverTimestamp();
    const shouldCreateThread =
      normalizedPreferredChannel === "in_app" &&
      church.features?.careThreads === true;

    // Pre-generate document references so IDs are known before any write.
    const requestRef = db.collection(`churches/${churchId}/careRequests`).doc();
    const requestId = requestRef.id;

    let threadId: string | undefined;
    let threadRef: DocumentReference | undefined;
    let messageRef: DocumentReference | undefined;

    if (shouldCreateThread) {
      threadRef = db.collection(`churches/${churchId}/careThreads`).doc();
      threadId = threadRef.id;
      messageRef = threadRef.collection("messages").doc();
    }

    const mailboxAlertRef = db.doc(
      `churches/${churchId}/submissionMailboxAlerts/${requestId}`
    );
    const queueEmailDelivery = mailboxAddress !== null;

    // Write all docs atomically.
    const batch = db.batch();

    batch.set(requestRef, {
      type: normalizedType,
      submitterId: uid,
      // submitterName is stored server-side regardless of isAnonymous.
      // The isAnonymous flag controls display in the pastoral interface;
      // it does not remove the record from the care workflow (contract §7.10).
      submitterName: member.displayName,
      submitterEmail: member.email ?? null,
      content: normalizedContent,
      status: "new",
      ownerUserId: null,
      ownerRole: null,
      assignedAt: null,
      closedAt: null,
      closedBy: null,
      lastActionAt: now,
      lastActionBy: uid,
      isAnonymous: isAnonymous === true,
      preferredChannel: normalizedPreferredChannel,
      categoryId: (categoryId as string | undefined) ?? null,
      threadId: threadId ?? null,
      intakeSource: "mobile_app",
      mailboxDeliveryState: queueEmailDelivery
        ? "queued"
        : "not_configured",
      createdAt: now,
      resolvedAt: null,
      resolvedBy: null,
    });

    batch.set(mailboxAlertRef, {
      requestId,
      type: normalizedType,
      status: "queued",
      queuedAt: now,
      churchId,
      churchName: church.name ?? "",
      submitterId: uid,
      submitterName: member.displayName,
      submitterEmail: member.email ?? null,
      isAnonymous: isAnonymous === true,
      preferredChannel: normalizedPreferredChannel,
      categoryId: (categoryId as string | undefined) ?? null,
      contentPreview:
        normalizedContent.length > 280
          ? `${normalizedContent.slice(0, 277)}...`
          : normalizedContent,
      mailboxAddress,
      deliveryTarget:
        queueEmailDelivery && mailboxAddress
          ? "firebase_trigger_email_extension"
          : "manual_church_queue",
      deliveredAt: null,
      deliveryError: queueEmailDelivery
        ? null
        : "submission_mailbox_not_configured",
      createdAt: now,
      updatedAt: now,
    });

    if (queueEmailDelivery && mailboxAddress) {
      const mailRef = db.collection("mail").doc();
      batch.set(mailRef, {
        to: [mailboxAddress],
        message: {
          subject: `[MKP] New ${normalizedType.replace("_", " ")} submission`,
          text: [
            `Church: ${church.name ?? churchId}`,
            `Submission ID: ${requestId}`,
            `Type: ${normalizedType}`,
            `Category: ${(categoryId as string | undefined) ?? "none"}`,
            `Preferred channel: ${normalizedPreferredChannel}`,
            `Anonymous: ${isAnonymous === true ? "yes" : "no"}`,
            "",
            normalizedContent,
          ].join("\n"),
        },
        x_mkp: {
          churchId,
          requestId,
          type: normalizedType,
          categoryId: (categoryId as string | undefined) ?? null,
          source: "submitCareRequest",
        },
      });
    }

    if (shouldCreateThread && threadRef && messageRef && threadId) {
      batch.set(threadRef, {
        requestId,
        memberUserId: uid,
        categoryId: (categoryId as string | undefined) ?? null,
        preferredChannel: normalizedPreferredChannel,
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
        body: normalizedContent,
        createdAt: now,
      });
    }

    await batch.commit();

    const result: {
      requestId: string;
      threadId?: string;
      mailboxDeliveryState: "queued" | "not_configured";
    } = {
      requestId,
      mailboxDeliveryState: queueEmailDelivery ? "queued" : "not_configured",
    };
    if (threadId) result.threadId = threadId;
    return result;
  }
);

// ---------------------------------------------------------------------------
// Phase 3: updateCareRequestLifecycle
// ---------------------------------------------------------------------------

/**
 * updateCareRequestLifecycle
 *
 * Church staff triage tool for interim submission handling.
 * Supports explicit ownership (claim/reassign) and lifecycle transitions
 * on care requests so churches can work from one backend system of record.
 *
 * Request data:
 *   {
 *     churchId: string,
 *     requestId: string,
 *     status?: 'new' | 'assigned' | 'in_progress' | 'closed',
 *     ownerUserId?: string | null
 *   }
 *
 * Returns:
 *   { requestId: string, status: string, ownerUserId: string | null }
 */
export const updateCareRequestLifecycle = onCall(
  { enforceAppCheck: false },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be signed in.");
    }

    const uid = request.auth.uid;
    const data = (request.data ?? {}) as Record<string, unknown>;
    const churchId = ensureNonEmptyString(data.churchId, "churchId");
    const requestId = ensureNonEmptyString(data.requestId, "requestId");

    const callerMember = await requireActiveMember(churchId, uid);
    if (!CARE_STAFF_ROLES.has(callerMember.role)) {
      throw new HttpsError(
        "permission-denied",
        "Not authorized to update care request lifecycle."
      );
    }

    const requestRef = db.doc(`churches/${churchId}/careRequests/${requestId}`);

    return db.runTransaction(async (tx) => {
      const requestSnap = await tx.get(requestRef);
      if (!requestSnap.exists) {
        throw new HttpsError("not-found", "Care request not found.");
      }

      const careRequest = requestSnap.data() as CareRequestData;
      const now = FieldValue.serverTimestamp();
      const updatePayload: Record<string, unknown> = {
        lastActionAt: now,
        lastActionBy: uid,
      };

      const hasOwnerPatch = Object.prototype.hasOwnProperty.call(
        data,
        "ownerUserId"
      );
      if (hasOwnerPatch) {
        const rawOwner = data.ownerUserId;
        const nextOwnerUserId =
          rawOwner === null
            ? null
            : ensureOptionalString(rawOwner, "ownerUserId") ?? null;

        if (nextOwnerUserId === null) {
          if (
            !CHURCH_ADMIN_ROLES.has(callerMember.role) &&
            careRequest.ownerUserId !== uid
          ) {
            throw new HttpsError(
              "permission-denied",
              "Only pastor/admin can unassign other owners."
            );
          }
          updatePayload.ownerUserId = null;
          updatePayload.ownerRole = null;
          updatePayload.assignedAt = null;
        } else {
          if (
            nextOwnerUserId !== uid &&
            !CHURCH_ADMIN_ROLES.has(callerMember.role)
          ) {
            throw new HttpsError(
              "permission-denied",
              "Only pastor/admin can assign requests to another user."
            );
          }

          const ownerMemberRef = db.doc(
            `churches/${churchId}/members/${nextOwnerUserId}`
          );
          const ownerMemberSnap = await tx.get(ownerMemberRef);
          if (!ownerMemberSnap.exists) {
            throw new HttpsError("invalid-argument", "ownerUserId must be a member.");
          }
          const ownerMember = ownerMemberSnap.data() as MemberData;
          if (
            ownerMember.status !== "active" ||
            !CARE_STAFF_ROLES.has(ownerMember.role)
          ) {
            throw new HttpsError(
              "invalid-argument",
              "ownerUserId must be an active pastor, admin, or care_team member."
            );
          }

          updatePayload.ownerUserId = nextOwnerUserId;
          updatePayload.ownerRole = ownerMember.role;
          updatePayload.assignedAt = now;
        }
      }

      if (Object.prototype.hasOwnProperty.call(data, "status")) {
        const nextStatus = ensureEnumValue(
          data.status,
          "status",
          CARE_REQUEST_STATUSES,
          "status must be new, assigned, in_progress, or closed."
        );

        if (!canTransitionCareRequestStatus(careRequest.status, nextStatus)) {
          throw new HttpsError(
            "failed-precondition",
            `Cannot transition care request from ${careRequest.status ?? "new"} to ${nextStatus}.`
          );
        }

        if (
          !CHURCH_ADMIN_ROLES.has(callerMember.role) &&
          careRequest.ownerUserId !== null &&
          careRequest.ownerUserId !== undefined &&
          careRequest.ownerUserId !== uid
        ) {
          throw new HttpsError(
            "permission-denied",
            "Only the assigned owner or pastor/admin can change this status."
          );
        }

        updatePayload.status = nextStatus;
        if (nextStatus === "closed") {
          updatePayload.closedAt = now;
          updatePayload.closedBy = uid;
          updatePayload.resolvedAt = now;
          updatePayload.resolvedBy = uid;
        } else {
          updatePayload.closedAt = null;
          updatePayload.closedBy = null;
          updatePayload.resolvedAt = null;
          updatePayload.resolvedBy = null;
        }
      }

      if (Object.keys(updatePayload).length === 2) {
        throw new HttpsError(
          "invalid-argument",
          "Provide at least one lifecycle update field."
        );
      }

      tx.update(requestRef, updatePayload);

      const nextOwner =
        Object.prototype.hasOwnProperty.call(updatePayload, "ownerUserId")
          ? (updatePayload.ownerUserId as string | null)
          : (careRequest.ownerUserId ?? null);
      const nextStatus =
        typeof updatePayload.status === "string"
          ? updatePayload.status
          : careRequest.status ?? "new";

      return {
        requestId,
        status: nextStatus,
        ownerUserId: nextOwner,
      };
    });
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
    const replyResult = await db.runTransaction(async (tx) => {
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
      const now = FieldValue.serverTimestamp();

      tx.set(msgRef, {
        senderType: "church",
        senderUserId: uid,
        body: (body as string).trim(),
        createdAt: now,
      });

      tx.update(threadRef, {
        churchReplyCount: FieldValue.increment(1),
        status: "closed",
        lastMessageAt: now,
        updatedAt: now,
      });

      if (thread.requestId) {
        const requestRef = db.doc(
          `churches/${churchId}/careRequests/${thread.requestId}`
        );
        tx.update(requestRef, {
          status: "closed",
          closedAt: now,
          closedBy: uid,
          resolvedAt: now,
          resolvedBy: uid,
          lastActionAt: now,
          lastActionBy: uid,
          ownerUserId: uid,
          ownerRole: member.role,
          assignedAt: now,
        });
      }

      return {
        messageId: msgRef.id,
        memberUserId: thread.memberUserId,
      };
    });

    const notificationScaffold = await notifyMemberCareReply(
      replyResult.memberUserId
    );

    return {
      threadId: threadId as string,
      messageId: replyResult.messageId,
      notificationScaffold,
    };
  }
);

// ---------------------------------------------------------------------------
// Phase 4: publishChurchMessage
// ---------------------------------------------------------------------------

/**
 * publishChurchMessage
 *
 * Creates a church-wide broadcast message. Only pastor, admin, or
 * communications roles may publish. Members are read-only consumers of this
 * feed; replies are not supported (contract §9).
 *
 * Request data:
 *   {
 *     churchId:   string,
 *     title:      string,
 *     body:       string,
 *     kind:       'pastoral' | 'announcement' | 'reminder',
 *     audience:   string,   // TODO: formalize allowed values (MVP default: 'all')
 *     expiresAt?: string    // ISO 8601 date string, optional
 *   }
 *
 * Returns:
 *   { messageId: string }
 *
 * Errors:
 *   unauthenticated   – no auth session
 *   invalid-argument  – missing or invalid fields
 *   permission-denied – not an authorized publishing role
 *   not-found         – church not found, or churchMessages feature disabled
 */
export const publishChurchMessage = onCall(
  { enforceAppCheck: false },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be signed in.");
    }

    const uid = request.auth.uid;
    const { churchId, title, body, kind, audience, expiresAt } =
      request.data as {
        churchId?: unknown;
        title?: unknown;
        body?: unknown;
        kind?: unknown;
        audience?: unknown;
        expiresAt?: unknown;
      };

    // Input validation
    if (!churchId || typeof churchId !== "string" || churchId.trim() === "") {
      throw new HttpsError("invalid-argument", "churchId is required.");
    }
    if (!title || typeof title !== "string" || title.trim() === "") {
      throw new HttpsError("invalid-argument", "title is required.");
    }
    if (!body || typeof body !== "string" || body.trim() === "") {
      throw new HttpsError("invalid-argument", "body is required.");
    }
    if (
      !kind ||
      !["pastoral", "announcement", "reminder"].includes(kind as string)
    ) {
      throw new HttpsError(
        "invalid-argument",
        "kind must be pastoral, announcement, or reminder."
      );
    }
    if (!audience || typeof audience !== "string" || audience.trim() === "") {
      throw new HttpsError("invalid-argument", "audience is required.");
    }

    // expiresAt is optional. If provided, must be a parseable ISO date string.
    let expiresAtTimestamp: Timestamp | null = null;
    if (expiresAt !== undefined && expiresAt !== null) {
      if (typeof expiresAt !== "string") {
        throw new HttpsError(
          "invalid-argument",
          "expiresAt must be an ISO date string."
        );
      }
      const parsed = Date.parse(expiresAt);
      if (isNaN(parsed)) {
        throw new HttpsError(
          "invalid-argument",
          "expiresAt must be a valid ISO date string."
        );
      }
      expiresAtTimestamp = Timestamp.fromDate(new Date(parsed));
    }

    // Verify active membership and role.
    // media_team is excluded by CHURCH_MESSAGE_ROLES (contract §9).
    const member = await requireActiveMember(churchId, uid);
    if (!CHURCH_MESSAGE_ROLES.has(member.role)) {
      throw new HttpsError(
        "permission-denied",
        "Not authorized to publish church messages."
      );
    }

    // Verify church feature gate.
    const church = await requireChurch(churchId);
    if (church.features?.churchMessages !== true) {
      throw new HttpsError(
        "not-found",
        "Church messages are not enabled for this church."
      );
    }

    const now = FieldValue.serverTimestamp();
    const messageRef = db
      .collection(`churches/${churchId}/churchMessages`)
      .doc();

    await messageRef.set({
      title: (title as string).trim(),
      body: (body as string).trim(),
      kind,
      audience: (audience as string).trim(),
      publishedBy: uid,
      createdAt: now,
      expiresAt: expiresAtTimestamp,
    });

    const notificationScaffold = await notifyChurchMessagePublished(
      churchId,
      uid
    );

    return { messageId: messageRef.id, notificationScaffold };
  }
);

// ---------------------------------------------------------------------------
// Phase 5: notification hooks
// ---------------------------------------------------------------------------
// Messaging delivery is intentionally scaffold-only in this phase.
// We compute eligibility from Firestore-backed preferences and token records,
// then return an emulator-safe summary without requiring FCM configuration.

// ---------------------------------------------------------------------------
// Phase 7: transcribeOnUpload
// ---------------------------------------------------------------------------
// This phase keeps transcription scaffold-only. The callable is a safe server
// runner for uploaded sermons until the Storage-triggered Deepgram path is
// wired. It still enforces sermon status, church feature gates, retention
// metadata, and failure-state representation.

// ---------------------------------------------------------------------------
// Phase 8: formation generation
// ---------------------------------------------------------------------------
// This phase remains scaffold-oriented but function-owned. The backend can
// derive a valid formationWeeks document from sermon + transcript inputs and
// enforce generated → approved → published transitions.

// ---------------------------------------------------------------------------
// Phase 9: weekly analytics
// ---------------------------------------------------------------------------
// Analytics stay aggregate-only and only read church-scoped backend data.
// No local-only journals, reflections, mood notes, or pastoral notes are read.
