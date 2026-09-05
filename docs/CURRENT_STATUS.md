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
- UI/UX: `docs/MOVIE_HALL_FINDER_UI_UX_REVISION_V2.1.md`
- Current screenshots: `docs/screenshots/`
- Historical material: `docs/archive/` and older V1/V2 specs

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
5. Never use `docs/archive/` as the current source.
6. Re-read this file after pulling/refreshing the repo if another AI may have changed documentation.

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
Implement V2.1 as a refinement of the existing app, not a product rewrite.
Priority is to simplify the homepage and move all recommendation content behind the search action while preserving existing recommendation capabilities.

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
