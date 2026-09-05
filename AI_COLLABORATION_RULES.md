# AI Collaboration Rules

This repository is the authoritative source for the Movie Hall Finder codebase.

## Read order
1. `docs/CURRENT_STATUS.md`
2. `docs/PRODUCT_RULES.md`
3. `docs/MOVIE_HALL_FINDER_UI_UX_REVISION_V2.1.md`
4. Existing implementation files

## Source-of-truth rules
- GitHub is the Single Source of Truth for code and implementation history.
- `docs/MOVIE_HALL_FINDER_UI_UX_REVISION_V2.1.md` is the current authoritative UI/UX spec.
- Earlier V1/V2 UI docs are historical references only when they conflict with V2.1.
- If product rules conflict with implementation details, preserve product rules and report the conflict.

## Change rules
- Do not silently invent requirements.
- Do not directly overwrite the intended stable branch for major changes. Prefer a feature branch and PR.
- Keep changes scoped to the requested task.
- Before editing, inspect the current repo and the latest specs.
- After editing, summarize changed files, behavior changes, known limitations, and any unresolved questions.

## Data truth rules
Core rule: **資料可以少，但不能假。**

Allowed states:
- Verified
- Unverified / Pending verification
- Unknown
- Demo / Mock

Never present Demo/Mock data as verified real data. Missing information must remain unknown or become a follow-up task.

## AI roles
Gemini, Codex, Claude, Niko, and other agents may work on the same repository. All agents must follow the same current docs and avoid creating competing copies of the same authoritative specification.

## Current UI principle
**首頁只負責開始，搜尋結果才負責說服你。**

The home page is a clean search entry. Top Pick and recommendation content appear only after search.
