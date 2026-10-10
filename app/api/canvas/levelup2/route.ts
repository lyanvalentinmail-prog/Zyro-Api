import { NextRequest } from "next/server";
import { cleanText, handleCanvas, padLevel } from "@/lib/canvas-route";

/**
 * Variante de subida de nivel sobre la plantilla «canvas-levelup2»
 * (título gigante LEVELUP + nivel actual junto a «NIVEL»).
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const level = cleanText(sp.get("level"), 6);
  return handleCanvas(req, "levelup2", {
    texts: {
      title: cleanText(sp.get("title"), 40),
      message: cleanText(sp.get("message"), 200),
      name: cleanText(sp.get("name"), 40),
      level: level ? padLevel(level) : null,
    },
    avatars: { avatar: sp.get("avatar") },
    sp,
  });
}
