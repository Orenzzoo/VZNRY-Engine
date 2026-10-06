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
| `--blue` | #60A5FA | Hints, model tags, bulk selection only |
| `--red`, `--green`, `--amber` | status colours | Errors/changes, approved/passed, warnings |

Don't introduce new accent colours. Status colours are only for status.

## Type
- **Geist** for all text. Headings: 600 weight, tight letter-spacing (−0.04em on page titles).
- **Geist Mono** for numbers, eyebrows (small uppercase labels), timestamps, prompts, code.

## Components and classes
- `Layout`: sidebar + top bar. Every internal screen uses it. Props: `section` (highlighted nav item), `crumbs`, `screen` (for bug reports), `brand`. Content is full width.
- `PageHead`: title, short lede, optional right-hand action (the old `eyebrow` prop is ignored).
- `Stepper`: step bar. `PRODUCT_STEPS` (researcher, 4), `BRIEF_STEPS` (editor, 4) or `EDITOR_STEPS` (editor, 4).
- `Avatar` (`src/data/team.jsx`): round initials badge for a team member. Use it wherever a person is shown (assignee, author).
- `EditText`, `TagList` (`Editable.jsx`): click-to-edit text and add/remove tag lists (Brand kit). Respect a `disabled` state when something is locked.
- `DatePicker`, `NumberField` (`Inputs.jsx`): use these instead of native `<input type="date">` / `type="number"`, which look out of place in the dark theme.
- `Modal` (`Modal.jsx`): floating card in the middle of the screen with a blurred backdrop; closes on Escape, × or backdrop click. Used for task details.
- `SourceLogo` (`SourceLogo.jsx`): small logo for a comment source (Reddit, TikTok, Amazon, reviews, competitor ads), matched from the source name.
- `Hint` (`Guide.jsx`): one-line tip with an info icon, used under section headings. The old blue `Guide` panel was removed.
- `BugReport`: sidebar bug panel; posts to Slack (mocked).
- Classes: `.card`, `.sub`, `.btn` (`.primary`, `.sm`, `.off`), `.mini`, `.pill` (`lime green amber red blue violet`), `.chip`, `.segs`/`.seg`, `.tag`, `.in`, `.field`, `.drop`, `.switch`, `.box`, `.toggle-row`, `.pick`, `.list-row` + `.th`, `.notice`, `.phone` (video placeholder), `.lane` + `.tile` (Generate's hook/core/CTA rows of 9:16 pieces; `.tile.add` for Generate / Drop tiles, `.ok` / `.no` for approved / rejected), `.skel` (loading shimmer), `.progress`, `.avatar`.

## Rules
0. **Calm by default.** One primary button per area, no eyebrow labels above page titles, no repeated badges, no duplicate sections. Titles use `.h1` (34 px).
1. **Every screen explains itself without extra panels.** A clear title and lede, labels in plain words, `Hint` lines where needed, and a `title` tooltip with "ⓘ" on confusing labels. Don't add blue guide panels.
2. **Plain language.** Write for a non-technical teammate. Say "keep or skip", not "approve QA artefact".
3. **Phone-safe.** No sideways scrolling at 390 px. Use `minmax(min(Npx, 100%), 1fr)` for wide grid columns; wrap wide tables in `overflowX: 'auto'`.
4. **Accessible.** Real `<button>`/`<a>`/`<input>`/`<label>`; `aria-pressed` on toggles; `aria-label` on icon-only buttons; touch targets ≥ 40–44 px.
5. **No emoji** in the UI. Use the stroke icons in `Icons.jsx`.
6. Sample data must look realistic but be clearly placeholder where unknown: `[Offer]`, `[client reviewer email]`.
7. Video thumbnails are placeholders (`.phone`) until real renders exist.
