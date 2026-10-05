# User flows and screens

All screens exist in the prototype under `src/pages/`. Routes are in `src/App.jsx`.

## Flow A: product link (7 steps)

| # | Step | Route | Who acts | What happens |
| --- | --- | --- | --- | --- |
| 1 | Link | `/` | Person | Pastes a product URL, presses Analyze. Setup runs ~3–5 min: read page, brand voice, visuals, buyer research. |
| 2 | Brand kit | `/product/brand-kit` | Person | Picks which scraped product images to use, sets a hero image, can swap real people in photos for cast characters, uploads extra photos. Checks facts, voice, colours, guardrails. Locks the kit. |
| 3 | Research | `/product/research` | Automatic (optional pinning) | Voice-of-customer phrases sorted into pains, desires, objections, aha moments, tagged by awareness stage. Buyer personas. Pinned phrases are used first as hooks. |
| 4 | Formats | `/product/formats` | Person | Picks recipes (formats) and quantities, sizes (9:16, 4:5, 1:1), cast, languages. Shows total files and estimated cost. "Generate" starts the batch. Link to use a custom prompt instead. |
| 5 | Director | `/product/director` | Automatic (optional changes) | Each piece: script → shot list → footage per shot, each shot routed to the best model and quality-checked. "Ask for a change" re-plans in plain words. |
| 6 | Review | `/product/review` | Person | Keep or skip each video. Skips require a reason (wrong product, uncanny face or hands, weak hook, off-brand, caption problem, other). |
| 7 | Deliver | `/product/deliver` | Person | Three routes: **client review link** (default), **download files**, or **publish to our channels** (optional). Shows the previous round's client feedback with "Fix in Director". |

Only steps 2, 4 and 6 strictly need a person.

### Optional: Publish

`/product/publish`: only for brands where we run their social accounts. Schedule to TikTok, Reels, Shorts; see performance; promote winners; "Make 10 variations" from a winner.

## Flow B: brief (custom ads)

| # | Step | Route | What happens |
| --- | --- | --- | --- |
| 1 | Brief | `/briefs/new` | Plain-language form: what we're promoting, optional fact link, the idea, style (AI presenter / animated / mixed), length, promo placement (middle / end / both), must say, avoid, save as series. Live ad-structure preview. |
| 2 | Concepts | `/briefs/concepts` | 10–20 script options sharing one **locked promo**. Side panel fact-checks claims (Verified / Needs check / Ask client / Blocked). |
| 3 | Look & cast | `/briefs/cast` | Presenter series: choose presenter + voice. Animation: choose a style frame, approve a character sheet. |
| 4–6 | Director → Review → Deliver | same as Flow A | |

The example in use is stored in the URL: `?ex=dt` (Dollar Tree) or `?ex=pl` (pillow).

## Workspace pages (sidebar)

| Page | Route | Purpose |
| --- | --- | --- |
| Products | `/` | Start a product, see recent products |
| Recipes | `/recipes` | Library of tested formats: structure, shot routing, prompt template, test history |
| Prompt editor | `/recipes/editor` | Write your own prompt with `{blanks}`; `!` locks a line; run exactly as written or let the engine tweak per product (with reasons) |
| Briefs | `/briefs/new` | Start a brief |
| Characters | `/characters` | The cast across all brands. Upload a real person (4 photos, voice, **consent required**), AI-generated or animated characters. Shows consistency score and rights. |
| Review queue | `/review-queue` | Every batch waiting for internal review, with reviewer assignment and overdue flags |
| Client reviews | `/client-reviews` | Every review round sent to clients: status, approval bar, latest comments, nudge, fix |
| Library | `/library` | Every clip ever made, with status, search, filters, details, bulk actions |
| Buyers | `/product/research` | Shortcut to research |

## Client-facing page

`/review/:roundId`: no sidebar, no login. The client picks a video, scrubs to a moment, leaves a timestamped comment, then Approves or Requests changes. "Send review" returns everything to our team. Requesting changes without a comment prompts them to say what to change.

## Shared UI on every internal screen

- Sidebar with logo, brand switcher, workspace nav, **Report a bug** (posts to Slack), credits meter.
- Top bar with breadcrumbs, search, "Sample data" badge.
- Step bar on flow screens.
- Blue "How this step works" guide; on screens ≥1560 px wide it sits in a right-hand column.
