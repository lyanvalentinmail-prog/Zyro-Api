import { randomUUID } from "crypto";
import { NextRequest } from "next/server";
import { clampInt, ok } from "@/lib/api";

/** Genera UUIDs v4 criptográficamente aleatorios. */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const count = clampInt(sp.get("count"), 1, 1, 10);
  const uppercase = (sp.get("uppercase") ?? "false").trim().toLowerCase() === "true";
  const uuids = Array.from({ length: count }, () => {
    const id = randomUUID();
    return uppercase ? id.toUpperCase() : id;
  });
  return ok({ count, uuids });
}
