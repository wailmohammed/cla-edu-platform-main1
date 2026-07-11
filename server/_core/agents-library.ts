import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface AgentInfo {
  id: string;
  name: string;
  description: string;
  emoji: string;
  division: string;
  body: string;
}

function resolveLibraryDir(): string {
  const here = path.dirname(fileURLToPath(import.meta.url)); // server/_core
  const candidates = [
    path.resolve(process.cwd(), "server/agents-library"),
    path.resolve(here, "..", "agents-library"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return candidates[0];
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const text = raw.trimStart();
  if (!text.startsWith("---")) return { data: {}, body: raw };
  const end = text.indexOf("\n---", 3);
  if (end === -1) return { data: {}, body: raw };
  const fm = text.slice(3, end).trim();
  const body = text.slice(end + 4).trim();
  const data: Record<string, string> = {};
  for (const line of fm.split("\n")) {
    const m = line.match(/^([A-Za-z0-9_-]+):\s?(.*)$/);
    if (m) data[m[1].toLowerCase()] = m[2].trim();
  }
  return { data, body };
}

let cache: AgentInfo[] | null = null;

export function listAgents(): AgentInfo[] {
  if (cache) return cache;
  const dir = resolveLibraryDir();
  const out: AgentInfo[] = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const divisionDir = path.join(dir, entry.name);
    for (const file of fs.readdirSync(divisionDir)) {
      if (!file.endsWith(".md")) continue;
      const raw = fs.readFileSync(path.join(divisionDir, file), "utf8");
      const { data, body } = parseFrontmatter(raw);
      if (!data.name) continue;
      out.push({
        id: slugify(data.name),
        name: data.name,
        description: data.description || "",
        emoji: data.emoji || "🤖",
        division: entry.name,
        body,
      });
    }
  }
  out.sort((a, b) => a.name.localeCompare(b.name));
  cache = out;
  return out;
}

export function getAgent(id: string): AgentInfo | undefined {
  return listAgents().find((a) => a.id === id);
}
