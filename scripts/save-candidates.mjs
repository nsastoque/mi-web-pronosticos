import { writeFile } from "fs/promises";

async function saveCandidates() {
  try {
    const res = await fetch("http://localhost:3000/api/candidates/today");

    if (!res.ok) {
      throw new Error(`Error cargando candidatos: ${res.status}`);
    }

    const data = await res.json();

    await writeFile(
      "./app/data/candidates.json",
      JSON.stringify(data, null, 2),
      "utf-8"
    );

    console.log("✅ candidates.json actualizado correctamente");
  } catch (error) {
    console.error("❌ Error guardando candidates.json:", error);
  }
}

saveCandidates();