import { ok } from "@/lib/api";
import { ANIME_QUOTES_FALLBACK } from "@/lib/data";

interface AnimechanNew {
  status?: string;
  data?: {
    content?: string;
    character?: { name?: string };
    anime?: { title?: string };
  };
}

interface AnimechanLegacy {
  quote?: string;
  character?: string;
  anime?: string;
}

/** Cita aleatoria de anime, con respaldo local si el proveedor falla. */
export async function GET() {
  try {
    const res = await fetch("https://api.animechan.io/v1/quotes/random", {
      signal: AbortSignal.timeout(10000),
    });
    if (res.ok) {
      const data = (await res.json()) as AnimechanNew | AnimechanLegacy;
      const content =
        (data as AnimechanNew).data?.content ?? (data as AnimechanLegacy).quote ?? "";
      const character =
        (data as AnimechanNew).data?.character?.name ?? (data as AnimechanLegacy).character ?? "Desconocido";
      const anime =
        (data as AnimechanNew).data?.anime?.title ?? (data as AnimechanLegacy).anime ?? "Desconocido";
      if (content) {
        return ok({ provider: "animechan", quote: { content, character, anime } });
      }
    }
  } catch {
    // Se usa el respaldo local documentado.
  }
  const quote = ANIME_QUOTES_FALLBACK[Math.floor(Math.random() * ANIME_QUOTES_FALLBACK.length)];
  return ok({ provider: "zyro-local-fallback", quote });
}
