# ALL-502 — Meta AI design ideas: used / merged / rejected

**Source:** Google Drive, folder "Meta Ai – MelodyMath+ParkWiz" → `meta.ai` → `ALL-502` (folder id `1JJuJdmqILO1Ptnrs1u2v46zquKXP6q8T`). Files created in Drive on 2026-11-02; reviewed 2026-11-04.
This repo is the home of the **shared Swissystem7 (S7) branding**. Other repos (ReservistGapGuide, ErrandFlow, PassPilot) only point here; they do not carry a copy of the logo.

| # | Idea | Drive file | Decision | Where / reason |
|---|------|-----------|----------|----------------|
| 1 | S7 monogram (geometric S + 7, ink + blue) | `ALL-502-logo-1-S7-monogram.png` (keyed transparent, 257 KB) | **merged** | Hand-traced to a 2-path SVG (under 1 KB) instead of shipping the PNG: `design/meta/s7-monogram.svg` is shown in the hero kicker of `index.html`; `favicon.svg` now uses the same mark on a tile (replaces the "אס" text icon). The S takes the page ink colour (light/dark via `prefers-color-scheme`). Optimized reference copy: `design/meta/ALL-502-logo-1-S7-monogram.webp` (6 KB). |
| 2 | S7 monogram, as generated (magenta chroma-key background) | `ALL-502-logo-1-S7-monogram-magenta-original.png` (231 KB) | rejected | Duplicate of #1; magenta background is a keying artefact, not a design. |
| 3 | Code wordmark: Swiss cross in `{+}` braces + "Swissystem7" | `ALL-502-logo-2-code-wordmark.png` (450 KB) | rejected | Over 300 KB; a second competing mark next to #1; commercial use of the Swiss cross may be legally restricted (unclear licence). Reference copy kept: `design/meta/ALL-502-logo-2-code-wordmark.webp` (11 KB), not referenced by the site. |
| 4 | Code wordmark, as generated (magenta) | `ALL-502-logo-2-code-wordmark-magenta-original.png` (402 KB) | rejected | Duplicate of #3, over 300 KB. |
| 5 | S7 + "Swissystem7" text, intermediate variant (magenta) | `ALL-502-logo-extra-S7-with-text-magenta.png` (342 KB) | rejected | Over 300 KB; intermediate draft of #1 with a different S; magenta background not keyed. |
| 6 | Colour palette (Primary Ink #0F172A, Swiss Blue #3A86FF, cyan #00E5CC, …) | `ALL-502.md` | **merged** (partly) | Only Swiss Blue is used, inside the S7 mark (#3a86ff in the hero, #2f6fd6 / #6ea3ff in the favicon for contrast on the tile). The rest is rejected: replacing the site's warm paper/teal palette would be a redesign. |
| 7 | Typography (Sora + JetBrains Mono, or Inter + Space Grotesk) | `ALL-502.md` | rejected | Redesign, adds external font requests, and these families do not cover Hebrew (the page is Hebrew RTL). |

**Count:** used 0 · merged 2 · rejected 5.

## Licence / provenance

Images and text were generated with Meta AI (Drive `createdTime` 2026-11-02). The prompt is unknown (not in Drive). The keyed transparent PNGs are the owner's own conversions of the Meta AI output. Used under Meta AI's terms of service. The SVGs in this repo are a hand trace of the generated monogram. No personal data is in any of the files.

## Not checked into the repo

The PNG originals over 300 KB stay in Drive (see table). No image-optimizer CLI was available; the WebP copies were made by resizing to 480 px wide in headless Chromium (canvas → WebP, quality 0.8).
