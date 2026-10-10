import { NextRequest, NextResponse } from "next/server";
import { clampInt } from "@/lib/api";

/** Redirige a la foto de un gato aleatorio (Cataas). */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const params = new URLSearchParams();
  if (sp.get("width") !== null) params.set("width", String(clampInt(sp.get("width"), 600, 1, 2000)));
  if (sp.get("height") !== null) params.set("height", String(clampInt(sp.get("height"), 600, 1, 2000)));
  const qs = params.toString();
  return NextResponse.redirect(`https://cataas.com/cat${qs ? `?${qs}` : ""}`, 307);
}
