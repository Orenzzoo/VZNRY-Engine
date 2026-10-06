# User flows and screens

All screens exist in the prototype under `src/pages/`. Routes are in `src/App.jsx`.

The tool follows how Visionary Studios actually works: **a researcher finds and researches the product, hands it to an editor, the editor makes the videos, and the client reviews them.** Each person sees the part of the process that is theirs.

## Roles

| Role | Sample person | What they do | Where they work |
| --- | --- | --- | --- |
| **Researcher** | David | Decides which clients and products to work on, researches each product (brand kit, buyer research), then hands it to an editor with a due date, priority, target number of videos, suggested formats and a note. Watches the pipeline and team workload. | Home (pipeline), Clients, Products, Editors (with hand-off) |
| **Editor** | Renz, Arland, Jerome, Willem | Gets researched products as tasks, reads the research, generates videos in one click (choosing a format or writing their own prompt), approves pieces, stitches ads, reviews them and sends them to the client. Fixes client change requests. | Home (my work), My tasks, Generate, Briefs, Review queue |
| **Client** | Brand marketer | Approves, rejects and comments on videos from a private link. Not a user: no login, no sidebar. | `/review/:roundId` |

Shared by both roles: Client reviews, Library, Characters (editors also get Recipes).

**Prototype only:** switch person from the account menu (top right) under "Switch account · demo", or add `?as=david` / `?as=renz` to any URL. The choice is remembered in the browser. Real login is not built yet.

## The whole process

```
Researcher                                   Editor                                        Client
Link → Brand kit → Research → Assign  ──▶  Task → Generate ──▶ Researcher review ──▶ Deliver  ──▶  Review link
                                             (or Custom video: Idea → Episodes → Look & cast → Generate)
                                                          ▲                                  │
                                                          └──── changes requested ◀──────────┘
```

## Flow A: researcher, from a product link (4 steps)

| # | Step | Route | What happens |
| --- | --- | --- | --- |
| 1 | Link | `/product/new` | Pastes a product URL, presses Analyze. Setup runs ~3–5 min: read page, brand voice, visuals, buyer research. |
| 2 | Brand kit | `/product/brand-kit` | Picks which product images to use, sets a hero image, can swap real people in photos for cast characters, uploads extra photos. Everything is editable until the kit is locked: click text to edit (name, category, price, problem, offer, sounds like / never sounds like), add or remove claims, voice words (click to turn on/off), guardrail words and claims, and change, add or remove colours (picker or hex). The badge switches from "Verified from page" to "Edited by you"; "Undo all changes" resets. Locks the kit. |
| 3 | Research | `/product/research` | Voice-of-customer phrases sorted into pains, desires, objections, aha moments, tagged by awareness stage, each with the logo of where it came from (Reddit, TikTok, Amazon, reviews, competitor ads). Buyer personas. Pinned phrases become the editor's suggested hooks. |
| 4 | Assign | `/editors?handoff=…` | Opens the **hand-off form** in a floating card on the Editors page (`/product/handoff?pkg=` redirects there). Picks the editor (open-task count shown, lightest load suggested), due date (the app's own calendar plus Tomorrow / Friday / Next Monday shortcuts; past days are struck out and can't be picked, max one year ahead), priority, number of videos (number field with − / + buttons, whole number 1–200), suggested formats (the saved list plus **Other** for any format typed in) and an optional note. "Assign" turns the research into a task and is disabled until the fields are valid. |

