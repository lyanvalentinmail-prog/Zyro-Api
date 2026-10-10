import { NextRequest } from "next/server";
import { cleanText, handleCanvas } from "@/lib/canvas-route";

/**
 * Tarjeta de despedida sobre la plantilla «canvas-despedida».
 * Todos los parámetros (texto, posición, tamaño, color) son modificables.
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  return handleCanvas(req, "despedida", {
    texts: {
      title: cleanText(sp.get("title"), 40),
      message: cleanText(sp.get("message"), 200),
      closing: cleanText(sp.get("closing"), 60),
      name: cleanText(sp.get("name"), 40),
      group: cleanText(sp.get("group"), 40),
    },
    avatars: { avatar: sp.get("avatar") },
    sp,
  });
}
