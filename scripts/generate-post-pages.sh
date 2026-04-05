#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
CONTENT_DIR="${ROOT_DIR}/content/posts"
OUTPUT_DIR="${ROOT_DIR}/posts"
SITE_BASE_URL="https://jonathanlindqvist.dev"

if [[ ! -d "${CONTENT_DIR}" ]]; then
  echo "Missing content directory: ${CONTENT_DIR}" >&2
  exit 1
fi

mkdir -p "${OUTPUT_DIR}"

slugify() {
  local input="$1"
  local lower
  lower="$(printf '%s' "${input}" | tr '[:upper:]' '[:lower:]')"
  lower="$(printf '%s' "${lower}" | sed -E 's/[^a-z0-9 _-]//g')"
  lower="$(printf '%s' "${lower}" | sed -E 's/[[:space:]]+/-/g; s/-+/-/g; s/^-+//; s/-+$//')"
  printf '%s' "${lower}"
}

parse_markdown() {
  perl -0777 -pe '
    sub slugify {
      my ($text) = @_;
      $text = lc($text // q{});
      $text =~ s/^\s+|\s+$//g;
      $text =~ s/[^\w\s-]//g;
      $text =~ s/\s+/-/g;
      return $text;
    }

    sub heading_anchor {
      my ($level, $title) = @_;
      my $id = slugify($title);
      return qq{<h$level id="$id"><a class="header-anchor" href="#$id">#</a>$title</h$level>};
    }

    # Headings
    s/^# (.*)$/heading_anchor(1, $1)/gime;
    s/^## (.*)$/heading_anchor(2, $1)/gime;
    s/^### (.*)$/heading_anchor(3, $1)/gime;

    # Bold & italic
    s/\*\*(.*?)\*\*/<strong>$1<\/strong>/gim;
    s/\*(.*?)\*/<em>$1<\/em>/gim;

    # Links [text](url)
    s/\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/<a href="$2" target="_blank" rel="noopener">$1<\/a>/gim;

    # Unordered lists
    s{(?:^|\n)([-*] .+(?:\n[-*] .+)*)}{
      my $m = $1;
      my @items = split(/\n/, $m);
      my $items = join(q{}, map { my $x = $_; $x =~ s/^[-*] //; qq{<li>$x<\/li>} } @items);
      qq{<ul>$items<\/ul>};
    }ge;

    # Ordered lists
    s{(?:^|\n)((?:\d+\. .+\n?)+)}{
      my $m = $1;
      my @items = split(/\n/, $m);
      my $items = join(q{}, map { my $x = $_; $x =~ s/^\d+\. //; qq{<li>$x<\/li>} } grep { length $_ } @items);
      qq{<ol>$items<\/ol>};
    }ge;

    # Paragraph handling aligned with js/markdown.js
    my @blocks = split(/\n{2,}/, $_);
    my @out;
    for my $block (@blocks) {
      my $trimmed = $block;
      $trimmed =~ s/^\s+|\s+$//g;

      if ($trimmed =~ /^<h\d/) {
        if ($trimmed =~ /^(<h\d[^>]*>.*?<\/h\d>)([\s\S]+)$/i) {
          push @out, $1, "<p>" . do { my $t = $2; $t =~ s/^\s+|\s+$//gr } . "</p>";
        } else {
          push @out, $trimmed;
        }
        next;
      }

      if ($trimmed =~ /^<(ul|ol|li|p)/) {
        push @out, $trimmed;
        next;
      }

      next if $trimmed eq q{};
      push @out, "<p>$trimmed</p>";
    }

    $_ = join(q{}, @out);
  '
}

escape_html() {
  local input="$1"
  input="${input//&/&amp;}"
  input="${input//</&lt;}"
  input="${input//>/&gt;}"
  printf '%s' "${input}"
}

generated_count=0

for post_file in "${CONTENT_DIR}"/*.txt; do
  [[ -e "${post_file}" ]] || continue

  slug="$(basename "${post_file}" .txt)"
  output_file="${OUTPUT_DIR}/${slug}.html"

  post_text="$(cat "${post_file}")"
  frontmatter=""
  body="${post_text}"

  if [[ "${post_text}" =~ ^---[[:space:]]*$'\n' ]]; then
    frontmatter="$(printf '%s' "${post_text}" | perl -0777 -ne 'if (/^---\s*\n(.*?)\n---\s*\n?/s) { print $1 }')"
    body="$(printf '%s' "${post_text}" | perl -0777 -ne 'if (/^---\s*\n.*?\n---\s*\n?(.*)$/s) { print $1 } else { print $_ }')"
  fi

  title=""
  date=""
  description=""

  if [[ -n "${frontmatter}" ]]; then
    while IFS= read -r line; do
      [[ -n "${line// }" ]] || continue
      key="${line%%:*}"
      value="${line#*:}"
      key="$(printf '%s' "${key}" | xargs)"
      value="$(printf '%s' "${value}" | sed -E 's/^\s+//; s/\s+$//')"

      case "${key}" in
        title) title="${value}" ;;
        date) date="${value}" ;;
        description) description="${value}" ;;
      esac
    done <<< "${frontmatter}"
  fi

  if [[ -z "${title}" ]]; then
    fallback="${slug//-/ }"
    title="${fallback}"
  fi

  if [[ -z "${description}" ]]; then
    description="$(printf '%s' "${body}" | tr '\n' ' ' | sed -E 's/[[:space:]]+/ /g; s/^ //; s/ $//' | cut -c1-160)"
  fi

  rendered_body="$(printf '%s' "${body}" | parse_markdown)"
  escaped_title="$(escape_html "${title}")"
  escaped_description="$(escape_html "${description}")"

  cat > "${output_file}" <<EOF
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${escaped_title} | Jonathan Lindqvist</title>
    <meta name="description" content="${escaped_description}" />
    <link rel="canonical" href="${SITE_BASE_URL}/posts/${slug}.html" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="stylesheet" href="../css/style.css" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <nav class="nav back-nav">
      <a href="../posts.html">
        <svg viewBox="0 0 16 16" fill="#000000">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M4.297105,3.29289 L0.59,7 L4.297105,10.7071 C4.687635,11.0976 5.320795,11.0976 5.711315,10.7071 C6.101845,10.3166 6.101845,9.68342 5.711315,9.29289 L4.418425,8 L11.504215,8 C12.332615,8 13.004215,8.67157 13.004215,9.5 C13.004215,10.3284 12.332615,11 11.504215,11 L10.004215,11 C9.451935,11 9.004215,11.4477 9.004215,12 C9.004215,12.5523 9.451935,13 10.004215,13 L11.504215,13 C13.437215,13 15.004215,11.433 15.004215,9.5 C15.004215,7.567 13.437215,6 11.504215,6 L4.418425,6 L5.711315,4.70711 C6.101845,4.31658 6.101845,3.68342 5.711315,3.29289 C5.320795,2.90237 4.687635,2.90237 4.297105,3.29289 Z"
            ></path>
          </g>
        </svg>
        Back to posts
      </a>

      <a href="../index.html">
        <svg fill="#000000" viewBox="0 0 24 24" id="home-alt-3" class="icon glyph">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M21.71,10.29l-9-9a1,1,0,0,0-1.42,0l-9,9a1,1,0,0,0-.21,1.09A1,1,0,0,0,3,12H4v9a1,1,0,0,0,1,1H8a1,1,0,0,0,1-1V15a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1v6a1,1,0,0,0,1,1h3a1,1,0,0,0,1-1V12h1a1,1,0,0,0,.92-.62A1,1,0,0,0,21.71,10.29Z"
            ></path>
          </g>
        </svg>
        Home
      </a>
    </nav>

    <main>
      <article class="post-content">
        <h1>${escaped_title}</h1>
$(if [[ -n "${date}" ]]; then printf '        <time datetime="%s">%s</time>\n' "$(escape_html "${date}")" "$(escape_html "${date}")"; fi)
        ${rendered_body}
      </article>
    </main>

    <script type="module" src="../js/cookie-banner.js"></script>
  </body>
</html>
EOF

  generated_count=$((generated_count + 1))
done

echo "Generated ${generated_count} static post pages in ${OUTPUT_DIR}"
