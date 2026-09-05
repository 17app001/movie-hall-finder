# Movie Hall Finder — Current Status

Updated: 2026-09-05

## Repository status
This repository is treated as the latest working codebase.
Current documentation work is being prepared on branch:
`docs/ai-collaboration-v2.1`

## Current authoritative documents
Read in this order:
1. `AI_COLLABORATION_RULES.md`
2. `docs/PRODUCT_RULES.md`
3. `docs/MOVIE_HALL_FINDER_UI_UX_REVISION_V2.1.md`

Historical references:
- `docs/MOVIE_HALL_FINDER_UI_UX_REVIEW_V1.md`
- `docs/MOVIE_HALL_FINDER_UI_UX_REVISION_V2.md`
- Gemini CLI prompt V1.1 / V1.2

If a historical document conflicts with V2.1, V2.1 wins for UI/UX.

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

## Review gate after implementation
Provide fresh screenshots for:
- homepage
- search result Top Pick
- preference drawer
- Hall PK
- hall detail
- theater guide
- Ask Theater
- desktop main view

Niko review should verify:
- homepage is truly only an entry point
- Top Pick is clearly dominant after search
- 10-second decision is possible
- no fake data is introduced
- visual hierarchy feels cinematic and young, not like an engineering dashboard
