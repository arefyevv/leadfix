import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const python = process.env.CODEX_PYTHON || "C:\\Users\\Viktor\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe";
const root = process.cwd();
const source = path.join(root, "..", "CRO", "2. Сriteria v1.xlsx");
const target = path.join(root, "src", "lib", "audit", "criteria.csv");

mkdirSync(path.dirname(target), { recursive: true });

const script = `
import csv
import openpyxl
from pathlib import Path

source = Path(r"""${source}""")
target = Path(r"""${target}""")

wb = openpyxl.load_workbook(source, read_only=True, data_only=True)
ws = wb["Критерии"]
rows = []
for row in ws.iter_rows(values_only=True):
    values = ["" if value is None else value for value in row]
    if any(str(value).strip() for value in values):
        rows.append(values)

with target.open("w", encoding="utf-8-sig", newline="") as file:
    writer = csv.writer(file, delimiter=";", quotechar='"', quoting=csv.QUOTE_ALL)
    writer.writerows(rows)

print(f"Exported {len(rows) - 1} criteria to {target}")
`;

const result = spawnSync(python, ["-c", script], {
  cwd: root,
  encoding: "utf8"
});

if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
if (result.status !== 0) process.exit(result.status ?? 1);
