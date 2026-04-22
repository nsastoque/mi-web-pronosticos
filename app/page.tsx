// app/page.tsx
// Server Component — "Partidos de hoy"
// Estética inspirada en Apple (light). La lógica de datos queda intacta.

import type { CSSProperties } from "react";
import { headers } from "next/headers";

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

// ---------- Data fetching (INTACTO) ----------

async function getMatches(): Promise<Match[]> {
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
    const forwardedProto = h.get("x-forwarded-proto");
    const isLocal = host.includes("localhost") || host.startsWith("127.");
    const protocol = forwardedProto || (isLocal ? "http" : "https");

    const url = `${protocol}://${host}/api/matches/today`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];

    const data = await res.json();
    return data?.response || [];
  } catch {
    return [];
  }
}

// ---------- Página ----------

export default async function Home() {
  const all = await getMatches();
  const matches = all.slice(0, 12);

  const today = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <main style={styles.page}>
      <InlineStyles />

      <div style={styles.container}>
        <section style={styles.hero}>
          <p style={styles.eyebrow}>HOY · {capitalize(today)}</p>
          <h1 style={styles.title}>Partidos de hoy</h1>
          <p style={styles.subtitle}>
            Una lectura serena de la jornada. Todos los encuentros del día, en un solo lugar.
          </p>

          {matches.length > 0 && (
            <div style={styles.heroMeta}>
              <span style={styles.heroCount}>{matches.length}</span>
              <span style={styles.heroCountLabel}>
                {matches.length === 1 ? "partido en agenda" : "partidos en agenda"}
              </span>
            </div>
          )}
        </section>

        <div style={styles.divider} />

        {matches.length === 0 ? (
          <EmptyState />
        ) : (
          <section style={styles.grid}>
            {matches.map((match) => (
              <MatchCard key={match.fixture.id} match={match} />
            ))}
          </section>
        )}

        <footer style={styles.footer}>
          <span style={styles.footerText}>
            Fórmula Once · El partido se lee antes de jugarse
          </span>
        </footer>
      </div>
    </main>
  );
}

