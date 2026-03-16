import { parseMarkdown } from "./markdown.js";

const params = new URLSearchParams(window.location.search);
const post = params.get("post");
const container = document.getElementById("post");
const siteBaseUrl = "https://jonathanlindqvist.dev";

function sanitizePostParam(value) {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized) ? normalized : null;
}

const safePostParam = sanitizePostParam(post);
const file = safePostParam ? `${safePostParam}.txt` : null;

function setCanonical(href) {
  const canonical = document.querySelector("link[rel='canonical']");
  if (canonical) {
    canonical.setAttribute("href", href);
  }
}

function setMetaDescription(description) {
  const metaDescription = document.querySelector("meta[name='description']");
  if (metaDescription) {
    metaDescription.setAttribute("content", description);
  }
}

if (!file) {
  setCanonical(`${siteBaseUrl}/post.html`);
  container.innerHTML = "<p>No post specified.</p>";
  throw new Error("No post file provided");
}

setCanonical(`${siteBaseUrl}/post.html?post=${safePostParam}`);

fetch(`content/posts/${file}`)
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
      document.title = `${meta.title} | Jonathan Lindqvist`;
    } else {
      const fallbackTitle = file.replace(/[-_]/g, " ").replace(/\.\w+$/, "");
      document.title = `${fallbackTitle} | Jonathan Lindqvist`;
    }

    const descriptionText =
      meta.description || body.replace(/\s+/g, " ").trim().slice(0, 160);
    setMetaDescription(descriptionText);

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
