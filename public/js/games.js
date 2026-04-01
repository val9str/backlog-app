let gamesData = [];
let dictsData = { series: [], gameCategories: [] };

function renderGames() {
  const form = document.getElementById("games-form");
  const filters = document.getElementById("games-filters");
  const list = document.getElementById("games-list");

  form.innerHTML = `
    <div class="form-block">
      <h3>Добавить игру</h3>
      <input id="game-title" placeholder="Название" />
      <input id="game-platform" placeholder="Платформа" />
      <select id="game-series">
        <option value="">Серия (необязательно)</option>
        ${dictsData.series.map(s => `<option>${s}</option>`).join("")}
      </select>
      <select id="game-category">
        <option value="">Категория (необязательно)</option>
        ${dictsData.gameCategories.map(c => `<option>${c}</option>`).join("")}
      </select>
      <textarea id="game-notes" placeholder="Заметки"></textarea>
      <button class="btn" id="game-add">Добавить</button>
    </div>
  `;

  filters.innerHTML = `
    <div class="form-block">
      <h3>Фильтры</h3>
      <input id="filter-title" placeholder="Название содержит..." />
      <select id="filter-series">
        <option value="">Все серии</option>
        ${dictsData.series.map(s => `<option>${s}</option>`).join("")}
      </select>
      <select id="filter-category">
        <option value="">Все категории</option>
        ${dictsData.gameCategories.map(c => `<option>${c}</option>`).join("")}
      </select>
      <button class="btn-secondary" id="filter-apply">Применить</button>
    </div>
  `;

  function applyFilters() {
    const title = document.getElementById("filter-title").value.toLowerCase();
    const series = document.getElementById("filter-series").value;
    const category = document.getElementById("filter-category").value;

    return gamesData.filter(g =>
      (title === "" || g.title.toLowerCase().includes(title)) &&
      (series === "" || g.series === series) &&
      (category === "" || g.category === category)
    );
  }

  function renderList() {
    const filtered = applyFilters();

    list.innerHTML = filtered.map(g => `
      <div class="card">
        <div class="card-title">${g.title}</div>
        <div class="card-section"><strong>Платформа:</strong> ${g.platform}</div>
        <div class="card-section"><strong>Серия:</strong> ${g.series || "-"}</div>
        <div class="card-section"><strong>Категория:</strong> ${g.category || "-"}</div>
        <div class="card-section"><strong>Заметки:</strong> ${g.notes || "-"}</div>
        <button class="btn-danger" onclick="deleteGame('${g.id}')">Удалить</button>
      </div>
    `).join("");
  }

  document.getElementById("game-add").onclick = async () => {
    const title = document.getElementById("game-title").value.trim();
    const platform = document.getElementById("game-platform").value.trim();
    const series = document.getElementById("game-series").value;
    const category = document.getElementById("game-category").value;
    const notes = document.getElementById("game-notes").value.trim();

    if (!title) return;

    gamesData.push({
      id: Date.now().toString(),
      title,
      platform,
      series,
      category,
      notes
    });

    await apiSave("games", gamesData);
    renderList();
  };

  document.getElementById("filter-apply").onclick = renderList;

  renderList();
}

window.deleteGame = async (id) => {
  gamesData = gamesData.filter(g => g.id !== id);
  await apiSave("games", gamesData);
  renderGames();
};

async function initGames() {
  gamesData = await apiGet("games");
  dictsData = await apiGet("dicts");
  renderGames();
}

document.addEventListener("DOMContentLoaded", initGames);

