# VZNRY Engine docs

Context for anyone, human or AI, working on this project. Read the file that matches your task before changing code.

| File | Read it when you are… |
| --- | --- |
| [01-product-overview.md](01-product-overview.md) | New to the project, or deciding whether a feature fits |
| [02-user-flows.md](02-user-flows.md) | Changing any screen or the order of steps |
| [03-ai-pipeline.md](03-ai-pipeline.md) | Working on generation, prompts, recipes or quality checks |
| [04-data-model.md](04-data-model.md) | Adding a backend, API, database table or real data |
| [05-design-system.md](05-design-system.md) | Building or restyling any UI |
| [06-roadmap.md](06-roadmap.md) | Planning what to build next |
| [07-decisions.md](07-decisions.md) | About to change something that was decided on purpose |
| [08-glossary.md](08-glossary.md) | You meet a term you're not sure about |

## Current status

- **Built:** front-end prototype (React + Vite). Role-based: Researcher and Editor each have their own home, sidebar and flow; clients use review links. All screens and interactions work on sample data, and you can switch person from the account menu.
- **How work flows:** Researcher researches a product → hands it off to an Editor → Editor generates, reviews and delivers → Client reviews. Details in `02-user-flows.md`.
- **Not built:** backend, database, login and real permissions, AI generation, storage, publishing, Slack. Everything marked *Planned* in these docs is a proposal, not a commitment.

## Keeping these docs useful

- When you make a product decision, add it to `07-decisions.md` with the date and the reason.
- When a *Planned* item gets built, change it to *Built* and note where the code lives.
- Keep files short and factual. If a section is guesswork, label it **Open question**.
