import { NextResponse } from "next/server";

export const CREATOR = "ZyroAPI";

/** Respuesta JSON de éxito con formato estándar. */
export function ok(body: Record<string, unknown>, status = 200) {
  return NextResponse.json({ status: true, creator: CREATOR, ...body }, { status });
}

/** Respuesta JSON de error clara y consistente. */
export function fail(error: string, status = 400, extra: Record<string, unknown> = {}) {
  return NextResponse.json({ status: false, creator: CREATOR, error, ...extra }, { status });
}

/** Hash determinista (djb2) para resultados "fun" reproducibles. */
export function hashStr(input: string): number {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = ((h * 33 + input.charCodeAt(i)) >>> 0) as number;
  }
  return h;
}

/** Entero saneado dentro de un rango. */
export function clampInt(value: string | null, def: number, min: number, max: number): number {
  if (value === null || value.trim() === "") return def;
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return def;
  return Math.min(max, Math.max(min, n));
}

/** Escapa texto para incrustarlo en un SVG de forma segura. */
export function escapeXml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Devuelve un SVG como imagen real. */
export function svgResponse(svg: string, maxAge = 3600) {
  return new NextResponse(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": `public, max-age=${maxAge}`,
    },
  });
}

/** Iniciales (máx. 2 letras) a partir de un nombre. */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AVATAR_PALETTE = ["1D4ED8", "0E7490", "047857", "6D28D9", "B45309", "BE123C", "334155"];

/** Color de fondo determinista a partir de un texto. */
export function colorFromString(input: string): string {
  return AVATAR_PALETTE[hashStr(input.toLowerCase()) % AVATAR_PALETTE.length];
}

/** Valida un color hex de 3 o 6 dígitos (sin #). */
export function sanitizeHex(input: string | null, fallback: string): string {
  if (!input) return fallback;
  const clean = input.replace(/^#/, "").trim();
  if (/^[0-9a-fA-F]{6}$/.test(clean) || /^[0-9a-fA-F]{3}$/.test(clean)) return clean;
  return fallback;
}

/** Divide un texto en líneas de como máximo N caracteres. */
export function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.length > 0 ? lines : [""];
}
