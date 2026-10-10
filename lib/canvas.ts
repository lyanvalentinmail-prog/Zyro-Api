import { promises as fs } from "fs";
import path from "path";
import { clampInt, escapeXml, sanitizeHex, wrapText } from "./api";

/**
 * Motor de tarjetas «canvas».
 *
 * Usa las plantillas de diseño originales (subidas desde Google Drive y
 * optimizadas a JPEG en `public/canvas/`) y compone encima, en SVG:
 *
 *  - textos superpuestos (con «píldoras» oscuras que tapan el texto horneado
 *    cuando un valor de la plantilla se sustituye),
 *  - avatares circulares descargados desde una URL (o `data:` URI),
 *  - barras de progreso (plantilla «gay»).
 *
 * Todos los parámetros son modificables vía query string:
 *  - cada texto admite los sufijos `X`, `Y`, `Size`, `Color`, `Weight` y
 *    `Spacing` (p. ej. `titleX=728&titleSize=80&titleColor=ffcc00`),
 *  - cada avatar admite `X`, `Y`, `R`, `Ring` y `RingWidth`
 *    (p. ej. `avatarR=120&avatarRing=ff5555`).
 */

export class CanvasAvatarError extends Error {}

/** Fuente SVG por defecto para todos los textos. */
const FONT_STACK = "Arial, Helvetica, sans-serif";

/** Color del anillo suave por defecto (plantillas sin aro horneado). */
const SOFT_RING = { color: "E7E9EE", width: 4, opacity: 0.55 };

export interface CanvasTextSlot {
  key: string;
  /** Texto por defecto horneado en la plantilla (informativo). */
  baked: string | null;
  x: number;
  y: number;
  size: number;
  color: string;
  weight: number;
  spacing?: number;
  italic?: boolean;
  uppercase?: boolean;
  /** Caracteres por línea (si se define, el texto se envuelve). */
  wrap?: number;
  lineHeight?: number;
  /** Píldora que tapa el texto horneado al sustituirlo. */
  pill?: { w: number; h: number; radius: number };
  /** Longitud máxima admitida del texto. */
  max?: number;
}

export interface CanvasAvatarSlot {
  key: string;
  x: number;
  y: number;
  r: number;
  /** Anillo dibujado alrededor del avatar (null = la plantilla ya tiene aro). */
  ring?: { color: string; width: number; opacity: number } | null;
}

export interface CanvasBarSlot {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  trackColor: string;
  /** Píldora que tapa la barra horneada. */
  cover: { x: number; y: number; w: number; h: number };
}

export interface CanvasTemplate {
  id: string;
  name: string;
  description: string;
  file: string;
  width: number;
  height: number;
  /** Color de fondo de las píldoras (mediano de la propia plantilla). */
  pillColor: string;
  texts: CanvasTextSlot[];
  avatars: CanvasAvatarSlot[];
  bar?: CanvasBarSlot;
}

/* ------------------------------------------------------------------ */
/* Registro de plantillas (posiciones medidas sobre las imágenes)      */
/* ------------------------------------------------------------------ */

