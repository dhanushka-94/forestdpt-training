import { promises as fs } from "fs";
import path from "path";
import type { Submission } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "submissions.json");

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf8");
  }
}

export async function getSubmissions(): Promise<Submission[]> {
  await ensureStore();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw) as Submission[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function addSubmission(
  submission: Submission,
): Promise<Submission> {
  const submissions = await getSubmissions();
  submissions.unshift(submission);
  await fs.writeFile(DATA_FILE, JSON.stringify(submissions, null, 2), "utf8");
  return submission;
}

export async function clearSubmissions(): Promise<void> {
  await ensureStore();
  await fs.writeFile(DATA_FILE, "[]", "utf8");
}
