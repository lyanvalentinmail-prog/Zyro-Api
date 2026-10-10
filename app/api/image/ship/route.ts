import { NextRequest } from "next/server";
import { fail, svgResponse } from "@/lib/api";
import { shipCardSvg } from "@/lib/svg";

/** Genera una tarjeta ship en SVG con dos nombres y su porcentaje. */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const name1 = (sp.get("name1") ?? "").trim();
  const name2 = (sp.get("name2") ?? "").trim();
  if (!name1 || !name2) {
    return fail("Parámetros 'name1' y 'name2' requeridos. Ejemplo: /api/image/ship?name1=Ana&name2=Luis", 400);
  }
  return svgResponse(shipCardSvg(name1, name2));
}
