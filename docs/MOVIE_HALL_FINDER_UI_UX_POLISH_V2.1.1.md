# Movie Hall Finder — UI/UX Polish V2.1.1

Status: **Candidate / Not yet authoritative**  
Date: 2026-09-05  
Scope: V2.1 visual and information-density polish only. No product-direction rewrite.

> **首頁只負責開始，搜尋結果才負責說服你。**

This document is intentionally a **new candidate spec**. It must be detected by the Start-of-task protocol and reviewed before being promoted into `docs/CURRENT_STATUS.md` as authoritative.

---

## 1. Goal

V2.1 direction is correct. V2.1.1 only refines hierarchy, density, and screenshot-source clarity based on the latest Review Gate images.

Primary goals:
- make the homepage feel lighter and more app-like
- make Top Pick feel like a recommendation, not a scoring dashboard
- reduce amber/orange competition with the primary CTA
- remove ambiguity in the current screenshot set

---

## 2. Homepage polish

### Keep
- Logo / app identity
- `今晚想看什麼？`
- short subtitle
- Movie / Location / Time
- primary CTA: `幫我挑一場`
- one short trust line only

### Change

#### 2.1 Reduce footer/explanatory copy
The homepage bottom should not contain a long product explanation.

Preferred trust line:

> **資料不足時會告訴你，不亂猜。**

Everything else belongs in About / Details / Results layers.

#### 2.2 Make the search container lighter
Current search area still feels slightly like a form card.

Polish target:
- weaker border
- less container chrome
- more breathing room
- preserve clear tap targets
- avoid nested-card feeling

#### 2.3 Stronger CTA hierarchy
The brightest amber/orange belongs to the main CTA.

Selected states such as movie/location/time should use a quieter active style so they do not compete with `幫我挑一場`.

Rule:
> **One dominant action color per screen.**

---

## 3. Top Pick result polish

Current Top Pick direction is correct, but it still leans toward an analysis / scoring interface.

### 3.1 Demote the score
`97 分` is supporting information, not the hero.

Priority must be:
1. movie
2. showtime
3. theater + hall
4. one-line reason
5. score

The score should be smaller and visually quieter than the showtime and venue.

### 3.2 Recommendation reason becomes one line first
First layer should be easy to understand in 1–3 seconds.

Preferred pattern:

> **大廳、時間剛好，而且離你近。**

Detailed rationale can expand below or open in a secondary layer.

### 3.3 Reduce visible badges
Do not show every attribute at equal importance.

First layer: show only the 2–3 strongest decision signals, for example:
- 大型影廳
- Dolby Atmos
- 時間剛好

Move price, district, verification detail, secondary features, etc. into details unless they are decisive for the current recommendation.

### 3.4 Keep Top Pick cinematic
Poster / movie / time / venue should carry the visual weight.

Avoid turning the hero card into:
- KPI panel
- finance score card
- engineering dashboard
- spec matrix

---

## 4. Color polish

Continue V2.1 direction:

- Background: deep charcoal (`#111214` / `#15161A`)
- Primary text: `#F5F5F7`
- Secondary text: `#9A9CA2`
- Main accent: amber around `#FF9F1C`

### V2.1.1 accent rule
Use the strongest amber only for:
- primary CTA
- key recommendation / winner state when needed

Do not use equally strong amber for every selected chip, badge, border, and label.

Target feeling:
> **深夜電影感，不是電競感；年輕，但不是霓虹科技感。**

---

## 5. Screenshot source-of-truth cleanup

Current mobile screenshot folder contains both:

- `mobile_02_search_result_top_pick.png`
- `mobile_02_top_pick.png`

This is ambiguous for AI review.

### Required cleanup
Current official screenshot:
- `docs/screenshots/mobile/mobile_02_search_result_top_pick.png`

Legacy / duplicate screenshot:
- move `docs/screenshots/mobile/mobile_02_top_pick.png` to archive

Suggested archive path:
- `docs/archive/screenshots-v1/`

Rule:
> One obvious current screenshot per Review Gate step.

---

## 6. Review Gate V2.1.1

### Homepage
- [ ] No Top Pick before search
- [ ] No long explanatory footer copy
- [ ] Search area feels light, not like a settings form
- [ ] CTA is the strongest accent on screen
- [ ] User understands how to start within 3 seconds

### Search Result / Top Pick
- [ ] Showtime + theater + hall are more prominent than the numeric score
- [ ] First recommendation reason is one concise sentence
- [ ] Only 2–3 strongest badges visible by default
- [ ] Poster and movie content remain the visual hero
- [ ] No dashboard / KPI-panel feeling

### Screenshot hygiene
- [ ] Only one official Top Pick screenshot remains in the current mobile folder
- [ ] Duplicate/legacy image moved to archive
- [ ] `CURRENT_STATUS.md` points only to the chosen official screenshot after approval

---

## 7. Implementation priority

### P0
1. Trim homepage bottom copy
2. Reduce search-container chrome
3. Reserve strongest amber for CTA
4. Demote `97 分`
5. Convert Top Pick explanation to one-line summary
6. Reduce visible Top Pick badges to 2–3
7. Archive duplicate `mobile_02_top_pick.png`

### P1
- fine-tune spacing / typography after new screenshots
- verify 390px mobile first-screen composition
- re-run Review Gate with updated screenshots

---

## 8. Promotion rule

This file is **not authoritative yet**.

The Start-of-task protocol should detect it as an unregistered newer candidate because it is not yet listed in `docs/CURRENT_STATUS.md`.

Expected behavior:
1. detect this file
2. stop automatic authority selection
3. report the candidate/spec conflict to Jerry
4. wait for approval
5. only after approval, update `docs/CURRENT_STATUS.md`

This behavior is intentional and is part of the collaboration-protocol test.
