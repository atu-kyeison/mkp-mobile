/**
 * MKP Emulator Seed Script
 *
 * Seeds the Firebase emulator with test churches, users, and memberships
 * for backend validation. Covers test-plan-v1.md sections 2, 3, 4, 5, 6, 7.
 *
 * Run from backend/functions/ AFTER emulators are started:
 *   npm run seed
 *
 * Or manually:
 *   FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 \
 *   FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 \
 *   node seed.js
 *
 * Safe to re-run: Auth users that already exist are skipped.
 * Firestore docs are set (overwrite), so re-seeding is idempotent.
 */

'use strict';

const admin = require('firebase-admin');
const crypto = require('crypto');

// Guard: must be pointed at emulators
if (!process.env.FIRESTORE_EMULATOR_HOST) {
  console.error('ERROR: FIRESTORE_EMULATOR_HOST is not set.');
  console.error('Do not run this script against a real Firebase project.');
  process.exit(1);
}

admin.initializeApp({ projectId: 'mkp-mobile-dev' });

const db = admin.firestore();
const auth = admin.auth();

// ---------------------------------------------------------------------------
// Join code hashing — must match the logic in functions/src/index.ts
// ---------------------------------------------------------------------------

function hashJoinCode(salt, code) {
  return crypto.createHash('sha256').update(salt + code).digest('hex');
}

// ---------------------------------------------------------------------------
// Test data definitions
// ---------------------------------------------------------------------------

const CHURCH_ALPHA_ID = 'church-alpha';
const CHURCH_BETA_ID  = 'church-beta';

// Church Alpha — all relevant features enabled
const ALPHA_JOIN_CODE = 'GRACE2024';
const ALPHA_SALT      = 'testSalt-alpha';
const ALPHA_SUBMISSION_MAILBOX = 'care-alpha@test.mykingdompal.com';

// Church Beta — features disabled (for feature-gate tests)
const BETA_JOIN_CODE = 'RIVER2024';
const BETA_SALT      = 'testSalt-beta';
const BETA_SUBMISSION_MAILBOX = 'care-beta@test.mykingdompal.com';

// One test user per role. Predictable UIDs make log-reading easier.
const TEST_USERS = [
  // Church Alpha
  { uid: 'uid-alice', email: 'alice@test.com', displayName: 'Alice Member',       churchId: CHURCH_ALPHA_ID, role: 'member'         },
  { uid: 'uid-bob',   email: 'bob@test.com',   displayName: 'Bob Pastor',         churchId: CHURCH_ALPHA_ID, role: 'pastor'         },
  { uid: 'uid-carol', email: 'carol@test.com', displayName: 'Carol CareTeam',     churchId: CHURCH_ALPHA_ID, role: 'care_team'      },
  { uid: 'uid-dave',  email: 'dave@test.com',  displayName: 'Dave Comms',         churchId: CHURCH_ALPHA_ID, role: 'communications' },
  { uid: 'uid-eve',   email: 'eve@test.com',   displayName: 'Eve Media',          churchId: CHURCH_ALPHA_ID, role: 'media_team'     },
  { uid: 'uid-frank', email: 'frank@test.com', displayName: 'Frank Admin',        churchId: CHURCH_ALPHA_ID, role: 'admin'          },
  // Church Beta (cross-church isolation tests)
  { uid: 'uid-grace', email: 'grace@test.com', displayName: 'Grace BetaMember',  churchId: CHURCH_BETA_ID,  role: 'member'         },
  { uid: 'uid-henry', email: 'henry@test.com', displayName: 'Henry BetaPastor',  churchId: CHURCH_BETA_ID,  role: 'pastor'         },
];

// ---------------------------------------------------------------------------
// Seed helpers
// ---------------------------------------------------------------------------

