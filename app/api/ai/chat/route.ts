import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";
import { JOKES_ES } from "@/lib/data";
import { TOTAL_ENDPOINTS } from "@/lib/endpoints";

function replyFor(message: string): string {
  const m = message.toLowerCase().trim();

  if (/(^(hola|buenas|hey|hello|hi)\b)/.test(m) && m.length < 30 && !m.includes("puedes")) {
    return "¡Hola! Soy el asistente demo de ZyroAPI. Puedo saludarte, decirte la hora, contar un chiste o explicar los endpoints. Escríbeme \"ayuda\" para ver más.";
  }
  if (m.includes("ayuda") || m.includes("help") || m.includes("puedes hacer") || m.includes("comandos")) {
    return "Puedo ayudarte con: decir la hora (escribe \"hora\"), contar un chiste (\"chiste\"), listar endpoints (\"endpoints\") o saludarte. Soy una demo con reglas locales.";
  }
  if (m.includes("hora")) {
    const now = new Date();
    const hh = String(now.getUTCHours()).padStart(2, "0");
    const mm = String(now.getUTCMinutes()).padStart(2, "0");
    return `Son las ${hh}:${mm} UTC (hora del servidor). ¿Algo más en lo que ayude?`;
  }
  if (m.includes("chiste")) {
    return JOKES_ES[Math.floor(Math.random() * JOKES_ES.length)];
  }
  if (m.includes("endpoint") || m.includes("api")) {
    return `ZyroAPI tiene ${TOTAL_ENDPOINTS} endpoints gratuitos sin API key: IA, imágenes, generadores, anime, herramientas, datos, diversión y utilidades. Revisa la documentación para verlos todos.`;
  }
  if (m.includes("gracias")) {
    return "¡De nada! Para eso estoy. ¿Probamos otro endpoint?";
  }
  if (m.includes("adios") || m.includes("adiós") || m.includes("chao") || m.includes("bye")) {
    return "¡Hasta luego! Vuelve cuando quieras probar más endpoints.";
  }
  if (m.includes("quien eres") || m.includes("quién eres") || m.includes("tu nombre")) {
    return "Soy el asistente demo de ZyroAPI: respondo con reglas locales del servidor, sin ningún modelo de lenguaje. Transparente y rápido.";
  }
  return `Has dicho: "${message.trim().slice(0, 120)}". Soy una demo con reglas locales: prueba con "ayuda", "hora" o "chiste".`;
}

export async function GET(req: NextRequest) {
  const message = (req.nextUrl.searchParams.get("message") ?? "").trim();
  if (!message) {
    return fail("Parámetro 'message' requerido. Ejemplo: /api/ai/chat?message=Hola", 400);
  }
  if (message.length > 500) {
    return fail("El parámetro 'message' supera los 500 caracteres.", 400);
  }
  return ok({
    engine: "rule-based-demo",
    message,
    reply: replyFor(message),
    note: "Demo local basada en reglas. No es un modelo LLM.",
  });
}
