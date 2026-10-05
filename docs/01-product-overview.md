# Product overview

## What VZNRY Engine is

An internal tool for **Visionary Studios** that turns a product link, or a custom brief, into a batch of finished, on-brand video ads, then gets them reviewed and delivered to the client.

Visionary Studios sells a done-for-you performance creative service to DTC (direct-to-consumer) brands: it takes ads that already work and turns them into many tested variations every week. The Engine is the internal machine behind that service.

## Who uses it

- **Our team** (producers, editors, prompt specialists): create batches, review output, deliver to clients. Not all of them are technical; the tool must be usable without writing prompts.
- **Clients** (brand marketers): only see the client review page from a link. No login, no access to the rest of the tool.

## The problem it replaces

The previous internal tool (`vznry.com/app`) had the right ingredients (product research, personas, concepts, characters, hook × core × CTA stitching) but its automatic generation gave poor results. People ended up writing prompts by hand, which defeated the point of automation.

**Root cause we're designing around:** the old tool sent abstract strategy ("concept: occasion transformation") almost directly to video models. Video models need concrete, shot-level direction: who is on screen, what they're doing, camera, lighting, the exact line, duration. A human writing prompts was doing that translation. The Engine adds a **director layer** that does it automatically (see `03-ai-pipeline.md`).

## Inspiration

[Mako](https://trymako.ai) (paste a link → research → pick content type → publish). We follow the same shape but aim higher on:

1. **Output quality**: director layer, tested recipes, automatic quality checks before a human sees anything.
2. **Agency workflow**: client review links with approve/reject/timestamped comments, because most of our videos go to clients who post them themselves.
3. **Team control**: our own prompt formats, our own characters, guardrails per brand.

## Two ways to start

1. **From a product link**: the normal case. The engine scrapes the product, builds a brand kit, researches buyers.
2. **From a brief**: for ads with no product page to analyse. Examples:
   - *Dollar Tree Secrets*: an AI presenter shares store "secrets", with a gift-card promo in the middle. A recurring series.
   - *Pillow animation*: an animated pillow character rescues someone from bad sleep, with the product and offer at the end.

## Success looks like

- A non-technical team member can go from link to a reviewable batch without writing a prompt.
- Most generated videos are good enough to keep on first review (target to set once we have real data).
- Clients approve in one or two rounds.
- The tool gets better over time from skip reasons, client feedback and ad performance.

## Out of scope for now

- Being a public SaaS product. It's internal.
- Billing, multi-company accounts.
- A full video editor. Small fixes happen by asking the Director in plain words.
