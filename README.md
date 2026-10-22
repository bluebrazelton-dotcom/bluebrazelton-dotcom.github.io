# bluebrazelton.com

Source for Blue Brazelton's personal site. Served by Cloudflare Pages (auto-builds on push to `main`); `CNAME` is kept for GitHub Pages.

## Layout
- Top level: main pages (home, about, research, writing, aegis, workshop, cv, contact) and essays. Essay steps live in `PUBLISHING.md`.
- `ai-disclosure/`: the standing AI disclosure (`index.html`) plus talk-specific disclosures.
- `talks/<year>-<event>/`: companion pages, handouts and PDFs for each talk.
- `dcc/`, `dimming/`, `hourglass/`: Workshop projects.
- `peer-scan/`: unlisted page.
- `_redirects`: old and short addresses. QR codes point at some of them, so don't delete rules.

## Conventions
- Internal links are root-absolute (`/about.html`), so pages work from any folder.
- Footer reads "Last updated Month YYYY". Update it sitewide.