function MatchCard({ match }: { match: Match }) {
  const { fixture, league, teams, goals } = match;

  const statusLong = fixture?.status?.long || "—";
  const short = (fixture?.status?.short || "").toUpperCase();

  const liveCodes = ["1H", "2H", "HT", "ET", "BT", "P", "LIVE"];
  const finishedCodes = ["FT", "AET", "PEN"];

  const isLive = liveCodes.includes(short);
  const isFinished = finishedCodes.includes(short);
  const isScheduled = !isLive && !isFinished;

  const hasScore =
    goals?.home !== null &&
    goals?.away !== null &&
    goals?.home !== undefined &&
    goals?.away !== undefined;

  const kickoff =
    isScheduled && fixture?.date
      ? new Intl.DateTimeFormat("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(fixture.date))
      : null;

  return (
    <article className="match-card" style={styles.card}>
      <header style={styles.cardHeader}>
        <span style={styles.league}>
          {league?.name}
          {league?.country ? ` · ${league.country}` : ""}
        </span>

        {isLive && (
          <span style={styles.liveBadge}>
            <span className="live-dot" style={styles.liveDot} />
            En vivo
          </span>
        )}

        {!isLive && isFinished && <span style={styles.finishedBadge}>Final</span>}

        {isScheduled && kickoff && <span style={styles.timeBadge}>{kickoff}</span>}
      </header>

      <div style={styles.cardRule} />

      <div style={styles.teams}>
        <div style={styles.teamRow}>
          <span style={styles.teamDot} />
          <span style={styles.teamName}>{teams?.home?.name}</span>
          <span style={styles.score}>{hasScore ? goals.home : "—"}</span>
        </div>
        <div style={styles.teamRow}>
          <span style={{ ...styles.teamDot, opacity: 0.45 }} />
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
      <div style={styles.emptyIcon} aria-hidden>
        <div style={styles.emptyIconInner} />
      </div>
      <p style={styles.emptyTitle}>Sin partidos por ahora</p>
      <p style={styles.emptyText}>
        Vuelve en unos minutos. La jornada aún no comienza.
      </p>
    </div>
  );
}

function capitalize(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
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
            color: #1d1d1f;
          }
          *, *::before, *::after { box-sizing: border-box; }

          .match-card { will-change: transform; }
          .match-card:hover {
            transform: translateY(-2px);
            border-color: rgba(0, 0, 0, 0.08) !important;
            box-shadow:
              0 1px 2px rgba(0, 0, 0, 0.04),
              0 22px 48px rgba(0, 0, 0, 0.08) !important;
          }

          @keyframes livePulse {
            0%, 100% { opacity: 1;   transform: scale(1); }
            50%      { opacity: 0.5; transform: scale(0.85); }
          }
          .live-dot { animation: livePulse 1.6s ease-in-out infinite; }
        `,
      }}
    />
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(1200px 500px at 50% -5%, rgba(0, 0, 0, 0.035), transparent 60%), #fbfbfd",
    color: "#1d1d1f",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Inter, "Segoe UI", Arial, sans-serif',
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  },
  container: { maxWidth: "1120px", margin: "0 auto", padding: "104px 24px 120px" },

  hero: { textAlign: "center", marginBottom: "48px" },
  eyebrow: {
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.22em",
    color: "#86868b",
    textTransform: "uppercase",
    margin: "0 0 20px",
  },
  title: {
    fontSize: "clamp(44px, 7vw, 76px)",
    fontWeight: 600,
    letterSpacing: "-0.035em",
    lineHeight: 1.04,
    margin: 0,
    color: "#1d1d1f",
    background: "linear-gradient(180deg, #1d1d1f 0%, #3a3a3c 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subtitle: {
    marginTop: "22px",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: "620px",
    fontSize: "clamp(17px, 1.6vw, 21px)",
    fontWeight: 400,
    lineHeight: 1.5,
    color: "#6e6e73",
  },
  heroMeta: {
    marginTop: "28px",
    display: "inline-flex",
    alignItems: "baseline",
    justifyContent: "center",
    gap: "10px",
  },
  heroCount: {
    fontSize: "17px",
    fontWeight: 600,
    color: "#1d1d1f",
    letterSpacing: "-0.01em",
    fontVariantNumeric: "tabular-nums",
  },
  heroCountLabel: { fontSize: "14px", color: "#86868b", fontWeight: 400 },

  divider: {
    height: "1px",
    background:
      "linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.08) 50%, transparent 100%)",
    margin: "24px auto 40px",
    maxWidth: "520px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "18px",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: "22px",
    padding: "24px 26px 22px",
    border: "1px solid rgba(0, 0, 0, 0.05)",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03), 0 12px 32px rgba(0, 0, 0, 0.04)",
    transition:
      "transform 260ms cubic-bezier(0.22, 1, 0.36, 1), border-color 260ms ease, box-shadow 260ms ease",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    minHeight: "200px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },
  league: {
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.1em",
    color: "#86868b",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    flex: 1,
    minWidth: 0,
  },
  cardRule: { height: "1px", backgroundColor: "rgba(0, 0, 0, 0.06)" },

  liveBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "11px",
    fontWeight: 600,
    color: "#d70015",
    backgroundColor: "rgba(255, 59, 48, 0.09)",
    border: "1px solid rgba(255, 59, 48, 0.18)",
    padding: "4px 10px",
    borderRadius: "999px",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },
  liveDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#ff3b30",
    display: "inline-block",
    boxShadow: "0 0 8px rgba(255, 59, 48, 0.55)",
  },
  finishedBadge: {
    fontSize: "11px",
    fontWeight: 500,
    color: "#6e6e73",
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    border: "1px solid rgba(0, 0, 0, 0.06)",
    padding: "4px 10px",
    borderRadius: "999px",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },
  timeBadge: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#1d1d1f",
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    padding: "4px 10px",
    borderRadius: "999px",
    letterSpacing: "0.01em",
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap",
  },

  teams: { display: "flex", flexDirection: "column", gap: "12px" },
  teamRow: { display: "flex", alignItems: "center", gap: "12px" },
  teamDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    backgroundColor: "#1d1d1f",
    flexShrink: 0,
  },
  teamName: {
    fontSize: "19px",
    fontWeight: 500,
    color: "#1d1d1f",
    letterSpacing: "-0.012em",
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
    borderTop: "1px solid rgba(0, 0, 0, 0.05)",
    paddingTop: "14px",
    marginTop: "auto",
  },
  status: {
    fontSize: "12px",
    color: "#86868b",
    fontWeight: 400,
    letterSpacing: "0.01em",
  },

  empty: {
    textAlign: "center",
    padding: "96px 24px",
    backgroundColor: "#ffffff",
    borderRadius: "22px",
    border: "1px solid rgba(0, 0, 0, 0.05)",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03), 0 12px 32px rgba(0, 0, 0, 0.035)",
  },
  emptyIcon: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    margin: "0 auto 24px",
    backgroundColor: "rgba(0, 0, 0, 0.035)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIconInner: {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    border: "2px solid #86868b",
    opacity: 0.45,
  },
  emptyTitle: {
    fontSize: "26px",
    fontWeight: 600,
    color: "#1d1d1f",
    margin: 0,
    letterSpacing: "-0.02em",
  },
  emptyText: {
    marginTop: "12px",
    fontSize: "16px",
    color: "#86868b",
    margin: "12px 0 0",
  },

  footer: {
    marginTop: "80px",
    paddingTop: "32px",
    borderTop: "1px solid rgba(0, 0, 0, 0.06)",
    textAlign: "center",
  },
  footerText: { fontSize: "12px", color: "#86868b", letterSpacing: "0.04em" },
};