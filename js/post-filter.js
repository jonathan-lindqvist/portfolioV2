const buttons = document.querySelectorAll(".post-filters button");
const posts = document.querySelectorAll(".post-item");

function applyFilter(filter) {
  buttons.forEach((b) => {
    b.classList.toggle("active", b.dataset.filter === filter);
  });

  posts.forEach((post) => {
    const tags = post.dataset.tags.split(" ");
    const show = filter === "all" || tags.includes(filter);
    post.style.display = show ? "" : "none";
  });
}

function updateURL(filter) {
  const url = new URL(window.location);
  if (filter === "all") {
    url.searchParams.delete("tag");
  } else {
    url.searchParams.set("tag", filter);
  }
  history.replaceState(null, "", url);
}

// Button clicks
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    applyFilter(filter);
    updateURL(filter);
  });
});

// Initial load (URL-based filter)
const params = new URLSearchParams(window.location.search);
const tagFromURL = params.get("tag");

if (tagFromURL) {
  applyFilter(tagFromURL);
} else {
  applyFilter("all");
}