**Editors page** (`/editors`, researcher): **Review videos** at the top (stitched ads editors sent, each with "Review N ads", plus the last few finished reviews with kept/skipped counts), **Team workload** (open tasks per editor; click an editor to filter) and **Current tasks** of every editor (filter by status; click a task to open its card **on top of this page**, `?task=<id>`; the card's button is "Review N ads from <editor>" when it's waiting for you).. The **Assign to an editor** button (with a count of what's waiting) opens a two-step floating card: **1. Which product?** lists every researched product waiting for an editor; **2.** the hand-off form for the chosen product, with "← Change product". `?handoff=` opens step 1, `?handoff=<id>` jumps to step 2; `/assign` and `/product/handoff` redirect here.

## Flow B: editor, custom videos (no product page)

**Custom videos** (previously called Briefs) belong to editors: specific or unusual video styles they make directly, not from the researcher.

| # | Step | Route | What happens |
| --- | --- | --- | --- |
| 1 | Idea | `/custom/new` | Start blank or from a **sample** (Dollar Tree Secrets, Pillow animation, AI drama, Singing video, Brainrot edit). Pick what kind of video it is (open list, "Add your own"), describe the idea, style, length, promo placement, must say, avoid, save as series. **Ad structure**: drag the handles between Hook, Story and Promo / CTA (or use arrow keys) to change the timing in 1-second steps; the beats list follows. |
| 2 | Episodes | `/custom/episodes` | Two sections. **Suggested episodes**: script options from the engine, all sharing one **locked promo**. **Create your own episode**: a prompt box where the editor describes an episode in plain words (with one-click starters like "End on a cliffhanger"); it becomes a selected "Your idea" card. Side panel fact-checks claims (Verified / Needs check / Ask client / Blocked). Picks and own episodes carry through to the next steps. |
| 3 | Look & cast | `/custom/cast` | Presenter series: choose presenter + voice. Animation: choose a style frame, approve a character sheet. |
| 4 | Generate | `/custom/generate` | A dedicated page with only the hooks / cores / CTAs builder (same as the editor's Generate, without the task and format sections). Hooks come from the chosen episodes, cores from the story beats, CTAs around the locked promo. |

The starting point is kept in the URL as `?ex=` (default `blank`).

## Flow C: editor, from a task to the client (4 steps)

| # | Step | Route | What happens |
| --- | --- | --- | --- |
| 1 | Task | `/tasks` | No step bar on this page (it is the editor's list, not a step screen). The editor's to-do list, filterable (open, to do, in progress, changes requested, with client). Clicking a task opens it in a **floating card** in the middle of the screen (Escape, × or clicking outside closes it; `?task=` keeps it open from links) showing the **research package**: product summary, price and offer, buyer types, pinned hooks, must say / avoid, suggested formats and the researcher's note. "Start generating" moves it to In progress. |
| 2 | Generate | `/generate?task=…` | Research summary at the top. **1. How should it look?** Choose a format (UGC talking head, wall of text, B-roll, green-screen, native story, before and after, animation, static) with the researcher's suggestions marked, **or** write your own prompt (`{blanks}`, `!` locked lines, run exactly / let the engine adapt it). **2. Generate, then approve**: "Generate everything" makes a first set of hooks, cores and CTAs in one click; each lane also has a single "Generate" tile and "Drop videos" for your own clips. ✓ / ✕ on each piece. **Stitch**: approved hooks × cores × CTAs = number of ads; "Stitch N ads" builds them and shows the **Stitched ads** right below (one card per combination, labelled e.g. H1 + C2 + T1, with length). If approvals change afterwards, a notice asks you to stitch again. "Send N ads to review" then goes to Review. ("Master cut only" was removed.) |
| 3 | Researcher review | (editor waits) | The editor presses **"Send N ads to David for review"** under the stitched ads; the task becomes **For review**. The researcher reviews on `/product/review?submission=…`: **keep or skip** each stitched ad (skips need a reason). Finishing sends it back: the task becomes **Approved · ready to send** (or back to In progress if nothing was kept). The Review page also has **Client feedback** (`?round=r2`): pick a review round, go through its videos one by one (Previous / Next or the strip of all videos), see each video's decision (approved / changes requested / not reviewed) and the client's timestamped comments as dots on the timeline, click a comment to jump there, reply, and "Fix in Generate" on videos with changes. |
| 4 | Deliver | `/product/deliver` | After the researcher approves. Three options, each with an icon: **Client review link** (default, link icon), **download files** (download icon), or **publish to our channels** (publish icon; optional, `/product/publish`). Client feedback from the last round links to "Fix in Generate". |

The **Director** (`/product/director`) still exists as the detailed shot-list view for a batch (script → shots → model → quality check), reached from Generate and the Review queue. It is part of the Generate step, not a separate step.

## Home (`/`)

- **Researcher home:** greeting, counts (ready to hand off, **videos to review**, with editors, researched in 30 days), and a **pipeline** board (Videos to review → Ready to assign → With editors → With client). Team workload lives on the Editors page.
- **Editor home:** greeting, counts, **Your tasks**, **Needs attention** (client-declined videos with their comments, overdue reviews) and the output chart. (In-progress and activity lists were dropped: tasks and notifications already show them.)

## Workspace pages (sidebar)

| Page | Route | Role | Purpose |
| --- | --- | --- | --- |
| Home | `/` | Both | See above |
| Clients | `/clients` | Researcher | Every client as an expandable row with counts. Opened, it shows one list at a time in tabs (**Revisions** first, then **Being made**, **Completed**), one line per video with the assigned editor, plus search, product and editor filters and 10-at-a-time "Show more" / "Show all", so it stays short with hundreds of videos. Items link to the round in Review → Client feedback. |
| Products | `/products` | Researcher | Every product (48 in the sample) as one slim row: client, status (Researching / Ready to assign / With editors / Live / Paused), videos made, last updated. Status chips with counts, search, client filter, sort, 12 per page with page numbers. No step bar. "Add product" opens step 1 (`/product/new`). |
| Custom videos | `/custom/new` | Editor | Start a custom video (old `/briefs/*` links redirect) |
| Buyers | `/buyers` | Not in any sidebar | Buyer research for a brand's products, without the step bar. Opened from a task's "Full research" button. |
| Editors | `/editors` | Researcher | Team workload, every editor's current tasks, and "Assign to an editor" (pick a product, then the editor). |
| My tasks | `/tasks` | Editor | Assigned tasks with the research attached (a researcher sees every editor's tasks here) |
| Generate | `/generate` | Editor | Build ads for a task (picks the most urgent open task if none is given) |
| Review queue | `/review-queue` | (not in any sidebar) | Older internal-review overview. Reviewing is now done by the researcher from Editors → Review videos. |
| Recipes | `/recipes` | Editor | Library of tested formats; prompt editor at `/recipes/editor` |
| Client reviews | `/client-reviews` | Both | Every review round sent to clients: status, approval bar, latest comments, nudge, fix. Clicking a round (its name or the arrow) opens it in Review → Client feedback. |
| Library | `/library` | Both | Every clip ever made, with status, search, filters, details, bulk actions |
| Characters | `/characters` | Both | The cast. Generate a character (describe → 4 options → pick and name), upload a real person (**consent required**), or animated characters. |

Pages are not locked by role yet: the sidebar only shows each role its own pages, but any page opens from a link.

## Client-facing page

`/review/:roundId`: no sidebar, no login. The client picks a video, scrubs to a moment, leaves a timestamped comment, then Approves or Requests changes. "Send review" returns everything to our team, where it shows up as **Changes requested** on the editor's task.

## Shared UI on every internal screen

- Sidebar stays fixed while the page scrolls (wide screens), so Report a bug and credits always sit at the bottom of the screen. Sidebar: app header (logo, links home), "Working on" brand switcher (editors only; researchers use Clients instead), the role's nav grouped into Work / Feedback / Resources, a quiet **Report a bug** link (posts to Slack), slim credits meter.
- Top bar: breadcrumbs, search, "Sample data" badge, notifications (per role), account menu (with demo account switching).
- Step bar on flow screens (researcher steps or editor steps).
- No guide panels; pages use the full width. Short hints and ⓘ tooltips explain anything unclear.
