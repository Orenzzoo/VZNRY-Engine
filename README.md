# VZNRY Engine

Internal tool for Visionary Studios that turns a product link or a custom brief into finished video ads. It covers the brand kit, buyer research, format recipes, AI generation with quality checks, team review, client review links, characters, custom prompts and a library of every clip.

> **Status: front-end prototype.** Every screen and interaction works, but all data is sample data and nothing is connected to a backend or AI models yet. Comments marked `In the real build` point to where real data plugs in.

## Run it locally

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

To make a production build: `npm run build` (output goes to `dist/`).

## Who uses it

The tool is role-based and follows how Visionary Studios works:

1. **Researcher** (e.g. David) researches a product and hands it to an editor.
2. **Editor** (e.g. Renz) gets it as a task with the research attached, generates the videos and sends them to the client.
3. **Client** reviews from a private link (no login).

In the prototype, switch person from the account menu (top right, "Switch account · demo") or add `?as=david` / `?as=renz` to any URL.

## Screens

| Area | Route | Role | What it is |
| --- | --- | --- | --- |
| Home | `/` | Both | Researcher: pipeline. Editor: my tasks, client fixes, output. |
| Products | `/products` | Researcher | Every product, searchable and paged |
| 1 · Link | `/product/new` | Researcher | Paste a product link and start setup |
| 2 · Brand kit | `/product/brand-kit` | Researcher | Product images, facts, voice, visuals, guardrails |
| 3 · Research | `/product/research` | Researcher | What buyers say, personas |
| 4 · Hand off | `/editors?handoff=` | Researcher | Assign a researched product to an editor (floating form on the Editors page) |
| Editors | `/editors` | Researcher | Team workload, current tasks, ready to hand off |
| Custom videos | `/custom/new`, `/custom/episodes`, `/custom/cast`, `/custom/generate` | Editor | Videos with no product page: idea, episodes (suggested or your own prompt), look, generate |
| Buyers | `/buyers` | Editor (via task) | Buyer research per brand |
| 1 · Task | `/tasks` | Editor | My tasks, each with the research package |
| 2 · Generate | `/generate?task=` | Editor | Pick a format or write a prompt, generate hooks / cores / CTAs in one click, approve, stitch |
| Director | `/product/director` | Editor | Detailed shot list and quality checks for a batch |
| 3 · Review | `/product/review` | Editor | Keep or skip each video |
| 4 · Deliver | `/product/deliver` | Editor | Client review link, download, or publish |
| Publish (optional) | `/product/publish` | Editor | Schedule posts for accounts we run |
| Recipes | `/recipes`, `/recipes/editor` | Editor | Tested formats and the custom prompt editor |
| Review queue | `/review-queue` | Editor | All batches waiting for internal review |
| Characters | `/characters` | Both | The cast: generate, upload (with consent), voices |
| Client reviews | `/client-reviews` | Both | Summary of every client review round |
| Library | `/library` | Both | Every clip ever made |
| Client review page | `/review/:roundId` | Client | What a client sees from a review link |

## Project layout

```
src/
  App.jsx              routes
  styles.css           design tokens and shared styles
  components/
    Layout.jsx         sidebar, top bar, page header
    Stepper.jsx        the step bar at the top of each flow
    Guide.jsx          Hint: small inline tip with an info icon
    BugReport.jsx      sidebar bug report (Slack is mocked)
    Icons.jsx          stroke icons
  data/
    team.jsx           roles, team members, current user (demo switching), Avatar
    work.js            research packages, tasks, hand-off (shared in-memory state)
    formats.js         video formats editors can generate
  pages/               one file per screen, page-only sample data at the top of each
public/
  vznry-logo.png
```

## Next steps for the real build

- Team login with roles (researcher, editor) and per-role permissions
- Backend and database for brands, products, research packages, tasks, batches, clips, characters, recipes and review rounds
- Jobs for scraping the product page, buyer research, script writing, shot generation and quality checks
- Storage for uploaded photos, voices, consent forms and rendered videos
- Private, expiring links for client review pages
- Slack webhook for bug reports
