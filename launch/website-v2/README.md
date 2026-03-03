# My Kingdom Pal Website V2

This folder contains a clean church-facing rebuild of the MKP marketing site.

## Location
- Static handoff: `launch/website-v2/public`
- React/Vite source of truth: `launch/website-v2/app`

## Purpose
- Keep the updated website next to the current app workspace
- Replace the older consumer-leaning and AI-heavy marketing language
- Provide a simple HTML/CSS package that can be reviewed and then moved to the external site folder later

## Included Pages
- `index.html`
- `about.html`
- `contact.html`
- `faq.html`
- `trust.html`
- `thank-you.html`
- `theme.css`

## React/Vite Pages
- `/`
- `/about`
- `/trust`
- `/compare`
- `/availability`
- `/faq`
- `/contact`
- `/privacy`
- `/terms`
- `/whitepaper`
- `/thank-you`

## Messaging Source of Truth
- `launch/web/church-landing-page-copy.md`
- `launch/social/initial-launch-sequence.md`
- `launch/social/asset-brief-and-review.md`

## Notes
- This rebuild is intentionally church-customer-first
- Claims are aligned to the current `mkp-mobile` product and launch materials
- The contact page uses the same Formspree endpoint from the old site as a placeholder
- The React/Vite app is now the maintainable source of truth
- The static `public` version can still be used for quick file-based review or copy/paste handoff
