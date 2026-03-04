'use strict';

const admin = require('firebase-admin');
const crypto = require('crypto');

const projectId = process.env.FIREBASE_PROJECT_ID || 'mkp-mobile-staging';

if (projectId !== 'mkp-mobile-staging') {
  console.error(`ERROR: FIREBASE_PROJECT_ID must be mkp-mobile-staging. Got: ${projectId}`);
  process.exit(1);
}

if (process.env.FIRESTORE_EMULATOR_HOST || process.env.FIREBASE_AUTH_EMULATOR_HOST) {
  console.error('ERROR: This script is for the real staging project only, not emulators.');
  process.exit(1);
}

admin.initializeApp({ projectId });

const db = admin.firestore();
const auth = admin.auth();

function hashJoinCode(salt, code) {
  return crypto.createHash('sha256').update(salt + code).digest('hex');
}

function makeSalt() {
  return crypto.randomBytes(16).toString('hex');
}

const CHURCH_ALPHA_ID = 'church-alpha';
const CHURCH_BETA_ID = 'church-beta';

const ALPHA_JOIN_CODE = process.env.MKP_ALPHA_JOIN_CODE || 'GRACE-STAGE-2026';
const BETA_JOIN_CODE = process.env.MKP_BETA_JOIN_CODE || 'RIVER-STAGE-2026';
const DEFAULT_PASSWORD = process.env.MKP_STAGING_PASSWORD || 'StagePass123!';

const TEST_USERS = [
  { uid: 'stg-alice-member', email: 'alice.staging@mykingdompal.com', displayName: 'Alice Member', churchId: CHURCH_ALPHA_ID, role: 'member' },
  { uid: 'stg-bob-pastor', email: 'bob.staging@mykingdompal.com', displayName: 'Bob Pastor', churchId: CHURCH_ALPHA_ID, role: 'pastor' },
  { uid: 'stg-carol-care', email: 'carol.staging@mykingdompal.com', displayName: 'Carol Care Team', churchId: CHURCH_ALPHA_ID, role: 'care_team' },
  { uid: 'stg-dave-comms', email: 'dave.staging@mykingdompal.com', displayName: 'Dave Communications', churchId: CHURCH_ALPHA_ID, role: 'communications' },
  { uid: 'stg-eve-media', email: 'eve.staging@mykingdompal.com', displayName: 'Eve Media Team', churchId: CHURCH_ALPHA_ID, role: 'media_team' },
  { uid: 'stg-frank-admin', email: 'frank.staging@mykingdompal.com', displayName: 'Frank Admin', churchId: CHURCH_ALPHA_ID, role: 'admin' },
  { uid: 'stg-grace-member', email: 'grace.staging@mykingdompal.com', displayName: 'Grace Beta Member', churchId: CHURCH_BETA_ID, role: 'member' },
  { uid: 'stg-henry-pastor', email: 'henry.staging@mykingdompal.com', displayName: 'Henry Beta Pastor', churchId: CHURCH_BETA_ID, role: 'pastor' },
];

async function upsertUser(user) {
  const now = admin.firestore.FieldValue.serverTimestamp();

  try {
    await auth.getUser(user.uid);
    await auth.updateUser(user.uid, {
      email: user.email,
      displayName: user.displayName,
      password: DEFAULT_PASSWORD,
    });
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      await auth.createUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        password: DEFAULT_PASSWORD,
      });
    } else {
      throw err;
    }
  }

  await db.doc(`users/${user.uid}`).set(
    {
      email: user.email,
      displayName: user.displayName,
      currentChurchId: user.churchId,
      preferredLanguage: 'en',
      createdAt: now,
      lastLoginAt: now,
    },
    { merge: true }
  );

  await db.doc(`churches/${user.churchId}/members/${user.uid}`).set(
    {
      displayName: user.displayName,
      email: user.email,
      role: user.role,
      status: 'active',
      joinedAt: now,
      lastActiveAt: now,
    },
    { merge: true }
  );

  console.log(`✓ ${user.uid.padEnd(18)} ${user.email.padEnd(34)} ${user.role.padEnd(16)} @ ${user.churchId}`);
}

async function seedChurches() {
  const batch = db.batch();
  const now = admin.firestore.FieldValue.serverTimestamp();
  const alphaSalt = makeSalt();
  const betaSalt = makeSalt();

  batch.set(
    db.doc(`churches/${CHURCH_ALPHA_ID}`),
    {
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
    },
    { merge: true }
  );

  batch.set(
    db.doc(`churches/${CHURCH_ALPHA_ID}/private/config`),
    {
      joinCodeHash: hashJoinCode(alphaSalt, ALPHA_JOIN_CODE),
      joinCodeSalt: alphaSalt,
      codeGeneratedAt: now,
    },
    { merge: true }
  );

  batch.set(
    db.doc(`churches/${CHURCH_BETA_ID}`),
    {
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
    },
    { merge: true }
  );

  batch.set(
    db.doc(`churches/${CHURCH_BETA_ID}/private/config`),
    {
      joinCodeHash: hashJoinCode(betaSalt, BETA_JOIN_CODE),
      joinCodeSalt: betaSalt,
      codeGeneratedAt: now,
    },
    { merge: true }
  );

  await batch.commit();
  console.log('✓ Churches upserted');
}

async function main() {
  console.log('');
  console.log('MKP Staging Seed');
  console.log('─────────────────────────────────────────────────');
  console.log(`Project:  ${projectId}`);
  console.log(`Password: ${DEFAULT_PASSWORD}`);
  console.log('');

  await seedChurches();
  console.log('');
  console.log('Seeding users:');

  for (const user of TEST_USERS) {
    await upsertUser(user);
  }

  console.log('');
  console.log('Join codes:');
  console.log(`  ${CHURCH_ALPHA_ID}: ${ALPHA_JOIN_CODE}`);
  console.log(`  ${CHURCH_BETA_ID}:  ${BETA_JOIN_CODE}`);
  console.log('');
  console.log('Done.');
}

main().catch((err) => {
  console.error('\nSeed failed:', err.message || err);
  process.exit(1);
});
