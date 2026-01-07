/* Tested & Tasted - shared utilities (static site) */

const TT = (() => {
  const SOURCES_URL = "assets/sources.json";
  const DISABLED_KEY = "tt_disabled_sources_v1";

  async function loadSources() {
    const res = await fetch(SOURCES_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load ${SOURCES_URL}`);
    const data = await res.json();
    // Basic normalization / validation
    return (Array.isArray(data) ? data : []).filter(s => s && s.id && s.name && s.domain);
  }

  function getDisabledIds() {
    try {
      const raw = localStorage.getItem(DISABLED_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(parsed) ? parsed : []);
    } catch {
      return new Set();
    }
  }

  function setDisabledIds(disabledSet) {
    const arr = Array.from(disabledSet);
    localStorage.setItem(DISABLED_KEY, JSON.stringify(arr));
  }

  function computeEnabledSources(allSources, disabledSet) {
    return allSources.filter(s => !disabledSet.has(s.id));
  }

  function buildGoogleQuery(userQuery, enabledSources) {
    const q = (userQuery || "").trim();
    const sites = enabledSources.map(s => `site:${s.domain}`);
    if (!q) return null;
    if (!sites.length) return null;

    // Wrap OR list to keep precedence predictable.
    const sitesExpr = sites.length === 1 ? sites[0] : `(${sites.join(" OR ")})`;
    return `${q} ${sitesExpr}`;
  }

  function redirectToGoogle(queryString) {
    const url = `https://www.google.com/search?q=${encodeURIComponent(queryString)}`;
    window.location.assign(url); // same tab
  }

  function setCopyrightYear() {
    const el = document.getElementById("copyright-year");
    if (!el) return;
    el.textContent = String(new Date().getFullYear());
  }

  // Small helper
  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  return {
    loadSources,
    getDisabledIds,
    setDisabledIds,
    computeEnabledSources,
    buildGoogleQuery,
    redirectToGoogle,
    setCopyrightYear,
    escapeHtml,
  };
})();
