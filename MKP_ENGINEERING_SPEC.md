# MKP Engineering Spec (MVP)

## 1) Product Intent
My Kingdom Pal is a church-led spiritual formation app anchored to Sunday teaching.
Primary flow is private, gentle, and non-gamified.
Journals remain local-only in MVP.

## 2) Canonical Navigation Map

### Root
- `Auth` (unauthenticated)
- `Main` (tabs)
- Modal: `FAQ`, `Guidelines`

### Auth Stack
- `Welcome`
- `Signup`
- `Terms`
- `Signin`
- `PasswordReset`
- `PasswordEmailSent`
- `ChurchSearch`
- `ChurchSuccess`
- `Privacy`

### Main Tabs
- `Home` -> `FormationDispatcher`
- `Journey` stack:
  - `JourneyHistory`
  - `MoodCheckIn`
  - `ReflectionEntry`
  - `MoodDetail`
  - `Insights`
- `Church` stack:
  - `CareHome`
  - `PrayerSubmission`
  - `TestimonySubmission`
  - `CareSupportRequest`
- `Profile` stack:
  - `ProfileMain`
  - `TechnicalSupport`

## 3) Intended Spiritual Flow (MVP)
1. Welcome -> Signup -> Terms -> ChurchSearch -> ChurchSuccess -> Home.
2. Home shows day-aware formation content.
3. Reflection opens first, then mood check-in appears after reflection completion.
4. Care tab supports prayer/testimony plus escalation (`Need more than prayer?`).
5. Profile offers FAQ/help and legal guidelines.

## 4) Data Boundaries (De-hardcode Plan)
- `churchContext` (server-backed later): church name/logo/code, pastor, sermon metadata, listen link.
- `weekContent` (server-backed later): Sunday recap, Mon-Sat prompts/prayers/truths.
- `userLocalData` (local-only MVP): reflections, mood logs, local archive indexes.

## 5) Local-only Storage Rules (MVP)
- Reflection/journal content: local device only.
- Mood private notes: local device only.
- Prayer/testimony/care-support requests: backend later (currently success state only).

## 6) Current Gaps to Address Next
- Unify screen sizing and scroll behavior to avoid clipped/smushed cards on small/large devices.
- Make tab overlap behavior consistent (content should not hide under tab bar unless intentional).
- Replace placeholder church data with context provider wiring.
- Add archive model for time/message/theme retrieval in JourneyHistory.
- Add i18n bootstrap (EN/ES/FR, default from device language).

## 7) QA Checklist (Manual)
- Auth flow path completes without dead ends.
- Terms/Privacy links open from every auth screen where shown.
- Church connect path reaches Home from ChurchSuccess CTA.
- Reflection -> Mood sequence behaves only after reflection open/complete.
- Care escalation form submits and returns safely.
- All main screens render correctly on iPhone and Android at multiple heights.
