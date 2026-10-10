import { NextRequest } from "next/server";
import { clampInt } from "@/lib/api";
import { shipResult } from "@/lib/fun";
import { cleanText, handleCanvas } from "@/lib/canvas-route";

/**
 * Tarjeta de ship sobre la plantilla «canvas-ship»: dos avatares en sus aros,
 * porcentaje (calculado desde los nombres si no se indica) y etiquetas.
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const name1 = cleanText(sp.get("name1"), 40);
  const name2 = cleanText(sp.get("name2"), 40);

  let percentage: number | null = null;
  const pctParam = sp.get("percentage");
  if (pctParam !== null && pctParam.trim() !== "") {
    percentage = clampInt(pctParam, 0, 0, 100);
  } else if (name1 && name2) {
    percentage = shipResult(name1, name2).percentage;
  }

  return handleCanvas(req, "ship", {
    texts: {
      percentage: percentage !== null ? `${percentage}%` : null,
      subtitle: cleanText(sp.get("subtitle"), 60),
      label1: cleanText(sp.get("label1"), 24) ?? name1,
      label2: cleanText(sp.get("label2"), 24) ?? name2,
      quote: cleanText(sp.get("quote"), 120),
    },
    avatars: { avatar1: sp.get("avatar1"), avatar2: sp.get("avatar2") },
    sp,
  });
}
