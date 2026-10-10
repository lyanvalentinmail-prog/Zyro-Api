import { NextRequest, NextResponse } from "next/server";
import { shortLinkStore } from "@/lib/store";

/** Redirección de enlaces cortos creados con /api/tools/shorten. */
export async function GET(_req: NextRequest, { params }: { params: { code: string } }) {
  const link = shortLinkStore().get(params.code);
  if (!link) {
    return NextResponse.json(
      { status: false, creator: "ZyroAPI", error: "Enlace no encontrado o expirado." },
      { status: 404 }
    );
  }
  link.hits += 1;
  return NextResponse.redirect(link.url, 307);
}
