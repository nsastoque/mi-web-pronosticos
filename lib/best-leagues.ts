import { getSportsList, getSoccerOddsBySportKey } from "@/lib/odds-api";

function scoreLeagueFromOdds(events: any[]) {
  let score = 0;

  // cantidad de partidos
  score += events.length * 3;

  for (const event of events) {
    const bookmakers = event.bookmakers || [];

    // más bookmakers = mejor señal
    score += Math.min(bookmakers.length, 5);

    const bookmaker = bookmakers[0];
    const market = bookmaker?.markets?.find((m: any) => m.key === "h2h");

    if (!market) continue;

    const outcomes = market.outcomes || [];

    for (const outcome of outcomes) {
      const odd = outcome.price;

      if (odd >= 1.35 && odd <= 2.2) {
        score += 2;
      }

      if (odd >= 1.45 && odd <= 1.9) {
        score += 3;
      }
    }
  }

  return score;
}

export async function detectBestLeaguesOfTheDay() {
  try {
    const sports = await getSportsList();

    const soccerSports = sports.filter(
      (sport: any) =>
        sport.key?.startsWith("soccer_") &&
        sport.active === true
    );

    const leagueResults = await Promise.all(
      soccerSports.map(async (sport: any) => {
        const odds = await getSoccerOddsBySportKey(sport.key);
        const score = scoreLeagueFromOdds(odds);

        return {
          key: sport.key,
          title: sport.title,
          description: sport.description,
          matchesCount: odds.length,
          score,
        };
      })
    );

    const filtered = leagueResults.filter(
      (league: any) => league.matchesCount > 0
    );

    filtered.sort((a: any, b: any) => b.score - a.score);

    return filtered.slice(0, 10);
  } catch (error) {
    console.error("Error detectando mejores ligas:", error);
    return [];
  }
}