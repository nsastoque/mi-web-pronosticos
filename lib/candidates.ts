export function buildCandidatesFromOdds(oddsEvents: any[]) {
  const candidates: any[] = [];

  for (const event of oddsEvents) {
    const bookmaker = event.bookmakers?.[0];
    const market = bookmaker?.markets?.find((m: any) => m.key === "h2h");

    if (!market) continue;

    const outcomes = market.outcomes || [];
    if (outcomes.length < 2) continue;

    for (const outcome of outcomes) {
      const odd = outcome.price;

      // filtro más flexible
      if (!odd || odd < 1.20 || odd > 3.5) continue;

      candidates.push({
        sportKey: event.sport_key,
        match: `${event.home_team} vs ${event.away_team}`,
        homeTeam: event.home_team,
        awayTeam: event.away_team,
        market: "Ganador",
        pick: outcome.name,
        odd,
        commenceTime: event.commence_time,
        bookmaker: bookmaker?.title || null,
      });
    }
  }

  return candidates;
}