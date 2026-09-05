# Movie Hall Finder — Product Rules

## Product purpose
Movie Hall Finder is not a traditional showtime listing site. Its job is to help a user quickly decide **which screening is most worth going to**.

Core sentence:
> **不用自己查半天，我幫你挑今天最值得看的那一場。**

## Product outcome
The user should be able to make a first decision in about 10 seconds.

The recommendation may consider:
- hall scale / importance
- premium format
- time fit
- price
- discounts / credit-card promotions
- distance / transport convenience
- confidence of the available data

## Data principle
> **資料可以少，但不能假。**

Requirements:
- Real data should have a source and update time when possible.
- Unknown information is allowed.
- Demo/Mock is allowed only for UI or algorithm testing and must be clearly labeled.
- Do not fabricate hall size, format, price, promotion, transport, or showtime facts to make the UI look complete.

## UX principles
- Mobile-first.
- Young, simple, content-forward.
- The user should not need to understand the scoring system before using the app.
- Recommendation first, explanation second, technical detail last.
- Progressive disclosure over information dumping.
- Prefer human language over engineering language.

## Homepage rule
> **首頁只負責開始，搜尋結果才負責說服你。**

The home page contains only the search entry and truly necessary information.
Top Pick, scoring, hall comparison, hall details, theater guide, and verification details appear after search.

## Visual direction
> **深夜電影感，不是電競感；年輕，但不是霓虹科技感。**

Use deep charcoal backgrounds, off-white text, muted secondary text, and restrained warm amber accents. Posters and movie content should be the visual focus.

## Front-end language
Prefer:
- 幫我挑一場
- 今天最值得看
- 跟別場 PK
- 幫我問影城
- 怎麼去 / 停哪裡 / 看完吃什麼

Avoid exposing technical terms such as:
- Realtime API
- Agent pipeline
- MissingInfoTask
- confidence model details on the primary surface

## V1 scoring reference
Current V1 reference weights:
- hall scale 30%
- special format 20%
- time fit 15%
- price 15%
- discounts 10%
- transportation 10%

These are implementation-level defaults, not homepage UI copy.
