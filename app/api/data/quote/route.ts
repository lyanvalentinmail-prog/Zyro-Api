import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";
import { QUOTES_EN, QUOTES_ES } from "@/lib/data";

/** Cita aleatoria en español o inglés. */
export async function GET(req: NextRequest) {
  const lang = (req.nextUrl.searchParams.get("lang") ?? "es").trim().toLowerCase();
  if (lang !== "es" && lang !== "en") {
    return fail("Parámetro 'lang' inválido. Usa 'es' o 'en'.", 400);
  }
  const pool = lang === "en" ? QUOTES_EN : QUOTES_ES;
  const quote = pool[Math.floor(Math.random() * pool.length)];
  return ok({ lang, quote });
}
