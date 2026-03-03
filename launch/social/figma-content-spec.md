# My Kingdom Pal Social Figma Content Spec

## Purpose
This document translates the approved launch copy into a designer-ready content spec for Instagram and LinkedIn.

Use it to build one modular visual system that can flex across:
- Instagram carousel posts
- LinkedIn carousel posts
- LinkedIn single-image founder posts

## Design Direction
Visual language should match the app:
- Midnight background
- Antique gold accents
- Clean glass-card feel where appropriate
- Reverent, restrained composition
- Strong editorial hierarchy

Avoid:
- Loud gradients
- Startup cliches
- Generic SaaS icon grids
- Consumer wellness aesthetics
- Overstuffed slides

## Format Specs
### Instagram Carousel
- Canvas: 1080 x 1350
- Safe margin: 96 px all sides
- Max text width: 760 px
- Preferred slide count: 4 to 6

### LinkedIn Carousel
- Canvas: 1080 x 1080 or 1080 x 1350
- Recommended: 1080 x 1350 for reuse with Instagram when possible
- Safe margin: 96 px all sides
- Max text width: 760 px

### LinkedIn Single Image
- Canvas: 1200 x 1200
- Safe margin: 100 px
- Keep headline and founder note readable in feed preview

## Layout System
Use three reusable layout types.

### Layout A: Text Cover
Use for:
- Problem statements
- Value statements
- Title slides

Required elements:
- Small brand kicker at top
- One dominant headline
- Optional two-line support copy
- Optional footer tag: `Launching soon for churches`

### Layout B: Screenshot + Message
Use for:
- Product walkthrough slides
- Feature framing slides

Required elements:
- Screenshot framed in device or cropped elegantly
- One short headline
- One short support paragraph
- Optional mini-label above screenshot

### Layout C: Founder Note / Philosophy
Use for:
- LinkedIn founder post image
- Values-based closing slides

Required elements:
- One short headline or quote
- 2 to 4 lines of supporting copy
- Brand mark

## Type Hierarchy
Use the same font families already present in the app where possible.

### Headline
- Tone: editorial, sober, high-contrast
- Max length: 8 to 12 words
- Max lines: 3

### Support Copy
- Tone: calm, plainspoken, ministry-aware
- Max length: 20 to 32 words
- Max lines: 4

### Kicker
- Use uppercase
- Examples:
  - `FOR CHURCHES`
  - `BEYOND SUNDAY`
  - `PRIVATE BY DEFAULT`

### Footer Microcopy
- Small and restrained
- Use only for:
  - `Launching soon for churches`
  - `My Kingdom Pal`
  - `Walk with the Word all week`

## Screenshot Guidance
Use screenshots as evidence of church value, not as the main story.

Preferred screen pairings:
- Sermon anchor:
  - `screens/Formation/Monday.tsx`
  - `src/screens/SundaySummaryDetailScreen.tsx`
- Reflection continuity:
  - `src/screens/ReflectionEntryScreen.tsx`
  - `src/screens/JourneyHistoryScreen.tsx`
- Care connection:
  - `screens/Care/PrayerSubmission.tsx`
  - `screens/Care/CareSupportRequest.tsx`
- Church connection:
  - `src/screens/auth/ChurchSuccessScreen.tsx`

Do not lead with:
- Mood screens without church context
- Auth forms as core proof of value
- Any screen that suggests admin tooling exists today

## Post-by-Post Build Specs
### Instagram Post 1: The Ministry Gap
#### Slide 1
Layout:
- Layout A

Copy:
- Kicker: `BEYOND SUNDAY`
- Headline: `What happens after Sunday?`
- Support: `A church can preach a faithful message on Sunday and still struggle to help people carry it into the week.`

#### Slide 2
Layout:
- Layout A

Copy:
- Kicker: `THE TENSION`
- Headline: `The sermon lands.`
- Support: `But by Tuesday, many people are already back in noise, pressure, distraction, and routine.`

#### Slide 3
Layout:
- Layout A

Copy:
- Kicker: `THE MINISTRY NEED`
- Headline: `Churches want formation, not just attendance.`
- Support: `The challenge is not only gathering people. It's helping the Word stay with them Monday through Saturday.`

#### Slide 4
Layout:
- Layout B

Copy:
- Kicker: `THE RESPONSE`
- Headline: `That's the gap My Kingdom Pal is built for.`
- Support: `A church-led rhythm that connects Sunday teaching to weekday reflection, prayer, and care.`

Asset:
- Use Sunday or Monday formation screenshot

#### Slide 5
Layout:
- Layout A

