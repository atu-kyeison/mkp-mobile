/**
 * MKP Emulator Test Runner
 *
 * Exercises the implemented Phase 1–9 Cloud Functions against the local
 * emulators.
 * Uses the Auth emulator REST API to get ID tokens, then calls each function
 * over HTTP the same way the mobile app would.
 *
 * Prerequisites:
 *   1. Firebase emulators running:  firebase emulators:start  (from backend/)
 *   2. Seed data loaded:            npm run seed              (from backend/functions/)
 *   3. Functions built:             npm run build             (from backend/functions/)
 *
 * Run:
 *   npm run test:emulator
 *
 * Or manually:
 *   FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 \
 *   FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 \
 *   node emulator-test.js
 *
 * Uses Node 20 built-in fetch — no extra dependencies required.
 */

'use strict';

const admin = require('firebase-admin');

const PROJECT_ID     = process.env.FIREBASE_PROJECT_ID  || 'mkp-mobile-dev';
const FUNCTIONS_HOST = process.env.FUNCTIONS_EMULATOR_HOST || '127.0.0.1:5001';
const AUTH_HOST      = process.env.FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099';

// Fake API key is accepted by the Auth emulator (any non-empty string works).
const FAKE_API_KEY = 'emulator-test-key';

const FUNCTIONS_BASE = `http://${FUNCTIONS_HOST}/${PROJECT_ID}/us-central1`;
const AUTH_SIGN_IN   = `http://${AUTH_HOST}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FAKE_API_KEY}`;

if (!admin.apps.length) {
  admin.initializeApp({ projectId: PROJECT_ID });
}

const db = admin.firestore();
const Timestamp = admin.firestore.Timestamp;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let passed = 0;
let failed = 0;

function pass(label) {
  passed++;
  console.log(`  ✓ ${label}`);
}

function fail(label, detail) {
  failed++;
  console.error(`  ✗ ${label}`);
  if (detail) console.error(`    ${detail}`);
}

/**
 * Sign in to the Auth emulator and return an ID token.
 */
async function signIn(email, password = 'password123') {
  const res = await fetch(AUTH_SIGN_IN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Auth sign-in failed for ${email}: ${text}`);
  }
  const body = await res.json();
  return body.idToken;
}

/**
 * Call a Firebase HTTPS callable (v2) function via the emulator.
 * Returns { data } on success or throws an object with { error } on failure.
 */
async function callFn(functionName, data, idToken) {
  const res = await fetch(`${FUNCTIONS_BASE}/${functionName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
    },
    body: JSON.stringify({ data }),
  });

  const body = await res.json();

  if (!res.ok || body.error) {
    const err = new Error(body.error?.message || `HTTP ${res.status}`);
    err.code = body.error?.status;
    err.response = body;
    throw err;
  }

  return body.result ?? body;
}

function getCurrentWeekStartDate() {
  const now = new Date();
  const utcDay = now.getUTCDay();
  const start = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() - utcDay
  ));
  return start.toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// Test suites
// ---------------------------------------------------------------------------

async function testJoinChurch() {
  console.log('\n── joinChurch ────────────────────────────────────');

  // A new user (not yet seeded as a member anywhere) for the join flow test.
  // We use a seeded user who IS already a member to test the re-join path.
  const aliceToken = await signIn('alice@test.com');

  // 1. Valid join code → success
  try {
    const result = await callFn(
      'joinChurch',
      { churchId: 'church-alpha', joinCode: 'GRACE2024' },
      aliceToken
    );
    if (result.churchId === 'church-alpha') {
      pass('valid join code returns churchId');
    } else {
      fail('valid join code returns churchId', JSON.stringify(result));
    }
    if (result.role) {
      pass('result includes role');
    } else {
      fail('result includes role', JSON.stringify(result));
    }
  } catch (err) {
    fail('valid join code returns churchId', err.message);
    fail('result includes role');
  }

  // 2. Wrong join code → permission-denied
  try {
    await callFn(
      'joinChurch',
      { churchId: 'church-alpha', joinCode: 'WRONGCODE' },
      aliceToken
    );
    fail('wrong join code is rejected');
  } catch (err) {
    pass('wrong join code is rejected');
  }

  // 3. No auth → unauthenticated
  try {
    await callFn('joinChurch', { churchId: 'church-alpha', joinCode: 'GRACE2024' }, null);
    fail('unauthenticated call is rejected');
  } catch (err) {
    pass('unauthenticated call is rejected');
  }

  // 4. Missing churchId → invalid-argument
  try {
    await callFn('joinChurch', { joinCode: 'GRACE2024' }, aliceToken);
    fail('missing churchId is rejected');
  } catch (err) {
    pass('missing churchId is rejected');
  }
}

