async function openGame(id) {
  const g = state.games.find((x) => x.id === id);
  if (!g) return;

  $("player-title").textContent = g.title;
  $("player-desc").textContent = g.description || "";
  $("browse").hidden = true;
  $("player").hidden = false;
  document.title = g.title + " | Game Shelf";
  location.hash = g.id;
  window.scrollTo(0, 0);

  const holder = document.createElement("div");
  holder.innerHTML = g.iframe || "";
  const original = holder.querySelector("iframe");

  if (!original || !original.getAttribute("src")) {
    $("frame").innerHTML =
      "<p class='empty'>This game has no playable page link.</p>";
    return;
  }

  const rawSrc = original.getAttribute("src");
  const resolvedSrc =
    /^https?:\/\//i.test(rawSrc) || rawSrc.startsWith("/")
      ? rawSrc
      : `gamesite/${rawSrc.replace(/^\.?\//, "")}`;
  const gameUrl = new URL(resolvedSrc, document.baseURI);

  const gameFrame = document.createElement("iframe");
  for (const attr of original.attributes) {
    if (attr.name !== "src" && attr.name !== "loading") {
      gameFrame.setAttribute(attr.name, attr.value);
    }
  }
  gameFrame.title = g.title;
  gameFrame.loading = "eager";
  $("frame").replaceChildren(gameFrame);

  try {
    const response = await fetch(gameUrl.href);
    if (!response.ok) throw new Error(`Game page returned ${response.status}`);

    const contentType =
      (response.headers.get("content-type") || "").toLowerCase();

    if (contentType.includes("text/html")) {
      gameFrame.src = gameUrl.href;
    } else {
      let html = await response.text();

      if (!/<base\b[^>]*\bhref\s*=/i.test(html)) {
        const safeUrl = gameUrl.href
          .replace(/&/g, "&amp;")
          .replace(/"/g, "&quot;");
        const baseTag = `<base href="${safeUrl}">`;

        html = /<head\b[^>]*>/i.test(html)
          ? html.replace(/<head\b[^>]*>/i, (head) => `${head}\n${baseTag}`)
          : `${baseTag}\n${html}`;
      }

      if (gameFrame.isConnected) gameFrame.srcdoc = html;
    }
  } catch {
    gameFrame.src = gameUrl.href;
  }
}
