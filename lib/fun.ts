import { hashStr } from "./api";

/** Barra de progreso textual de 10 bloques. */
export function progressBar(pct: number): string {
  const filled = Math.round(pct / 10);
  return "█".repeat(filled) + "░".repeat(10 - filled);
}

export function shipMessage(pct: number): string {
  if (pct >= 90) return "¡Combinación legendaria!";
  if (pct >= 70) return "¡Hay mucha química!";
  if (pct >= 50) return "Buena compatibilidad.";
  if (pct >= 30) return "Podría funcionar con esfuerzo.";
  return "Mejor como amigos.";
}

export function shipResult(name1: string, name2: string) {
  const pct = hashStr(`${name1.toLowerCase().trim()}|${name2.toLowerCase().trim()}`) % 101;
  return { percentage: pct, bar: progressBar(pct), message: shipMessage(pct) };
}

export function iqLevel(iq: number): string {
  if (iq < 85) return "Por debajo del promedio";
  if (iq < 100) return "Promedio bajo";
  if (iq < 115) return "Promedio alto";
  if (iq < 130) return "Superior";
  if (iq < 145) return "Muy superior";
  return "Genio";
}

export function iqResult(name: string) {
  const iq = 70 + (hashStr(name.toLowerCase().trim()) % 96); // 70–165
  return { iq, level: iqLevel(iq) };
}

export function gayrateMessage(pct: number): string {
  if (pct < 20) return "Esencialmente clásico, con estilo.";
  if (pct < 40) return "Un toque de fabulousidad.";
  if (pct < 60) return "Equilibrio perfecto.";
  if (pct < 80) return "Nivel de fabulousidad considerable.";
  return "¡Fabulosidad máxima!";
}

export function gayrateResult(name: string) {
  const pct = hashStr(`gayrate:${name.toLowerCase().trim()}`) % 101;
  return { percentage: pct, bar: progressBar(pct), message: gayrateMessage(pct) };
}