async function testSubmitCareRequest() {
  console.log('\n── submitCareRequest ─────────────────────────────');

  const aliceToken  = await signIn('alice@test.com');   // member, church-alpha
  const graceToken  = await signIn('grace@test.com');   // member, church-beta (features disabled)

  let createdThreadId;

  // 1. Valid care request with in_app channel → creates thread (features.careThreads=true)
  try {
    const result = await callFn(
      'submitCareRequest',
      {
        churchId: 'church-alpha',
        type: 'prayer',
        content: 'Please pray for my family.',
        isAnonymous: false,
        preferredChannel: 'in_app',
      },
      aliceToken
    );
    if (result.requestId) {
      pass('care request created, requestId returned');
    } else {
      fail('care request created, requestId returned', JSON.stringify(result));
    }
    if (result.threadId) {
      pass('in_app channel + careThreads=true creates thread');
      createdThreadId = result.threadId;
    } else {
      fail('in_app channel + careThreads=true creates thread', JSON.stringify(result));
    }
  } catch (err) {
    fail('care request created', err.message);
    fail('in_app channel + careThreads=true creates thread');
  }

  // 2. email channel → no thread created
  try {
    const result = await callFn(
      'submitCareRequest',
      {
        churchId: 'church-alpha',
        type: 'testimony',
        content: 'God answered my prayer.',
        isAnonymous: false,
        preferredChannel: 'email',
      },
      aliceToken
    );
    if (result.requestId && !result.threadId) {
      pass('email channel does not create a thread');
    } else {
      fail('email channel does not create a thread', JSON.stringify(result));
    }
  } catch (err) {
    fail('email channel does not create a thread', err.message);
  }

  // 3. church-beta: careThreads=false → no thread even with in_app channel
  try {
    const result = await callFn(
      'submitCareRequest',
      {
        churchId: 'church-beta',
        type: 'care_support',
        content: 'I need support.',
        isAnonymous: true,
        preferredChannel: 'in_app',
      },
      graceToken
    );
    if (result.requestId && !result.threadId) {
      pass('careThreads feature=false suppresses thread creation');
    } else {
      fail('careThreads feature=false suppresses thread creation', JSON.stringify(result));
    }
  } catch (err) {
    fail('careThreads feature=false suppresses thread creation', err.message);
  }

  // 4. Invalid type → invalid-argument
  try {
    await callFn(
      'submitCareRequest',
      {
        churchId: 'church-alpha',
        type: 'invalid_type',
        content: 'Test.',
        isAnonymous: false,
        preferredChannel: 'in_app',
      },
      aliceToken
    );
    fail('invalid type is rejected');
  } catch (err) {
    pass('invalid type is rejected');
  }

  // 5. No auth → unauthenticated
  try {
    await callFn(
      'submitCareRequest',
      { churchId: 'church-alpha', type: 'prayer', content: 'Test.', isAnonymous: false, preferredChannel: 'in_app' },
      null
    );
    fail('unauthenticated call is rejected');
  } catch (err) {
    pass('unauthenticated call is rejected');
  }

  return createdThreadId;
}

async function testNotificationScaffoldingSetup() {
  console.log('\n── notificationScaffolding ──────────────────────');

  const aliceToken = await signIn('alice@test.com');

  try {
    const result = await callFn(
      'saveCommunicationPreferences',
      {
        churchMessagesEnabled: true,
        careReplyNotificationsEnabled: true,
        formationNotificationsEnabled: false,
      },
      aliceToken
    );

    if (result.churchMessagesEnabled === true &&
        result.careReplyNotificationsEnabled === true &&
        result.formationNotificationsEnabled === false) {
      pass('communication preferences saved through callable');
    } else {
      fail('communication preferences saved through callable', JSON.stringify(result));
    }
  } catch (err) {
    fail('communication preferences saved through callable', err.message);
  }

  try {
    const snap = await db.doc('users/uid-alice/preferences/communication').get();
    const data = snap.data() || {};
    if (data.churchMessagesEnabled === true &&
        data.careReplyNotificationsEnabled === true &&
        data.formationNotificationsEnabled === false) {
      pass('communication preference doc written to contract path');
    } else {
      fail('communication preference doc written to contract path', JSON.stringify(data));
    }
  } catch (err) {
    fail('communication preference doc written to contract path', err.message);
  }

  try {
    const result = await callFn(
      'registerFcmToken',
      {
        tokenId: 'device-alpha',
        token: 'fcm-token-alpha',
        platform: 'ios',
      },
      aliceToken
    );

    if (result.tokenId === 'device-alpha' && result.platform === 'ios') {
      pass('fcm token registered through callable');
    } else {
      fail('fcm token registered through callable', JSON.stringify(result));
    }
  } catch (err) {
    fail('fcm token registered through callable', err.message);
  }

  try {
    const snap = await db.doc('users/uid-alice/fcmTokens/device-alpha').get();
    const data = snap.data() || {};
    if (data.token === 'fcm-token-alpha' && data.platform === 'ios') {
      pass('fcm token doc written to contract path');
    } else {
      fail('fcm token doc written to contract path', JSON.stringify(data));
    }
  } catch (err) {
    fail('fcm token doc written to contract path', err.message);
  }
}

