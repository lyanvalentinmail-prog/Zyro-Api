import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";
import { gayrateResult } from "@/lib/fun";

/** Medidor divertido y determinista (solo entretenimiento). */
export async function GET(req: NextRequest) {
  const name = (req.nextUrl.searchParams.get("name") ?? "").trim();
  if (!name) {
    return fail("Parámetro 'name' requerido. Ejemplo: /api/fun/gayrate?name=Ana", 400);
  }
  return ok({ name: name.slice(0, 40), ...gayrateResult(name) });
}