export const CANVAS_TEMPLATES: CanvasTemplate[] = [
  {
    id: "welcome",
    name: "Welcome",
    description: "Tarjeta de bienvenida: título, subtítulo, nombre, grupo y nº de miembro.",
    file: "canvas-welcome.jpg",
    width: 1672,
    height: 940,
    pillColor: "09090A",
    texts: [
      { key: "title", baked: "WELCOME", x: 728, y: 413, size: 62, color: "FFFFFF", weight: 700, spacing: 12, uppercase: true, max: 40, pill: { w: 667, h: 90, radius: 14 } },
      { key: "subtitle", baked: "Un nuevo capítulo comienza bajo la misma luna.", x: 735, y: 566, size: 29, color: "EDEDED", weight: 400, wrap: 42, lineHeight: 1.35, max: 160, pill: { w: 434, h: 86, radius: 12 } },
      { key: "name", baked: null, x: 730, y: 668, size: 46, color: "FFFFFF", weight: 700, max: 40 },
      { key: "group", baked: null, x: 730, y: 714, size: 26, color: "B9BDC7", weight: 400, max: 40 },
      { key: "member", baked: "MIEMBRO # 001", x: 1353, y: 644, size: 24, color: "FFFFFF", weight: 500, spacing: 4, uppercase: true, max: 24, pill: { w: 287, h: 45, radius: 22 } },
    ],
    avatars: [{ key: "avatar", x: 738, y: 280, r: 95, ring: SOFT_RING }],
  },
  {
    id: "despedida",
    name: "Despedida",
    description: "Tarjeta de despedida: título, mensaje de varias líneas y deseo final.",
    file: "canvas-despedida.jpg",
    width: 1672,
    height: 941,
    pillColor: "070707",
    texts: [
      { key: "title", baked: "GOOD BYE", x: 893, y: 285, size: 56, color: "FFFFFF", weight: 700, spacing: 12, uppercase: true, max: 40, pill: { w: 621, h: 88, radius: 16 } },
      { key: "message", baked: "No es un adiós definitivo, solo un hasta pronto. Gracias por todo el tiempo compartido. Tu presencia siempre fue importante.", x: 881, y: 503, size: 28, color: "EDEDED", weight: 400, wrap: 40, lineHeight: 1.5, max: 200, pill: { w: 472, h: 224, radius: 14 } },
      { key: "closing", baked: "Te deseamos lo mejor", x: 877, y: 646, size: 26, color: "FFFFFF", weight: 500, spacing: 3, uppercase: true, max: 60, pill: { w: 308, h: 51, radius: 25 } },
      { key: "name", baked: null, x: 502, y: 675, size: 44, color: "FFFFFF", weight: 700, max: 40 },
      { key: "group", baked: null, x: 502, y: 720, size: 26, color: "B9BDC7", weight: 400, max: 40 },
    ],
    avatars: [{ key: "avatar", x: 502, y: 480, r: 140, ring: SOFT_RING }],
  },
  {
    id: "levelup",
    name: "Level Up",
    description: "Subida de nivel: avatar en el aro central, nivel anterior y actual.",
    file: "canvas-levelup.jpg",
    width: 1672,
    height: 940,
    pillColor: "050506",
    texts: [
      { key: "labelPrev", baked: "NIVEL ANTERIOR", x: 387, y: 343, size: 21, color: "D7DAE0", weight: 500, spacing: 3, uppercase: true, max: 24, pill: { w: 274, h: 44, radius: 22 } },
      { key: "previous", baked: "01", x: 387, y: 404, size: 72, color: "FFFFFF", weight: 700, max: 6, pill: { w: 105, h: 82, radius: 12 } },
      { key: "labelCur", baked: "NIVEL ACTUAL", x: 1290, y: 344, size: 21, color: "D7DAE0", weight: 500, spacing: 3, uppercase: true, max: 24, pill: { w: 242, h: 44, radius: 22 } },
      { key: "level", baked: "02", x: 1289, y: 402, size: 72, color: "FFFFFF", weight: 700, max: 6, pill: { w: 115, h: 83, radius: 12 } },
      { key: "title", baked: "LEVEL UP", x: 839, y: 552, size: 92, color: "FFFFFF", weight: 800, spacing: 10, uppercase: true, max: 40, pill: { w: 645, h: 116, radius: 16 } },
      { key: "message", baked: "¡Sigue avanzando, lo mejor aún está por venir!", x: 836, y: 691, size: 30, color: "EDEDED", weight: 400, wrap: 42, lineHeight: 1.35, max: 160, pill: { w: 423, h: 96, radius: 12 } },
      { key: "name", baked: null, x: 833, y: 466, size: 42, color: "FFFFFF", weight: 700, max: 40 },
    ],
    avatars: [{ key: "avatar", x: 833, y: 262, r: 125, ring: null }],
  },
  {
    id: "levelup2",
    name: "Level Up V2",
    description: "Variante de subida de nivel: título gigante y nivel actual.",
    file: "canvas-levelup2.jpg",
    width: 1672,
    height: 941,
    pillColor: "090909",
    texts: [
      { key: "title", baked: "LEVELUP", x: 845, y: 400, size: 124, color: "FFFFFF", weight: 800, spacing: 16, uppercase: true, max: 40, pill: { w: 892, h: 200, radius: 18 } },
      { key: "level", baked: "02", x: 954, y: 549, size: 76, color: "FFFFFF", weight: 700, max: 6, pill: { w: 132, h: 86, radius: 12 } },
      { key: "message", baked: "¡Felicidades! Tu esfuerzo te ha llevado a un nuevo nivel.", x: 836, y: 677, size: 27, color: "EDEDED", weight: 400, wrap: 46, lineHeight: 1.4, max: 200, pill: { w: 594, h: 98, radius: 12 } },
      { key: "name", baked: null, x: 836, y: 775, size: 46, color: "FFFFFF", weight: 700, max: 40 },
    ],
    avatars: [{ key: "avatar", x: 836, y: 178, r: 98, ring: SOFT_RING }],
  },
  {
    id: "ship",
    name: "Ship",
    description: "Compatibilidad de pareja: dos avatares, porcentaje y etiquetas.",
    file: "canvas-ship.jpg",
    width: 1672,
    height: 941,
    pillColor: "070708",
    texts: [
      { key: "percentage", baked: "92%", x: 844, y: 390, size: 98, color: "FFFFFF", weight: 800, max: 6, pill: { w: 265, h: 129, radius: 16 } },
      { key: "subtitle", baked: "COMPATIBILIDAD DE SHIP", x: 835, y: 571, size: 23, color: "D7DAE0", weight: 500, spacing: 6, uppercase: true, wrap: 18, lineHeight: 1.5, max: 60, pill: { w: 399, h: 95, radius: 12 } },
      { key: "label1", baked: "TU PERFIL", x: 392, y: 624, size: 26, color: "FFFFFF", weight: 600, spacing: 3, uppercase: true, max: 24, pill: { w: 216, h: 48, radius: 24 } },
      { key: "label2", baked: "SU PERFIL", x: 1279, y: 623, size: 26, color: "FFFFFF", weight: 600, spacing: 3, uppercase: true, max: 24, pill: { w: 213, h: 48, radius: 24 } },
      { key: "quote", baked: "\"Dos almas, un mismo cielo.\"", x: 836, y: 715, size: 29, color: "FFFFFF", weight: 400, italic: true, wrap: 40, max: 120, pill: { w: 437, h: 59, radius: 12 } },
    ],
    avatars: [
      { key: "avatar1", x: 385, y: 410, r: 128, ring: null },
      { key: "avatar2", x: 1286, y: 411, r: 128, ring: null },
    ],
  },
  {
    id: "gay",
    name: "Gayrate",
    description: "Medidor divertido: porcentaje gigante y barra de progreso.",
    file: "canvas-gay.jpg",
    width: 1254,
    height: 1254,
    pillColor: "050505",
    texts: [
      { key: "percentage", baked: "84%", x: 646, y: 827, size: 180, color: "FFFFFF", weight: 800, max: 6, pill: { w: 387, h: 206, radius: 20 } },
      { key: "name", baked: null, x: 627, y: 590, size: 48, color: "FFFFFF", weight: 700, max: 40 },
    ],
    avatars: [{ key: "avatar", x: 626, y: 398, r: 130, ring: SOFT_RING }],
    bar: { x: 316, y: 926, w: 606, h: 50, color: "F4F4F6", trackColor: "1F1F26", cover: { x: 306, y: 916, w: 626, h: 70 } },
  },
];