async function testRespondToCareThread(threadId) {
  console.log('\n── respondToCareThread ───────────────────────────');

  if (!threadId) {
    console.log('  (skipped — no threadId from submitCareRequest)');
    return;
  }

  const aliceToken = await signIn('alice@test.com');  // member
  const bobToken   = await signIn('bob@test.com');    // pastor
  const eveToken   = await signIn('eve@test.com');    // media_team

  // 1. Member cannot respond (wrong role)
  try {
    await callFn(
      'respondToCareThread',
      { churchId: 'church-alpha', threadId, body: 'We are praying for you.' },
      aliceToken
    );
    fail('member cannot respond to care thread (permission-denied)');
  } catch (err) {
    pass('member cannot respond to care thread (permission-denied)');
  }

  // 2. media_team cannot respond (wrong role)
  try {
    await callFn(
      'respondToCareThread',
      { churchId: 'church-alpha', threadId, body: 'We are praying for you.' },
      eveToken
    );
    fail('media_team cannot respond to care thread (permission-denied)');
  } catch (err) {
    pass('media_team cannot respond to care thread (permission-denied)');
  }

  // 3. Pastor sends the one allowed reply
  let messageId;
  try {
    const result = await callFn(
      'respondToCareThread',
      { churchId: 'church-alpha', threadId, body: 'We are praying for you. God bless.' },
      bobToken
    );
    if (
      result.messageId &&
      result.threadId === threadId &&
      result.notificationScaffold?.hookTriggered === true &&
      result.notificationScaffold?.eligibleUserCount === 1 &&
      result.notificationScaffold?.tokenCount === 1
    ) {
      pass('pastor sends church reply, messageId returned');
      pass('care reply notification scaffold triggers for opted-in member token');
      messageId = result.messageId;
    } else {
      fail('pastor sends church reply, messageId returned', JSON.stringify(result));
      fail('care reply notification scaffold triggers for opted-in member token', JSON.stringify(result));
    }
  } catch (err) {
    fail('pastor sends church reply', err.message);
    fail('care reply notification scaffold triggers for opted-in member token', err.message);
  }

  // 4. Second reply is rejected (one-reply-max)
  try {
    await callFn(
      'respondToCareThread',
      { churchId: 'church-alpha', threadId, body: 'A second reply attempt.' },
      bobToken
    );
    fail('second church reply is rejected (one-reply-max)');
  } catch (err) {
    pass('second church reply is rejected (one-reply-max)');
  }

  return messageId;
}

async function testPublishChurchMessage() {
  console.log('\n── publishChurchMessage ──────────────────────────');

  const aliceToken = await signIn('alice@test.com');  // member
  const bobToken   = await signIn('bob@test.com');    // pastor
  const daveToken  = await signIn('dave@test.com');   // communications
  const eveToken   = await signIn('eve@test.com');    // media_team
  const henryToken = await signIn('henry@test.com');  // pastor @ church-beta (features disabled)

  // 1. Member cannot publish
  try {
    await callFn(
      'publishChurchMessage',
      { churchId: 'church-alpha', title: 'Test', body: 'Hello.', kind: 'announcement', audience: 'all' },
      aliceToken
    );
    fail('member cannot publish church message (permission-denied)');
  } catch (err) {
    pass('member cannot publish church message (permission-denied)');
  }

  // 2. media_team cannot publish
  try {
    await callFn(
      'publishChurchMessage',
      { churchId: 'church-alpha', title: 'Test', body: 'Hello.', kind: 'announcement', audience: 'all' },
      eveToken
    );
    fail('media_team cannot publish church message (permission-denied)');
  } catch (err) {
    pass('media_team cannot publish church message (permission-denied)');
  }

  // 3. Pastor can publish
  try {
    const result = await callFn(
      'publishChurchMessage',
      { churchId: 'church-alpha', title: 'Sunday Service', body: 'Join us this Sunday at 10am.', kind: 'announcement', audience: 'all' },
      bobToken
    );
    if (
      result.messageId &&
      result.notificationScaffold?.hookTriggered === true &&
      result.notificationScaffold?.eligibleUserCount === 1 &&
      result.notificationScaffold?.tokenCount === 1
    ) {
      pass('pastor publishes church message, messageId returned');
      pass('church message notification scaffold fans out to opted-in member token');
    } else {
      fail('pastor publishes church message', JSON.stringify(result));
      fail('church message notification scaffold fans out to opted-in member token', JSON.stringify(result));
    }
  } catch (err) {
    fail('pastor publishes church message', err.message);
    fail('church message notification scaffold fans out to opted-in member token', err.message);
  }

  // 4. Disable church message notifications, then verify publish stays scaffolded
  try {
    const prefs = await callFn(
      'saveCommunicationPreferences',
      {
        churchMessagesEnabled: false,
      },
      aliceToken
    );
    if (prefs.churchMessagesEnabled === false) {
      pass('church message preference can be disabled independently');
    } else {
      fail('church message preference can be disabled independently', JSON.stringify(prefs));
    }
  } catch (err) {
    fail('church message preference can be disabled independently', err.message);
  }

  // 5. Communications role can publish
  try {
    const result = await callFn(
      'publishChurchMessage',
      { churchId: 'church-alpha', title: 'Weekly Update', body: 'Here is your update.', kind: 'pastoral', audience: 'all' },
      daveToken
    );
    if (
      result.messageId &&
      result.notificationScaffold?.eligibleUserCount === 0 &&
      result.notificationScaffold?.skippedReason === 'church_message_notifications_disabled'
    ) {
      pass('communications role publishes church message');
      pass('church message scaffold respects stored communication preferences');
    } else {
      fail('communications role publishes church message', JSON.stringify(result));
      fail('church message scaffold respects stored communication preferences', JSON.stringify(result));
    }
  } catch (err) {
    fail('communications role publishes church message', err.message);
    fail('church message scaffold respects stored communication preferences', err.message);
  }

  // 6. Feature gate: church-beta has churchMessages=false
  try {
    await callFn(
      'publishChurchMessage',
      { churchId: 'church-beta', title: 'Test', body: 'Hello.', kind: 'announcement', audience: 'all' },
      henryToken
    );
    fail('churchMessages feature=false blocks publish');
  } catch (err) {
    pass('churchMessages feature=false blocks publish');
  }

  // 7. Invalid kind → invalid-argument
  try {
    await callFn(
      'publishChurchMessage',
      { churchId: 'church-alpha', title: 'Test', body: 'Hello.', kind: 'invalid_kind', audience: 'all' },
      bobToken
    );
    fail('invalid kind is rejected');
  } catch (err) {
    pass('invalid kind is rejected');
  }
}

