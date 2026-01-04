function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function parseMarkdown(md) {
  let html = md;

  // Headings
  html = html.replace(/^### (.*)$/gim, (_, title) => {
    const id = slugify(title);
    return `<h3 id="${id}"><a class="header-anchor" href="#${id}">#</a>${title}</h3>`;
  });

  html = html.replace(/^## (.*)$/gim, (_, title) => {
    const id = slugify(title);
    return `<h2 id="${id}"><a class="header-anchor" href="#${id}">#</a>${title}</h2>`;
  });

  html = html.replace(/^# (.*)$/gim, (_, title) => {
    const id = slugify(title);
    return `<h1 id="${id}">${title}</h1>`;
  });

  // Bold & italic
  html = html.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>");
  html = html.replace(/\*(.*?)\*/gim, "<em>$1</em>");

  // Links [text](url)
  html = html.replace(
    /\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gim,
    `<a href="$2" target="_blank" rel="noopener">$1</a>`
  );

  // Unordered lists
  html = html.replace(
    /(?:^|\n)([-*] .+(?:\n[-*] .+)*)/g,
    match => {
      const items = match
        .trim()
        .split("\n")
        .map(item => `<li>${item.slice(2)}</li>`)
        .join("");
      return `<ul>${items}</ul>`;
    }
  );

  // Ordered lists
  html = html.replace(
    /(?:^|\n)((?:\d+\. .+\n?)+)/g,
    match => {
      const items = match
        .trim()
        .split("\n")
        .map(item => `<li>${item.replace(/^\d+\. /, "")}</li>`)
        .join("");
      return `<ol>${items}</ol>`;
    }
  );

  // Paragraphs (avoid wrapping block elements)
  html = html
    .split(/\n{2,}/)
    .map(block => {
      if (/^<(h\d|ul|ol|li|p)/.test(block.trim())) return block;
      return `<p>${block.trim()}</p>`;
    })
    .join("");

  return html;
}
