import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";
import { randomCode, shortLinkStore } from "@/lib/store";

/** Acortador de URLs real con almacenamiento en memoria. */
export async function GET(req: NextRequest) {
  const url = (req.nextUrl.searchParams.get("url") ?? "").trim();
  if (!url) {
    return fail("Parámetro 'url' requerido. Ejemplo: /api/tools/shorten?url=https://example.com", 400);
  }
  if (url.length > 2000) {
    return fail("El parámetro 'url' supera los 2000 caracteres.", 400);
  }
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return fail("URL inválida. Debe incluir http(s). Ejemplo: https://example.com", 400);
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return fail("Solo se admiten URLs http(s).", 400);
  }

  const store = shortLinkStore();
  let code = "";
  for (let i = 0; i < 5; i++) {
    const candidate = randomCode(6);
    if (!store.has(candidate)) {
      code = candidate;
      break;
    }
  }
  if (!code) {
    return fail("No se pudo generar un código único. Inténtalo de nuevo.", 500);
  }
  store.set(code, { url: parsed.toString(), createdAt: new Date().toISOString(), hits: 0 });

  return ok({
    original: parsed.toString(),
    code,
    short_url: `${req.nextUrl.origin}/s/${code}`,
    note: "Los enlaces se guardan en memoria y pueden expirar al reiniciar el servidor.",
  });
}
