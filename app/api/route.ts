import { NextResponse } from "next/server";
import { CATEGORIES, SITE_NAME, TAGLINE, TOTAL_ENDPOINTS, VERSION } from "@/lib/endpoints";

/** Índice público de la API: lista todas las categorías y endpoints. */
export async function GET() {
  return NextResponse.json({
    status: true,
    creator: SITE_NAME,
    name: SITE_NAME,
    tagline: TAGLINE,
    version: VERSION,
    docs: "/",
    endpoints_count: TOTAL_ENDPOINTS,
    auth: "none",
    categories: CATEGORIES.map((c) => ({
      slug: c.slug,
      name: c.name,
      description: c.description,
      endpoints: c.endpoints.map((e) => ({ method: e.method, path: e.path, name: e.name })),
    })),
  });
}
