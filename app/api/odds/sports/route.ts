import { getSportsList } from "@/lib/odds-api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getSportsList();
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { ok: false, error: "No se pudieron obtener sports" },
      { status: 500 }
    );
  }
}