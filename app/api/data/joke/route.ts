import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";
import { JOKES_EN, JOKES_ES } from "@/lib/data";

/** Chiste aleatorio en español o inglés. */
export async function GET(req: NextRequest) {
  const lang = (req.nextUrl.searchParams.get("lang") ?? "es").trim().toLowerCase();
  if (lang !== "es" && lang !== "en") {
    return fail("Parámetro 'lang' inválido. Usa 'es' o 'en'.", 400);
  }
  const pool = lang === "en" ? JOKES_EN : JOKES_ES;
  const id = Math.floor(Math.random() * pool.length);
  return ok({ lang, joke: { id: id + 1, text: pool[id] } });
}
