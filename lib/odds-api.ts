export async function getSportsList() {
  try {
    const res = await fetch(
      `https://api.the-odds-api.com/v4/sports?apiKey=${process.env.ODDS_API_KEY}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error("The Odds API error:", res.status);
      return [];
    }

    return res.json();
  } catch (error) {
    console.error("Error consultando The Odds API:", error);
    return [];
  }
}

export async function getSoccerOddsBySportKey(sportKey: string) {
  try {
    const res = await fetch(
      `https://api.the-odds-api.com/v4/sports/${sportKey}/odds?apiKey=${process.env.ODDS_API_KEY}&regions=eu&markets=h2h&oddsFormat=decimal`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error(`Error odds para ${sportKey}:`, res.status);
      return [];
    }

    return res.json();
  } catch (error) {
    console.error(`Error consultando odds para ${sportKey}:`, error);
    return [];
  }
}