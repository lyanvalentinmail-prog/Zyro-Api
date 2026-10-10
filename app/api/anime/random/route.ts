import { fail, ok } from "@/lib/api";

interface JikanEntry {
  mal_id: number;
  title: string;
  type?: string;
  episodes?: number;
  score?: number;
  images?: { jpg?: { image_url?: string } };
  url?: string;
}

/** Anime aleatorio a través del proveedor gratuito Jikan. */
export async function GET() {
  try {
    const res = await fetch("https://api.jikan.moe/v4/random/anime?sfw=true", {
      signal: AbortSignal.timeout(12000),
    });
    if (res.status === 429) {
      return fail("El proveedor Jikan está limitando peticiones (429). Espera unos segundos e inténtalo de nuevo.", 502);
    }
    if (!res.ok) {
      return fail(`El proveedor Jikan respondió con HTTP ${res.status}. Inténtalo de nuevo.`, 502);
    }
    const data = (await res.json()) as { data?: JikanEntry };
    const e = data.data;
    if (!e) return fail("El proveedor no devolvió ningún anime.", 502);
    return ok({
      provider: "jikan.moe",
      result: {
        mal_id: e.mal_id,
        title: e.title,
        type: e.type ?? "Desconocido",
        episodes: e.episodes ?? 0,
        score: e.score ?? 0,
        image: e.images?.jpg?.image_url ?? "",
        url: e.url ?? "",
      },
    });
  } catch {
    return fail("No se pudo contactar con el proveedor Jikan. Inténtalo de nuevo.", 502);
  }
}
