/* Tested & Tasted - home page logic */

(async function initHome() {
  TT.setCopyrightYear();

  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const err = document.getElementById("search-error");
  const iconsEl = document.getElementById("source-icons");

  let sources = [];
  try {
    sources = await TT.loadSources();
  } catch (e) {
    // If sources fail to load, we still render the page but show a helpful error on search.
    console.error(e);
  }

  function renderIcons(enabledSources) {
    if (!iconsEl) return;
    iconsEl.innerHTML = "";

    enabledSources.forEach(src => {
      const item = document.createElement("div");
      item.className = "group flex flex-col items-center gap-2 cursor-pointer transition-all hover:opacity-100";
      item.title = src.name;

      const bubble = document.createElement("div");
      bubble.className = "size-12 md:size-14 rounded-full bg-white dark:bg-[#102219] border border-[#0d1b14]/5 dark:border-white/5 shadow-sm flex items-center justify-center p-3";
      const img = document.createElement("img");
      img.alt = `${src.name} icon`;
      img.src = src.icon || "assets/icons/placeholder.svg";
      img.className = "w-full h-full object-contain";
      bubble.appendChild(img);

      item.appendChild(bubble);
      iconsEl.appendChild(item);
    });
  }

  // Initial icon render
  const disabled = TT.getDisabledIds();
  const enabled = TT.computeEnabledSources(sources, disabled);
  renderIcons(enabled);

  function showError(message) {
    if (!err) return;
    err.textContent = message;
    err.classList.remove("hidden");
  }

  function clearError() {
    if (!err) return;
    err.textContent = "";
    err.classList.add("hidden");
  }

  if (form) {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      clearError();

      const userQuery = (input?.value || "").trim();
      const disabledNow = TT.getDisabledIds();
      const enabledNow = TT.computeEnabledSources(sources, disabledNow);

      if (!userQuery) {
        showError("Type a recipe or ingredient to search.");
        input?.focus();
        return;
      }
      if (!enabledNow.length) {
        showError("Please enable at least one source (Customize Sources).");
        return;
      }

      const q = TT.buildGoogleQuery(userQuery, enabledNow);
      if (!q) {
        showError("Unable to build search query. Please try again.");
        return;
      }
      TT.redirectToGoogle(q);
    });
  }
})();