export function getCanvasTemplate(id: string): CanvasTemplate | undefined {
  return CANVAS_TEMPLATES.find((t) => t.id === id);
}

/** Catálogo público de plantillas y sus slots (para /api/canvas/templates). */
export function canvasTemplatesCatalog() {
  return CANVAS_TEMPLATES.map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    path: `/api/canvas/${t.id}`,
    size: { width: t.width, height: t.height },
    background: `/canvas/${t.file}`,
    pillColor: `#${t.pillColor}`,
    texts: t.texts.map((s) => ({
      key: s.key,
      baked: s.baked,
      x: s.x,
      y: s.y,
      size: s.size,
      color: `#${s.color}`,
      weight: s.weight,
      spacing: s.spacing ?? 0,
      uppercase: s.uppercase ?? false,
      italic: s.italic ?? false,
      wrap: s.wrap ?? null,
    })),
    avatars: t.avatars.map((a) => ({ key: a.key, x: a.x, y: a.y, r: a.r, ring: a.ring ? `#${a.ring.color}` : "none" })),
    ...(t.bar
      ? { bar: { x: t.bar.x, y: t.bar.y, w: t.bar.w, h: t.bar.h, color: `#${t.bar.color}`, trackColor: `#${t.bar.trackColor}` } }
      : {}),
  }));
}

