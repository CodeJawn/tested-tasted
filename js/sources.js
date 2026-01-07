/* Tested & Tasted - customize sources page logic */

(async function initSources() {
  TT.setCopyrightYear();

  const listEl = document.getElementById("sources-list");
  const saveBtn = document.getElementById("save-sources");

  let sources = [];
  try {
    sources = await TT.loadSources();
  } catch (e) {
    console.error(e);
  }

  // Draft disabled set (so Cancel can simply navigate away without saving)
  const originalDisabled = TT.getDisabledIds();
  const draftDisabled = new Set(originalDisabled);

  function makeSourceRow(src, enabled) {
    // Card layout based on your comp; toggle at right.
    const card = document.createElement("div");
    card.className = "group flex items-center justify-between gap-4 rounded-2xl border border-[#0d1b14]/10 dark:border-white/10 bg-white/70 dark:bg-[#0f1f17]/70 backdrop-blur px-5 py-4 hover:border-primary/50 transition-all shadow-sm hover:shadow-md";

    const left = document.createElement("div");
    left.className = "flex items-center gap-4 min-w-0";

    const iconWrap = document.createElement("div");
    iconWrap.className = "size-12 rounded-full bg-[#f0f7f4] dark:bg-[#1e3a2d] flex items-center justify-center overflow-hidden shrink-0";
    const img = document.createElement("img");
    img.alt = `${src.name} Logo`;
    img.className = "w-full h-full object-contain p-2";
    img.src = src.icon || "assets/icons/placeholder.svg";
    iconWrap.appendChild(img);

    const meta = document.createElement("div");
    meta.className = "min-w-0";
    const name = document.createElement("h3");
    name.className = "text-base font-bold text-[#0d1b14] dark:text-white truncate";
    name.textContent = src.name;

    const domain = document.createElement("p");
    domain.className = "text-sm text-[#4c9a73] dark:text-[#8abea4] truncate";
    domain.textContent = src.domain;

    meta.appendChild(name);
    meta.appendChild(domain);

    left.appendChild(iconWrap);
    left.appendChild(meta);

    // Toggle switch (accessible checkbox)
    const toggleWrap = document.createElement("label");
    toggleWrap.className = "relative inline-flex items-center cursor-pointer shrink-0";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "sr-only peer";
    checkbox.checked = enabled;

    const track = document.createElement("div");
    track.className = "w-12 h-7 bg-[#e7f3ed] dark:bg-[#1e3a2d] peer-focus:outline-none rounded-full peer peer-checked:bg-primary transition-colors";
    const knob = document.createElement("div");
    knob.className = "absolute top-1 left-1 bg-white dark:bg-[#102219] border border-[#0d1b14]/10 dark:border-white/10 rounded-full h-5 w-5 transition-transform peer-checked:translate-x-5";

    toggleWrap.appendChild(checkbox);
    toggleWrap.appendChild(track);
    toggleWrap.appendChild(knob);

    checkbox.addEventListener("change", () => {
      // enabled => remove from disabled; disabled => add to disabled
      if (checkbox.checked) {
        draftDisabled.delete(src.id);
      } else {
        draftDisabled.add(src.id);
      }
    });

    card.appendChild(left);
    card.appendChild(toggleWrap);

    return card;
  }

  function render() {
    if (!listEl) return;
    listEl.innerHTML = "";

    // Keep stable ordering as in JSON
    sources.forEach(src => {
      const enabled = !draftDisabled.has(src.id);
      listEl.appendChild(makeSourceRow(src, enabled));
    });
  }

  render();

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      TT.setDisabledIds(draftDisabled);
      // Navigate back home after saving
      window.location.assign("index.html");
    });
  }
})();
