import { NextRequest } from "next/server";
import { clampInt, fail, ok } from "@/lib/api";

const STOPWORDS = new Set(
  "el la los las un una unos unas de del en y o que es son fue fueron ser estar con por para como más pero sus su al se no sí una este esta estos estas aquel aquello muy sin sobre entre cuando donde quien porque pues así tan hasta desde también tras durante siempre nunca cada hay son era eran ha han tiene tienen puede pueden hace hacen dos tres solo sólo".split(" ")
    .concat("the a an and or of to in is are was were be been being with for on as at by from has have had it its this that these those but not you your we our they their he she him her his hers will would can could should there here when where which who whom what how why if then than so such no yes do does did done".split(" "))
);

function splitSentences(text: string): string[] {
  const matches = text.match(/[^.!?]+[.!?]+/g);
  const sentences = (matches ?? [text]).map((s) => s.trim()).filter((s) => s.length > 0);
  return sentences.length > 0 ? sentences : [text.trim()];
}

function summarize(text: string, count: number): string {
  const sentences = splitSentences(text);
  if (sentences.length <= count) return sentences.join(" ");

  const freq = new Map<string, number>();
  for (const word of text.toLowerCase().match(/[a-záéíóúñü]+/g) ?? []) {
    if (word.length < 3 || STOPWORDS.has(word)) continue;
    freq.set(word, (freq.get(word) ?? 0) + 1);
  }

  const scored = sentences.map((sentence, index) => {
    const words = sentence.toLowerCase().match(/[a-záéíóúñü]+/g) ?? [];
    let score = 0;
    for (const word of words) {
      if (!STOPWORDS.has(word)) score += freq.get(word) ?? 0;
    }
    // Ligera preferencia por las primeras frases y longitud media.
    score += Math.max(0, 3 - index) * 0.5;
    return { sentence, index, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .sort((a, b) => a.index - b.index)
    .map((s) => s.sentence)
    .join(" ");
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const text = (sp.get("text") ?? "").trim();
  const sentences = clampInt(sp.get("sentences"), 3, 1, 5);

  if (!text) {
    return fail("Parámetro 'text' requerido. Ejemplo: /api/ai/summarize?text=Un%20texto%20largo...", 400);
  }
  if (text.length < 40) {
    return fail("El parámetro 'text' debe tener al menos 40 caracteres.", 400);
  }
  if (text.length > 5000) {
    return fail("El parámetro 'text' supera los 5000 caracteres.", 400);
  }

  return ok({
    method: "extractive-frequency",
    original_length: text.length,
    sentences,
    summary: summarize(text, sentences),
  });
}
