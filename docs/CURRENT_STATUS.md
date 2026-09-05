# Movie Hall Finder — Current Status

Updated: 2026-09-05
Status role: **Single Dynamic Index / Current Authority Map**

> Every AI agent must read this file before implementation work.
> If a newer non-archived spec appears in the repo but is not listed here, report the mismatch before major changes instead of guessing.

## Repository status
This repository is treated as the latest working codebase.
Current stable/default working branch: `feat/ui-ux-review-v1`

## Current authoritative documents
Read in this order:
1. `AI_COLLABORATION_RULES.md`
2. `docs/PRODUCT_RULES.md`
3. `docs/MOVIE_HALL_FINDER_UI_UX_REVISION_V2.1.md`
4. Current implementation files

### Authority map
- Collaboration rules: `AI_COLLABORATION_RULES.md`
- Product rules: `docs/PRODUCT_RULES.md`
- UI/UX authoritative spec: `docs/MOVIE_HALL_FINDER_UI_UX_REVISION_V2.1.md`
- Current UI polish candidate: `docs/MOVIE_HALL_FINDER_UI_UX_POLISH_V2.1.1.md`
- Current screenshots: `docs/screenshots/`
- Historical material: `docs/archive/` and older V1/V2 specs

### Candidate workflow
`V2.1.1` is the **current UI polish candidate / next refinement target**, but it is **not authoritative yet**.

Rules:
- V2.1 remains the authoritative UI/UX specification.
- V2.1.1 may be used for the next polish implementation pass when Jerry explicitly asks to proceed.
- V2.1.1 must not silently override V2.1 product rules or core flow.
- After implementation, update screenshots and run the review gate.
- Promotion to authoritative status requires explicit human approval.
- If promoted, update this file in the same change.

### V2.1.1 implementation authorization — 2026-09-05
Jerry explicitly authorized implementation of the V2.1.1 UI polish candidate on 2026-09-05.

Authorization boundaries and required completion steps:
- V2.1 remains the authoritative baseline throughout this implementation pass.
- Authorization is limited to the V2.1.1 UI polish scope; do not change core product rules, recommendation logic, or the established user flow.
- Run the full test suite and production build before handing off for review.
- Refresh every screenshot affected by the UI polish implementation.
- After implementation and verification, update this file to record: **implementation completed / pending Niko review**.
- Then **STOP at the Niko review gate**. Do not proceed beyond review or treat V2.1.1 as approved.
- Do not promote V2.1.1 to the authoritative specification without explicit Jerry/Niko approval.

### V2.1.1 implementation status — 2026-09-05
Status: **Implementation completed / pending Niko review**
- V2.1.1 visual & information density polish completed:
  - Homepage search container lightened (weaker border, less chrome, breathing room).
  - Selected pills/buttons calmed to soft off-white active states, reserving dominant vibrant amber for primary CTA `幫我挑一場 ✨`.
  - Homepage bottom copy trimmed; redundant footer removed on homepage so single trust line `資料不足時會告訴你，不亂猜。` remains uncluttered.
  - Top Pick score demoted to quiet supporting info (`97分推薦`), showtime & venue carry primary visual weight.
  - One-line recommendation reason: `「大廳、時間剛好，而且離你近。」`.
  - Curated first-layer badges to 2–3 strongest decision signals (`大型影廳`, `Dolby Atmos`, `時間剛好`), moving price & transit into expanded details.
  - Duplicate `mobile_02_top_pick.png` removed and archived to `docs/archive/screenshots-v1/`.
  - Official screenshots refreshed across all mobile and desktop viewports.
  - Full test suite passed (7/7 tests). Production build passed.
  - Deployed live to GitHub Pages and Surge CDN.
- **STOPPED at Niko review gate**: Awaiting explicit Jerry/Niko approval before promoting V2.1.1 to authoritative status.

### Maintenance rule
Whenever a newer authoritative product/UI/architecture spec is intentionally created, merged, or promoted, the same work must update this file so this authority map never points to an older version.

