export async function getMatchesToday() {
  const today = new Date().toISOString().split("T")[0];

  const res = await fetch(
    `https://v3.football.api-sports.io/fixtures?next=20,
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