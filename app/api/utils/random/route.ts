import { randomInt } from "crypto";
import { NextRequest } from "next/server";
import { clampInt, fail, ok } from "@/lib/api";

function parseIntParam(value: string | null, def: number): number {
  if (value === null || value.trim() === "") return def;
  const n = Number.parseInt(value, 10);
  return Number.isNaN(n) ? def : n;
}

/** Números enteros aleatorios con aleatoriedad criptográfica. */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const min = parseIntParam(sp.get("min"), 1);
  const max = parseIntParam(sp.get("max"), 100);
  const count = clampInt(sp.get("count"), 5, 1, 100);

  if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max)) {
    return fail("Los parámetros 'min' y 'max' deben ser enteros.", 400);
  }
  if (min > max) {
    return fail("El parámetro 'min' no puede ser mayor que 'max'.", 400);
  }
  if (max - min > 1_000_000) {
    return fail("El rango máximo permitido es de 1.000.000.", 400);
  }

  const numbers = Array.from({ length: count }, () => randomInt(min, max + 1));
  return ok({ min, max, count, numbers });
}
