import { NextRequest } from "next/server";
import { fail, svgResponse } from "@/lib/api";
import { iqcSvg } from "@/lib/svg";

/** Genera una tarjeta de cita (IQC) en SVG. */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const text = (sp.get("text") ?? "").trim();
  const author = (sp.get("author") ?? "ZyroAPI").trim();
  if (!text) {
    return fail("Parámetro 'text' requerido. Ejemplo: /api/maker/iqc?text=Hazlo%20simple&author=ZyroAPI", 400);
  }
  if (text.length > 280) {
    return fail("El parámetro 'text' supera los 280 caracteres.", 400);
  }
  return svgResponse(iqcSvg(text, author));
}
