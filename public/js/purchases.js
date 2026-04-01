let purchasesData = [];
let purchaseRates = {
  usd: 90,
  eur: 100
};

function renderPurchases() {
  const rates = document.getElementById("purchases-rates");
  const form = document.getElementById("purchases-form");
  const list = document.getElementById("purchases-list");

  rates.innerHTML = `
    <div class="form-block">
      <h3>Курсы валют</h3>
      <label>USD → RUB</label>
      <input id="rate-usd" type="number" value="${purchaseRates.usd}" />
      <label>EUR → RUB</label>
      <input id="rate-eur" type="number" value="${purchaseRates.eur}" />
      <button class="btn" id="save-rates">Сохранить</button>
    </div>
  `;

  form.innerHTML = `
    <div class="form-block">
      <h3>Добавить покупку</h3>
      <input id="purchase-title" placeholder="Название" />
      <input id="purchase-price" type="number" placeholder="Цена" />
      <select id="purchase-currency">
        <option>RUB</option>
        <option>USD</option>
        <option>EUR</option>
      </select>
      <textarea id="purchase-notes" placeholder="Заметки"></textarea>
      <button class="btn" id="purchase-add">Добавить</button>
    </div>
  `;

  function convert(price, currency) {
    if (currency === "RUB") return price;
    if (currency === "USD") return price * purchaseRates.usd;
    if (currency === "EUR") return price * purchaseRates.eur;
    return price;
  }

  function renderList() {
    list.innerHTML = purchasesData.map(p => `
      <div class="card">
        <div class="card-title">${p.title}</div>
        <div class="card-section"><strong>Цена:</strong> ${p.price} ${p.currency}</div>
        <div class="card-section"><strong>В рублях:</strong> ${convert(p.price, p.currency)}</div>
        <div class="card-section"><strong>Заметки:</strong> ${p.notes || "-"}</div>
        <button class="btn-danger" onclick="deletePurchase('${p.id}')">Удалить</button>
      </div>
    `).join("");
  }

  document.getElementById("save-rates").onclick = async () => {
    purchaseRates.usd = Number(document.getElementById("rate-usd").value);
    purchaseRates.eur = Number(document.getElementById("rate-eur").value);

    await apiSave("purchases", purchasesData);
    await apiSave("dicts", { ...dictsData, purchaseRates });

    renderList();
  };

  document.getElementById("purchase-add").onclick = async () => {
    const title = document.getElementById("purchase-title").value.trim();
    const price = Number(document.getElementById("purchase-price").value);
    const currency = document.getElementById("purchase-currency").value;
    const notes = document.getElementById("purchase-notes").value.trim();

    if (!title || !price) return;

    purchasesData.push({
      id: Date.now().toString(),
      title,
      price,
      currency,
      notes
    });

    await apiSave("purchases", purchasesData);
    renderList();
  };

  renderList();
}

window.deletePurchase = async (id) => {
  purchasesData = purchasesData.filter(p => p.id !== id);
  await apiSave("purchases", purchasesData);
  renderPurchases();
};

async function initPurchases() {
  purchasesData = await apiGet("purchases");
  const dicts = await apiGet("dicts");

  if (dicts.purchaseRates) {
    purchaseRates = dicts.purchaseRates;
  }

  renderPurchases();
}

document.addEventListener("DOMContentLoaded", initPurchases);

