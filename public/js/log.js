let logData = [];

function renderLog() {
  const list = document.getElementById("log-list");

  list.innerHTML = logData
    .map(l => `
      <div class="card">
        <div class="card-title">${l.action}</div>
        <div class="card-section"><strong>Дата:</strong> ${new Date(l.time).toLocaleString()}</div>
      </div>
    `)
    .join("");
}

async function initLog() {
  logData = await apiGet("log");
  renderLog();
}

document.addEventListener("DOMContentLoaded", initLog);

