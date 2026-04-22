// app/page.tsx
// Server Component — "Partidos de hoy"
// Estética inspirada en Apple: minimalismo, jerarquía tipográfica y quietud visual.

import type { CSSProperties } from "react";

export const dynamic = "force-dynamic";

// ---------- Tipos ----------

type Team = {
  name: string;
  logo?: string;
};

type Match = {
  fixture: {
    id: number;
    date?: string;
    status: {
      long: string;
      short?: string;
      elapsed?: number | null;
    };
  };
  league: {
    name: string;
    country?: string;
    logo?: string;
  };
  teams: {
    home: Team;
    away: Team;
  };
  goals: {
    home: number | null;
    away: number | null;
  };
};

// ---------- Data fetching ----------

async function getMatches(): Promise<Match[]> {
  try {
    const res = await fetch("http://localhost:3000/api/matches/today", {
      cache: "no-store",
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data?.response || [];
  } catch {
    return [];
  }
}

// ---------- Página ----------

export default async function Page() {
  const all = await getMatches();
  const matches = all.slice(0, 20);

  return (
    <main style={styles.page}>
      <InlineStyles />

      <div style={styles.container}>
        <section style={styles.hero}>
          <p style={styles.eyebrow}>Hoy</p>
          <h1 style={styles.title}>Partidos de hoy</h1>
          <p style={styles.subtitle}>
            Una lectura serena de la jornada. Todos los encuentros del día, en un solo lugar.
          </p>
        </section>

        {matches.length === 0 ? (
          <EmptyState />
        ) : (
          <section style={styles.grid}>
            {matches.map((match) => (
              <MatchCard key={match.fixture.id} match={match} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

// ---------- Componentes ----------

function MatchCard({ match }: { match: Match }) {
  const { fixture, league, teams, goals } = match;

  const statusLong = fixture?.status?.long || "—";
  const short = (fixture?.status?.short || "").toUpperCase();

  const liveCodes = ["1H", "2H", "HT", "ET", "BT", "P", "LIVE"];
  const finishedCodes = ["FT", "AET", "PEN"];

  const isLive = liveCodes.includes(short);
  const isFinished = finishedCodes.includes(short);

  const hasScore =
    goals?.home !== null &&
    goals?.away !== null &&
    goals?.home !== undefined &&
    goals?.away !== undefined;

  return (
    <article className="match-card" style={styles.card}>
      <header style={styles.cardHeader}>
        <span style={styles.league}>
          {league?.name}
          {league?.country ? ` · ${league.country}` : ""}
        </span>

        {isLive && (
          <span style={styles.liveBadge}>
            <span style={styles.liveDot} />
            En vivo
          </span>
        )}

        {!isLive && isFinished && <span style={styles.finishedBadge}>Final</span>}
      </header>

      <div style={styles.teams}>
        <div style={styles.teamRow}>
          <span style={styles.teamName}>{teams?.home?.name}</span>
          <span style={styles.score}>{hasScore ? goals.home : "—"}</span>
        </div>
        <div style={styles.teamRow}>
          <span style={styles.teamName}>{teams?.away?.name}</span>
          <span style={styles.score}>{hasScore ? goals.away : "—"}</span>
        </div>
      </div>

      <footer style={styles.cardFooter}>
        <span style={styles.status}>{statusLong}</span>
      </footer>
    </article>
  );
}

function EmptyState() {
  return (
    <div style={styles.empty}>
      <p style={styles.emptyTitle}>Sin partidos por ahora</p>
      <p style={styles.emptyText}>
        Vuelve en unos minutos. La jornada aún no comienza.
      </p>
    </div>
  );
}

function InlineStyles() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          html, body {
            margin: 0;
            padding: 0;
            background: #fbfbfd;
          }
          *, *::before, *::after { box-sizing: border-box; }

          .match-card {
            will-change: transform;
          }
          .match-card:hover {
            transform: translateY(-2px);
            box-shadow:
              0 1px 2px rgba(0, 0, 0, 0.04),
              0 18px 40px rgba(0, 0, 0, 0.08) !important;
          }

          @media (max-width: 640px) {
            .fo-container { padding: 64px 20px 80px !important; }
            .fo-hero     { margin-bottom: 48px !important; }
          }
        `,
      }}
    />
  );
}

// ---------- Estilos ----------

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#fbfbfd",
    color: "#1d1d1f",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Inter, "Segoe UI", Arial, sans-serif',
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  },
  container: {
    maxWidth: "1120px",
    margin: "0 auto",
    padding: "96px 24px 120px",
  },
  hero: {
    textAlign: "center",
    marginBottom: "72px",
  },
  eyebrow: {
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: "0.14em",
    color: "#86868b",
    textTransform: "uppercase",
    margin: "0 0 18px",
  },
  title: {
    fontSize: "clamp(44px, 7vw, 72px)",
    fontWeight: 600,
    letterSpacing: "-0.035em",
    lineHeight: 1.05,
    margin: 0,
    color: "#1d1d1f",
  },
  subtitle: {
    marginTop: "20px",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: "620px",
    fontSize: "clamp(17px, 1.6vw, 21px)",
    fontWeight: 400,
    lineHeight: 1.45,
    color: "#6e6e73",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "22px",
    padding: "28px 28px 24px",
    boxShadow:
      "0 1px 2px rgba(0, 0, 0, 0.03), 0 10px 28px rgba(0, 0, 0, 0.045)",
    border: "1px solid rgba(0, 0, 0, 0.04)",
    transition:
      "transform 240ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 240ms ease",
    display: "flex",
    flexDirection: "column",
    gap: "22px",
    minHeight: "200px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },
  league: {
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: "0.01em",
    color: "#86868b",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    flex: 1,
    minWidth: 0,
  },
  liveBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    fontWeight: 600,
    color: "#d70015",
    backgroundColor: "rgba(255, 59, 48, 0.08)",
    padding: "4px 10px",
    borderRadius: "999px",
    letterSpacing: "0.02em",
    whiteSpace: "nowrap",
  },
  liveDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#ff3b30",
    display: "inline-block",
  },
  finishedBadge: {
    fontSize: "12px",
    fontWeight: 500,
    color: "#86868b",
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    padding: "4px 10px",
    borderRadius: "999px",
    letterSpacing: "0.02em",
    whiteSpace: "nowrap",
  },
  teams: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  teamRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: "16px",
  },
  teamName: {
    fontSize: "19px",
    fontWeight: 500,
    color: "#1d1d1f",
    letterSpacing: "-0.01em",
    lineHeight: 1.25,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    flex: 1,
    minWidth: 0,
  },
  score: {
    fontSize: "26px",
    fontWeight: 600,
    color: "#1d1d1f",
    letterSpacing: "-0.02em",
    fontVariantNumeric: "tabular-nums",
    minWidth: "28px",
    textAlign: "right",
  },
  cardFooter: {
    borderTop: "1px solid rgba(0, 0, 0, 0.06)",
    paddingTop: "16px",
    marginTop: "auto",
  },
  status: {
    fontSize: "13px",
    color: "#86868b",
    fontWeight: 400,
  },
  empty: {
    textAlign: "center",
    padding: "88px 24px",
    backgroundColor: "#ffffff",
    borderRadius: "22px",
    border: "1px solid rgba(0, 0, 0, 0.04)",
    boxShadow:
      "0 1px 2px rgba(0, 0, 0, 0.03), 0 10px 28px rgba(0, 0, 0, 0.035)",
  },
  emptyTitle: {
    fontSize: "24px",
    fontWeight: 600,
    color: "#1d1d1f",
    margin: 0,
    letterSpacing: "-0.02em",
  },
  emptyText: {
    marginTop: "10px",
    fontSize: "16px",
    color: "#86868b",
    margin: "10px 0 0",
  },
};
