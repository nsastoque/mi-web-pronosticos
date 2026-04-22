import { detectBestLeaguesOfTheDay } from "@/lib/best-leagues";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await detectBestLeaguesOfTheDay();
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { ok: false, error: "No se pudieron detectar las mejores ligas del día" },
      { status: 500 }
    );
  }
}