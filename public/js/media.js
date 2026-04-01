let mediaData = [];
let dictsMedia = { mediaTypes: ["Фильм", "Сериал", "Аниме"], statuses: ["Запланировано", "Смотрю", "Просмотрено"] };

function renderMedia() {
  const form = document.getElementById("media-form");
  const filters = document.getElementById("media-filters");
  const list = document.getElementById("media-list");

  form.innerHTML = `
    <div class="form-block">
      <h3>Добавить медиа</h3>
      <input id="media-title" placeholder="Название" />
      <select id="media-type">
        ${dictsMedia.mediaTypes.map(t => `<option>${t}</option>`).join("")}
      </select>
      <select id="media-status">
        ${dictsMedia.statuses.map(s => `<option>${s}</option>`).join("")}
      </select>
      <textarea id="media-notes" placeholder="Заметки"></textarea>
      <button class="btn" id="media-add">Добавить</button>
    </div>
  `;

  filters.innerHTML = `
    <div class="form-block">
      <h3>Фильтры</h3>
      <input id="media-filter-title" placeholder="Название содержит..." />
      <select id="media-filter-type">
        <option value="">Все типы</option>
        ${dictsMedia.mediaTypes.map(t => `<option>${t}</option>`).join("")}
      </select>
      <select id="media-filter-status">
        <option value="">Все статусы</option>
        ${dictsMedia.statuses.map(s => `<option>${s}</option>`).join("")}
      </select>
      <button class="btn-secondary" id="media-filter-apply">Применить</button>
    </div>
  `;

  function applyFilters() {
    const title = document.getElementById("media-filter-title").value.toLowerCase();
    const type = document.getElementById("media-filter-type").value;
    const status = document.getElementById("media-filter-status").value;

    return mediaData.filter(m =>
      (title === "" || m.title.toLowerCase().includes(title)) &&
      (type === "" || m.type === type) &&
      (status === "" || m.status === status)
    );
  }

  function renderList() {
    const filtered = applyFilters();

    list.innerHTML = filtered.map(m => `
      <div class="card">
        <div class="card-title">${m.title}</div>
        <div class="card-section"><strong>Тип:</strong> ${m.type}</div>
        <div class="card-section"><strong>Статус:</strong> ${m.status}</div>
        <div class="card-section"><strong>Заметки:</strong> ${m.notes || "-"}</div>
        <button class="btn-danger" onclick="deleteMedia('${m.id}')">Удалить</button>
      </div>
    `).join("");
  }

  document.getElementById("media-add").onclick = async () => {
    const title = document.getElementById("media-title").value.trim();
    const type = document.getElementById("media-type").value;
    const status = document.getElementById("media-status").value;
    const notes = document.getElementById("media-notes").value.trim();

    if (!title) return;

    mediaData.push({
      id: Date.now().toString(),
      title,
      type,
      status,
      notes
    });

    await apiSave("media", mediaData);
    renderList();
  };

  document.getElementById("media-filter-apply").onclick = renderList;

  renderList();
}

window.deleteMedia = async (id) => {
  mediaData = mediaData.filter(m => m.id !== id);
  await apiSave("media", mediaData);
  renderMedia();
};

async function initMedia() {
  mediaData = await apiGet("media");
  renderMedia();
}

document.addEventListener("DOMContentLoaded", initMedia);
