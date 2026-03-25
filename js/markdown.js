const REGEX_PATTERNS = {
  slugifySpecialChars: /[^\w\s-]/g,
  heading1: /^# (.*)$/gim,
  heading2: /^## (.*)$/gim,
  heading3: /^### (.*)$/gim,
  bold: /\*\*(.*?)\*\*/gim,
  italic: /\*(.*?)\*/gim,
  link: /\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gim,
  unorderedList: /(?:^|\n)([-*] .+(?:\n[-*] .+)*)/g,
  orderedList: /(?:^|\n)((?:\d+\. .+\n?)+)/g,
  multilineBreak: /\n{2,}/,
};

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(REGEX_PATTERNS.slugifySpecialChars, "")
    .replace(/\s+/g, "-");
}

function createHeadingAnchor(level, title) {
  const id = slugify(title);
  return `<h${level} id="${id}"><a class="header-anchor" href="#${id}">#</a>${title}</h${level}>`;
}

export function parseMarkdown(md) {
  let html = md;

  // Headings
  html = html.replace(REGEX_PATTERNS.heading1, (_, title) =>
    createHeadingAnchor(1, title),
  );
  html = html.replace(REGEX_PATTERNS.heading2, (_, title) =>
    createHeadingAnchor(2, title),
  );
  html = html.replace(REGEX_PATTERNS.heading3, (_, title) =>
    createHeadingAnchor(3, title),
  );

  // Bold & italic
  html = html.replace(REGEX_PATTERNS.bold, "<strong>$1</strong>");
  html = html.replace(REGEX_PATTERNS.italic, "<em>$1</em>");

  // Links [text](url)
  html = html.replace(
    REGEX_PATTERNS.link,
    `<a href="$2" target="_blank" rel="noopener">$1</a>`,
  );

  // Unordered lists
  html = html.replace(REGEX_PATTERNS.unorderedList, (match) => {
    const items = match
      .trim()
      .split("\n")
      .map((item) => `<li>${item.slice(2)}</li>`)
      .join("");
    return `<ul>${items}</ul>`;
  });

  // Ordered lists
  html = html.replace(REGEX_PATTERNS.orderedList, (match) => {
    const items = match
      .trim()
      .split("\n")
      .map((item) => `<li>${item.replace(/^\d+\. /, "")}</li>`)
      .join("");
    return `<ol>${items}</ol>`;
  });

  // Paragraphs (robust handling after headers)
  html = html
    .split(REGEX_PATTERNS.multilineBreak)
    .flatMap((block) => {
      const trimmed = block.trim();

      // Header followed by text in same block
      if (/^<h\d/.test(trimmed)) {
        const match = trimmed.match(/^(<h\d[^>]*>.*?<\/h\d>)([\s\S]+)$/i);

        if (match) {
          return [match[1], `<p>${match[2].trim()}</p>`];
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
