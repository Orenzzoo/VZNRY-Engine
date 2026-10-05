# Roadmap

Proposed order. Adjust as priorities change.

## Phase 0: Front-end prototype ✅ Built
All screens and interactions on sample data. React + Vite + React Router.

## Phase 1: Core engine (MVP)
Goal: one click produces output good enough to keep.
- Backend, database, team login (**Open question:** stack, e.g. Supabase / Node API / Python workers)
- Product link → brand kit (scrape, voice, visuals, cutouts, image triage)
- Buyer research → voice-of-customer bank + personas
- 2 recipes first: **AI UGC talking head** and **wall of text**
- Director layer (script → shot list → prompts)
- Automatic quality check with regeneration
- Internal review (keep/skip with reasons)
- Download delivery

## Phase 2: Agency workflow
- Client review links (private, expiring) with approve / changes / timestamped comments
- Client reviews summary, Review queue with assignment
- Library of every clip
- Characters with consent, voices and consistency tests
- More recipes; custom prompt editor
- Briefs flow (series + animation)
- Slack bug reports

## Phase 3: Scale and learn
- Publishing to TikTok, Reels, Shorts; Meta/TikTok Ads for winners
- Performance data back into the tool
- Learning loop: re-rank recipes, hooks, angles; raise quality bars from skip reasons
- Winner remix (break a winning ad into its recipe, make 10 versions)
- Language versions, batch mode across products

## Open questions
- Which video, avatar, voice and vision models per shot type (test before committing).
- Animation: fully AI-generated vs animating fixed artwork in code.
- Hosting and storage for large video files.
- Brand permissions: confirm we have rights to use client brand names, products and gift-card terms in ads.
- Real Slack channel name for bug reports (placeholder `#engine-bugs`).
