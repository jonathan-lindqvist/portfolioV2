function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function parseMarkdown(md) {
  return md
    .replace(/^### (.*)$/gim, (_, title) => {
      const id = slugify(title);
      return `
        <h3 id="${id}">
          <a class="header-anchor" href="#${id}">#</a>
          ${title}
        </h3>
      `;
    })
    .replace(/^## (.*)$/gim, (_, title) => {
      const id = slugify(title);
      return `
        <h2 id="${id}">
          <a class="header-anchor" href="#${id}">#</a>
          ${title}
        </h2>
      `;
    })
    .replace(/^# (.*)$/gim, (_, title) => {
      const id = slugify(title);
      return `
        <h1 id="${id}">
          ${title}
        </h1>
      `;
    })
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/gim, "<em>$1</em>")
    .replace(/\n\n+/g, "</p><p>");
}
