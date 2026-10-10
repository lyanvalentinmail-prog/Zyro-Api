import { NextRequest } from "next/server";
import { clampInt, colorFromString, fail, sanitizeHex, svgResponse } from "@/lib/api";
import { avatarSvg } from "@/lib/svg";

/** Genera un avatar SVG con las iniciales del nombre. */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const name = (sp.get("name") ?? "").trim();
  if (!name) {
    return fail("Parámetro 'name' requerido. Ejemplo: /api/image/avatar?name=Ana%20García", 400);
  }
  const size = clampInt(sp.get("size"), 256, 32, 1024);
  const bg = sanitizeHex(sp.get("bg"), colorFromString(name));
  const color = sanitizeHex(sp.get("color"), "FFFFFF");
  return svgResponse(avatarSvg(name.slice(0, 60), size, bg, color));
}
