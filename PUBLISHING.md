# Publishing a blog post

Cadence: a new essay every other Tuesday, released at 9:00 am. Best day for this audience.
Everything is prepared on the **Friday before**: the site goes live that Friday (so the
page has a few days to be indexed before Substack picks it up), and the Substack and
LinkedIn posts are scheduled that same Friday to publish Tuesday at 9:00 am.
Post pages live at the repo root. Talk material goes in `talks/<year>-<event>/` (see README.md).

## Steps
1. Copy `_post-template.html` → `your-slug.html`.
   Slug: lowercase, hyphenated, no date (e.g. `boxes-and-boxes.html`).
2. Fill the `{{...}}` fields:
   - `{{TITLE}}` — appears twice (in <title> and <h1>)
   - `{{SLUG}}` — in the canonical link; must match the filename
   - `{{ONE_SENTENCE_DESCRIPTION}}` — the <meta description>
   - `{{MONTH DD, YYYY}}` — the dateline (the Tuesday it goes live)
   - One `<p>…</p>` per body paragraph
   - Optional `<blockquote class="pullquote">` for one featured line
   - References: paste each cite in its own `<p class="muted small sans">`;
     wrap any bare URL or DOI as `<a href="URL">URL</a>`
3. Add the post to `writing.html`: paste a new `<li>` at the TOP of
   `<ul class="entry-list">` (newest first). The list sits inside the parchment
   scroll (`<div class="scroll">` and its decoration layers); leave those alone and only add the `<li>`:
```html
   <li>
     <div class="entry-meta">Mon DD, YYYY</div>
     <div class="entry-body">
       <p class="entry-body__title"><a href="your-slug.html">Title</a></p>
       <p class="entry-body__note">One-line teaser.</p>
     </div>
   </li>
```
4. **Friday before release:** commit + push (or merge the PR) to `main`.
   GitHub Pages publishes in about a minute. The dateline and the `writing.html`
   entry still show the Tuesday release date.
5. **Same Friday:** schedule the Substack cross-post (the full piece, with the
   canonical URL set to the bluebrazelton.com page) and a short LinkedIn post
   linking to the site, both for **Tuesday at 9:00 am**.

## Notes
- Internal links are root-absolute: `/filename.html` (leading slash), never `../`.
  Post pages still live at the repo root.
- Only the body, title, date, slug, description, and refs change between posts.
  Head/nav/footer are identical everywhere — don't edit them per-post.
- Keep `aria-current="page"` on the Writing nav link in post pages.
- The `?v=8` on styles.css is a cache-buster; bump it sitewide only if you
  change styles.css.
