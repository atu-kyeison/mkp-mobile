# Provider Integration Plan v1

Purpose: replace the current Phase 7 transcription scaffold and Phase 8 formation scaffold with production provider integrations after Phase 11 mobile verification.

This plan is aligned to the current backend contract and implementation:
- current scaffolded callable flow: [backend/functions/src/index.ts](/Users/niwilcox/Documents/New project/mkp-mobile/backend/functions/src/index.ts)
- canonical schema and privacy rules: [backend/contract-v1.1.md](/Users/niwilcox/Documents/New project/mkp-mobile/backend/contract-v1.1.md)
- phase intent: [backend/roadmap-v1.md](/Users/niwilcox/Documents/New project/mkp-mobile/backend/roadmap-v1.md)

## Current state

- Phase 7 is scaffolded with `transcribeOnUpload`; it writes a transcript artifact with `provider: "deepgram_scaffold"` and marks the sermon `transcribed`.
- Phase 8 is scaffolded with `generateFormationContent`; it reads the first completed transcript and writes placeholder `formationWeeks/{weekId}` content.
- Church isolation already exists in path design: `churches/{churchId}/...`
- Transcript reads are already staff-restricted in rules; formation weeks are member-readable only when `published`.
- Journals, mood notes, and reflection text remain local-only and must stay out of any provider payloads.

## Immediate recommendation after Phase 11 verification

Freeze mobile API changes, then implement the backend provider swap in this order:
1. Replace Phase 7 with a Storage-triggered Deepgram pipeline.
2. Keep Phase 8 callable, but move generation to Gemini-backed server logic.
3. Add provider config, observability, retries, and kill switches before enabling any church in production.
4. Pilot with one internal church and only then remove the scaffold fallback.

## Required product decisions before wiring

1. Transcript editing model.
Decide whether pastors can edit transcript text before Gemini generation or whether the transcript artifact is immutable and corrections happen in a separate reviewed text field.

2. Formation generation trigger.
Decide whether Gemini runs automatically after successful transcription or only from an explicit staff action. Recommended: explicit staff action first, automatic only after pilot stability.

3. Language policy.
Decide whether the sermon `language` field always drives both Deepgram recognition and Gemini output language, or whether bilingual/manual override is supported. Recommended: single sermon language for MVP.

4. Approval boundary.
Confirm that Gemini output always lands in `generated` and never bypasses `approved` to `published`. Recommended: keep the existing approval gate unchanged.

5. Transcript retention enforcement.
Contract already targets 7-day transcript retention and 24-hour post-processing audio retention. Decide whether retention is hard-delete only or also includes provider-side no-retention settings. Recommended: both.

6. Re-run policy.
Decide who can re-run transcription and generation, how many times, and whether re-runs replace or version existing transcript/generation artifacts. Recommended: pastor/admin only; version transcript artifacts; overwrite formation week only from the latest successful generation.

7. Cost boundary.
Set hard limits for max audio duration, max file size, allowed mime types, and max Gemini retries. Recommended: reject oversized files server-side before provider calls.

8. Provider data-use posture.
Confirm production accounts, regions, retention settings, and whether either provider uses submitted data for training. This must be resolved contractually before production traffic.

## Provider setup checklist

### Deepgram

- Create a production Deepgram project dedicated to MKP backend use.
- Generate a server-only API key scoped to transcription.
- Confirm supported audio formats for the upload path used by `createSermonUpload` / `completeSermonUpload`.
- Choose model, language coverage, punctuation/paragraphing, diarization, and utterance/segment output requirements.
- Decide whether word timings/confidence must be stored or discarded.
- Confirm provider-side retention/data usage settings meet the contract.
- Document max audio duration and cost assumptions per sermon.
- Verify retry-safe request strategy using a stable request id tied to `churchId + sermonId + transcriptVersion`.
- Validate one EN and one ES sermon sample before coding rollout.

### Gemini

- Provision a production Gemini project for Cloud Functions use.
- Generate a server-only credential path appropriate for Firebase Functions.
- Select the exact model for structured formation generation.
- Lock the output contract for `formationWeeks/{weekId}` including required sections, tone, scripture handling, and language behavior.
- Decide whether Gemini receives full transcript text, a normalized transcript, or a bounded excerpt plus sermon metadata. Recommended: normalized transcript plus sermon metadata only.
- Define token limits, timeout, and max retry count.
- Create moderation/guardrail rules for malformed output, missing sections, hallucinated scripture, and empty responses.
- Validate JSON-only or schema-shaped output before writing Firestore. Recommended: schema-shaped JSON on the server, then map to Firestore.

