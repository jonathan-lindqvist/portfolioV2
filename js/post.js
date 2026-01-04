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

    // Front-matter is optional
    if (text.startsWith("---")) {
      const parts = text.split("---");
      const metaLines = parts[1].trim().split("\n");
      body = parts.slice(2).join("---");

      metaLines.forEach((line) => {
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
        ${meta.date ? `<time>${meta.date}</time>` : ""}
        ${parseMarkdown(body)}
      </article>
    `;
  })
  .catch((err) => {
    console.error(err);
    container.innerHTML = "<p>Failed to load post.</p>";
  });
