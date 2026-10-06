# VZNRY Engine: notes for Claude

Internal tool for Visionary Studios: product link or custom brief → finished video ads. React 18 + Vite + React Router, plain CSS. No backend yet. Page-only sample data sits at the top of each page file; data shared between pages (team, tasks, research packages, formats) lives in `src/data/`.

**The tool is role-based** and follows how the company works: a **Researcher** (David) researches a product and hands it off; an **Editor** (Renz, Arland, Jerome, Willem) gets it as a task, generates the videos and sends them to the **client** (review link only, not a user). See `docs/02-user-flows.md`.

## Project docs (read these first)
Full context lives in `docs/`. Start with `docs/README.md`, then read the file that matches the task:
product overview, user flows, AI pipeline, data model, design system, roadmap, decisions log, glossary.
When you make a product decision, add it to `docs/07-decisions.md`.

## Commands
- `npm run dev`: local server on http://localhost:5173
- `npm run build`: production build; run it after changes to catch errors

## Design rules (keep these consistent)
- Dark theme only. Colours live as CSS variables in `src/styles.css` (`--bg`, `--card`, `--lime`, etc.). Use the variables, don't add new hex colours casually.
- One accent: acid lime `--lime` (#C6F432) for primary buttons, active states and highlights. Blue (#60A5FA family) is reserved for hints, "model" tags and bulk-selection.
- Fonts: Geist for text, Geist Mono for numbers, labels, eyebrows and code.
- Reuse the shared classes: `.card`, `.sub`, `.btn` / `.btn.primary` / `.btn.sm`, `.pill` (+ `lime`, `green`, `amber`, `red`, `blue`, `violet`), `.chip`, `.segs` + `.seg`, `.in`, `.field`, `.switch`, `.box`, `.pick`, `.list-row` + `.th`, `.notice`.
- Every screen uses `<Layout>` (sidebar + top bar) and opens with `<PageHead>` (title + short lede; no eyebrow label above the title, since breadcrumbs and step bars already say where you are). **No blue "How this works" guide panels** (removed from every page by request): explain things with clear copy, a short lede, `<Hint>` lines (`src/components/Guide.jsx`) and `title` tooltips instead. Page content uses the full width.
- Labels that might confuse people get a `title` tooltip and an "ⓘ".
- Flow screens show a `<Stepper>`: researcher product screens use the default `PRODUCT_STEPS` (Link → Brand kit → Research → Assign), custom-video screens `steps={BRIEF_STEPS}` (editor: Idea → Episodes → Look & cast → Generate), editor screens `steps={EDITOR_STEPS}` (Task → Generate → Review → Deliver).
- Role-specific nav lives in `navFor()` in `src/components/Layout.jsx`. A new page must be added there for the role(s) that use it, and its `<Layout section>` must match the nav label.
- Pages must work at 390 px wide with no sideways scrolling: use `minmax(min(Npx, 100%), 1fr)` for wide grid columns, and put wide tables inside an `overflowX: 'auto'` box.
- Keep screens calm: one primary action per area, no repeated status badges, no duplicate sections showing the same data. Prefer fewer, clearer sections over more.
- Plain, friendly copy. No jargon without explanation. Sample data is labelled with the "Sample data" pill in the top bar.

## Product decisions already made
- Step 7 is **Deliver**, not Publish. Client review link is the default route; publishing to our own channels is optional.
- Clients review on `/review/:roundId`: no login, no sidebar, approve / request changes / timestamped comments per video.
- Characters that are real people require signed consent before they can be saved.
- **Custom videos** (formerly Briefs; code still uses `Brief.jsx`, `BRIEF_STEPS`, `briefExamples.jsx`) start blank or from a **sample** (Dollar Tree Secrets, Pillow animation, AI drama, Singing video, Brainrot edit). Samples only pre-fill the form; they are not fixed options. "What kind of video?" is an open list: people can add their own type. The starting point is kept in the URL as `?ex=` (default `blank`). Data lives in `src/pages/briefExamples.jsx`.
- Roles: `researcher` and `editor` (`src/data/team.jsx`). Current user via `useCurrentUser()`; switch with the account menu ("Switch account · demo") or `?as=david` / `?as=renz` in the URL. Pages are not locked by role yet; only the sidebar differs.
- Researcher routes: `/` (pipeline home), `/products` (product list, no step bar; "Add product" → `/product/new`), `/product/new` → `/product/brand-kit` → `/product/research` → hand-off (`/product/handoff` and `/assign` redirect to `/editors?handoff=<id>`), `/editors` (team workload, current tasks, ready to hand off; the hand-off form `HandOffForm.jsx` opens in a `Modal`). The researcher sidebar has Clients (`/clients`) and no Briefs, Buyers or "Working on" brand switcher.
- Editor routes: `/` (my-work home), `/tasks` → `/generate?task=` → (send stitched ads to the researcher) → `/product/deliver` once approved. **Editors don't review their own videos**: `submitForReview()` puts them in `reviews` (`src/data/work.js`); the researcher reviews on `/product/review?submission=<id>` from Editors → Review videos, and `finishReview()` sets the task to `approved`. Task statuses: todo, doing, review, approved, fixes, client, done. Show status text with `statusLabel(status, role)` (it can word a status differently per role; today both roles see the same). The task card is the shared `TaskDetail` component; its main button depends on the viewer's role. Custom videos are editor-only: `/custom/new` (Idea) → `/custom/episodes` (suggested + write-your-own) → `/custom/cast` → `/custom/generate` (`BRIEF_STEPS`; picks shared via `useEpisodes()`). The hooks/cores/CTAs builder is the shared `LaneBuilder` component. `/buyers` is opened from a task's "Full research". Generate = choose a format **or** write your own prompt, "Generate everything" in one click, approve hooks / cores / CTAs, stitch combinations. `/product/director` is the detailed shot-list view inside Generate. The old Formats step was removed; `/product/formats` redirects to `/generate`.
- Client review rounds (videos, decisions, timestamped comments) live in `src/data/reviews.js`; Client reviews links each round to `/product/review?round=<id>` (Client feedback view).
- Tasks and hand-offs are shared in-memory state (`useWork()`, `assignTask()`, `setTaskStatus()` in `src/data/work.js`); they reset on reload.
- Sidebar top is the app header (logo + wordmark, links home); the signed-in account lives in the top bar with demo account switching. The brand switcher ("Working on") is a dropdown; picking a brand doesn't filter sample data yet.
- Motion: shared easing tokens `--ease` / `--ease-out` in `styles.css`. Page content fades up with a stagger, the active nav highlight slides, and a lime bar sweeps the top on page change. For content that swaps in place, add `.anim-in` (or `.stagger` on a list) and give it a React `key` so it replays. All motion is turned off under `prefers-reduced-motion`.
- The bug report posts to Slack channel `#engine-bugs` (placeholder name; mocked for now).
