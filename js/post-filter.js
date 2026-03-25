class PostFilter {
  constructor() {
    this.buttons = document.querySelectorAll(".post-filters button");
    this.posts = document.querySelectorAll(".post-item");
    this.searchInput = document.querySelector("#post-search-input");

    if (!this.buttons || !this.posts) {
      console.warn("PostFilter: Required DOM elements not found");
      return;
    }

    this.allowedFilters = new Set(
      Array.from(this.buttons).map((button) => button.dataset.filter),
    );

    this.currentFilter = "all";
    this.currentSearchTerm = "";

    this.init();
  }

  normalizeSearchTerm(value) {
    return String(value ?? "")
      .trim()
      .toLowerCase()
      .slice(0, 100);
  }

  sanitizeFilter(filter) {
    return this.allowedFilters.has(filter) ? filter : "all";
  }

  getPostText(post) {
    return post?.textContent?.toLowerCase?.() ?? "";
  }

  applyFilters() {
    if (!this.buttons || !this.posts) return;

    this.buttons.forEach((b) => {
      b.classList.toggle("active", b?.dataset?.filter === this.currentFilter);
    });

    this.posts.forEach((post) => {
      if (!post?.dataset?.tags) return;

      const tags = post.dataset.tags.split(" ");
      const matchesTag =
        this.currentFilter === "all" || tags.includes(this.currentFilter);
      const matchesSearch =
        this.currentSearchTerm.length === 0 ||
        this.getPostText(post).includes(this.currentSearchTerm);
      const show = matchesTag && matchesSearch;

      post.style.display = show ? "" : "none";
    });
  }

  updateURL() {
    const url = new URL(window.location);

    if (this.currentFilter === "all") {
      url.searchParams.delete("tag");
    } else {
      url.searchParams.set("tag", this.currentFilter);
    }

    if (this.currentSearchTerm.length === 0) {
      url.searchParams.delete("q");
    } else {
      url.searchParams.set("q", this.currentSearchTerm);
    }

    history.replaceState(null, "", url);
  }

  attachEventListeners() {
    if (this.buttons) {
      this.buttons.forEach((button) => {
        button.addEventListener("click", () => {
          this.currentFilter = this.sanitizeFilter(button.dataset.filter);
          this.applyFilters();
          this.updateURL();
        });
      });
    }

    if (this.searchInput) {
      this.searchInput.addEventListener("input", (event) => {
        this.currentSearchTerm = this.normalizeSearchTerm(event.target.value);
        this.applyFilters();
        this.updateURL();
      });
    }
  }

  loadFromURL() {
    const params = new URLSearchParams(window.location.search);
    const tagFromURL = params.get("tag");
    const searchFromURL = params.get("q");

    if (tagFromURL) {
      this.currentFilter = this.sanitizeFilter(tagFromURL);
    }

    if (searchFromURL) {
      this.currentSearchTerm = this.normalizeSearchTerm(searchFromURL);
      if (this.searchInput) {
        this.searchInput.value = this.currentSearchTerm;
      }
    }
  }

  init() {
    this.loadFromURL();
    this.attachEventListeners();
    this.applyFilters();
  }
}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new PostFilter();
  });
} else {
  new PostFilter();
}

export { PostFilter };
