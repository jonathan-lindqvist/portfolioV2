import { parseMarkdown } from "./markdown.js";

const params = new URLSearchParams(window.location.search);
const file = params.get("file");
const container = document.getElementById("post");

if (!file) {
  container.innerHTML = "<p>No post specified.</p>";
  throw new Error("No post file provided");
}

fetch(`/content/posts/${file}`)
  .then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to load post: ${res.status}`);
    }
    return res.text();
  })
  .then((text) => {
    let meta = {};
    let body = text;

    const fm = text.match(/^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/);

    if (fm) {
      body = fm[2];

      fm[1].split("\n").forEach((line) => {
        if (!line.trim()) return;
        const [key, ...rest] = line.split(":");
        meta[key.trim()] = rest.join(":").trim();
      });
    }

    if (meta.title) {
      document.title = meta.title;
    } else {
      document.title = file.replace(/[-_]/g, " ").replace(/\.\w+$/, "");
    }

    container.innerHTML = `
      <article class="post-content">
        ${meta.title ? `<h1>${meta.title}</h1>` : ""}
        ${meta.date ? `<time datetime="${meta.date}">${meta.date}</time>` : ""}
        ${parseMarkdown(body)}
      </article>
    `;
  })
  .catch((err) => {
    console.error(err);
    container.innerHTML = "<p>Failed to load post.</p>";
  });
