import { NextRequest } from "next/server";
import { clampInt, fail, ok } from "@/lib/api";

interface JikanEntry {
  mal_id: number;
  title: string;
  type?: string;
  episodes?: number;
  score?: number;
  images?: { jpg?: { image_url?: string } };
  url?: string;
}

function simplify(e: JikanEntry) {
  return {
    mal_id: e.mal_id,
    title: e.title,
    type: e.type ?? "Desconocido",
    episodes: e.episodes ?? 0,
    score: e.score ?? 0,
    image: e.images?.jpg?.image_url ?? "",
    url: e.url ?? "",
  };
}

/** Búsqueda de anime a través del proveedor gratuito Jikan. */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const q = (sp.get("q") ?? "").trim();
  const limit = clampInt(sp.get("limit"), 5, 1, 10);

  if (q.length < 2) {
    return fail("Parámetro 'q' requerido (mín. 2 caracteres). Ejemplo: /api/anime/search?q=naruto", 400);
  }

  try {
    const res = await fetch(
      `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&limit=${limit}&sfw=true`,
      { signal: AbortSignal.timeout(12000) }
    );
    if (res.status === 429) {
      return fail("El proveedor Jikan está limitando peticiones (429). Espera unos segundos e inténtalo de nuevo.", 502);
    }
    if (!res.ok) {
      return fail(`El proveedor Jikan respondió con HTTP ${res.status}. Inténtalo de nuevo.`, 502);
    }
    const data = (await res.json()) as { data?: JikanEntry[] };
    const results = (data.data ?? []).map(simplify);
    return ok({ provider: "jikan.moe", query: q, count: results.length, results });
  } catch {
    return fail("No se pudo contactar con el proveedor Jikan. Inténtalo de nuevo.", 502);
  }
}
