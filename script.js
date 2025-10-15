function (element, input) {
  const root = element || document;

  // Optional: pass { baseUrl: "https://news.yahoo.com" } from UiPath to resolve relative links
  const baseUrl = (input && input.baseUrl) ? String(input.baseUrl) : (location ? location.origin : "");

  const toAbs = (href) => {
    if (!href) return "";
    try { return new URL(href, baseUrl || location.href).href; } catch (_) { return href; }
  };

  // Select only real news items (skip Taboola/ads/etc.)
  // In your markup, real items have li.stream-item[data-test-locator="stream-item"]
  const items = Array.from(
    root.querySelectorAll('li.stream-item[data-test-locator="stream-item"]')
  ).map(li => {
    const temaEl   = li.querySelector('[data-test-locator="stream-item-category-label"]');
    const fonteEl  = li.querySelector('[data-test-locator="stream-item-publisher"]');
    const titleA   = li.querySelector('[data-test-locator="stream-item-title"] a');
    const resumoEl = li.querySelector('[data-test-locator="stream-item-summary"]');
    const timeEl   = li.querySelector('[data-test-locator="stream-read-time"]');

    const titulo        = titleA ? (titleA.textContent || "").trim() : "";
    const resumo        = resumoEl ? (resumoEl.textContent || "").trim() : "";
    const tema          = temaEl ? (temaEl.textContent || "").trim() : "";
    const fonte         = fonteEl ? (fonteEl.textContent || "").trim() : "";
    const tempo_leitura = timeEl ? (timeEl.textContent || "").trim() : "";
    const href          = titleA ? toAbs(titleA.getAttribute("href")) : "";
    const uuid          = li.getAttribute("data-uuid") || "";

    return {
      titulo,
      resumo,
      tema,
      fonte,
      tempo_leitura,
      url: href,
      uuid
    };
  })
  // keep only entries that at least have a title (robustness)
  .filter(x => x.titulo);

  // Return a JSON array (each item is one news)
  return JSON.stringify(items);
}