async function testDeleteFcmToken() {
  console.log('\n── deleteFcmToken ───────────────────────────────');

  const aliceToken = await signIn('alice@test.com');

  try {
    const result = await callFn(
      'deleteFcmToken',
      { tokenId: 'device-alpha' },
      aliceToken
    );
    if (result.tokenId === 'device-alpha') {
      pass('fcm token delete callable returns tokenId');
    } else {
      fail('fcm token delete callable returns tokenId', JSON.stringify(result));
    }
  } catch (err) {
    fail('fcm token delete callable returns tokenId', err.message);
  }

  try {
    const snap = await db.doc('users/uid-alice/fcmTokens/device-alpha').get();
    if (!snap.exists) {
      pass('fcm token doc is deleted');
    } else {
      fail('fcm token doc is deleted', 'document still exists');
    }
  } catch (err) {
    fail('fcm token doc is deleted', err.message);
  }
}

async function testSermonMediaPipeline() {
  console.log('\n── sermonMediaPipeline ──────────────────────────');

  const aliceToken = await signIn('alice@test.com');  // member
  const bobToken   = await signIn('bob@test.com');    // pastor
  const carolToken = await signIn('carol@test.com');  // care_team
  const daveToken  = await signIn('dave@test.com');   // communications
  const eveToken   = await signIn('eve@test.com');    // media_team
  const henryToken = await signIn('henry@test.com');  // pastor @ church-beta

  let createdSermonId;
  let createdUploadPath;

  // 1. member cannot create sermon upload
  try {
    await callFn(
      'createSermonUpload',
      {
        churchId: 'church-alpha',
        title: 'The Narrow Way',
        preacherName: 'Bob Pastor',
        date: '2026-03-01T16:00:00.000Z',
        language: 'en',
        sourceType: 'audio_upload',
        fileName: 'narrow-way.mp3',
      },
      aliceToken
    );
    fail('member cannot create sermon upload');
  } catch (err) {
    pass('member cannot create sermon upload');
  }

  // 2. care_team cannot create sermon upload
  try {
    await callFn(
      'createSermonUpload',
      {
        churchId: 'church-alpha',
        title: 'The Narrow Way',
        preacherName: 'Bob Pastor',
        date: '2026-03-01T16:00:00.000Z',
        language: 'en',
        sourceType: 'audio_upload',
        fileName: 'narrow-way.mp3',
      },
      carolToken
    );
    fail('care_team cannot create sermon upload');
  } catch (err) {
    pass('care_team cannot create sermon upload');
  }

  // 3. communications cannot create sermon upload
  try {
    await callFn(
      'createSermonUpload',
      {
        churchId: 'church-alpha',
        title: 'The Narrow Way',
        preacherName: 'Bob Pastor',
        date: '2026-03-01T16:00:00.000Z',
        language: 'en',
        sourceType: 'audio_upload',
        fileName: 'narrow-way.mp3',
      },
      daveToken
    );
    fail('communications cannot create sermon upload');
  } catch (err) {
    pass('communications cannot create sermon upload');
  }

  // 4. media_team can create sermon upload metadata
  try {
    const result = await callFn(
      'createSermonUpload',
      {
        churchId: 'church-alpha',
        title: 'The Narrow Way',
        preacherName: 'Bob Pastor',
        date: '2026-03-01T16:00:00.000Z',
        language: 'en',
        sourceType: 'audio_upload',
        fileName: 'narrow-way.mp3',
        series: 'Kingdom Rhythms',
        partNumber: 2,
        bibleRefs: ['Matthew 7:13-14'],
      },
      eveToken
    );

    if (
      result.sermonId &&
      result.status === 'draft' &&
      typeof result.uploadPath === 'string' &&
      result.uploadPath === `sermons/church-alpha/${result.sermonId}/original/narrow-way.mp3`
    ) {
      pass('media_team creates sermon upload metadata');
      createdSermonId = result.sermonId;
      createdUploadPath = result.uploadPath;
    } else {
      fail('media_team creates sermon upload metadata', JSON.stringify(result));
    }
  } catch (err) {
    fail('media_team creates sermon upload metadata', err.message);
  }

  // 5. created sermon doc contains source metadata
  try {
    const snap = await db.doc(`churches/church-alpha/sermons/${createdSermonId}`).get();
    const data = snap.data() || {};
    if (
      data.title === 'The Narrow Way' &&
      data.sourceType === 'audio_upload' &&
      data.status === 'draft' &&
      data.audioStoragePath === createdUploadPath
    ) {
      pass('sermon doc records source metadata correctly');
    } else {
      fail('sermon doc records source metadata correctly', JSON.stringify(data));
    }
  } catch (err) {
    fail('sermon doc records source metadata correctly', err.message);
  }

  // 6. feature-disabled church blocks sermon upload metadata flow
  try {
    await callFn(
      'createSermonUpload',
      {
        churchId: 'church-beta',
        title: 'River Sermon',
        preacherName: 'Henry BetaPastor',
        date: '2026-03-01T16:00:00.000Z',
        language: 'en',
        sourceType: 'audio_upload',
        fileName: 'river.mp3',
      },
      henryToken
    );
    fail('mediaPipeline feature=false blocks sermon upload creation');
  } catch (err) {
    pass('mediaPipeline feature=false blocks sermon upload creation');
  }

  // 7. invalid sourceType is rejected
  try {
    await callFn(
      'createSermonUpload',
      {
        churchId: 'church-alpha',
        title: 'Bad Source',
        preacherName: 'Bob Pastor',
        date: '2026-03-01T16:00:00.000Z',
        language: 'en',
        sourceType: 'external_url',
        fileName: 'bad.mp3',
      },
      bobToken
    );
    fail('invalid sermon sourceType is rejected');
  } catch (err) {
    pass('invalid sermon sourceType is rejected');
  }

  // 8. wrong role cannot complete upload
  try {
    await callFn(
      'completeSermonUpload',
      {
        churchId: 'church-alpha',
        sermonId: createdSermonId,
        audioStoragePath: createdUploadPath,
      },
      aliceToken
    );
    fail('member cannot complete sermon upload');
  } catch (err) {
    pass('member cannot complete sermon upload');
  }

  // 9. upload path must remain inside sermon original path
  try {
    await callFn(
      'completeSermonUpload',
      {
        churchId: 'church-alpha',
        sermonId: createdSermonId,
        audioStoragePath: 'sermons/church-alpha/other-sermon/original/narrow-way.mp3',
      },
      bobToken
    );
    fail('sermon upload path is validated');
  } catch (err) {
    pass('sermon upload path is validated');
  }

  // 10. pastor can mark upload complete
  try {
    const result = await callFn(
      'completeSermonUpload',
      {
        churchId: 'church-alpha',
        sermonId: createdSermonId,
        audioStoragePath: createdUploadPath,
      },
      bobToken
    );

    if (
      result.sermonId === createdSermonId &&
      result.status === 'uploaded' &&
      result.audioStoragePath === createdUploadPath
    ) {
      pass('authorized staff can complete sermon upload');
    } else {
      fail('authorized staff can complete sermon upload', JSON.stringify(result));
    }
  } catch (err) {
    fail('authorized staff can complete sermon upload', err.message);
  }

  // 11. sermon status moves to uploaded after completion
  try {
    const snap = await db.doc(`churches/church-alpha/sermons/${createdSermonId}`).get();
    const data = snap.data() || {};
    if (data.status === 'uploaded' && data.audioStoragePath === createdUploadPath) {
      pass('sermon upload metadata flow updates status to uploaded');
    } else {
      fail('sermon upload metadata flow updates status to uploaded', JSON.stringify(data));
    }
  } catch (err) {
    fail('sermon upload metadata flow updates status to uploaded', err.message);
  }
}

