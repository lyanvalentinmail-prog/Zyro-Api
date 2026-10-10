import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";
import { shipResult } from "@/lib/fun";

/** Compatibilidad entre dos nombres (JSON determinista). */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const name1 = (sp.get("name1") ?? "").trim();
  const name2 = (sp.get("name2") ?? "").trim();
  if (!name1 || !name2) {
    return fail("Parámetros 'name1' y 'name2' requeridos. Ejemplo: /api/maker/ship?name1=Ana&name2=Luis", 400);
  }
  return ok({ name1: name1.slice(0, 40), name2: name2.slice(0, 40), ...shipResult(name1, name2) });
}
