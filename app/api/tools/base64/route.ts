import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";

/** Codifica o decodifica Base64 con soporte UTF-8. */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const input = sp.get("text") ?? "";
  const action = (sp.get("action") ?? "encode").trim().toLowerCase();

  if (action !== "encode" && action !== "decode") {
    return fail("Parámetro 'action' inválido. Usa 'encode' o 'decode'.", 400);
  }
  if (!input) {
    return fail("Parámetro 'text' requerido. Ejemplo: /api/tools/base64?text=Hola&action=encode", 400);
  }
  if (input.length > 10000) {
    return fail("El parámetro 'text' supera los 10000 caracteres.", 400);
  }

  try {
    if (action === "encode") {
      return ok({ action, input, output: Buffer.from(input, "utf8").toString("base64") });
    }
    const clean = input.replace(/\s/g, "");
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(clean) || clean.length % 4 !== 0) {
      return fail("Texto Base64 inválido. Revisa el parámetro 'text'.", 400);
    }
    const output = Buffer.from(clean, "base64").toString("utf8");
    return ok({ action, input, output });
  } catch {
    return fail("No se pudo procesar el texto. Revisa los parámetros.", 400);
  }
}
