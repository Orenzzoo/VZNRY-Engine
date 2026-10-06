# Decisions log

Newest first. Add an entry whenever something is decided on purpose, so nobody undoes it by accident.

| Date | Decision | Why |
| --- | --- | --- |
| 2026-10-06 | Researcher wording: "hand off" → **assign** ("Ready to assign", "Assign to an editor"). Code keeps the `handoff` names. | Clearer for the team. |
| 2026-10-06 | The **researcher** reviews editors' stitched ads (Editors → Review videos), not the editor. Kept ads go back to the editor to send to the client. Editors lose the Review queue. | Matches the company process; a second pair of eyes before anything reaches a client. |
| 2026-10-06 | Delivery options have icons (link, download, publish). | Easier to scan. |
| 2026-10-06 | Stitching shows the stitched ads on the same page first; going to Review is a separate button. "Master cut only" removed. | Editors want to see the finished combinations before review. |
| 2026-10-06 | Briefs renamed **Custom videos**; steps Idea → Episodes → Look & cast → Generate, with its own Generate page (hooks/cores/CTAs only). | "Brief" didn't describe it; custom videos shouldn't jump into the task-based Generate page. |
| 2026-10-06 | Episodes step split into Suggested episodes and Create your own episode (prompt box). | Editors want to steer episodes in their own words. |
| 2026-10-06 | Sidebar is sticky on wide screens. | Bug report and credits were only visible after scrolling to the bottom. |
| 2026-10-06 | Hand-off is one button on the Editors page that opens a two-step card (product first, then editor); the separate "Ready to hand off" panel was removed. | One clear way to hand off, no duplicate lists. |
| 2026-10-06 | Researcher "Products" is a paged product list (`/products`); adding a product is a button that starts the Link step. | The researcher needs to see all current products at a glance, not a setup form. |
| 2026-10-06 | "Hand off" page became the **Editors** page (workload, current tasks, ready list); hand-off is a floating form on it. Team workload moved off the researcher home. | The researcher's main job there is managing editors; handing off is one action within that. |
| 2026-10-06 | Clients page: tabs + one-line rows + search/filters + "Show more" instead of three full columns. | Must stay usable when a client has hundreds of videos. |
| 2026-10-06 | Researchers get a **Clients** page (expandable: completed, revisions with comments, being made, who's assigned) instead of the "Working on" switcher. | Researchers manage clients as a whole, not one brand at a time. |
| 2026-10-06 | Clean-up pass: grouped sidebar, smaller titles without eyebrows, quieter bug report and credits, plain homepage headers, no duplicate sections or badges. | The app felt busy; same features and flow, less noise. |
| 2026-10-06 | Briefs are editor-only and go straight to Generate; researcher sidebar has no Briefs or Buyers. | Researchers work from product links and hand off; custom brief ideas are made by editors. |
| 2026-10-06 | Brand kit is editable in place until locked. | Scraped facts, voice and colours are often slightly wrong; fixing them should take one click. |
| 2026-10-06 | Custom date picker and number field instead of the browser's. | Native controls clashed with the dark design. |
| 2026-10-06 | Task details open in a centred floating card, not a side panel. | Easier to read the research package. |
| 2026-10-06 | Removed the blue "How this works" guide panels from every page; content uses the full width. Replaces the 2026-10-05 guide decision. | They were clutter; the screens explain themselves with copy, hints and tooltips. |
| 2026-10-06 | Client review rounds open in Review → **Client feedback** (videos one by one, decision, timestamped comments, reply, fix), not in Deliver. | Deliver is for sending; the team needs a proper place to read client feedback per video. |
| 2026-10-06 | Brief ad structure timing is adjustable by dragging. | Different formats need different hook/story/promo lengths; the guide was clutter there. |
| 2026-10-06 | My tasks has no step bar. | It's the editor's list, not a step in a flow. |
| 2026-10-06 | The tool is **role-based**: Researcher and Editor each get their own home, sidebar and steps; clients stay link-only. | Matches how Visionary Studios works today (David researches and assigns, editors make the videos), instead of one person doing every step. |
| 2026-10-06 | Researcher flow ends in **Hand off** (editor, due date, priority, number of videos, suggested formats, note). | Editors should start with full context, and the researcher decides who does what. |
| 2026-10-06 | Editor flow is Task → **Generate** → Review → Deliver. Generate = choose a format or write your own prompt, one-click "Generate everything", approve hooks/cores/CTAs, stitch combinations. | One-click generation for editors; keeps the proven hook × core × CTA stitching from the old tool. |
| 2026-10-06 | The separate Formats step was removed (format choice lives in Generate); Director became the detailed view inside Generate. | Fewer steps for editors; the researcher suggests formats at hand-off. |
| 2026-10-06 | Demo account switching (account menu, `?as=`) until real login exists. | Lets anyone see each role's view in the prototype. |
| 2026-10-05 | Home dashboard at `/`; product flow moved to `/product/new`. | People need one place that shows what needs them today (client-declined videos, overdue reviews, output). |
| 2026-10-05 | Buyers gets its own route (`/buyers`) instead of linking into product step 3. | Clicking Buyers highlighted Products, which was confusing. |
| 2026-10-05 | Brief examples are optional samples, not a two-way switch; video type is an open list with "Add your own". | The team makes many kinds of video (AI drama, singing, brainrot…); two fixed examples felt limiting. |
| 2026-10-05 | Characters can be generated (describe → 4 options → pick and name), not only uploaded. | "AI-generated" characters need a way to be made in the tool. |
| 2026-10-05 | Logo is a proper app header; account (dummy) sits in the top bar with a menu. | The logo row looked like the logged-in account. |
| 2026-10-05 | Smooth transitions throughout, one easing curve, respects reduced motion. | Switching felt abrupt; motion should show what changed. |
| 2026-10-05 | Project docs live in `docs/` as Markdown; `CLAUDE.md` points to them. | Gives AI tools and new teammates the same context. |
| 2026-10-05 | Front end built as React + Vite + React Router, plain CSS with tokens. | Simple, fast, easy for AI tools to edit; no framework lock-in for the backend. |
| 2026-10-05 | Name: **VZNRY Engine**, using the VZNRY logo. | Matches the company brand. |
| 2026-10-05 | Workspace pages (Review queue, Client reviews, Library) are separate pages, not links into one batch's step. | People need an overview across all brands. |
| 2026-10-05 | "Report a bug" in every sidebar, posting to Slack with screen, product, batch, browser and optional screenshot. | Fast bug reporting without leaving the tool. |
| 2026-10-05 | ~~Every screen has a "How this step works" guide; on wide screens it moves to a right-hand column.~~ Reversed 2026-10-06. | Tool must be friendly for non-technical teammates; uses empty space on wide screens. |
| 2026-10-05 | Brand kit includes a product image picker: include/exclude, hero, swap people for cast characters, upload own photos. | Same control as the old tool, with clearer recommendations. |
| 2026-10-05 | Step 7 is **Deliver**, not Publish. Client review link is the default; publishing is optional. | Many videos go to clients who post them themselves. |
| 2026-10-05 | Clients review on a no-login page with approve / request changes / timestamped comments per video. | Replaces email back-and-forth; feedback lands next to the video. |
| 2026-10-05 | Users can bring their own prompt format, run exactly or tweaked per product, with `!` to lock lines and every tweak explained. | Keeps proven prompts while still adapting per product. |
| 2026-10-05 | Characters page; real people need signed consent before saving. | Legal risk of using likeness and voice without consent. |
| 2026-10-05 | **Briefs** as a second way to start (no product page), with Series and a locked promo segment. | Covers custom work like Dollar Tree Secrets and the pillow animation. |
| 2026-10-05 | Recipes (tested formats) instead of open-ended prompting. | Reliable output; prompt expertise is captured once and reused. |
| 2026-10-05 | Director layer turns strategy into shot lists before generation, plus automatic QA before human review. | Root cause of poor output in the old tool. |
| 2026-10-05 | Design: dark base, single acid-lime accent, Geist + Geist Mono. | Modern, clearly better-looking than the old tool. |
