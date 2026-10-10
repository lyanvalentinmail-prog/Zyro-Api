import { NextRequest, NextResponse } from "next/server";
import { clampInt, fail } from "@/lib/api";

/** Genera un código QR en PNG. */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const text = (sp.get("text") ?? "").trim();
  const size = clampInt(sp.get("size"), 256, 100, 1000);

  if (!text) {
    return fail("Parámetro 'text' requerido. Ejemplo: /api/tools/qr?text=Hola&size=256", 400);
  }
  if (text.length > 1000) {
    return fail("El parámetro 'text' supera los 1000 caracteres.", 400);
  }

  try {
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&format=png&qzone=1`;
    const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
    if (!res.ok) {
      return fail(`El proveedor de QR respondió con HTTP ${res.status}. Inténtalo de nuevo.`, 502);
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return fail("No se pudo generar el código QR. Inténtalo de nuevo.", 502);
  }
}
