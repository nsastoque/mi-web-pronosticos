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

export async function getMatchesToday() {
  const today = new Date().toISOString().split("T")[0];

  const res = await fetch(
    `https://v3.football.api-sports.io/fixtures?date=${today}`,
    {
      method: "GET",
      headers: {
        "x-apisports-key": process.env.API_FOOTBALL_KEY!,
        Accept: "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Error de API-Football: ${res.status}`);
  }

  return res.json();
}