/* ------------------------------------------------------------------ */
/* Carga de plantillas (cacheada en memoria)                           */
/* ------------------------------------------------------------------ */

const backgroundCache = new Map<string, string>();

async function loadBackground(tpl: CanvasTemplate): Promise<string> {
  const cached = backgroundCache.get(tpl.id);
  if (cached) return cached;
  const file = path.join(process.cwd(), "public", "canvas", tpl.file);
  const b64 = (await fs.readFile(file)).toString("base64");
  backgroundCache.set(tpl.id, b64);
  return b64;
}

/* ------------------------------------------------------------------ */
/* Descarga de avatares                                                */
/* ------------------------------------------------------------------ */

const MAX_AVATAR_BYTES = 6 * 1024 * 1024;
const AVATAR_TIMEOUT_MS = 6000;

/** Bloquea hosts internos para evitar SSRF básico. */
function isBlockedHost(hostname: string): boolean {
  const h = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (h === "localhost" || h.endsWith(".localhost") || h.endsWith(".local") || h.endsWith(".internal")) return true;
  if (h === "::1" || h === "0:0:0:0:0:0:0:1") return true;
  const m = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (m) {
    const a = Number(m[1]);
    const b = Number(m[2]);
    if (a === 0 || a === 10 || a === 127) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 169 && b === 254) return true;
  }
  return false;
}

/** Convierte una URL (o data: URI) de avatar en data URI embebible. */
export async function avatarToDataUri(rawUrl: string): Promise<string> {
  const url = rawUrl.trim();
  if (url.startsWith("data:")) {
    if (!/^data:image\/[a-z0-9.+-]+;base64,[a-z0-9+/=]+$/i.test(url) || url.length > 8_000_000) {
      throw new CanvasAvatarError("El avatar data: URI no es una imagen base64 válida o supera los 8 MB.");
    }
    return url;
  }
  if (!/^https?:\/\//i.test(url)) {
    throw new CanvasAvatarError("El avatar debe ser una URL http(s) o un data: URI de imagen.");
  }
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new CanvasAvatarError("La URL del avatar no es válida.");
  }
  const allowPrivate = process.env.CANVAS_AVATAR_ALLOW_PRIVATE === "1";
  if (!allowPrivate && isBlockedHost(parsed.hostname)) {
    throw new CanvasAvatarError("No se permiten avatares desde hosts internos o locales.");
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), AVATAR_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal, redirect: "follow" });
    if (!res.ok) {
      throw new CanvasAvatarError(`No se pudo descargar el avatar (HTTP ${res.status}).`);
    }
    const contentType = (res.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length === 0) throw new CanvasAvatarError("El avatar descargado está vacío.");
    if (buf.length > MAX_AVATAR_BYTES) throw new CanvasAvatarError("El avatar supera los 6 MB.");
    const mime = contentType || "image/png";
    if (!mime.startsWith("image/")) {
      throw new CanvasAvatarError(`El avatar debe ser una imagen (Content-Type recibido: ${mime || "desconocido"}).`);
    }
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch (e) {
    if (e instanceof CanvasAvatarError) throw e;
    if (e instanceof Error && e.name === "AbortError") {
      throw new CanvasAvatarError("La descarga del avatar superó los 6 segundos.");
    }
    throw new CanvasAvatarError("No se pudo descargar el avatar desde la URL indicada.");
  } finally {
    clearTimeout(timer);
  }
}

/* ------------------------------------------------------------------ */
/* Renderizado                                                         */
/* ------------------------------------------------------------------ */

export interface CanvasRenderOptions {
  /** Valores de texto resueltos por la ruta (null/undefined = no dibujar). */
  texts: Record<string, string | null | undefined>;
  /** URLs de avatar resueltas por la ruta (null/undefined = no dibujar). */
  avatars: Record<string, string | null | undefined>;
  /** Valor de la barra de progreso (0–100) si procede dibujarla. */
  bar?: number | null;
  /** Query string completa, para los overrides geométricos. */
  sp: URLSearchParams;
}

/** Estimación del ancho de una línea en px (Arial ≈ 0.6em por carácter). */
function estimateWidth(line: string, size: number, spacing: number): number {
  return line.length * (size * 0.6 + spacing);
}