async function testTranscriptionPipeline() {
  console.log('\n── transcriptionPipeline ───────────────────────');

  const bobToken   = await signIn('bob@test.com');    // pastor
  const eveToken   = await signIn('eve@test.com');    // media_team
  const henryToken = await signIn('henry@test.com');  // pastor @ church-beta

  let successSermonId;
  let failureSermonId;
  let successTranscriptId;
  let failureTranscriptId;

  async function createUploadedSermon(title, fileName) {
    const created = await callFn(
      'createSermonUpload',
      {
        churchId: 'church-alpha',
        title,
        preacherName: 'Bob Pastor',
        date: '2026-03-01T16:00:00.000Z',
        language: 'en',
        sourceType: 'audio_upload',
        fileName,
      },
      eveToken
    );

    await callFn(
      'completeSermonUpload',
      {
        churchId: 'church-alpha',
        sermonId: created.sermonId,
        audioStoragePath: created.uploadPath,
      },
      bobToken
    );

    return created;
  }

  // 1. Uploaded sermon can enter transcription and write transcript artifact
  try {
    const created = await createUploadedSermon('Transcription Success', 'transcription-success.mp3');
    const result = await callFn(
      'transcribeOnUpload',
      {
        churchId: 'church-alpha',
        sermonId: created.sermonId,
        transcriptText: 'Blessed are the peacemakers.',
      },
      bobToken
    );

    if (result.sermonId === created.sermonId &&
        result.status === 'transcribed' &&
        result.transcriptId) {
      pass('uploaded sermon can move through transcription scaffold');
      pass('transcript record can be written');
      successSermonId = created.sermonId;
      successTranscriptId = result.transcriptId;
    } else {
      fail('uploaded sermon can move through transcription scaffold', JSON.stringify(result));
      fail('transcript record can be written', JSON.stringify(result));
    }
  } catch (err) {
    fail('uploaded sermon can move through transcription scaffold', err.message);
    fail('transcript record can be written', err.message);
  }

  // 2. Transcript retention metadata is set
  try {
    const snap = await db.doc(`churches/church-alpha/sermons/${successSermonId}/transcripts/${successTranscriptId}`).get();
    const data = snap.data() || {};
    if (data.provider === 'deepgram_scaffold' &&
        data.status === 'completed' &&
        data.retentionDeleteAfter) {
      pass('transcript artifact includes retention metadata');
    } else {
      fail('transcript artifact includes retention metadata', JSON.stringify(data));
    }
  } catch (err) {
    fail('transcript artifact includes retention metadata', err.message);
  }

  // 3. Sermon doc reflects transcribed lifecycle state
  try {
    const snap = await db.doc(`churches/church-alpha/sermons/${successSermonId}`).get();
    const data = snap.data() || {};
    if (data.status === 'transcribed' && data.transcriptionStatus === 'transcribed') {
      pass('sermon status updates to transcribed');
    } else {
      fail('sermon status updates to transcribed', JSON.stringify(data));
    }
  } catch (err) {
    fail('sermon status updates to transcribed', err.message);
  }

  // 4. media_team cannot trigger transcription lifecycle
  try {
    await callFn(
      'transcribeOnUpload',
      {
        churchId: 'church-alpha',
        sermonId: successSermonId,
      },
      eveToken
    );
    fail('media_team cannot trigger transcription scaffold');
  } catch (err) {
    pass('media_team cannot trigger transcription scaffold');
  }

  // 5. Feature-disabled church blocks transcription scaffold
  try {
    await callFn(
      'transcribeOnUpload',
      {
        churchId: 'church-beta',
        sermonId: 'missing-sermon',
      },
      henryToken
    );
    fail('sermonTranscription feature=false blocks transcription scaffold');
  } catch (err) {
    pass('sermonTranscription feature=false blocks transcription scaffold');
  }

  // 6. Failure path writes failure state without secrets
  try {
    const created = await createUploadedSermon('Transcription Failure', 'transcription-failure.mp3');
    const result = await callFn(
      'transcribeOnUpload',
      {
        churchId: 'church-alpha',
        sermonId: created.sermonId,
        simulateFailure: true,
      },
      bobToken
    );

    if (result.sermonId === created.sermonId &&
        result.status === 'failed' &&
        result.transcriptId) {
      pass('failed transcription writes a failure state');
      failureSermonId = created.sermonId;
      failureTranscriptId = result.transcriptId;
    } else {
      fail('failed transcription writes a failure state', JSON.stringify(result));
    }
  } catch (err) {
    fail('failed transcription writes a failure state', err.message);
  }

  // 7. Failure transcript artifact is sanitized
  try {
    const snap = await db.doc(`churches/church-alpha/sermons/${failureSermonId}/transcripts/${failureTranscriptId}`).get();
    const data = snap.data() || {};
    if (data.status === 'failed' &&
        data.errorCode === 'TRANSCRIPTION_SCAFFOLD_FAILURE' &&
        !Object.prototype.hasOwnProperty.call(data, 'content')) {
      pass('failed transcription does not expose raw transcript content');
    } else {
      fail('failed transcription does not expose raw transcript content', JSON.stringify(data));
    }
  } catch (err) {
    fail('failed transcription does not expose raw transcript content', err.message);
  }
}

