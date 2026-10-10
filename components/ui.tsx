"use client";

import { useState } from "react";

/* ---------------- Iconos (SVG inline, sin dependencias) ---------------- */

function baseIconProps(className?: string) {
  return {
    className: className ?? "h-4 w-4",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    viewBox: "0 0 24 24",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
}

export function IconMenu({ className }: { className?: string }) {
  return (
    <svg {...baseIconProps(className)}>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}

export function IconClose({ className }: { className?: string }) {
  return (
    <svg {...baseIconProps(className)}>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

export function IconSearch({ className }: { className?: string }) {
  return (
    <svg {...baseIconProps(className)}>
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </svg>
  );
}

export function IconChevron({ className }: { className?: string }) {
  return (
    <svg {...baseIconProps(className)}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function IconCopy({ className }: { className?: string }) {
  return (
    <svg {...baseIconProps(className)}>
      <rect x="9" y="9" width="12" height="12" rx="0" />
      <path d="M5 15V3h12" />
    </svg>
  );
}

export function IconCheck({ className }: { className?: string }) {
  return (
    <svg {...baseIconProps(className)}>
      <polyline points="4 12.5 9.5 18 20 6.5" />
    </svg>
  );
}

export function IconSun({ className }: { className?: string }) {
  return (
    <svg {...baseIconProps(className)}>
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
      <line x1="4.9" y1="4.9" x2="7" y2="7" />
      <line x1="17" y1="17" x2="19.1" y2="19.1" />
      <line x1="4.9" y1="19.1" x2="7" y2="17" />
      <line x1="17" y1="7" x2="19.1" y2="4.9" />
    </svg>
  );
}

export function IconMoon({ className }: { className?: string }) {
  return (
    <svg {...baseIconProps(className)}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

export function IconExternal({ className }: { className?: string }) {
  return (
    <svg {...baseIconProps(className)}>
      <path d="M14 4h6v6" />
      <path d="M20 4 10 14" />
      <path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5" />
    </svg>
  );
}

/* ---------------- Etiqueta de método HTTP ---------------- */

export function MethodBadge({ method }: { method: string }) {
  const styles =
    method === "GET"
      ? "bg-[#16A34A] text-white"
      : method === "POST"
        ? "bg-[#1D4ED8] text-white"
        : "bg-slate-500 text-white";
  return (
    <span className={`inline-block shrink-0 px-2 py-1 text-[11px] font-bold leading-none tracking-wide ${styles}`}>
      {method}
    </span>
  );
}

/* ---------------- Botón de copiar ---------------- */

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }
}

export function CopyButton({ text, label = "Copiar" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        const done = await copyText(text);
        if (done) {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        }
      }}
      className="inline-flex shrink-0 items-center gap-1.5 border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-[#1D4ED8] hover:text-[#1D4ED8] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-400 dark:hover:text-blue-300"
      aria-live="polite"
    >
      {copied ? <IconCheck className="h-3.5 w-3.5" /> : <IconCopy className="h-3.5 w-3.5" />}
      {copied ? "Copiado" : label}
    </button>
  );
}

/* ---------------- Resaltado JSON ligero ---------------- */

function highlightJson(code: string) {
  const nodes: React.ReactNode[] = [];
  const re = /("(?:[^"\\]|\\.)*")(?=\s*:)|("(?:[^"\\]|\\.)*")|\b(true|false)\b|\b(null)\b|(-?\d[\d.]*(?:[eE][+-]?\d+)?)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(code)) !== null) {
    if (m.index > last) nodes.push(<span key={k++}>{code.slice(last, m.index)}</span>);
    const [full, key, str, bool, nul, num] = m;
    if (key) nodes.push(<span key={k++} className="json-key">{key}</span>);
    else if (str) nodes.push(<span key={k++} className="json-string">{str}</span>);
    else if (bool) nodes.push(<span key={k++} className="json-bool">{bool}</span>);
    else if (nul) nodes.push(<span key={k++} className="json-null">{nul}</span>);
    else if (num) nodes.push(<span key={k++} className="json-number">{num}</span>);
    else nodes.push(<span key={k++}>{full}</span>);
    last = m.index + full.length;
  }
  if (last < code.length) nodes.push(<span key={k++}>{code.slice(last)}</span>);
  return nodes;
}

/* ---------------- Bloque de código ---------------- */

export function CodeBlock({
  code,
  language = "json",
  title,
}: {
  code: string;
  language?: "json" | "js" | "bash" | "text";
  title: string;
}) {
  return (
    <div className="border border-[#E5E7EB] bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between gap-2 border-b border-[#E5E7EB] px-3 py-2 dark:border-slate-800">
        <span className="truncate text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <CopyButton text={code} />
      </div>
      <pre className="max-w-full overflow-x-auto p-3 font-mono text-slate-800 dark:text-slate-200">
        <code>{language === "json" ? highlightJson(code) : code}</code>
      </pre>
    </div>
  );
}
