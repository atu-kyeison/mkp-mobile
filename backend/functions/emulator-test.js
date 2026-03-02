/**
 * MKP Emulator Test Runner
 *
 * Exercises the four Phase 1–4 Cloud Functions against the local emulators.
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

const PROJECT_ID     = process.env.FIREBASE_PROJECT_ID  || 'mkp-mobile-dev';
const FUNCTIONS_HOST = process.env.FUNCTIONS_EMULATOR_HOST || '127.0.0.1:5001';
const AUTH_HOST      = process.env.FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099';

// Fake API key is accepted by the Auth emulator (any non-empty string works).
const FAKE_API_KEY = 'emulator-test-key';

const FUNCTIONS_BASE = `http://${FUNCTIONS_HOST}/${PROJECT_ID}/us-central1`;
const AUTH_SIGN_IN   = `http://${AUTH_HOST}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FAKE_API_KEY}`;

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
    if (result.messageId && result.threadId === threadId) {
      pass('pastor sends church reply, messageId returned');
      messageId = result.messageId;
    } else {
      fail('pastor sends church reply, messageId returned', JSON.stringify(result));
    }
  } catch (err) {
    fail('pastor sends church reply', err.message);
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
    if (result.messageId) {
      pass('pastor publishes church message, messageId returned');
    } else {
      fail('pastor publishes church message', JSON.stringify(result));
    }
  } catch (err) {
    fail('pastor publishes church message', err.message);
  }

  // 4. Communications role can publish
  try {
    const result = await callFn(
      'publishChurchMessage',
      { churchId: 'church-alpha', title: 'Weekly Update', body: 'Here is your update.', kind: 'pastoral', audience: 'all' },
      daveToken
    );
    if (result.messageId) {
      pass('communications role publishes church message');
    } else {
      fail('communications role publishes church message', JSON.stringify(result));
    }
  } catch (err) {
    fail('communications role publishes church message', err.message);
  }

  // 5. Feature gate: church-beta has churchMessages=false
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

  // 6. Invalid kind → invalid-argument
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
    const threadId = await testSubmitCareRequest();
    await testRespondToCareThread(threadId);
    await testPublishChurchMessage();
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
