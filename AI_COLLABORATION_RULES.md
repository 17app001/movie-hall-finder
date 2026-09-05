# AI Collaboration Rules

This repository is the authoritative source for the Movie Hall Finder codebase.

## Start-of-task protocol — mandatory
Before doing any implementation work, every AI agent must:
1. Read `docs/CURRENT_STATUS.md` first.
2. Read every document listed under **Current authoritative documents**.
3. Inspect the repository root and `docs/` for newer non-archived spec/status files that may have been added after `CURRENT_STATUS.md` was last updated.
4. If a newer candidate document exists but is not referenced by `CURRENT_STATUS.md`, stop before major implementation changes and report the mismatch instead of guessing which file wins.
5. Inspect the current implementation only after the authoritative docs are resolved.

Do not rely on conversation memory, an old prompt, or a previously read copy when the repository can be checked again.

## Read order
The default entry point is always:
1. `docs/CURRENT_STATUS.md`
2. The authoritative files listed there
3. Existing implementation files

At the moment, the current authoritative product/UI documents are:
- `docs/PRODUCT_RULES.md`
- `docs/MOVIE_HALL_FINDER_UI_UX_REVISION_V2.1.md`

## Current-document maintenance rule
`docs/CURRENT_STATUS.md` is the single dynamic index for the project.

Whenever an agent intentionally creates, replaces, merges, or promotes a newer authoritative specification, that same change must also update `docs/CURRENT_STATUS.md` so that it records:
- current authoritative file path
- version / status
- last updated date
- current screenshot set, if applicable
- current implementation target / branch when relevant

Never create a newer authoritative document and leave `CURRENT_STATUS.md` pointing to the old one.

## Source-of-truth rules
- GitHub is the Single Source of Truth for code and implementation history.
- `docs/CURRENT_STATUS.md` is the Single Source of Truth for **what is current now**.
- `docs/MOVIE_HALL_FINDER_UI_UX_REVISION_V2.1.md` is currently the authoritative UI/UX spec.
- Earlier V1/V2 UI docs are historical references only when they conflict with the current authoritative spec.
- Files inside `docs/archive/` are historical and must never override current files.
- If product rules conflict with implementation details, preserve product rules and report the conflict.

## Change rules
- Do not silently invent requirements.
- Do not directly overwrite the intended stable branch for major changes. Prefer a feature branch and PR.
- Keep changes scoped to the requested task.
- Before editing, inspect the current repo and the latest specs.
- After editing, summarize changed files, behavior changes, known limitations, and any unresolved questions.
- If an implementation task changes project status materially, update `docs/CURRENT_STATUS.md` in the same workstream.

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
