import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";

function offsetLabel(tz: string, date: Date): string {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = Object.fromEntries(dtf.formatToParts(date).map((p) => [p.type, p.value]));
  const asUTC = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second)
  );
  const diffMin = Math.round((asUTC - date.getTime()) / 60000);
  const sign = diffMin >= 0 ? "+" : "-";
  const abs = Math.abs(diffMin);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return m === 0 ? `UTC${sign}${h}` : `UTC${sign}${h}:${String(m).padStart(2, "0")}`;
}

/** Hora actual UTC, timestamp Unix y hora local por zona horaria. */
export async function GET(req: NextRequest) {
  const tz = (req.nextUrl.searchParams.get("tz") ?? "Europe/Madrid").trim() || "Europe/Madrid";
  try {
    new Intl.DateTimeFormat("es-ES", { timeZone: tz });
  } catch {
    return fail("Zona horaria inválida. Usa un identificador IANA como 'Europe/Madrid'.", 400);
  }
  const now = new Date();
  const local = new Intl.DateTimeFormat("es-ES", {
    timeZone: tz,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(now);
  return ok({
    utc: now.toISOString(),
    timestamp: Math.floor(now.getTime() / 1000),
    timezone: tz,
    local,
    offset: offsetLabel(tz, now),
  });
}
