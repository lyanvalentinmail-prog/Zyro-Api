import { colorFromString, escapeXml, initialsOf, wrapText } from "./api";
import { progressBar, shipResult } from "./fun";

/** Portada estilo «brat»: verde lima + texto negro centrado. */
export function bratSvg(rawText: string): string {
  const text = (rawText || "brat").slice(0, 60).trim().toLowerCase() || "brat";
  const lines = wrapText(text, 12).slice(0, 5);
  const fontSize = lines.length === 1 && text.length <= 8 ? 110 : lines.length <= 2 ? 78 : 58;
  const lineHeight = fontSize * 1.04;
  const startY = 256 - ((lines.length - 1) * lineHeight) / 2;
  const textEls = lines
    .map(
      (line, i) =>
        `<text x="256" y="${(startY + i * lineHeight).toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="500" letter-spacing="-2" fill="#000000">${escapeXml(line)}</text>`
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" fill="#8ACE00"/>${textEls}</svg>`;
}

/** Avatar cuadrado con iniciales. */
export function avatarSvg(name: string, size: number, bg: string, color: string): string {
  const initials = initialsOf(name);
  const fontSize = Math.round(size * 0.4);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" fill="#${bg}"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="600" fill="#${color}">${escapeXml(initials)}</text></svg>`;
}

/** Tarjeta ship: dos avatares, corazón y porcentaje. */
export function shipCardSvg(name1: string, name2: string): string {
  const a = name1.trim().slice(0, 20);
  const b = name2.trim().slice(0, 20);
  const { percentage } = shipResult(a, b);
  const bar = progressBar(percentage);
  const c1 = colorFromString(a);
  const c2 = colorFromString(b);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"><rect width="800" height="400" fill="#FFFFFF"/><rect x="8" y="8" width="784" height="384" fill="none" stroke="#E5E7EB" stroke-width="2"/><circle cx="200" cy="160" r="72" fill="#${c1}"/><text x="200" y="160" text-anchor="middle" dominant-baseline="central" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="700" fill="#FFFFFF">${escapeXml(initialsOf(a))}</text><circle cx="600" cy="160" r="72" fill="#${c2}"/><text x="600" y="160" text-anchor="middle" dominant-baseline="central" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="700" fill="#FFFFFF">${escapeXml(initialsOf(b))}</text><path d="M400 208 C 382 186, 348 170, 348 142 C 348 124, 362 114, 376 114 C 388 114, 396 122, 400 130 C 404 122, 412 114, 424 114 C 438 114, 452 124, 452 142 C 452 170, 418 186, 400 208 Z" fill="#E11D48"/><text x="400" y="262" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="800" fill="#0F172A">${percentage}%</text><text x="400" y="298" text-anchor="middle" font-family="monospace" font-size="22" fill="#1D4ED8">${bar}</text><text x="200" y="272" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="600" fill="#0F172A">${escapeXml(a)}</text><text x="600" y="272" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="600" fill="#0F172A">${escapeXml(b)}</text><text x="400" y="352" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="#94A3B8">ZyroAPI · ship</text></svg>`;
}

/** Tarjeta de cita (IQC) de 1200 × 630. */
export function iqcSvg(text: string, author: string): string {
  const clean = text.trim().slice(0, 280);
  const by = (author.trim() || "ZyroAPI").slice(0, 60);
  const lines = wrapText(`“${clean}”`, 34).slice(0, 7);
  const fontSize = lines.length <= 3 ? 56 : 44;
  const lineHeight = fontSize * 1.25;
  const startY = 315 - ((lines.length - 1) * lineHeight) / 2 - 20;
  const textEls = lines
    .map(
      (line, i) =>
        `<text x="130" y="${(startY + i * lineHeight).toFixed(1)}" font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" font-style="italic" fill="#0F172A">${escapeXml(line)}</text>`
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#FFFFFF"/><rect width="1200" height="630" fill="none" stroke="#E5E7EB" stroke-width="2"/><rect x="64" y="80" width="14" height="470" fill="#1D4ED8"/>${textEls}<text x="130" y="540" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="700" fill="#1D4ED8">— ${escapeXml(by)}</text><text x="1070" y="575" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#94A3B8">ZyroAPI</text></svg>`;
}
