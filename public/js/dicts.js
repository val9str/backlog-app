let dictsData = {
  series: [],
  gameCategories: [],
  purchaseRates: { usd: 90, eur: 100 }
};

function renderDicts() {
  const root = document.getElementById("dicts-content");

  root.innerHTML = `
    <div class="form-block">
      <h3>Серии игр</h3>
      <input id="dict-series-input" placeholder="Добавить серию" />
      <button class="btn" id="dict-series-add">Добавить</button>
      <div id="dict-series-list"></div>
    </div>

    <div class="form-block">
      <h3>Категории игр</h3>
      <input id="dict-category-input" placeholder="Добавить категорию" />
      <button class="btn" id="dict-category-add">Добавить</button>
      <div id="dict-category-list"></div>
    </div>
  `;

  function renderLists() {
    document.getElementById("dict-series-list").innerHTML =
      dictsData.series
        .map(s => `
          <div class="card">
            ${s}
            <button class="btn-danger" onclick="deleteSeries('${s}')">Удалить</button>
          </div>
        `)
        .join("");

    document.getElementById("dict-category-list").innerHTML =
      dictsData.gameCategories
        .map(c => `
          <div class="card">
            ${c}
            <button class="btn-danger" onclick="deleteCategory('${c}')">Удалить</button>
          </div>
        `)
        .join("");
  }

  document.getElementById("dict-series-add").onclick = async () => {
    const val = document.getElementById("dict-series-input").value.trim();
    if (!val) return;
    dictsData.series.push(val);
    await apiSave("dicts", dictsData);
    renderLists();
  };

  document.getElementById("dict-category-add").onclick = async () => {
    const val = document.getElementById("dict-category-input").value.trim();
    if (!val) return;
    dictsData.gameCategories.push(val);
    await apiSave("dicts", dictsData);
    renderLists();
  };

  renderLists();
}

window.deleteSeries = async (name) => {
  dictsData.series = dictsData.series.filter(s => s !== name);
  await apiSave("dicts", dictsData);
  renderDicts();
};

window.deleteCategory = async (name) => {
  dictsData.gameCategories = dictsData.gameCategories.filter(c => c !== name);
  await apiSave("dicts", dictsData);
  renderDicts();
};

async function initDicts() {
  dictsData = await apiGet("dicts");
  renderDicts();
}

document.addEventListener("DOMContentLoaded", initDicts);