async function testFormationPipeline() {
  console.log('\n── formationPipeline ───────────────────────────');

  const aliceToken = await signIn('alice@test.com');  // member
  const bobToken   = await signIn('bob@test.com');    // pastor
  const eveToken   = await signIn('eve@test.com');    // media_team
  const henryToken = await signIn('henry@test.com');  // pastor @ church-beta

  let weekId;
  let sermonId;

  async function createTranscribedSermon(title, fileName) {
    const created = await callFn(
      'createSermonUpload',
      {
        churchId: 'church-alpha',
        title,
        preacherName: 'Bob Pastor',
        date: '2026-03-02T16:00:00.000Z',
        language: 'en',
        sourceType: 'audio_upload',
        fileName,
        bibleRefs: ['Romans 12:2'],
      },
      eveToken
    );

    await callFn(
      'completeSermonUpload',
      {
        churchId: 'church-alpha',
        sermonId: created.sermonId,
        audioStoragePath: created.uploadPath,
      },
      bobToken
    );

    await callFn(
      'transcribeOnUpload',
      {
        churchId: 'church-alpha',
        sermonId: created.sermonId,
        transcriptText: 'Be transformed by the renewing of your mind.',
      },
      bobToken
    );

    return created.sermonId;
  }

  // 1. Member cannot generate formation
  try {
    await callFn(
      'generateFormationContent',
      { churchId: 'church-alpha', sermonId: 'missing-sermon' },
      aliceToken
    );
    fail('member cannot generate formation content');
  } catch (err) {
    pass('member cannot generate formation content');
  }

  // 2. Feature-disabled church blocks formation generation
  try {
    await callFn(
      'generateFormationContent',
      { churchId: 'church-beta', sermonId: 'missing-sermon' },
      henryToken
    );
    fail('formationGeneration feature=false blocks generation');
  } catch (err) {
    pass('formationGeneration feature=false blocks generation');
  }

  // 3. Pastor can generate formation from transcribed sermon
  try {
    sermonId = await createTranscribedSermon('Formation Week', 'formation-week.mp3');
    const result = await callFn(
      'generateFormationContent',
      { churchId: 'church-alpha', sermonId },
      bobToken
    );

    if (result.sermonId === sermonId &&
        result.status === 'generated' &&
        result.weekId) {
      pass('pastor generates formation content');
      weekId = result.weekId;
    } else {
      fail('pastor generates formation content', JSON.stringify(result));
    }
  } catch (err) {
    fail('pastor generates formation content', err.message);
  }

  // 4. Formation week document is structurally valid
  try {
    const snap = await db.doc(`churches/church-alpha/formationWeeks/${weekId}`).get();
    const data = snap.data() || {};
    if (data.status === 'generated' &&
        data.sermonId === sermonId &&
        data.days?.monday &&
        data.days?.saturday &&
        Array.isArray(data.truths)) {
      pass('formation week doc is created with scaffold content');
    } else {
      fail('formation week doc is created with scaffold content', JSON.stringify(data));
    }
  } catch (err) {
    fail('formation week doc is created with scaffold content', err.message);
  }

  // 5. Sermon reflects generated formation lifecycle state
  try {
    const snap = await db.doc(`churches/church-alpha/sermons/${sermonId}`).get();
    const data = snap.data() || {};
    if (data.status === 'formation_generated' && data.formationStatus === 'generated') {
      pass('sermon status updates to formation_generated');
    } else {
      fail('sermon status updates to formation_generated', JSON.stringify(data));
    }
  } catch (err) {
    fail('sermon status updates to formation_generated', err.message);
  }

  // 6. Cannot publish before approval
  try {
    await callFn(
      'updateFormationWeekStatus',
      { churchId: 'church-alpha', weekId, status: 'published' },
      bobToken
    );
    fail('formation publish requires approval first');
  } catch (err) {
    pass('formation publish requires approval first');
  }

  // 7. Pastor can approve then publish
  try {
    const approved = await callFn(
      'updateFormationWeekStatus',
      { churchId: 'church-alpha', weekId, status: 'approved' },
      bobToken
    );
    const published = await callFn(
      'updateFormationWeekStatus',
      { churchId: 'church-alpha', weekId, status: 'published' },
      bobToken
    );

    if (approved.status === 'approved' && published.status === 'published') {
      pass('formation status transitions through approved to published');
    } else {
      fail('formation status transitions through approved to published', JSON.stringify({ approved, published }));
    }
  } catch (err) {
    fail('formation status transitions through approved to published', err.message);
  }

  // 8. Published formation week is stored as published
  try {
    const snap = await db.doc(`churches/church-alpha/formationWeeks/${weekId}`).get();
    const data = snap.data() || {};
    if (data.status === 'published') {
      pass('published formation week state is stored');
    } else {
      fail('published formation week state is stored', JSON.stringify(data));
    }
  } catch (err) {
    fail('published formation week state is stored', err.message);
  }
}

