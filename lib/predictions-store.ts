import { put, list } from "@vercel/blob";

const BLOB_PATH = "predictions/today.json";

export async function savePredictionsToBlob(data: unknown) {
  const body = JSON.stringify(data, null, 2);

  await put(BLOB_PATH, body, {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
    allowOverwrite: true,
  });
}

export async function getPredictionsFromBlob() {
  const { blobs } = await list({ prefix: BLOB_PATH });

  const file = blobs.find((b) => b.pathname === BLOB_PATH);
  if (!file) return [];

  const res = await fetch(file.url, { cache: "no-store" });
  if (!res.ok) return [];

  return res.json();
}