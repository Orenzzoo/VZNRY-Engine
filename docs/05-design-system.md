# Design system

All tokens and shared classes live in `src/styles.css`. Shared components live in `src/components/`.

## Look
Dark, sharp and modern, deliberately more polished than the old vznry tool. Near-black base, one acid-lime accent.

## Colour tokens
| Token | Value | Use |
| --- | --- | --- |
| `--bg` | #09090B | Page background |
| `--side` | #0E0E11 | Sidebar |
| `--card` | #121216 | Cards |
| `--sub` | #0D0D10 | Inset panels inside cards |
| `--line`, `--line-2`, `--line-3` | #1E1E24, #222228, #2A2A31 | Borders |
| `--text` / `--muted` / `--faint` | #F4F4F5 / #A1A1AA / #8B8B94 | Text levels |
| `--lime` | #C6F432 | **The** accent: primary buttons, active states, selected items, progress |
| `--blue` | #60A5FA | Guides, model tags, bulk selection only |
| `--red`, `--green`, `--amber` | status colours | Errors/changes, approved/passed, warnings |

Don't introduce new accent colours. Status colours are only for status.

## Type
- **Geist** for all text. Headings: 600 weight, tight letter-spacing (−0.04em on page titles).
- **Geist Mono** for numbers, eyebrows (small uppercase labels), timestamps, prompts, code.

## Components and classes
- `Layout`: sidebar + top bar. Every internal screen uses it. Props: `section` (highlighted nav item), `crumbs`, `screen` (for bug reports), `brand`, `guide`.
- `PageHead`: eyebrow, title, lede, optional right-hand action.
- `Stepper`: step bar. `PRODUCT_STEPS` (7) or `BRIEF_STEPS` (6).
- `Guide`: blue "How this step works" panel. Pass `items` as `[label, text]` pairs (What it's for / What you do / What happens next) and `terms` for jargon.
- `BugReport`: sidebar bug panel; posts to Slack (mocked).
- Classes: `.card`, `.sub`, `.btn` (`.primary`, `.sm`, `.off`), `.mini`, `.pill` (`lime green amber red blue violet`), `.chip`, `.segs`/`.seg`, `.tag`, `.in`, `.field`, `.drop`, `.switch`, `.box`, `.toggle-row`, `.pick`, `.list-row` + `.th`, `.notice`, `.phone` (video placeholder).

## Rules
1. **Every screen explains itself.** Add a `Guide` with what it's for, what you do, what happens next. Define jargon in `terms`. Add a `title` tooltip and "ⓘ" to confusing labels.
2. **Plain language.** Write for a non-technical teammate. Say "keep or skip", not "approve QA artefact".
3. **Phone-safe.** No sideways scrolling at 390 px. Use `minmax(min(Npx, 100%), 1fr)` for wide grid columns; wrap wide tables in `overflowX: 'auto'`.
4. **Accessible.** Real `<button>`/`<a>`/`<input>`/`<label>`; `aria-pressed` on toggles; `aria-label` on icon-only buttons; touch targets ≥ 40–44 px.
5. **No emoji** in the UI. Use the stroke icons in `Icons.jsx`.
6. Sample data must look realistic but be clearly placeholder where unknown: `[Offer]`, `[client reviewer email]`.
7. Video thumbnails are placeholders (`.phone`) until real renders exist.
