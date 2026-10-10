const state = { games: [], category: "All", query: "" };
const $ = (id) => document.getElementById(id);

async function init() {
  try {
    const res = await fetch("games.json");
    if (!res.ok) throw new Error(res.status);
    state.games = await res.json();
    const gameTitleFixes = {
  "html-26": "Amaze",
  "html-29": "Bazooka Boy",
  "html-60": "Achievement Unlocked",
  "html-61": "Achievement Unlocked 2",
  "html-62": "Achievement Unlocked 3",
  "html-71": "Bloons Tower Defense",
  "html-72": "Bloons Tower Defense 2",
  "html-73": "Bloons Tower Defense 3",
  "html-74": "Bloons Tower Defense 4",
  "html-79": "Cannon Basketball",
  "html-80": "Cannon Basketball 2",
  "html-84": "Cubefield",
  "html-95": "Line Rider 2",
  "html-105": "World's Hardest Game 4",
  "html-106": "This Is the Only Level",
  "html-107": "Level 2",
  "html-109": "Tomb of the Mask",
  "html-115": "8 Ball Pool",
  "html-128": "Slice It All",
  "html-174": "WorldBox",
  "html-175": "Run",
  "html-176": "Run 2",
  "html-218": "Papa's Bakeria",
  "html-219": "Papa's Burgeria",
  "html-222": "Papa's Donuteria",
  "html-223": "Papa's Freezeria",
  "html-225": "Papa's Pancakeria",
  "html-226": "Papa's Pastaria",
  "html-227": "Papa's Pizzeria",
  "html-230": "Papa's Taco Mia",
  "html-232": "Plants vs. Zombies",
  "html-234": "Duck Life",
  "html-235": "Duck Life 2: World Champion",
  "html-236": "Duck Life 3",
  "html-237": "Duck Life 4",
  "html-238": "Duck Life",
  "html-239": "Red Ball Definitive Edition",
  "html-240": "Red Ball 2 Definitive Edition",
  "html-241": "Red Ball 3",
  "html-242": "Red Ball 4",
  "html-243": "Red Ball 4: Volume 2",
  "html-244": "Red Ball 4: Volume 3",
  "html-245": "Wheely",
  "html-246": "Wheely 2",
  "html-247": "Wheely 3",
  "html-248": "Wheely 4",
  "html-249": "Wheely 5",
  "html-250": "Wheely 6",
  "html-251": "Wheely 7",
  "html-252": "Wheely 8",
  "html-287": "Riddle School",
  "html-288": "Riddle School 2",
  "html-289": "Riddle School 3",
  "html-290": "Riddle School 4",
  "html-291": "Riddle School 5",
  "html-292": "Riddle Transfer",
  "html-293": "Riddle Transfer 2",
  "html-304": "Alien Hominid",
  "html-314": "Super Mario 63",
  "html-323": "Find the Alien",
  "html-326": "Pokey Ball",
  "html-333": "Fancy Pants Adventure",
  "html-334": "Fancy Pants Adventure 2",
  "html-335": "Fancy Pants Adventure: World 3",
  "html-336": "Fancy Pants Adventure: World 4 Part 1",
  "html-337": "Fancy Pants Adventure: World 4 Part 2",
  "html-340": "Learn to Fly",
  "html-341": "Learn 2 Fly 2",
  "html-342": "Learn to Fly 3",
  "html-343": "Learn to Fly: Idle",
  "html-344": "Raft Wars",
  "html-345": "Raft Wars 2",
  "html-350": "The Binding of Isaac: Wrath of the Lamb",
  "html-358": "Dadish 3D",
  "html-359": "Daily Dadish",
  "html-369": "Slow Roads",
  "html-376": "Build a Big Army",
  "html-377": "Build a Plane",
  "html-378": "Camouflage and Sniper",
  "html-379": "Car Survival 3D",
  "html-383": "Crush Cars 3D",
  "html-386": "Diamond Seeker",
  "html-391": "Flick Goal",
  "html-392": "Flip Master",
  "html-393": "Giant Wanted",
  "html-394": "Gun Clone",
  "html-397": "Make A Superboat",
  "html-398": "Makeover Run",
  "html-399": "Mega Car Jumps",
  "html-401": "Monster Box 3D",
  "html-403": "Robot Invasion",
  "html-404": "Seat Jam 3D",
  "html-405": "Shooting Master",
  "html-412": "Triple Match 3D",
  "html-415": "Twisted Rope 3D",
  "html-417": "War Regions",
  "html-418": "Weapon Craft Run",
  "html-479": "Steal Brainrot",
  "html-548": "Football Bros",
  "html-551": "Hype",
  "html-584": "Stone Grass Mowing Simulator",
  "html-586": "Dosbox",
  "html-602": "Dosbox",
  "html-614": "Toy Rider",
  "html-673": "Hobo",
  "html-674": "Hobo 2",
  "html-675": "Hobo 3",
  "html-676": "Hobo 4",
  "html-677": "Hobo 5",
  "html-678": "Hobo 6",
  "html-679": "Hobo 7",
  "html-688": "Peggle",
  "html-737": "Saihate Station",
  "html-773": "Dos",
  "html-778": "Laingame",
  "html-842": "Plants vs. Zombies"
};

state.games.forEach((game) => {
  if (gameTitleFixes[game.id]) {
    game.title = gameTitleFixes[game.id];
  }
});
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
function openGameInBlank(id) {
  const game = state.games.find((g) => g.id === id);
  if (!game) return;

  const holder = document.createElement("div");
  holder.innerHTML = game.iframe || "";
  const original = holder.querySelector("iframe");
  const src = original?.getAttribute("src");
  if (!src) return;

  const gameUrl = new URL(src, document.baseURI).href;
  const tab = window.open("about:blank", "_blank");

  if (!tab) {
    alert("Your browser blocked the new tab. Allow pop-ups for this site and try again.");
    return;
  }

  tab.document.title = game.title;
  tab.document.body.style.cssText = "margin:0;overflow:hidden";
  const frame = tab.document.createElement("iframe");
  frame.src = gameUrl;
  frame.style.cssText = "width:100vw;height:100vh;border:0";
  frame.allow = "fullscreen; autoplay; gamepad";
  tab.document.body.appendChild(frame);
}
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

  const rawSrc = original.getAttribute("src");
  const resolvedSrc = /^https?:\/\//i.test(rawSrc) || rawSrc.startsWith("/")
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

    const contentType = (response.headers.get("content-type") || "").toLowerCase();
    if (contentType.includes("text/html")) {
      gameFrame.src = gameUrl.href;
    } else {
      let html = await response.text();
      if (!/<base\b[^>]*\bhref\s*=/i.test(html)) {
        const safeUrl = gameUrl.href.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
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

function showBrowse() {
  $("frame").innerHTML = "";                 // unloads the game
  $("player").hidden = true;
  $("browse").hidden = false;
  document.title = "Game Shelf";
  history.replaceState(null, "", location.pathname);
}

init();

