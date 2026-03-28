# MKP Android internal testing build runbook

## Repo readiness summary

- Build path: Expo managed app using EAS cloud build
- Target backend for tester builds: staging
- Android application ID: `com.mykingdompal.mkp`
- Android version code: starts at `1`, then auto-increments in EAS
- Privacy boundary remains unchanged:
  - journals local-only
  - mood notes local-only
  - reflection text local-only

## What is configured in repo

- App display name: `MKP`
- Expo slug: `mkp-mobile`
- Marketing version: `1.0.0`
- Android package/application ID: `com.mykingdompal.mkp`
- Android version code baseline: `1`
- EAS Android build profile: `internal-testing-android`
- Android build artifact for Play testing: `.aab`
- Build env: points to `mkp-mobile-staging`

## What must still be done manually outside the repo

1. Create or confirm the Google Play Console app using package name `com.mykingdompal.mkp`.
2. Accept any pending Google Play Console agreements and finish initial app setup.
3. Complete required Play Console store metadata for testing:
   - app access
   - ads declaration
   - content rating
   - data safety
   - target audience if Google requires it
   - privacy policy URL
4. Create the internal testing track or closed testing track and add tester emails or a Google Group.
5. Log in to Expo with `eas login`.
6. Run `eas build:configure` once if Expo asks to link the project to an EAS project.
7. Let EAS generate/manage the Android keystore, or provide an existing upload keystore if one already exists.
8. If you want to automate Play upload with `eas submit`, create a Google service account with Play Console API access and make the JSON key available to EAS.

## First Android internal testing build sequence

1. In `/Users/niwilcox/Documents/New project/mkp-mobile`, confirm the branch is in the state you want testers to see.
2. Log in to Expo:

```bash
eas login
```

3. Configure EAS for the project if this has not been done before:

```bash
eas build:configure
```

4. Start the Android build for Play internal testing:

```bash
eas build --platform android --profile internal-testing-android
```

5. Download the resulting `.aab` artifact from the EAS build page.
6. In Google Play Console, create a new release in the internal testing track.
7. Upload the `.aab`, save, and roll out the release to internal testing.
8. Add testers to the release if they are not already assigned to the track.
9. Install from the Play internal testing link and run a quick smoke test against staging.

## Optional automation later

If Play Console API access is set up, you can submit directly from EAS instead of uploading manually:

```bash
eas submit --platform android --profile internal-testing-android
```

## Recommendation

- Repo status: ready to create the first Android internal testing build
- Remaining work is manual console/account setup, not a repo code blocker