Historical references:
- `docs/MOVIE_HALL_FINDER_UI_UX_REVIEW_V1.md`
- `docs/MOVIE_HALL_FINDER_UI_UX_REVISION_V2.md`
- Gemini CLI prompt V1.1 / V1.2

If a historical document conflicts with the current authority map, the current authoritative document wins.

## Automatic freshness check for AI agents
At the start of every task, the agent should:
1. Read this file.
2. Read the authoritative files above.
3. Inspect repo root and `docs/` for newer non-archived spec/status files.
4. If a newer-looking file exists but is not listed here, treat it as a **candidate**, not automatically authoritative; report the inconsistency first.
5. If a candidate is explicitly registered in this file, preserve its candidate status unless human approval promotes it.
6. Never use `docs/archive/` as the current source.
7. Re-read this file after pulling/refreshing the repo if another AI may have changed documentation.

This prevents an AI from silently continuing from an old prompt or an old V1/V2 document.

## Current product direction
Movie Hall Finder helps the user choose the most worthwhile screening rather than simply listing showtimes.

Core rules:
- **資料可以少，但不能假。**
- Real Data Only + Unknown Allowed.
- Mobile-first.
- First useful decision in about 10 seconds.
- Recommendation first, technical detail second.

## Current UI decision — V2.1
The homepage is now intentionally minimal.

Homepage contains only:
- app identity
- headline / short trust copy
- movie search
- location
- time
- primary CTA: `幫我挑一場`

Do NOT show on homepage:
- Top Pick
- score
- recommendation reasons
- preference weights
- Hall PK
- hall detail
- theater guide
- Ask Theater
- verification/source details

All of the above appear only after the user searches.

## Post-search order
1. Top Pick
2. recommendation reasons
3. 2–3 alternatives
4. preference refinement
5. Hall PK
6. hall detail
7. theater guide
8. Ask Theater
9. source / verification details

## Visual direction
Deep-night cinema mood:
- deep charcoal background, not pure black
- off-white primary text
- muted gray secondary text
- restrained amber accent around `#FF9F1C`
- green only for verified states
- soft yellow for unknown/pending
- violet/blue-gray for Demo/Mock

Avoid dashboard, finance-app, neon-tech, and esports aesthetics.

## Immediate implementation target
Use V2.1 as the product/UI authority and apply `MOVIE_HALL_FINDER_UI_UX_POLISH_V2.1.1.md` as the next polish pass only when explicitly requested.
The V2.1.1 pass should refine visual hierarchy and current screenshots without changing the core product flow or recommendation model.

## Current screenshot set
Fresh screenshots are organized under `docs/screenshots/`.

### Mobile — `docs/screenshots/mobile/`
- `mobile_01_homepage.png`: Homepage
- `mobile_02_search_result_top_pick.png`: Search result Top Pick
- `mobile_03_preference_drawer.png`: Preference drawer
- `mobile_04_hall_pk.png`: Hall comparison PK
- `mobile_05_hall_detail.png`: Hall detail & king seat
- `mobile_06_theater_guide.png`: Theater outing guide
- `mobile_07_ask_theater.png`: Ask Theater official check
- `qrcode_github_pages.png`: Mobile test QR code

### Desktop — `docs/screenshots/desktop/`
- `desktop_01_main.png`
- `desktop_02_hall_pk.png`
- `desktop_03_hall_spec.png`
- `desktop_04_theater_guide.png`
- `desktop_05_ask_theater.png`

### Archive — `docs/archive/screenshots-v1/`
Legacy screenshots only.

## Review gate / current verification snapshot
- [x] Homepage is truly only an entry point
- [x] Top Pick is clearly dominant after search
- [x] 10-second decision is possible
- [x] No fake data is introduced
- [x] Visual hierarchy feels cinematic and young, not like an engineering dashboard
- [x] All 7 unit & integration tests passing (`npm test`)
- [x] Production build passes (`npm run build`)
- [x] Deployed live to GitHub Pages and Surge CDN
