import predictions from "../data/predictions.json";

export const dynamic = "force-dynamic";

export default function PredictionsPage() {
  return (
    <main
      style={{
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        background: "#f5f5f7",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <p
          style={{
            fontSize: "12px",
            letterSpacing: "0.2em",
            color: "#8c8c8c",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          Hoy
        </p>

        <h1
          style={{
            fontSize: "56px",
            lineHeight: 1.05,
            margin: 0,
            color: "#1d1d1f",
          }}
        >
          Pronósticos de hoy
        </h1>

        <p
          style={{
            marginTop: "16px",
            fontSize: "20px",
            color: "#6e6e73",
          }}
        >
          Una selección más cuidada. Solo las opciones más sólidas del día.
        </p>

        <div style={{ marginTop: "48px", display: "grid", gap: "20px" }}>
          {predictions.length === 0 ? (
            <div
              style={{
                background: "#fff",
                borderRadius: "24px",
                padding: "40px",
                boxShadow: "0 6px 30px rgba(0,0,0,0.04)",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "30px",
                  color: "#1d1d1f",
                }}
              >
                Sin pronósticos por ahora
              </h2>
              <p
                style={{
                  marginTop: "10px",
                  color: "#6e6e73",
                  fontSize: "18px",
                }}
              >
                Vuelve más tarde. El análisis del día aún no ha sido generado.
              </p>
            </div>
          ) : (
            predictions.map((item, index) => (
              <div
                key={index}
                style={{
                  background: "#fff",
                  borderRadius: "24px",
                  padding: "28px",
                  boxShadow: "0 6px 30px rgba(0,0,0,0.04)",
                  border: "1px solid rgba(0,0,0,0.04)",
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
                  {item.market}
                </p>

                <h2
                  style={{
                    marginTop: "12px",
                    marginBottom: "8px",
                    fontSize: "30px",
                    color: "#1d1d1f",
                  }}
                >
                  {item.match}
                </h2>

                <p
                  style={{
                    margin: "0 0 16px 0",
                    fontSize: "20px",
                    color: "#333",
                  }}
                >
                  <strong>Pick:</strong> {item.pick}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "24px",
                    flexWrap: "wrap",
                    marginBottom: "16px",
                  }}
                >
                  <p style={{ margin: 0, color: "#6e6e73" }}>
                    <strong>Cuota:</strong> {item.odd}
                  </p>
                  <p style={{ margin: 0, color: "#6e6e73" }}>
                    <strong>Confianza:</strong> {item.confidence}
                  </p>
                </div>

                <p
                  style={{
                    margin: 0,
                    color: "#6e6e73",
                    fontSize: "17px",
                    lineHeight: 1.6,
                  }}
                >
                  {item.short_reason}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}