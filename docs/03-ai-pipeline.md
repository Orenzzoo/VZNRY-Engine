# AI generation pipeline

**Status: Planned.** Nothing here is built yet. The prototype shows what each stage looks like to the user.

This is the core of the product. The goal: one click produces output that's good enough to keep, without a person writing prompts.

## Stages

```
Link or brief
  → 1. Brand kit (scrape + extract)
  → 2. Research (voice of customer, personas)
  → 3. Recipe chosen per piece
  → 4. Director: script → shot list → model-specific prompts
  → 5. Generate candidates per shot
  → 6. Automatic quality check (pick best, regenerate failures)
  → 7. Assemble (stitch, captions, sizes, music)
  → 8. Human review → client review → deliver
  → 9. Learn (skip reasons, client feedback, ad performance)
```

### 1. Brand kit
- Scrape the product page: name, price, offer, claims, images.
- Extract brand voice from site copy and top social posts.
- Visuals: colours, fonts, logo, **product cutouts** (background removed) so the product looks identical in every shot.
- Image triage: recommend which images to use; flag text-heavy, low-resolution, duplicate, real-person and customer photos.
- Guardrails: words to avoid, claims we can't make. Checked on every script and caption.

### 2. Research
- Sources: Reddit, TikTok comments, Amazon/site reviews, Trustpilot, competitor ads (Meta Ad Library).
- Output: **voice-of-customer bank**, real repeated phrases tagged by type (pain, desire, objection, aha) and awareness stage.
- Personas with best angles and share of signals.
- Refresh weekly. Reuse category research across similar products.

### 3. Recipes
A recipe is a tested format, tuned once by someone good at prompting, then used by anyone. It fixes:
- structure (e.g. hook 0–3s, problem, demo, CTA)
- allowed shot types per slot
- a prompt template per shot type, with `{blanks}`
- which model each shot type goes to
- caption style, pacing, music

Current recipes: AI UGC talking head, wall of text, product B-roll, static ad, native story, before and after, green-screen reaction (draft).

**Custom prompt formats** (prompt editor): the user writes their own template. Two modes:
- *Use exactly as written*: fill blanks only.
- *Tweak per product*: the engine may change only what's allowed (hook wording, setting, product shots, camera and pacing), never lines starting with `!`, and shows every change with a reason.

### 4. Director layer (the key piece)
For each piece:
1. Write the script from recipe + pinned VoC phrases + brand kit + persona.
2. Break it into a **shot list**: subject, action, setting, camera, duration, line, on-screen text.
3. Turn each shot into a **model-specific prompt**, attaching reference images (character, product cutout, style frame).
4. Route each shot to the best tool (avatar/lip-sync for talking heads; image-to-video for product B-roll; code for captions, end cards, chat UIs).

Users edit at script or shot level in plain language ("make shot 2 messier"); only the affected shots are re-planned.

### 5–6. Candidates and quality check
- Generate 2–4 candidates per shot.
- A vision model scores each against a checklist: product looks right (shape, colour), no distorted hands or faces, text legible, matches the shot description, no guardrail violations, character matches reference.
- Below threshold → regenerate (shown as **Fixed** in the Director). Only passing pieces reach Review.
- Quality bars are per shot type and rise when people keep skipping that type.

### 7. Assembly
- Hook × core × CTA stitching (kept from the old tool), plus the **Master Cut** idea: the smallest set of ads that shows every approved segment once.
- Briefs: a **locked promo segment** is made once and reused unchanged in every episode.
- Auto captions in brand style, sizes 9:16 / 4:5 / 1:1, language versions with voice cloning, static ads from the same script.

### 9. Learning loop
- Skip reasons tune prompts and quality bars.
- Client comments and decisions feed the same loop.
- Ad performance (hold rate, CTR, ROAS) re-ranks recipes, hooks and angles for the next batch.

## Characters and consistency
- Each character is locked with reference images (front, three-quarter, side, full body) and a voice.
- Consistency score = share of test shots that match the reference face.
- Real people require signed consent stored with the character.
- Animation: approve a style frame and a character sheet (several poses) before any video is made. Consider animating from fixed artwork in code as a cheaper, more consistent option than fully AI-generated animation. **Open question.**

## Model choices
**Open question.** The video model landscape changes monthly; pick per shot type after testing. Categories needed: text/image-to-video, avatar + lip-sync, text-to-speech + voice cloning, image generation, background removal, vision model for QA, LLM for research, scripts, shot lists and prompt tweaks. Keep models behind an adapter so they can be swapped without touching recipes.

## Cost
Show estimated cost before generating (Formats step) and actual spend per batch (Director). Track cost per finished ad and per model.
