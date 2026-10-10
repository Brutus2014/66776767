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
    $("frame").innerHTML = "<p class='empty'>This game has no playable page link.</p>";
    return;
  }

  const gameFrame = document.createElement("iframe");
  for (const attr of original.attributes) {
    if (attr.name !== "src" && attr.name !== "loading") {
      gameFrame.setAttribute(attr.name, attr.value);
    }
  }
  gameFrame.title = g.title;
  gameFrame.loading = "eager";

  const gameUrl = new URL(original.getAttribute("src"), document.baseURI);
  $("frame").replaceChildren(gameFrame);

  try {
    const response = await fetch(gameUrl.href);
    if (!response.ok) throw new Error(`Game page returned ${response.status}`);

    const contentType = (response.headers.get("content-type") || "").toLowerCase();

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
}const state = { games: [], category: "All", query: "" };
const $ = (id) => document.getElementById(id);

async function init() {
  try {
    const res = await fetch("games.json");
    if (!res.ok) throw new Error(res.status);
    state.games = await res.json();
  } catch (err) {
    $("grid").innerHTML = "<p class='empty'>Could not load games.json. Run the site from a local server (see README) instead of opening the file directly.</p>";
    return;
  }
  renderFilters();
  renderGrid();
  $("search").addEventListener("input", (e) => { state.query = e.target.value.toLowerCase(); renderGrid(); });
  $("back").addEventListener("click", showBrowse);
  $("logo").addEventListener("click", (e) => { e.preventDefault(); showBrowse(); });
  $("fullscreen").addEventListener("click", () => {
    const f = $("frame").querySelector("iframe");
    if (f && f.requestFullscreen) f.requestFullscreen();
  });
  // Open a game directly via #game-id
  const id = location.hash.slice(1);
  if (id) openGame(id);
}

function renderFilters() {
  const cats = ["All", ...new Set(state.games.map((g) => g.category))];
  $("filters").innerHTML = "";
  cats.forEach((c) => {
    const b = document.createElement("button");
    b.className = "chip";
    b.textContent = c;
    b.setAttribute("role", "tab");
    b.setAttribute("aria-selected", c === state.category);
    b.onclick = () => { state.category = c; renderFilters(); renderGrid(); };
    $("filters").appendChild(b);
  });
}

function renderGrid() {
  const list = state.games.filter((g) =>
    (state.category === "All" || g.category === state.category) &&
    (g.title + " " + g.category).toLowerCase().includes(state.query)
  );
  $("grid").innerHTML = "";
  list.forEach((g) => {
    const card = document.createElement("button");
    card.className = "card";
    card.innerHTML = `
      <div class="tile" style="background:${g.color || "#2f5bff"}">${g.title.charAt(0)}</div>
      <div class="card-body"><h3 class="card-title"></h3><p class="card-cat"></p></div>`;
    card.querySelector(".card-title").textContent = g.title;
    card.querySelector(".card-cat").textContent = g.category;
    card.onclick = () => openGame(g.id);
    $("grid").appendChild(card);
  });
  $("empty").hidden = list.length > 0;
}

function openGame(id) {
  const g = state.games.find((x) => x.id === id);
  if (!g) return;
  $("player-title").textContent = g.title;
  $("player-desc").textContent = g.description || "";
  $("frame").innerHTML = g.iframe;           // iframe markup comes from games.json
  $("browse").hidden = true;
  $("player").hidden = false;
  document.title = g.title + " | Game Shelf";
  location.hash = g.id;
  window.scrollTo(0, 0);
}

function showBrowse() {
  $("frame").innerHTML = "";                 // unloads the game
  $("player").hidden = true;
  $("browse").hidden = false;
  document.title = "Game Shelf";
  history.replaceState(null, "", location.pathname);
}

init();
