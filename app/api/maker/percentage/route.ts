import { NextRequest } from "next/server";
import { fail, hashStr, ok } from "@/lib/api";
import { progressBar } from "@/lib/fun";

/** Porcentaje determinista para cualquier texto. */
export async function GET(req: NextRequest) {
  const text = (req.nextUrl.searchParams.get("text") ?? "").trim();
  if (!text) {
    return fail("Parámetro 'text' requerido. Ejemplo: /api/maker/percentage?text=Lunes", 400);
  }
  const percentage = hashStr(text.toLowerCase()) % 101;
  return ok({ text: text.slice(0, 100), percentage, bar: progressBar(percentage) });
}
