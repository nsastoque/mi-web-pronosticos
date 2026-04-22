export async function getMatchesToday() {
  const today = new Date().toISOString().split("T")[0];

  try {
    const res = await fetch(
      `https://v3.football.api-sports.io/fixtures?date=${today}`,
      {
        method: "GET",
        headers: {
          "x-apisports-key": process.env.API_FOOTBALL_KEY || "",
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error("API-Football error:", res.status);
      return { response: [] };
    }

    return res.json();
  } catch (error) {
    console.error("Error consultando API-Football:", error);
    return { response: [] };
  }
}