async function testWeeklyAnalytics() {
  console.log('\n── weeklyAnalytics ─────────────────────────────');

  const aliceToken = await signIn('alice@test.com');  // member
  const bobToken   = await signIn('bob@test.com');    // pastor
  const weekStartDate = getCurrentWeekStartDate();
  const weekStart = new Date(`${weekStartDate}T00:00:00.000Z`);
  const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
  const weekStartTs = Timestamp.fromDate(weekStart);
  const weekEndTs = Timestamp.fromDate(weekEnd);

  // 1. Member cannot compute analytics
  try {
    await callFn(
      'computeWeeklyAnalytics',
      { churchId: 'church-alpha', weekStartDate },
      aliceToken
    );
    fail('member cannot compute weekly analytics');
  } catch (err) {
    pass('member cannot compute weekly analytics');
  }

  // 2. Pastor can compute aggregate analytics
  try {
    const result = await callFn(
      'computeWeeklyAnalytics',
      { churchId: 'church-alpha', weekStartDate },
      bobToken
    );

    const [
      activeMembersSnap,
      careSubmittedSnap,
      careResolvedSnap,
      churchMessagesSnap,
    ] = await Promise.all([
      db.collection('churches/church-alpha/members').where('status', '==', 'active').get(),
      db.collection('churches/church-alpha/careRequests')
        .where('createdAt', '>=', weekStartTs)
        .where('createdAt', '<', weekEndTs)
        .get(),
      db.collection('churches/church-alpha/careRequests')
        .where('resolvedAt', '>=', weekStartTs)
        .where('resolvedAt', '<', weekEndTs)
        .get(),
      db.collection('churches/church-alpha/churchMessages')
        .where('createdAt', '>=', weekStartTs)
        .where('createdAt', '<', weekEndTs)
        .get(),
    ]);

    if (
      result.weekStartDate === weekStartDate &&
      result.activeMembers === activeMembersSnap.size &&
      result.careRequestsSubmitted === careSubmittedSnap.size &&
      result.careRequestsResolved === careResolvedSnap.size &&
      result.churchMessagesPublished === churchMessagesSnap.size &&
      result.formationViews === 0
    ) {
      pass('weekly analytics are computed from aggregate backend data');
    } else {
      fail('weekly analytics are computed from aggregate backend data', JSON.stringify(result));
    }
  } catch (err) {
    fail('weekly analytics are computed from aggregate backend data', err.message);
  }

  // 3. Analytics doc is written without local-only leakage
  try {
    const snap = await db.doc(`churches/church-alpha/analyticsWeekly/${weekStartDate}`).get();
    const data = snap.data() || {};
    if (
      data.weekStartDate === weekStartDate &&
      Object.prototype.hasOwnProperty.call(data, 'computedAt') &&
      !Object.prototype.hasOwnProperty.call(data, 'journalText') &&
      !Object.prototype.hasOwnProperty.call(data, 'moodNotes')
    ) {
      pass('analytics doc stays aggregate-only');
    } else {
      fail('analytics doc stays aggregate-only', JSON.stringify(data));
    }
  } catch (err) {
    fail('analytics doc stays aggregate-only', err.message);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('');
  console.log('MKP Emulator Test Runner');
  console.log('─────────────────────────────────────────────────');
  console.log(`Project:   ${PROJECT_ID}`);
  console.log(`Functions: ${FUNCTIONS_BASE}`);
  console.log(`Auth:      http://${AUTH_HOST}`);
  console.log('');
  console.log('Prerequisite: emulators running + seed data loaded.');
  console.log('  Start emulators: firebase emulators:start  (from backend/)');
  console.log('  Load seed data:  npm run seed              (from backend/functions/)');
  console.log('');

  try {
    await testJoinChurch();
    await testNotificationScaffoldingSetup();
    const threadId = await testSubmitCareRequest();
    await testRespondToCareThread(threadId);
    await testPublishChurchMessage();
    await testDeleteFcmToken();
    await testSermonMediaPipeline();
    await testTranscriptionPipeline();
    await testFormationPipeline();
    await testWeeklyAnalytics();
  } catch (err) {
    console.error('\nUnhandled error:', err.message || err);
    process.exit(1);
  }

  console.log('');
  console.log('─────────────────────────────────────────────────');
  console.log(`Results: ${passed} passed, ${failed} failed`);

  if (failed > 0) {
    console.log('');
    console.log('Some tests failed. Check emulator logs for details:');
    console.log('  http://localhost:4000  (Emulator UI)');
    process.exit(1);
  } else {
    console.log('All tests passed.');
  }
}

main().catch((err) => {
  console.error('\nTest runner crashed:', err.message || err);
  process.exit(1);
});
