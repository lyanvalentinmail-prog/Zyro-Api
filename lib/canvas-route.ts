import { NextRequest } from "next/server";
import { fail, svgResponse } from "./api";
import { CanvasAvatarError, type CanvasRenderOptions, renderCanvasSvg } from "./canvas";

/** Texto limpio y acortado (null si viene vacío). */
export function cleanText(value: string | null, max: number): string | null {
  if (value === null) return null;
  const t = value.trim();
  if (!t) return null;
  return t.slice(0, max);
}

/** Rellena números de nivel con cero a la izquierda ("7" -> "07"). */
export function padLevel(value: string): string {
  return /^\d+$/.test(value) ? value.padStart(2, "0") : value;
}

/** "42" -> "MIEMBRO # 042"; los textos personalizados pasan tal cual. */
export function composeMember(value: string): string {
  if (/^\d+$/.test(value)) return `MIEMBRO # ${value.padStart(3, "0")}`;
  return value;
}

/** Renderiza una plantilla canvas y gestiona los errores de avatar. */
export async function handleCanvas(
  req: NextRequest,
  templateId: string,
  opts: CanvasRenderOptions
) {
  try {
    const svg = await renderCanvasSvg(templateId, opts);
    return svgResponse(svg);
  } catch (e) {
    if (e instanceof CanvasAvatarError) return fail(e.message, 502);
    throw e;
  }
}
