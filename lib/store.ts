/** Almacén en memoria para el acortador de URLs. */

export interface ShortLink {
  url: string;
  createdAt: string;
  hits: number;
}

const globalForStore = globalThis as unknown as {
  __zyroShortLinks?: Map<string, ShortLink>;
};

export function shortLinkStore(): Map<string, ShortLink> {
  if (!globalForStore.__zyroShortLinks) {
    globalForStore.__zyroShortLinks = new Map<string, ShortLink>();
  }
  return globalForStore.__zyroShortLinks;
}

const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function randomCode(length = 6): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
}
