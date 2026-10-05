# Data model

**Status: Planned.** No backend exists yet. Each page currently holds sample data in constants at the top of its file. This is a proposed shape based on what the screens need; adjust when the backend is chosen.

## Entities

**Workspace**: Visionary Studios. Owns everything below.

**Brand**: a client brand (Moyou London, Dollar Tree, HookLife…).
- name, colour, logo, voice tags, sounds-like / never-sounds-like examples, guardrails (words to avoid, claims we can't make)

**Product**: belongs to a Brand.
- url, name, price, current offer, category, problem it solves, claims, setup status
- **ProductImage**: url, source (scraped/uploaded), resolution, recommended, included, isHero, hasPerson, swapForCharacter

**Research**: belongs to a Product (category research can be shared).
- **Phrase**: text, type (pain/desire/objection/aha), awareness stage, source, count, pinned
- **Persona**: name, description, wants, worries, best angle, share of signals

**Brief**: alternative to Product as a starting point.
- name, what's promoted, fact link, idea, style (ai/anim/mix), length, promo placement, must say, avoid, isSeries
- **Concept**: title, hook, angle, fact status, selected
- **Fact**: text, source, status (Verified/Needs check/Varies/Ask client/Blocked)
- **PromoSegment**: locked description and slot

**Recipe**: workspace-wide.
- name, owner, status (Live/Testing/Draft), length, structure slots, shot routing, prompt template, allowed tweaks, test runs, pass rate, hold rate, uses
- Custom prompt formats are Recipes created in the prompt editor (mode: exact/tweak, per-product notes).

**Character**: workspace-wide, scoped to brands.
- name, kind (ai/uploaded/animated), reference images, voice, consistency score, allowed brands, rights, **consent document** (required for uploaded real people)

**Batch**: belongs to a Product or Brief.
- recipes and quantities, sizes, languages, cast, status, estimated and actual cost

**Piece (clip)**: belongs to a Batch.
- title, recipe, character, persona, hook, script, status (generating / in review / with client / approved / delivered / posted / skipped), version, quality score, files per size, captions
- **Shot**: order, time range, description, line/text, model, candidates, quality score, status, notes
- **ReviewDecision** (internal): kept/skipped, reason, reviewer

**ReviewRound** (client): belongs to a Batch.
- round number, pieces, reviewers, message, due date, download-only-after-approval flag, private link token, expiry
- **ClientDecision**: piece, approved / changes requested
- **ClientComment**: piece, timestamp in video, author, text

**Post** (optional publishing): piece, channel, scheduled time, metrics (views, hold rate, CTR, ROAS), promoted.

**BugReport**: screen, description, severity, screenshot, reporter, Slack message link.

## Rules worth enforcing in the backend
- An uploaded real-person Character cannot be saved without a consent document.
- A Concept that relies on a fact with status other than Verified cannot be generated. Blocked facts are never used.
- Client review links are unguessable and expire. Clients can only see their own round.
- Files flagged "download only after approval" stay locked until the client approves that piece.
