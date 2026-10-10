"use client";

import { useEffect, useRef, useState } from "react";
import type { ApiEndpoint } from "@/lib/endpoints";
import { CodeBlock, IconExternal } from "./ui";

interface TryResult {
  ok: boolean;
  status: number;
  ms: number;
  contentType: string;
  url: string;
  text: string;
  isImage: boolean;
  imageSrc?: string;
}

export function TryPanel({ endpoint }: { endpoint: ApiEndpoint }) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(endpoint.params.map((p) => [p.name, p.example ?? ""]))
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  function buildUrl(): string {
    const qs = new URLSearchParams();
    for (const p of endpoint.params) {
      const v = (values[p.name] ?? "").trim();
      if (v !== "") qs.set(p.name, v);
    }
    const query = qs.toString();
    return query ? `${endpoint.path}?${query}` : endpoint.path;
  }

  async function run() {
    const url = buildUrl();
    setLoading(true);
    setError(null);
    setResult(null);
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    const t0 = performance.now();
    try {
      const res = await fetch(url);
      const ms = Math.max(1, Math.round(performance.now() - t0));
      const contentType = res.headers.get("content-type") ?? "desconocido";
      if (contentType.startsWith("image/")) {
        const blob = await res.blob();
        const src = URL.createObjectURL(blob);
        objectUrlRef.current = src;
        setResult({ ok: res.ok, status: res.status, ms, contentType, url, text: "", isImage: true, imageSrc: src });
      } else {
        const raw = await res.text();
        let pretty = raw;
        try {
          pretty = JSON.stringify(JSON.parse(raw), null, 2);
        } catch {
          /* no es JSON: se muestra tal cual */
        }
        setResult({ ok: res.ok, status: res.status, ms, contentType, url, text: pretty, isImage: false });
      }
    } catch {
      setError("No se pudo completar la solicitud. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section aria-label={`Probar ${endpoint.path}`} className="border border-[#E5E7EB] bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/60 sm:p-4">
      <h4 className="text-sm font-bold text-[#0F172A] dark:text-white">Probar endpoint</h4>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        Solicitud HTTP real al servidor. Sin API key.
      </p>

      {endpoint.params.length > 0 && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {endpoint.params.map((p) => (
            <label key={p.name} className="block">
              <span className="mb-1 flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span className="font-mono">{p.name}</span>
                {p.required ? (
                  <span className="bg-red-100 px-1 py-0.5 text-[10px] font-bold uppercase text-red-700 dark:bg-red-950 dark:text-red-300">
                    requerido
                  </span>
                ) : (
                  <span className="bg-slate-200 px-1 py-0.5 text-[10px] font-bold uppercase text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                    opcional
                  </span>
                )}
              </span>
              <input
                type="text"
                value={values[p.name] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [p.name]: e.target.value }))}
                placeholder={p.example ?? p.type}
                className="w-full border border-[#E5E7EB] bg-white px-2.5 py-2 font-mono text-xs text-[#0F172A] placeholder:text-slate-400 focus:border-[#1D4ED8] focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={run}
          disabled={loading}
          className="bg-[#1D4ED8] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1E40AF] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Enviando…" : "Probar endpoint"}
        </button>
        <span className="max-w-full truncate font-mono text-xs text-slate-500 dark:text-slate-400">
          {buildUrl()}
        </span>
      </div>

      {error && (
        <div role="alert" className="mt-3 border-l-2 border-red-600 bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-200">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-3 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span
              className={`px-2 py-1 font-bold ${
                result.ok
                  ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
                  : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
              }`}
            >
              HTTP {result.status}
            </span>
            <span className="bg-slate-200 px-2 py-1 font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
              {result.ms} ms
            </span>
            <span className="max-w-full truncate bg-slate-200 px-2 py-1 font-mono text-slate-700 dark:bg-slate-700 dark:text-slate-200">
              {result.contentType}
            </span>
          </div>

          {result.isImage && result.imageSrc ? (
            <div className="border border-[#E5E7EB] bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.imageSrc}
                alt={`Respuesta de ${endpoint.path}`}
                className="max-h-72 w-auto max-w-full border border-[#E5E7EB] dark:border-slate-800"
                loading="lazy"
              />
              <a
                href={result.url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#1D4ED8] hover:underline dark:text-blue-300"
              >
                Abrir imagen original <IconExternal className="h-3.5 w-3.5" />
              </a>
            </div>
          ) : (
            <CodeBlock code={result.text} language="json" title="Respuesta del servidor" />
          )}
        </div>
      )}
    </section>
  );
}
