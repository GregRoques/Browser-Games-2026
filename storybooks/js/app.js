(function () {
  const storiesContainer = document.getElementById("stories");
  const spinner = document.getElementById("spinner");
  const sentinel = document.getElementById("sentinel");

  let currentPage = 0;
  let isLoading = false;
  let hasMore = true;

  const LIMIT = 50;

  async function fetchStories(page) {
    const res = await fetch(`/api/stories?page=${page}&limit=${LIMIT}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  function createPlaceholderSVG() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>`;
  }

  function renderCard(story) {
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-lg-4";

    const proxiedImage = story.image
      ? `/api/image-proxy?url=${encodeURIComponent(story.image)}`
      : "";

    const imageSection = proxiedImage
      ? `<img class="card-image" src="${escapeAttr(proxiedImage)}" alt="${escapeAttr(story.title)}" loading="lazy" onerror="this.outerHTML='<div class=\\'card-placeholder\\'>${createPlaceholderSVG()}</div>'">`
      : `<div class="card-placeholder">${createPlaceholderSVG()}</div>`;

    let cleanTitle = story.title || "";
    // Strip "Gemini - " or "‎Gemini - " prefix (including hidden LTR mark)
    cleanTitle = cleanTitle.replace(/^\u200e?Gemini\s*-\s*/, "");

    const displayTitle =
      cleanTitle && cleanTitle !== story.url
        ? escapeHTML(cleanTitle)
        : "A Story for Teddy";

    const hasRealDescription =
      story.description &&
      !story.description.toLowerCase().includes("created with gemini");

    const description = hasRealDescription
      ? `<p class="card-description">${escapeHTML(story.description)}</p>`
      : "";

    col.innerHTML = `
      <div class="story-card">
        <a href="${escapeAttr(story.url)}" target="_blank" rel="noopener noreferrer">
          <div class="card-image-wrap">${imageSection}</div>
          <div class="card-body">
            <h2 class="card-title">${displayTitle}</h2>
            ${description}
          </div>
        </a>
      </div>
    `;

    return col;
  }

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  async function loadPage() {
    if (isLoading || !hasMore) return;

    isLoading = true;
    spinner.classList.remove("d-none");

    try {
      const data = await fetchStories(currentPage);

      data.stories.forEach((story) => {
        storiesContainer.appendChild(renderCard(story));
      });

      hasMore = data.hasMore;
      currentPage++;
    } catch (err) {
      console.error("Failed to load stories:", err);
    } finally {
      isLoading = false;
      spinner.classList.add("d-none");
    }
  }

  // Intersection Observer for infinite scroll
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        loadPage();
      }
    },
    { rootMargin: "200px" }
  );

  observer.observe(sentinel);

  // Initial load
  loadPage();
})();
