import { getMatchesToday } from "@/lib/api-football";

export async function GET() {
  try {
    const data = await getMatchesToday();
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { ok: false, error: "No se pudieron obtener los partidos" },
      { status: 500 }
    );
  }
}