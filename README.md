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
- Favicon and header logo: `favicon.ico`, `favicon.svg`, `apple-touch-icon.png` at the root, copied from Brand Standards\logo\ (the favicon cut; under 48 px always use it). Branded pages carry the three `<link rel="icon">` tags and the owl in the `.brand` header link. Deliberately unbranded pages (Tech Summit, hourglass app, prompt, peer-scan, meet-blue-590) are left alone.
- Bump `styles.css?v=N` on every page when styles.css changes.
- **Dark mode:** every branded page loads `<script src="/mode.js"></script>` in `<head>` (right after the stylesheet; no `defer`). It sets `<html data-mode="light|dark">` from the visitor's saved choice, otherwise their device setting, and adds the sun/moon button after the header menu. Dark colors live in `styles.css` (DARK MODE section, screen only); pages with their own `<style>` (talk pages, AI disclosure, meet-blue) carry their own `html[data-mode="dark"]` block. Palette: night slate `#1F2B3D` page, `#2A3A52` cards, `#4A5D7C` rules, Parchment text, Sky links. Printing always uses the light colors.
- Internal links are root-absolute (`/about.html`), so pages work from any folder.
- Footer links: Contact · CV · LinkedIn (talk pages add AI disclosure), then "Last updated Month YYYY". Update the date sitewide. LinkedIn is the only profile link in the footer (Blue, 2026-10-22); ORCID, Scholar and Substack live on the Contact page.
- Accessibility: every image needs alt text that describes the picture, not its caption; vague links ("Learn more", "Read more") get an `aria-label` that starts with the visible words; page banners sit inside `<main>`.
- **Link previews:** every branded page has Open Graph tags (`og:title`, `og:description`, `og:url`, `og:image`) plus `twitter:card`. Images live in `og/` at 1200×630: `og-default.png` for most pages, `og-reclaim.png` and `og-beyond-compliance.png` for the talk handouts (and their short addresses). New pages: copy the block from a sibling page. LinkedIn caches previews; after a change, paste the URL into linkedin.com/post-inspector to refresh it.
- **Workshop page** (`workshop.html`, shown as "Crafting Studio"): a Dungeon Crawler Carl–inspired side-quest page (Oct 2026), different from the rest of the site on purpose; all wording is original. Styles live in the page's own `<style>`, not `styles.css`. Each project is one `<li class="ach ach--TIER">` card (tiers: bronze, silver, gold, legendary set the color) with: a themed loot box in the banner (e.g. "Gold Double-Booked Box"), an achievement name and one snarky System line, the project title, a game-save status ("Game saved", "Quest complete", "Complete! (for now)"), a `<time>` line for the month it was finished, the description, two "loot" lessons learned, and a link button. To add a project, copy a card. The DCC fan-project credit lives on the DCC page, not here.
- **BlueSpace** (`bluespace.html`, Oct 2026): a mid-2000s social-profile version of the About page for the AAC&U conference crowd. Self-contained like the Workshop (own `<style>`, no `styles.css`, no `mode.js`; it stays light on purpose). "BlueSpace" and all wording are original; its images live in `bluespace/`. Linked from a banner at the top of `about.html` and from the AAC&U badge on the home page.
- **404:** `404.html` is served by GitHub Pages for any missing address. Links on it must stay root-absolute.
- **Images:** keep photos under ~250 KB (about 1600 px wide is plenty); check that a `.jpg` is really a JPEG.
