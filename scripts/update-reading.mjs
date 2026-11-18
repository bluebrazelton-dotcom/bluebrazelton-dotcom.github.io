import { writeFileSync } from "node:fs";

const FEED = "https://www.goodreads.com/review/list_rss/191649250?shelf=currently-reading";

try {
  const res = await fetch(FEED, { headers: { "User-Agent": "bluebrazelton.com reading widget" } });
  if (!res.ok) throw new Error(`Goodreads returned ${res.status}`);
  const xml = await res.text();
  if (!xml.includes("<rss")) throw new Error("Response was not an RSS feed");

  const books = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) => ({
    title: field(item, "title"),
    author: field(item, "author_name"),
    cover: field(item, "book_large_image_url") || field(item, "book_image_url"),
    link: field(item, "link").split("?")[0],
  }));

  writeFileSync("reading.json", JSON.stringify({ books }, null, 2) + "\n");
  console.log(`Saved ${books.length} book(s)`);
} catch (err) {
  // Leave the existing reading.json alone so the site keeps the last good list
  console.warn(`Skipped update: ${err.message}`);
}

function field(item, tag) {
  const m = item.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`));
  return m ? decode(m[1].trim()) : "";
}

function decode(s) {
  return s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'").replace(/&amp;/g, "&");
}
