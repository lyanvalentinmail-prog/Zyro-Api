import { NextRequest } from "next/server";
import { cleanText, composeMember, handleCanvas } from "@/lib/canvas-route";

/**
 * Tarjeta de bienvenida sobre la plantilla «canvas-welcome».
 * Todos los parámetros (texto, posición, tamaño, color) son modificables.
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const memberRaw = cleanText(sp.get("member"), 24);
  return handleCanvas(req, "welcome", {
    texts: {
      title: cleanText(sp.get("title"), 40),
      subtitle: cleanText(sp.get("subtitle"), 160),
      name: cleanText(sp.get("name"), 40),
      group: cleanText(sp.get("group"), 40),
      member: memberRaw ? composeMember(memberRaw) : null,
    },
    avatars: { avatar: sp.get("avatar") },
    sp,
  });
}
