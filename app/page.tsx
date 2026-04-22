import { headers } from "next/headers";

async function getMatches() {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";

  const res = await fetch(`${protocol}://${host}/api/matches/today`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("No se pudieron cargar los partidos");
  }

  return res.json();
}

export default async function Home() {
  const data = await getMatches();
  const matches = data.response || [];

  return (
    <main style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1>Partidos de hoy</h1>

      {matches.length === 0 ? (
        <p>No hay partidos disponibles.</p>
      ) : (
        <div style={{ display: "grid", gap: "16px", marginTop: "20px" }}>
          {matches.slice(0, 20).map((match: any) => (
            <div
              key={match.fixture.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "12px",
                padding: "16px",
                background: "#fff",
                color: "#000",
              }}
            >
              <p><strong>Liga:</strong> {match.league.name}</p>
              <p>
                <strong>Partido:</strong> {match.teams.home.name} vs {match.teams.away.name}
              </p>
              <p><strong>Estado:</strong> {match.fixture.status.long}</p>
              <p>
                <strong>Marcador:</strong> {match.goals.home ?? 0} - {match.goals.away ?? 0}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}