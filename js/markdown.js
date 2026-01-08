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

  // Paragraphs (robust handling after headers)
  html = html
    .split(/\n{2,}/)
    .flatMap(block => {
      const trimmed = block.trim();

      // Header followed by text in same block
      if (/^<h\d/.test(trimmed)) {
        const match = trimmed.match(
          /^(<h\d[^>]*>.*?<\/h\d>)([\s\S]+)$/i
        );

        if (match) {
          return [
            match[1],
            `<p>${match[2].trim()}</p>`
          ];
        }

        return trimmed;
      }

      if (/^<(ul|ol|li|p)/.test(trimmed)) return trimmed;
      if (!trimmed) return "";

      return `<p>${trimmed}</p>`;
    })
    .join("");

  return html;
}
