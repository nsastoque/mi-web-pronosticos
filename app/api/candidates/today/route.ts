import { detectBestLeaguesOfTheDay } from "@/lib/best-leagues";
import { getSoccerOddsBySportKey } from "@/lib/odds-api";
import { buildCandidatesFromOdds } from "@/lib/candidates";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const bestLeagues = await detectBestLeaguesOfTheDay();

    // solo top 5 ligas para no explotar requests
    const selectedLeagues = bestLeagues.slice(0, 5);

    const allOdds = await Promise.all(
      selectedLeagues.map((league: any) =>
        getSoccerOddsBySportKey(league.key)
      )
    );

    const flatOdds = allOdds.flat();
    const candidates = buildCandidatesFromOdds(flatOdds);

    return Response.json(candidates.slice(0, 30));
  } catch (error) {
    console.error("Error generando candidatos:", error);
    return Response.json([], { status: 200 });
  }
}