## Secrets and config plan

Use Firebase Secret Manager for provider credentials. Do not place provider keys in app config or client environment variables.

### Secrets

- `DEEPGRAM_API_KEY`
- `GEMINI_API_KEY` or equivalent service credential secret, depending on the chosen Gemini access path

### Non-secret runtime config

Store non-secret provider settings in function code defaults plus an optional church-level override block under a private config document.

Recommended private config path:
- `churches/{churchId}/private/config/providerSettings`

Recommended fields:
- `transcriptionProvider`: `"deepgram"`
- `generationProvider`: `"gemini"`
- `transcriptionEnabled`: boolean
- `generationEnabled`: boolean
- `autoGenerateFormation`: boolean
- `transcriptRetentionDays`: number
- `audioRetentionHours`: number
- `maxAudioBytes`: number
- `maxAudioMinutes`: number
- `allowedAudioMimeTypes`: string[]

Global defaults should live in server code, not Firestore, so one bad document cannot disable safety checks.

### Firebase Functions shape

- Keep client-facing endpoints free of provider secrets.
- Attach secrets only to the functions that need them.
- Recommended split:
  - `onObjectFinalized` Storage trigger for transcription
  - callable `generateFormationContent` for Gemini generation
  - optional callable admin-only `retrySermonProcessing`

## Implementation plan in the right order

### Step 1: harden the current schema without changing app behavior

- Add explicit processing metadata to sermon docs:
  - `providerStatus.transcription`
  - `providerStatus.generation`
  - `lastProcessingError`
  - `processingAttemptCount`
  - `latestTranscriptId`
- Add transcript artifact metadata:
  - `requestId`
  - `durationMs`
  - `providerJobId`
  - `completedAt`
  - `attempt`
- Preserve existing status values so Phase 11 mobile wiring does not break.

### Step 2: extract Phase 7 and Phase 8 logic into helper modules

- Move transcript lifecycle logic out of [backend/functions/src/index.ts](/Users/niwilcox/Documents/New project/mkp-mobile/backend/functions/src/index.ts) into provider/service helpers.
- Move formation content mapping and validation into separate helpers.
- Add pure functions for:
  - sermon eligibility checks
  - transcript document creation
  - formation output validation
  - status transition updates

### Step 3: implement the Deepgram path

- Add a Storage trigger on `sermons/{churchId}/{sermonId}/original/*`.
- On finalize:
  - verify sermon exists and is `uploaded`
  - verify `sourceType === "audio_upload"`
  - verify the object path matches the sermon metadata
  - mark sermon `transcribing`
  - call Deepgram
  - write transcript artifact
  - update sermon to `transcribed` or `failed`
- Keep the existing `transcribeOnUpload` callable temporarily as an admin-only fallback or test hook during rollout.

### Step 4: implement the Gemini path

- Keep `generateFormationContent` as the staff-controlled entry point.
- Replace scaffold text generation with:
  - transcript fetch
  - transcript normalization
  - Gemini request
  - strict server-side schema validation
  - Firestore write to `formationWeeks/{weekId}`
- Maintain current lifecycle:
  - sermon `transcribed` -> `formation_generated`
  - formation week `generated` -> `approved` -> `published`

### Step 5: add cleanup and retention enforcement

- Add scheduled cleanup for transcript docs past `retentionDeleteAfter`.
- Add Storage cleanup for original sermon audio 24 hours after successful processing.
- If provider-side files/jobs persist, delete them as part of completion cleanup when supported.

### Step 6: expand emulator and integration coverage

- Extend [backend/functions/emulator-test.js](/Users/niwilcox/Documents/New project/mkp-mobile/backend/functions/emulator-test.js) to cover:
  - duplicate finalize events are idempotent
  - failed provider call writes safe failure state
  - retry path increments attempt count
  - generation rejects malformed model output
  - local-only member data never enters provider payload builders

## Rollout strategy

### Stage 0: code behind flags

- Add global provider kill switches in code.
- Add per-church enablement in `private/config/providerSettings`.
- Default all provider integrations to off.

