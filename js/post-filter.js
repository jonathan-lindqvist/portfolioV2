const buttons = document.querySelectorAll(".post-filters button");
const posts = document.querySelectorAll(".post-item");
const searchInput = document.querySelector("#post-search-input");
const allowedFilters = new Set(
  Array.from(buttons).map((button) => button.dataset.filter)
);

let currentFilter = "all";
let currentSearchTerm = "";

function normalizeSearchTerm(value) {
  return String(value ?? "").trim().toLowerCase().slice(0, 100);
}

function sanitizeFilter(filter) {
  return allowedFilters.has(filter) ? filter : "all";
}

function getPostText(post) {
  return post.textContent.toLowerCase();
}

function applyFilters() {
  buttons.forEach((b) => {
    b.classList.toggle("active", b.dataset.filter === currentFilter);
  });

  posts.forEach((post) => {
    const tags = post.dataset.tags.split(" ");
    const matchesTag = currentFilter === "all" || tags.includes(currentFilter);
    const matchesSearch =
      currentSearchTerm.length === 0 || getPostText(post).includes(currentSearchTerm);
    const show = matchesTag && matchesSearch;

    post.style.display = show ? "" : "none";
  });
}

function updateURL() {
  const url = new URL(window.location);

  if (currentFilter === "all") {
    url.searchParams.delete("tag");
  } else {
    url.searchParams.set("tag", currentFilter);
  }

  if (currentSearchTerm.length === 0) {
    url.searchParams.delete("q");
  } else {
    url.searchParams.set("q", currentSearchTerm);
  }

  history.replaceState(null, "", url);
}

// Button clicks
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = sanitizeFilter(button.dataset.filter);
    applyFilters();
    updateURL();
  });
});

if (searchInput) {
  searchInput.addEventListener("input", (event) => {
    currentSearchTerm = normalizeSearchTerm(event.target.value);
    applyFilters();
    updateURL();
  });
}

// Initial load (URL-based filter)
const params = new URLSearchParams(window.location.search);
const tagFromURL = params.get("tag");
const searchFromURL = params.get("q");

if (tagFromURL) {
  currentFilter = sanitizeFilter(tagFromURL);
}

if (searchFromURL) {
  currentSearchTerm = normalizeSearchTerm(searchFromURL);
  if (searchInput) {
    searchInput.value = currentSearchTerm;
  }
}

applyFilters();
