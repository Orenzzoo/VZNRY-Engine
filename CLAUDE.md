# VZNRY Engine: notes for Claude

Internal tool for Visionary Studios: product link or custom brief → finished video ads. React 18 + Vite + React Router, plain CSS. No backend yet; every page holds its own sample data at the top of the file.

## Project docs (read these first)
Full context lives in `docs/`. Start with `docs/README.md`, then read the file that matches the task:
product overview, user flows, AI pipeline, data model, design system, roadmap, decisions log, glossary.
When you make a product decision, add it to `docs/07-decisions.md`.

## Commands
- `npm run dev`: local server on http://localhost:5173
- `npm run build`: production build; run it after changes to catch errors

## Design rules (keep these consistent)
- Dark theme only. Colours live as CSS variables in `src/styles.css` (`--bg`, `--card`, `--lime`, etc.). Use the variables, don't add new hex colours casually.
- One accent: acid lime `--lime` (#C6F432) for primary buttons, active states and highlights. Blue (#60A5FA family) is reserved for guides, "model" tags and bulk-selection.
- Fonts: Geist for text, Geist Mono for numbers, labels, eyebrows and code.
- Reuse the shared classes: `.card`, `.sub`, `.btn` / `.btn.primary` / `.btn.sm`, `.pill` (+ `lime`, `green`, `amber`, `red`, `blue`, `violet`), `.chip`, `.segs` + `.seg`, `.in`, `.field`, `.switch`, `.box`, `.pick`, `.list-row` + `.th`, `.notice`.
- Every screen uses `<Layout>` (sidebar + top bar) and opens with `<PageHead>` then a `<Guide>` explaining: what it's for, what you do, what happens next, plus short definitions of any jargon. New screens need a guide too.
- Labels that might confuse people get a `title` tooltip and an "ⓘ".
- Product-flow screens show `<Stepper current={n} />`; brief screens use `steps={BRIEF_STEPS}`.
- Pages must work at 390 px wide with no sideways scrolling: use `minmax(min(Npx, 100%), 1fr)` for wide grid columns, and put wide tables inside an `overflowX: 'auto'` box.
- Plain, friendly copy. No jargon without explanation. Sample data is labelled with the "Sample data" pill in the top bar.

## Product decisions already made
- Step 7 is **Deliver**, not Publish. Client review link is the default route; publishing to our own channels is optional.
- Clients review on `/review/:roundId`: no login, no sidebar, approve / request changes / timestamped comments per video.
- Characters that are real people require signed consent before they can be saved.
- Brief examples: Dollar Tree Secrets (AI presenter series, promo in the middle) and the pillow animation (promo at the end). The selected example is kept in the URL as `?ex=`.
- The bug report posts to Slack channel `#engine-bugs` (placeholder name; mocked for now).