### Stage 1: shadow transcription

- Run Deepgram for one internal church after upload.
- Keep staff-triggered scaffold path available for fallback.
- Compare transcript quality, latency, and cost on a small sermon set.

### Stage 2: production transcription

- Turn on Deepgram writes for the pilot church.
- Disable scaffold transcript writes for that church.
- Keep fallback retry callable available to pastor/admin.

### Stage 3: Gemini pilot generation

- Keep manual `generateFormationContent`.
- Require staff review of every generated week.
- Log output validity failures and editing burden.

### Stage 4: broader tenant rollout

- Enable one church at a time.
- Review costs, failure rates, and approval throughput weekly.
- Remove scaffold fallback only after the pilot path is stable for multiple weeks.

## Failure handling, retry, logging, retention, cost control

### Failure handling

- Never leave sermons stuck in `transcribing` or generation-in-progress forever; write terminal `failed` states with safe error codes.
- Store provider error category and retryability, not raw secrets or full request bodies.
- Separate user-facing status from internal failure details.

Recommended error fields:
- `errorCode`
- `errorStage`
- `retryable`
- `failedAt`
- `lastAttemptAt`

### Retry

- Use idempotent request ids.
- Allow bounded retries only for retryable failures.
- Recommended limits:
  - transcription: 2 automatic retries, then manual retry only
  - generation: 1 automatic retry for transient model/service failures, then manual retry only

### Logging

- Use structured logs keyed by `churchId`, `sermonId`, `weekId`, provider, and attempt number.
- Do not log transcript content or generated formation content bodies in production logs.
- Log payload sizes, durations, retry counts, and final outcomes.

### Retention

- Enforce the existing contract:
  - original uploaded sermon audio: 24 hours after successful processing
  - transcript artifacts: 7 days
  - formation output: retained
- Keep retention metadata on every transcript artifact and add cleanup automation rather than relying on manual deletion.

### Cost control

- Reject audio that exceeds duration or size limits before provider submission.
- Normalize transcripts before Gemini to reduce token spend.
- Use explicit model selection, token ceilings, and no speculative extra generations.
- Keep generation manual during pilot so cost tracks staff intent.
- Add weekly aggregate cost review per church, but store only aggregate operational metrics, not transcript text.

## Schema and function changes needed

### Firestore schema

Recommended sermon doc additions:
- `providerStatus.transcription`: `idle | queued | transcribing | transcribed | failed`
- `providerStatus.generation`: `idle | generating | generated | failed`
- `latestTranscriptId`: string
- `processingAttemptCount`: number
- `lastProcessingError`: map

Recommended transcript doc additions:
- `requestId`: string
- `attempt`: number
- `providerJobId`: string
- `durationMs`: number
- `completedAt`: timestamp
- `contentSha256`: string

Recommended formation week additions:
- `generationProvider`: `"gemini"`
- `generationVersion`: string
- `generatedFromTranscriptId`: string
- `generationWarnings`: string[]

These are additive and should not require a mobile contract break if the app ignores unknown fields.

### Function changes

- Add `transcribeOnSermonUpload` as a Storage trigger.
- Keep `generateFormationContent`, but replace scaffold generation internals.
- Add `retrySermonProcessing` or split retry endpoints if you want explicit admin/pastor recovery flows.
- Add scheduled cleanup functions for transcript/audio retention.

### Rules and indexes

- Firestore rules likely need minimal change because transcript and formation writes remain function-only.
- Storage rules may need review if lifecycle cleanup or provider staging paths add new objects.
- No new member-readable paths are needed.

## Recommended wiring rules

- Provider payloads may include only:
  - sermon audio or transcript text
  - sermon metadata needed for output quality: title, preacherName, language, series, partNumber, bibleRefs, sermon date
- Provider payloads must never include:
  - journal entries
  - mood notes
  - reflection text
  - care thread messages
  - care request bodies
  - any cross-church data

## Concise execution order after Phase 11 app verification

1. Lock product decisions on trigger mode, language policy, retention enforcement, and retry policy.
2. Add provider config/secrets plumbing and additive schema fields.
3. Build the Deepgram Storage trigger with idempotency and retention cleanup.
4. Swap `generateFormationContent` to Gemini with strict output validation.
5. Expand emulator/integration coverage.
6. Pilot one church with manual generation and fallback still available.
