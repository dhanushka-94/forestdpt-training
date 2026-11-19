import { promises as fs } from "fs";
import path from "path";
import { list, put } from "@vercel/blob";
import type { Submission } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "submissions.json");
const BLOB_PATH = "submissions.json";

function useBlobStore() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID,
  );
}

async function ensureLocalStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf8");
  }
}

async function getLocalSubmissions(): Promise<Submission[]> {
  await ensureLocalStore();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw) as Submission[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function saveLocalSubmissions(submissions: Submission[]) {
  await ensureLocalStore();
  await fs.writeFile(DATA_FILE, JSON.stringify(submissions, null, 2), "utf8");
}

async function getBlobSubmissions(): Promise<Submission[]> {
  const { blobs } = await list({ prefix: BLOB_PATH });
  const match = blobs.find((blob) => blob.pathname === BLOB_PATH);
  if (!match) return [];

  const response = await fetch(match.url, { cache: "no-store" });
  if (!response.ok) return [];

  try {
    const parsed = (await response.json()) as Submission[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function saveBlobSubmissions(submissions: Submission[]) {
  await put(BLOB_PATH, JSON.stringify(submissions), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function getSubmissions(): Promise<Submission[]> {
  if (useBlobStore()) {
    return getBlobSubmissions();
  }
  return getLocalSubmissions();
}

export async function addSubmission(
  submission: Submission,
): Promise<Submission> {
  const submissions = await getSubmissions();
  submissions.unshift(submission);

  if (useBlobStore()) {
    await saveBlobSubmissions(submissions);
  } else {
    await saveLocalSubmissions(submissions);
  }

  return submission;
}

export async function clearSubmissions(): Promise<void> {
  if (useBlobStore()) {
    await saveBlobSubmissions([]);
    return;
  }
  await saveLocalSubmissions([]);
}
