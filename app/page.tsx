import { headers } from "next/headers";
import predictions from "./data/predictions.json";

export const dynamic = "force-dynamic";

async function getMatches() {
  try {
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https";

    const res = await fetch(`${protocol}://${host}/api/matches/today`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Error cargando partidos:", res.status);
      return { response: [] };
    }

    return res.json();
  } catch (error) {
    console.error("Error general:", error);
    return { response: [] };
  }
}

function normalizeMatchName(name: string) {
  return name.toLowerCase().replace(/\s+/g, " ").trim();
}

function didPredictionWin(match: any, prediction: any) {
  const status = match?.fixture?.status?.short;
  const isFinished = status === "FT" || status === "AET" || status === "PEN";

  if (!isFinished) return false;

  const home = match?.teams?.home?.name;
  const away = match?.teams?.away?.name;
  const homeGoals = match?.goals?.home ?? 0;
  const awayGoals = match?.goals?.away ?? 0;

  const market = prediction?.market?.toLowerCase?.() || "";
  const pick = prediction?.pick?.toLowerCase?.() || "";

  if (market.includes("ganador")) {
    if (pick === home?.toLowerCase() && homeGoals > awayGoals) return true;
    if (pick === away?.toLowerCase() && awayGoals > homeGoals) return true;
    return false;
  }

  if (market.includes("over 1.5")) {
    return homeGoals + awayGoals > 1.5;
  }

  if (market.includes("over 2.5")) {
    return homeGoals + awayGoals > 2.5;
  }

  if (market.includes("under 3.5")) {
    return homeGoals + awayGoals < 3.5;
  }

  if (market.includes("btts") || pick.includes("ambos marcan")) {
    return homeGoals > 0 && awayGoals > 0;
  }

  return false;
}

export default async function Home() {
  const data = await getMatches();
  const matches = data.response || [];

  const predictedMatches = matches
    .map((match: any) => {
      const matchName = `${match.teams.home.name} vs ${match.teams.away.name}`;

      const prediction = predictions.find(
        (item: any) =>
          normalizeMatchName(item.match) === normalizeMatchName(matchName)
      );

      if (!prediction) return null;

      return {
        match,
        prediction,
        won: didPredictionWin(match, prediction),
      };
    })
    .filter(Boolean) as any[];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f5f7",
        color: "#1d1d1f",
        padding: "40px 24px 80px",
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Arial, sans-serif',
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <p
            style={{
              fontSize: "12px",
              letterSpacing: "0.2em",
              color: "#8c8c8c",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Hoy
          </p>

          <h1
            style={{
              fontSize: "64px",
              lineHeight: 1.05,
              margin: 0,
              color: "#1d1d1f",
              fontWeight: 600,
            }}
          >
            Pronósticos de hoy
          </h1>

          <p
            style={{
              marginTop: "18px",
              fontSize: "22px",
              color: "#6e6e73",
            }}
          >
            Una selección más cuidada. Solo las opciones más sólidas del día.
          </p>
        </div>

        {predictedMatches.length === 0 ? (
          <div
            style={{
              background: "#fff",
              borderRadius: "28px",
              padding: "48px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "34px",
                color: "#1d1d1f",
              }}
            >
              Sin pronósticos por ahora
            </h2>
            <p
              style={{
                marginTop: "12px",
                color: "#6e6e73",
                fontSize: "18px",
              }}
            >
              Vuelve más tarde. El análisis del día aún no ha sido generado.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            {predictedMatches.map(({ match, prediction, won }) => {
              const finished =
                match?.fixture?.status?.short === "FT" ||
                match?.fixture?.status?.short === "AET" ||
                match?.fixture?.status?.short === "PEN";

              return (
                <div
                  key={match.fixture.id}
                  style={{
                    background: won ? "#eefbf2" : "#fff",
                    borderRadius: "28px",
                    padding: "28px",
                    boxShadow: won
                      ? "0 8px 30px rgba(34,197,94,0.10)"
                      : "0 8px 30px rgba(0,0,0,0.04)",
                    border: won
                      ? "1px solid rgba(34,197,94,0.22)"
                      : "1px solid rgba(0,0,0,0.04)",
                    transition: "all 0.25s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "14px",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        letterSpacing: "0.08em",
                        color: "#8c8c8c",
                        textTransform: "uppercase",
                      }}
                    >
                      {match.league.name}
                    </p>

                    {won && (
                      <span
                        style={{
                          background: "#22c55e",
                          color: "#fff",
                          padding: "8px 12px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: 600,
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                        }}
                      >
                        Acertado
                      </span>
                    )}
                  </div>

                  <h2
                    style={{
                      marginTop: 0,
                      marginBottom: "10px",
                      fontSize: "34px",
                      lineHeight: 1.15,
                      color: "#1d1d1f",
                    }}
                  >
                    {match.teams.home.name} vs {match.teams.away.name}
                  </h2>

                  <p
                    style={{
                      margin: 0,
                      color: "#6e6e73",
                      fontSize: "16px",
                    }}
                  >
                    Estado: {match.fixture.status.long}
                  </p>

                  <p
                    style={{
                      marginTop: "12px",
                      marginBottom: "20px",
                      fontSize: "18px",
                      color: "#333",
                    }}
                  >
                    <strong>Marcador:</strong> {match.goals.home ?? 0} -{" "}
                    {match.goals.away ?? 0}
                  </p>

                  <div
                    style={{
                      marginTop: "18px",
                      padding: "18px",
                      borderRadius: "20px",
                      background: won ? "rgba(34,197,94,0.06)" : "#fafafa",
                      border: won
                        ? "1px solid rgba(34,197,94,0.16)"
                        : "1px solid rgba(0,0,0,0.05)",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        letterSpacing: "0.08em",
                        color: "#8c8c8c",
                        textTransform: "uppercase",
                      }}
                    >
                      Pronóstico
                    </p>

                    <p
                      style={{
                        marginTop: "10px",
                        marginBottom: "8px",
                        fontSize: "20px",
                        color: "#1d1d1f",
                      }}
                    >
                      <strong>{prediction.pick}</strong>
                    </p>

                    <div
                      style={{
                        display: "flex",
                        gap: "18px",
                        flexWrap: "wrap",
                        marginBottom: "10px",
                      }}
                    >
                      <p style={{ margin: 0, color: "#6e6e73" }}>
                        <strong>Mercado:</strong> {prediction.market}
                      </p>
                      <p style={{ margin: 0, color: "#6e6e73" }}>
                        <strong>Cuota:</strong> {prediction.odd}
                      </p>
                      <p style={{ margin: 0, color: "#6e6e73" }}>
                        <strong>Confianza:</strong> {prediction.confidence}
                      </p>
                    </div>

                    <p
                      style={{
                        margin: 0,
                        color: "#6e6e73",
                        lineHeight: 1.6,
                        fontSize: "15px",
                      }}
                    >
                      {prediction.short_reason}
                    </p>

                    {finished && !won && (
                      <p
                        style={{
                          marginTop: "12px",
                          marginBottom: 0,
                          fontSize: "14px",
                          color: "#b45309",
                          fontWeight: 600,
                        }}
                      >
                        Pronóstico no cumplido
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}