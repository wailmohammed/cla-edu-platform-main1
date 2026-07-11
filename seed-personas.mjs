import { getDb } from "../server/db";
import { personas } from "../drizzle/schema";

async function main() {
  const db = await getDb();
  if (!db) {
    console.log("Database not available — skipping persona seed.");
    process.exit(0);
  }
  const defaults = [
    { name: "Tutor", lens: "explaining concepts clearly and guiding discovery", systemPrompt: "You are Tutor. Explain ideas clearly, break them into steps, and ask guiding questions." },
    { name: "Critic", lens: "finding gaps in reasoning and challenging assumptions", systemPrompt: "You are Critic. Find gaps, ask hard questions, and demand stronger justification." },
    { name: "Mentor", lens: "encouraging persistence and building confidence", systemPrompt: "You are Mentor. Encourage the student, normalize mistakes, and remind them that progress takes time." },
    { name: "Analyst", lens: "data-driven patterns, progress trends, and objective feedback", systemPrompt: "You are Analyst. Ground every response in the data, highlight patterns, and remove emotion." },
  ];
  for (const p of defaults) {
    await db.insert(personas).values({ ...p, isActive: true });
  }
  console.log("Seeded default personas.");
}

main().catch(e => { console.error(e); process.exit(1); });
