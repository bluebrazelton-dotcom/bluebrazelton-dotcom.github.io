# bluebrazelton.com

Source for Blue Brazelton's personal site. Served by **GitHub Pages** from `main` (custom domain in `CNAME`); a merge goes live in about a minute.

## Layout
- Top level: main pages (home, about, research, writing, aegis, workshop, cv, contact) and essays. Essay steps live in `PUBLISHING.md`.
- `ai-disclosure/`: the standing AI disclosure (`index.html`) plus talk-specific disclosures.
- `talks/<year>-<event>/`: companion pages, handouts and PDFs for each talk.
- `dcc/`, `dimming/`, `hourglass/`: Workshop projects.
- `peer-scan/`: unlisted page.
- **Moved pages:** GitHub Pages has no redirect file, so an old address keeps a small forwarding page (e.g. `pick-your-use-case.html`, `unit-framework.html`, `hourglass/index.html`). PDFs and DOCX files can't forward, so a copy stays at the old address. QR codes and slides point at some of these: never delete one.
- **Short QR addresses** (e.g. `/beyond-compliance`): a forwarding page named `beyond-compliance.html` at the top level, pointing into `talks/`.

## Conventions
- Internal links are root-absolute (`/about.html`), so pages work from any folder.
- Footer reads "Last updated Month YYYY". Update it sitewide.
