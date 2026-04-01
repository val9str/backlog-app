async function apiGet(name) {
  const res = await fetch(`/api/${name}`);
  return await res.json();
}

async function apiSave(name, data) {
  await fetch(`/api/${name}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

