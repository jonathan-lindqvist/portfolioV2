import { parseMarkdown } from "./markdown.js";

const params = new URLSearchParams(window.location.search);
const file = params.get("file");

if (!file) {
  document.getElementById("post").innerHTML = "<p>No post specified.</p>";
} else {
  fetch(`content/posts/${file}`)
    .then(res => res.text())
    .then(text => {
      const parts = text.split('---');
      const metaLines = parts[1].trim().split('\n');
      const body = parts[2];

      const meta = {};
      metaLines.forEach(line => {
        const [key, value] = line.split(': ');
        meta[key] = value;
      });

      document.getElementById("post").innerHTML = `
        <h1>${meta.title}</h1>
        <small>${meta.date}</small>
        <p>${parseMarkdown(body)}</p>
      `;
    });
}
