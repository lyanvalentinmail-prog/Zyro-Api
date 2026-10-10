import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";

const LANG_RE = /^[a-z]{2}(-[a-z]{2})?$/;

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const text = (sp.get("text") ?? "").trim();
  const from = (sp.get("from") ?? "en").trim().toLowerCase() || "en";
  const to = (sp.get("to") ?? "es").trim().toLowerCase() || "es";

  if (!text) {
    return fail("Parámetro 'text' requerido. Ejemplo: /api/ai/translate?text=Hello&from=en&to=es", 400);
  }
  if (text.length > 500) {
    return fail("El parámetro 'text' supera los 500 caracteres.", 400);
  }
  if (!LANG_RE.test(from) || !LANG_RE.test(to)) {
    return fail("Idiomas inválidos. Usa códigos ISO 639-1 como 'en' o 'es'.", 400);
  }

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
    const res = await fetch(url, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(10000) });
    if (!res.ok) {
      return fail(`El proveedor de traducción respondió con HTTP ${res.status}. Inténtalo de nuevo en unos segundos.`, 502);
    }
    const data = (await res.json()) as { responseData?: { translatedText?: string } };
    const translated = data?.responseData?.translatedText;
    if (!translated) {
      return fail("El proveedor no devolvió ninguna traducción.", 502);
    }
    return ok({ provider: "mymemory", from, to, original: text, translated });
  } catch {
    return fail("No se pudo contactar con el proveedor de traducción. Inténtalo de nuevo.", 502);
  }
}