async function seedChurches() {
  const batch = db.batch();
  const now = admin.firestore.FieldValue.serverTimestamp();

  // Church Alpha — current MVP backend features enabled
  batch.set(db.doc(`churches/${CHURCH_ALPHA_ID}`), {
    name: 'Grace Community Church',
    slug: 'grace-community',
    timezone: 'America/Chicago',
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'es'],
    plan: 'growth',
    features: {
      careThreads: true,
      churchMessages: true,
      mediaPipeline: true,
      sermonTranscription: true,
      formationGeneration: true,
      dashboardSSO: false,
    },
    branding: {},
    createdAt: now,
    updatedAt: now,
  });

  batch.set(db.doc(`churches/${CHURCH_ALPHA_ID}/private/config`), {
    joinCodeHash: hashJoinCode(ALPHA_SALT, ALPHA_JOIN_CODE),
    joinCodeSalt: ALPHA_SALT,
    submissionMailbox: ALPHA_SUBMISSION_MAILBOX,
    codeGeneratedAt: now,
  });

  // Church Beta — all features disabled
  batch.set(db.doc(`churches/${CHURCH_BETA_ID}`), {
    name: 'River of Life Church',
    slug: 'river-of-life',
    timezone: 'America/New_York',
    defaultLanguage: 'en',
    supportedLanguages: ['en'],
    plan: 'standard',
    features: {
      careThreads: false,
      churchMessages: false,
      mediaPipeline: false,
      sermonTranscription: false,
      formationGeneration: false,
      dashboardSSO: false,
    },
    branding: {},
    createdAt: now,
    updatedAt: now,
  });

  batch.set(db.doc(`churches/${CHURCH_BETA_ID}/private/config`), {
    joinCodeHash: hashJoinCode(BETA_SALT, BETA_JOIN_CODE),
    joinCodeSalt: BETA_SALT,
    submissionMailbox: BETA_SUBMISSION_MAILBOX,
    codeGeneratedAt: now,
  });

  await batch.commit();
  console.log('✓ Churches seeded');
  console.log(`  church-alpha: join code = ${ALPHA_JOIN_CODE}  (features: careThreads=true, churchMessages=true, mediaPipeline=true, sermonTranscription=true, formationGeneration=true)`);
  console.log(`  church-beta:  join code = ${BETA_JOIN_CODE}  (features: careThreads=false, churchMessages=false, mediaPipeline=false, sermonTranscription=false, formationGeneration=false)`);
}

async function seedUser(user) {
  const now = admin.firestore.FieldValue.serverTimestamp();

  // Create Firebase Auth user in the emulator
  try {
    await auth.createUser({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      password: 'password123',
    });
  } catch (err) {
    if (err.code === 'auth/uid-already-exists') {
      process.stdout.write(`  (auth user ${user.uid} exists, skipping) `);
    } else {
      throw err;
    }
  }

  // Global user profile at /users/{uid}
  await db.doc(`users/${user.uid}`).set({
    email: user.email,
    displayName: user.displayName,
    currentChurchId: user.churchId,
    createdAt: now,
    lastLoginAt: now,
    preferredLanguage: 'en',
  });

  // Church membership at /churches/{churchId}/members/{uid}
  await db.doc(`churches/${user.churchId}/members/${user.uid}`).set({
    displayName: user.displayName,
    email: user.email,
    role: user.role,
    status: 'active',
    joinedAt: now,
    lastActiveAt: now,
  });

  console.log(`✓ ${user.uid.padEnd(12)} ${user.email.padEnd(24)} ${user.role.padEnd(16)} @ ${user.churchId}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('');
  console.log('MKP Emulator Seed');
  console.log('─────────────────────────────────────────────────');
  console.log(`Firestore: ${process.env.FIRESTORE_EMULATOR_HOST}`);
  console.log(`Auth:      ${process.env.FIREBASE_AUTH_EMULATOR_HOST || '(not set)'}`);
  console.log('');

  await seedChurches();
  console.log('');
  console.log('Seeding users:');

  for (const user of TEST_USERS) {
    await seedUser(user);
  }

  console.log('');
  console.log('─────────────────────────────────────────────────');
  console.log('Seed complete. Test credentials (password: password123):');
  console.log('');
  console.log('  uid-alice   alice@test.com    member         church-alpha');
  console.log('  uid-bob     bob@test.com      pastor         church-alpha');
  console.log('  uid-carol   carol@test.com    care_team      church-alpha');
  console.log('  uid-dave    dave@test.com     communications church-alpha');
  console.log('  uid-eve     eve@test.com      media_team     church-alpha');
  console.log('  uid-frank   frank@test.com    admin          church-alpha');
  console.log('  uid-grace   grace@test.com    member         church-beta');
  console.log('  uid-henry   henry@test.com    pastor         church-beta');
  console.log('');
  console.log('  church-alpha join code: GRACE2024');
  console.log('  church-beta  join code: RIVER2024');
  console.log('');
  console.log('Run emulator tests: npm run test:emulator');
}

main().catch((err) => {
  console.error('\nSeed failed:', err.message || err);
  process.exit(1);
});
