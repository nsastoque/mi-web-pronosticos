import { detectBestLeaguesOfTheDay } from "@/lib/best-leagues";
import { getSoccerOddsBySportKey } from "@/lib/odds-api";
import { buildCandidatesFromOdds } from "@/lib/candidates";
import { savePredictionsToBlob } from "@/lib/predictions-store";

export const dynamic = "force-dynamic";

function buildClaudePrompt(candidates: any[]) {
  return `
Actúa como una analista de fútbol de élite, rigurosa y conservadora.

Selecciona únicamente los 5 picks más sólidos del día.

Reglas:
- evita picks volátiles
- prioriza cuotas entre 1.30 y 2.20
- descarta partidos muy parejos
- máximo 5 picks
- no uses "seguro", "garantizado" ni "fijo"
- usa análisis serio y profesional

Formato JSON exacto:
[
  {
    "match": "",
    "market": "",
    "pick": "",
    "odd": 0,
    "confidence": "medium | high",
    "short_reason": ""
  }
]

Candidatos:
${JSON.stringify(candidates, null, 2)}
`;
}

async function askClaudeForPredictions(candidates: any[]) {
  try {
    const prompt = buildClaudePrompt(candidates);

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
      cache: "no-store",
    });

    if (!res.ok) {
  const txt = await res.text();
  console.error("Anthropic API error:", res.status, txt);
  throw new Error(`Anthropic API error ${res.status}: ${txt}`);
}

    const data = await res.json();
    const text = data?.content?.[0]?.text || "[]";

    try {
      return JSON.parse(text);
    } catch (error) {
      console.error("Claude no devolvió JSON válido");
      console.error(text);
      return [];
    }
  } catch (error) {
    console.error("Error consultando Claude:", error);
    return [];
  }
}

} catch (error) {
  console.error("Error generando predicciones:", error);

  return Response.json(
    {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    },
    { status: 500 }
  );
 }

const bestLeagues = await detectBestLeaguesOfTheDay();

const blacklist = [
  "fifa",
  "winner",
  "outright",
];

const selectedLeagues = bestLeagues
  .filter((l: any) =>
    l.key.startsWith("soccer_") &&
    !blacklist.some(b => l.key.includes(b))
  )
  .slice(0, 3);

    const predictions = await askClaudeForPredictions(candidates);
if (!Array.isArray(predictions)) {
  throw new Error("Predictions no es un array válido");
}
    await savePredictionsToBlob(predictions);

   } catch (error) {
  console.error("Error generando predicciones:", error);

  return Response.json(
    {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    },
    { status: 500 }
  );
}