function pillRect(
  slot: CanvasTextSlot,
  text: string,
  size: number,
  spacing: number,
  lines: string[]
): { x: number; y: number; w: number; h: number; radius: number } | null {
  if (!slot.pill) return null;
  const widest = Math.max(...lines.map((l) => estimateWidth(l, size, spacing)), 0);
  const lineH = size * (slot.lineHeight ?? 1.25);
  const w = Math.max(slot.pill.w, widest + size * 0.7 + 24);
  const h = Math.max(slot.pill.h, lines.length * lineH + size * 0.7 + 16);
  return {
    x: Math.round(slot.x - w / 2),
    y: Math.round(slot.y - h / 2),
    w: Math.round(w),
    h: Math.round(h),
    radius: slot.pill.radius,
  };
}

function textSvg(slot: CanvasTextSlot, rawText: string, tpl: CanvasTemplate, sp: URLSearchParams): string {
  let text = rawText.trim().slice(0, slot.max ?? 200);
  if (slot.uppercase) text = text.toUpperCase();

  const x = clampInt(sp.get(`${slot.key}X`), slot.x, -2000, 4000);
  const y = clampInt(sp.get(`${slot.key}Y`), slot.y, -2000, 4000);
  const spacing = clampInt(sp.get(`${slot.key}Spacing`), slot.spacing ?? 0, 0, 60);
  const weight = clampInt(sp.get(`${slot.key}Weight`), slot.weight, 100, 900);
  const color = sanitizeHex(sp.get(`${slot.key}Color`), slot.color);
  let size = clampInt(sp.get(`${slot.key}Size`), slot.size, 8, 400);

  const lines = slot.wrap ? wrapText(text, slot.wrap).slice(0, 7) : [text];
  const lineH = size * (slot.lineHeight ?? 1.25);

  // Auto-ajuste: reducir la fuente si el texto se sale de la tarjeta.
  const maxW = tpl.width - 120;
  while (size > slot.size * 0.55 && Math.max(...lines.map((l) => estimateWidth(l, size, spacing))) > maxW) {
    size -= 2;
  }

  const parts: string[] = [];

  // Píldora que tapa el texto horneado.
  const pill = pillRect({ ...slot, x, y }, text, size, spacing, lines);
  if (pill) {
    parts.push(
      `<rect x="${pill.x}" y="${pill.y}" width="${pill.w}" height="${pill.h}" rx="${pill.radius}" fill="#${tpl.pillColor}" opacity="0.96"/>`
    );
  }

  // Compensar el letter-spacing final al centrar con text-anchor="middle".
  const cx = spacing > 0 ? x + spacing / 2 : x;
  const startY = y - ((lines.length - 1) * lineH) / 2;

  const attrs = [
    `text-anchor="middle"`,
    `dominant-baseline="central"`,
    `font-family="${FONT_STACK}"`,
    `font-size="${Math.round(size)}"`,
    `font-weight="${weight}"`,
    spacing > 0 ? `letter-spacing="${spacing}"` : "",
    slot.italic ? `font-style="italic"` : "",
    `fill="#${color}"`,
  ]
    .filter(Boolean)
    .join(" ");

  lines.forEach((line, i) => {
    parts.push(
      `<text x="${cx}" y="${(startY + i * lineH).toFixed(1)}" ${attrs}>${escapeXml(line)}</text>`
    );
  });

  return parts.join("");
}

