# Decisions log

Newest first. Add an entry whenever something is decided on purpose, so nobody undoes it by accident.

| Date | Decision | Why |
| --- | --- | --- |
| 2026-10-05 | Project docs live in `docs/` as Markdown; `CLAUDE.md` points to them. | Gives AI tools and new teammates the same context. |
| 2026-10-05 | Front end built as React + Vite + React Router, plain CSS with tokens. | Simple, fast, easy for AI tools to edit; no framework lock-in for the backend. |
| 2026-10-05 | Name: **VZNRY Engine**, using the VZNRY logo. | Matches the company brand. |
| 2026-10-05 | Workspace pages (Review queue, Client reviews, Library) are separate pages, not links into one batch's step. | People need an overview across all brands. |
| 2026-10-05 | "Report a bug" in every sidebar, posting to Slack with screen, product, batch, browser and optional screenshot. | Fast bug reporting without leaving the tool. |
| 2026-10-05 | Every screen has a "How this step works" guide; on wide screens it moves to a right-hand column. | Tool must be friendly for non-technical teammates; uses empty space on wide screens. |
| 2026-10-05 | Brand kit includes a product image picker: include/exclude, hero, swap people for cast characters, upload own photos. | Same control as the old tool, with clearer recommendations. |
| 2026-10-05 | Step 7 is **Deliver**, not Publish. Client review link is the default; publishing is optional. | Many videos go to clients who post them themselves. |
| 2026-10-05 | Clients review on a no-login page with approve / request changes / timestamped comments per video. | Replaces email back-and-forth; feedback lands next to the video. |
| 2026-10-05 | Users can bring their own prompt format, run exactly or tweaked per product, with `!` to lock lines and every tweak explained. | Keeps proven prompts while still adapting per product. |
| 2026-10-05 | Characters page; real people need signed consent before saving. | Legal risk of using likeness and voice without consent. |
| 2026-10-05 | **Briefs** as a second way to start (no product page), with Series and a locked promo segment. | Covers custom work like Dollar Tree Secrets and the pillow animation. |
| 2026-10-05 | Recipes (tested formats) instead of open-ended prompting. | Reliable output; prompt expertise is captured once and reused. |
| 2026-10-05 | Director layer turns strategy into shot lists before generation, plus automatic QA before human review. | Root cause of poor output in the old tool. |
| 2026-10-05 | Design: dark base, single acid-lime accent, Geist + Geist Mono. | Modern, clearly better-looking than the old tool. |
