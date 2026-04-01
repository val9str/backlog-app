import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;

const __dirname = path.resolve();
const dataDir = path.join(__dirname, "backlog-app", "data");

app.use(express.json());
app.use(express.static(path.join(__dirname, "backlog-app", "public")));

function load(name) {
  const file = path.join(dataDir, `${name}.json`);
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function save(name, data) {
  const file = path.join(dataDir, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
}

app.get("/api/:name", (req, res) => {
  try {
    res.json(load(req.params.name));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/:name", (req, res) => {
  try {
    save(req.params.name, req.body);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backlog App запущен: http://localhost:${PORT}`);
});