async function avatarSvg(
  slot: CanvasAvatarSlot,
  url: string,
  sp: URLSearchParams,
  index: number
): Promise<string> {
  const dataUri = await avatarToDataUri(url);
  const x = clampInt(sp.get(`${slot.key}X`), slot.x, -2000, 4000);
  const y = clampInt(sp.get(`${slot.key}Y`), slot.y, -2000, 4000);
  const r = clampInt(sp.get(`${slot.key}R`), slot.r, 8, 1000);

  // Anillo: la plantilla puede traerlo horneado (ring null).
  const ringParam = sp.get(`${slot.key}Ring`);
  const widthParam = sp.get(`${slot.key}RingWidth`);
  let ring: { color: string; width: number; opacity: number } | null = slot.ring ?? null;
  if (ringParam !== null) {
    if (ringParam.trim().toLowerCase() === "none") {
      ring = null;
    } else {
      ring = {
        color: sanitizeHex(ringParam, slot.ring?.color ?? "E7E9EE"),
        width: clampInt(widthParam, slot.ring?.width ?? 4, 1, 40),
        opacity: slot.ring?.opacity ?? 0.55,
      };
    }
  } else if (widthParam !== null && ring) {
    ring = { ...ring, width: clampInt(widthParam, ring.width, 1, 40) };
  }

  const parts: string[] = [];
  parts.push(`<clipPath id="clip-${slot.key}-${index}"><circle cx="${x}" cy="${y}" r="${r}"/></clipPath>`);
  parts.push(
    `<image href="${dataUri}" xlink:href="${dataUri}" x="${x - r}" y="${y - r}" width="${r * 2}" height="${r * 2}" preserveAspectRatio="xMidYMid slice" clip-path="url(#clip-${slot.key}-${index})"/>`
  );
  if (ring) {
    parts.push(
      `<circle cx="${x}" cy="${y}" r="${r + 2 + ring.width / 2}" fill="none" stroke="#${ring.color}" stroke-width="${ring.width}" opacity="${ring.opacity}"/>`
    );
  }
  return parts.join("");
}

function barSvg(tpl: CanvasTemplate, value: number, sp: URLSearchParams): string {
  if (!tpl.bar) return "";
  const x = clampInt(sp.get("barX"), tpl.bar.x, -2000, 4000);
  const y = clampInt(sp.get("barY"), tpl.bar.y, -2000, 4000);
  const w = clampInt(sp.get("barW"), tpl.bar.w, 40, 4000);
  const h = clampInt(sp.get("barH"), tpl.bar.h, 8, 400);
  const color = sanitizeHex(sp.get("barColor"), tpl.bar.color);
  const trackColor = sanitizeHex(sp.get("trackColor"), tpl.bar.trackColor);
  const pct = Math.min(100, Math.max(0, value));
  const fillW = Math.max(h, Math.round((w * pct) / 100));
  const cover = tpl.bar.cover;
  const coverX = x - (cover.x - tpl.bar.x);
  const coverY = y - (cover.y - tpl.bar.y);
  return [
    // Tapa la barra horneada.
    `<rect x="${coverX}" y="${coverY}" width="${cover.w}" height="${cover.h}" rx="${Math.round(cover.h / 2)}" fill="#${tpl.pillColor}"/>`,
    // Pista nueva.
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.round(h / 2)}" fill="#${trackColor}"/>`,
    // Relleno.
    `<rect x="${x}" y="${y}" width="${fillW}" height="${h}" rx="${Math.round(h / 2)}" fill="#${color}"/>`,
  ].join("");
}

/** Compone la tarjeta completa como SVG. */
export async function renderCanvasSvg(templateId: string, opts: CanvasRenderOptions): Promise<string> {
  const tpl = getCanvasTemplate(templateId);
  if (!tpl) throw new Error(`Plantilla canvas desconocida: ${templateId}`);

  const bg = await loadBackground(tpl);
  const parts: string[] = [];

  parts.push(
    `<image href="data:image/jpeg;base64,${bg}" x="0" y="0" width="${tpl.width}" height="${tpl.height}" preserveAspectRatio="xMidYMid slice"/>`
  );

  // Avatares (debajo de los textos).
  for (let i = 0; i < tpl.avatars.length; i++) {
    const slot = tpl.avatars[i];
    const url = opts.avatars[slot.key];
    if (url) parts.push(await avatarSvg(slot, url, opts.sp, i));
  }

  // Textos.
  for (const slot of tpl.texts) {
    const value = opts.texts[slot.key];
    if (value !== undefined && value !== null && value.trim() !== "") {
      parts.push(textSvg(slot, value, tpl, opts.sp));
    }
  }

  // Barra de progreso.
  if (opts.bar !== undefined && opts.bar !== null) {
    parts.push(barSvg(tpl, opts.bar, opts.sp));
  }

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" ` +
    `width="${tpl.width}" height="${tpl.height}" viewBox="0 0 ${tpl.width} ${tpl.height}">` +
    `<title>ZyroAPI · canvas ${escapeXml(tpl.name)}</title>` +
    parts.join("") +
    `</svg>`
  );
}
