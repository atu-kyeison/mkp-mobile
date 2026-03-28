# MKP TestFlight internal build runbook

## Repo readiness summary

- Build path: Expo managed app using EAS cloud build
- Staging backend: configured and ready
- iOS native project: not committed, which is fine for EAS managed builds
- Privacy boundary: journals, mood notes, and reflection text remain local-only

## What is configured in repo

- App display name: `MKP`
- Expo slug: `mkp-mobile`
- Marketing version: `1.0.0`
- iOS bundle identifier: `com.mykingdompal.mkp`
- iOS build number: starts at `1`, then auto-increments in EAS
- EAS build profile: `testflight`
- TestFlight build env: points to `mkp-mobile-staging`

## What must still be done manually outside the repo

1. Create or confirm the Apple Developer account/team that will sign MKP.
2. Create the app in App Store Connect using bundle ID `com.mykingdompal.mkp`.
3. Accept any pending Apple agreements in App Store Connect.
4. Add the first app record metadata Apple requires:
   - primary language
   - app name
   - subtitle if desired
   - privacy policy URL
   - support URL
   - age rating
5. Create or confirm an Expo account/project and log in with `eas login`.
6. Run `eas build:configure` once if Expo asks to link the project.
7. Let EAS manage iOS credentials, or provide an existing distribution certificate and provisioning profile.
8. Add internal testers in App Store Connect after the first build is processed.

## First internal TestFlight build sequence

1. In `/Users/niwilcox/Documents/New project/mkp-mobile`, confirm the release branch is in the state you want to ship.
2. Log in to Expo:

```bash
eas login
```

3. Configure EAS for the project if this has not been done before:

```bash
eas build:configure
```

4. Start the iOS build:

```bash
eas build --platform ios --profile testflight
```

5. If the build is not auto-submitted, submit it to App Store Connect:

```bash
eas submit --platform ios --profile testflight
```

6. In App Store Connect, wait for processing to finish.
7. Add the build to the app's internal testing group.
8. Install from TestFlight and run a quick smoke test against staging.

## Notes

- This path intentionally keeps TestFlight pointed at staging, not production.
- EAS `autoIncrement` handles the iOS build number for subsequent builds.
- If Apple asks for export compliance, answer based on the app's actual crypto usage during submission.