Copy:
- Kicker: `LAUNCH`
- Headline: `Launching soon for churches`
- Support: `Follow along as we get closer to launch.`

### LinkedIn Post 1: Product Thesis for Churches
#### Single Image
Layout:
- Layout C

Copy:
- Kicker: `FOR CHURCHES`
- Headline: `Strong on Sunday. Under-supported the rest of the week.`
- Support: `My Kingdom Pal is built to help churches create a quieter, steadier rhythm of weekday discipleship, private reflection, and care connection.`

### Instagram Post 2: How MKP Supports Churches
#### Slide 1
Layout:
- Layout A

Copy:
- Kicker: `HOW IT WORKS`
- Headline: `How My Kingdom Pal supports churches through the week`
- Support: `A simple rhythm from Sunday teaching to weekday formation.`

#### Slide 2
Layout:
- Layout B

Copy:
- Kicker: `SUNDAY`
- Headline: `Sunday becomes the anchor`
- Support: `The week's rhythm starts from the message your church is already preaching.`

Asset:
- Sunday summary or Monday formation screen

#### Slide 3
Layout:
- Layout B

Copy:
- Kicker: `WEEKDAY FORMATION`
- Headline: `Members receive gentle weekday prompts`
- Support: `Not more noise. Not more pressure. Just a faithful next step each day.`

Asset:
- Monday or Wednesday formation screen

#### Slide 4
Layout:
- Layout B

Copy:
- Kicker: `TRUST`
- Headline: `Reflection stays private by default`
- Support: `People need honest space with God. Private journaling is part of the design, not an afterthought.`

Asset:
- Reflection entry or journey screen

#### Slide 5
Layout:
- Layout B

Copy:
- Kicker: `CARE`
- Headline: `Prayer and support requests create a path for care`
- Support: `When members choose to share, the app can support real church follow-up.`

Asset:
- Prayer or care request screen

#### Slide 6
Layout:
- Layout A

Copy:
- Kicker: `FOR CHURCHES`
- Headline: `Built for churches. Launching soon.`
- Support: `Follow the launch as we get closer.`

### LinkedIn Post 2: What Churches Actually Need
Build as a 6-slide carousel using the same content blocks as Instagram Post 2 but with tighter, more strategic support lines.

Tone adjustments:
- Replace emotional phrasing with ministry-operations clarity
- Keep each support paragraph under 24 words

### Instagram Post 3: What We're Building Toward
#### Slide 1
Layout:
- Layout A

Copy:
- Kicker: `PRODUCT CONVICTIONS`
- Headline: `Built for spiritual formation, not engagement hacks`
- Support: `We are not trying to turn discipleship into a metric.`

#### Slide 2
Layout:
- Layout A

Copy:
- Kicker: `CHURCH-LED`
- Headline: `Church-led, not platform-led`
- Support: `The goal is to support the local church's voice, not replace it with a generic content stream.`

#### Slide 3
Layout:
- Layout A

Copy:
- Kicker: `PRIVATE BY DEFAULT`
- Headline: `Private by default`
- Support: `Reflection and mood notes are designed to remain on the member's device. Honest space matters.`

#### Slide 4
Layout:
- Layout C

Copy:
- Kicker: `WHY IT MATTERS`
- Headline: `Designed to support discipleship and care`
- Support: `A quieter product can still create meaningful continuity for churches.`

### LinkedIn Post 3: Why We're Building It This Way
#### Single Image
Layout:
- Layout C

Copy:
- Kicker: `PRODUCT PHILOSOPHY`
- Headline: `Not every ministry problem should be solved with more engagement mechanics.`
- Support: `My Kingdom Pal is being built around church trust, weekly rhythm, private reflection, and a clearer path for care when members choose to share.`

## Character Guardrails
### Headlines
- Ideal: 5 to 9 words
- Hard max: 14 words

### Support Copy
- Ideal: 12 to 24 words
- Hard max: 32 words

### Kicker
- Ideal: 1 to 3 words
- Hard max: 4 words

## Design QA
- First slide must make church relevance obvious within 2 seconds
- Every screenshot slide must still work if the screenshot is replaced later
- No slide should require more than one visual focal point
- Typography must stay readable at phone-preview size
- End-user language must always point back to church value

## Export Notes
When handing off to design:
- Treat [initial-launch-sequence.md](/Users/niwilcox/Documents/New project/mkp-mobile/launch/social/initial-launch-sequence.md) as source-of-truth for captions
- Treat [social-content-export.csv](/Users/niwilcox/Documents/New project/mkp-mobile/launch/social/social-content-export.csv) as the structured content source
