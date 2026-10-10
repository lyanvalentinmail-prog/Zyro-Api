import { NextRequest } from "next/server";
import { cleanText, handleCanvas, padLevel } from "@/lib/canvas-route";

/**
 * Tarjeta de subida de nivel sobre la plantilla «canvas-levelup»
 * (con aro de avatar central y niveles anterior/actual).
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const previous = cleanText(sp.get("previous"), 6);
  const level = cleanText(sp.get("level"), 6);
  return handleCanvas(req, "levelup", {
    texts: {
      title: cleanText(sp.get("title"), 40),
      message: cleanText(sp.get("message"), 160),
      name: cleanText(sp.get("name"), 40),
      labelPrev: cleanText(sp.get("labelPrev"), 24),
      labelCur: cleanText(sp.get("labelCur"), 24),
      previous: previous ? padLevel(previous) : null,
      level: level ? padLevel(level) : null,
    },
    avatars: { avatar: sp.get("avatar") },
    sp,
  });
}
