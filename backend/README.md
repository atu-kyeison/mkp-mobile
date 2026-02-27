# MKP Mobile Backend

Firebase backend for MKP Mobile app.

## Quick Start

### Prerequisites

- Node.js 20+
- Firebase CLI: `npm install -g firebase-tools`
- Firebase account with project created

### Setup

```bash
# Install functions dependencies
cd functions
npm install
cd ..

# Login to Firebase (one time)
firebase login

# Update project ID in .firebaserc if needed
```

### Local Development with Emulators

```bash
# From backend/ directory
firebase emulators:start

# Or with seed data export
firebase emulators:start --import=./emulator-data --export-on-exit
```

Emulator UI: http://localhost:4000

| Service   | Port |
|-----------|------|
| Auth      | 9099 |
| Firestore | 8080 |
| Functions | 5001 |
| UI        | 4000 |

### Deploy

```bash
# Deploy rules only
firebase deploy --only firestore:rules

# Deploy indexes only
firebase deploy --only firestore:indexes

# Deploy functions only
firebase deploy --only functions

# Deploy everything
firebase deploy
```

## Structure

```
backend/
├── firebase.json           # Firebase configuration
├── firestore.rules         # Security rules (BE-03)
├── firestore.indexes.json  # Indexes (BE-04)
├── contract-v1.md          # Schema contract (BE-02)
├── .firebaserc             # Project aliases
└── functions/
    ├── package.json
    ├── tsconfig.json
    └── src/
        └── index.ts        # Cloud Functions entry
```

## Schema Reference

See `contract-v1.md` for the canonical Firestore schema.

Key points:
- All collections scoped under `/churches/{churchId}/` except `/users`
- Journals and mood notes are **local-only** (no Firestore collection)
- Care requests are pastor/admin read-only
- Join code lookup via Cloud Function only (no client query)
