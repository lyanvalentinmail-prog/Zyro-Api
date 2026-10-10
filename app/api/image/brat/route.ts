import { NextRequest } from "next/server";
import { svgResponse } from "@/lib/api";
import { bratSvg } from "@/lib/svg";

/** Genera una portada estilo «brat» en SVG. */
export async function GET(req: NextRequest) {
  const text = req.nextUrl.searchParams.get("text") ?? "brat";
  return svgResponse(bratSvg(text));
}
