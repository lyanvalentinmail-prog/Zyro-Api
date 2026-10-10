import { NextRequest } from "next/server";
import { clampInt } from "@/lib/api";
import { gayrateResult } from "@/lib/fun";
import { cleanText, handleCanvas } from "@/lib/canvas-route";

/**
 * Medidor «gayrate» sobre la plantilla «canvas-gay»: porcentaje gigante,
 * barra de progreso y avatar. El porcentaje se calcula desde el nombre
 * si no se indica (mismo algoritmo que /api/fun/gayrate).
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const name = cleanText(sp.get("name"), 40);

  let percentage: number | null = null;
  const pctParam = sp.get("percentage");
  if (pctParam !== null && pctParam.trim() !== "") {
    percentage = clampInt(pctParam, 0, 0, 100);
  } else if (name) {
    percentage = gayrateResult(name).percentage;
  }

  return handleCanvas(req, "gay", {
    texts: {
      percentage: percentage !== null ? `${percentage}%` : null,
      name,
    },
    avatars: { avatar: sp.get("avatar") },
    bar: percentage,
    sp,
  });
}
