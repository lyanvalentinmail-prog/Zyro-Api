import { ok } from "@/lib/api";
import { canvasTemplatesCatalog } from "@/lib/canvas";

/**
 * Catálogo JSON de las plantillas canvas disponibles con sus slots,
 * valores por defecto y los sufijos de parámetro admitidos.
 */
export async function GET() {
  return ok({
    count: canvasTemplatesCatalog().length,
    templates: canvasTemplatesCatalog(),
    overrides: {
      text: "Cada texto admite los sufijos X, Y, Size, Color, Weight y Spacing (p. ej. titleX=728&titleSize=80&titleColor=ffcc00).",
      avatar: "Cada avatar admite los sufijos X, Y, R, Ring y RingWidth (p. ej. avatarR=120&avatarRing=ff5555 o avatar1Ring=none).",
      bar: "La barra de la plantilla gay admite barX, barY, barW, barH, barColor y trackColor.",
      avatar_source: "El avatar puede ser una URL http(s) pública o un data: URI de imagen (máx. 6 MB).",
    },
  });
}
