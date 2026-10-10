import { NextRequest, NextResponse } from "next/server";
import { clampInt } from "@/lib/api";

/** Redirige a una fotografía aleatoria (Picsum). */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const width = clampInt(sp.get("width"), 800, 1, 2000);
  const height = clampInt(sp.get("height"), 600, 1, 2000);
  const seed = sp.get("seed")?.trim() || String(Date.now());
  return NextResponse.redirect(
    `https://picsum.photos/${width}/${height}?random=${encodeURIComponent(seed)}`,
    307
  );
}
