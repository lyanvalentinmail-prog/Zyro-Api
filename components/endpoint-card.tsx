"use client";

import { useState } from "react";
import type { ApiEndpoint } from "@/lib/endpoints";
import { curlExampleFor, jsExampleFor } from "@/lib/endpoints";
import { TryPanel } from "./try-panel";
import { CodeBlock, CopyButton, IconChevron, IconExternal, MethodBadge } from "./ui";

function PreviewImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <p className="mt-2 border border-dashed border-[#E5E7EB] bg-white px-3 py-4 text-center text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        Vista previa no disponible. Usa «Probar endpoint» o abre el ejemplo original.
      </p>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className="mt-2 max-h-56 w-auto max-w-full border border-[#E5E7EB] bg-white dark:border-slate-800"
    />
  );
}

interface EndpointCardProps {
  endpoint: ApiEndpoint;
  open: boolean;
  onToggle: () => void;
  origin: string;
}

export function EndpointCard({ endpoint: ep, open, onToggle, origin }: EndpointCardProps) {
  const fullRequestUrl = `${origin}${ep.exampleRequest}`;

  return (
    <article
      id={`ep-${ep.id}`}
      className="scroll-mt-32 border border-[#E5E7EB] bg-white dark:border-slate-800 dark:bg-slate-900/40"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`ep-body-${ep.id}`}
        className="flex w-full items-center gap-2 px-3 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 sm:gap-3 sm:px-4"
      >
        <MethodBadge method={ep.method} />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-mono text-[13px] font-semibold text-[#0F172A] dark:text-slate-100 sm:text-sm">
            {ep.path}
          </span>
          <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
            {ep.name}
          </span>
        </span>
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center border border-[#E5E7EB] text-slate-500 transition-transform dark:border-slate-700 dark:text-slate-300 ${
            open ? "rotate-180" : ""
          }`}
        >
          <IconChevron className="h-4 w-4" />
        </span>
      </button>

      {open && (
        <div id={`ep-body-${ep.id}`} className="space-y-5 border-t border-[#E5E7EB] px-3 py-4 dark:border-slate-800 sm:px-4">
          <div>
            <h4 className="text-sm font-bold text-[#0F172A] dark:text-white">{ep.name}</h4>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{ep.description}</p>
            {ep.note && (
              <p className="mt-2 border-l-2 border-[#1D4ED8] bg-blue-50 px-3 py-2 text-xs text-slate-700 dark:bg-blue-950/40 dark:text-slate-300">
                {ep.note}
              </p>
            )}
          </div>

          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Solicitud
            </h4>
            <div className="flex items-stretch gap-2">
              <div className="flex min-w-0 flex-1 items-center gap-2 border border-[#E5E7EB] bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950">
                <MethodBadge method={ep.method} />
                <span className="truncate font-mono text-xs text-[#0F172A] dark:text-slate-100">
                  {fullRequestUrl}
                </span>
              </div>
              <CopyButton text={fullRequestUrl} label="URL" />
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Parámetros
            </h4>
            {ep.params.length === 0 ? (
              <p className="border border-dashed border-[#E5E7EB] px-3 py-2 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                Este endpoint no necesita parámetros.
              </p>
            ) : (
              <div className="max-w-full overflow-x-auto border border-[#E5E7EB] dark:border-slate-800">
                <table className="params-table min-w-[560px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                      <th className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Nombre</th>
                      <th className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tipo</th>
                      <th className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Obligatorio</th>
                      <th className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Descripción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ep.params.map((p) => (
                      <tr key={p.name} className="border-b border-[#E5E7EB] last:border-0 dark:border-slate-800">
                        <td className="whitespace-nowrap px-3 py-2 font-mono text-xs font-semibold text-[#1D4ED8] dark:text-blue-300">
                          {p.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 font-mono text-xs text-slate-600 dark:text-slate-300">
                          {p.type}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2">
                          {p.required ? (
                            <span className="bg-green-100 px-1.5 py-0.5 text-[11px] font-bold text-green-800 dark:bg-green-950 dark:text-green-300">
                              Sí
                            </span>
                          ) : (
                            <span className="bg-slate-100 px-1.5 py-0.5 text-[11px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                              No
                            </span>
                          )}
                        </td>
                        <td className="min-w-[220px] px-3 py-2 text-[13px] text-slate-600 dark:text-slate-300">
                          {p.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Respuesta de ejemplo
            </h4>
            {ep.responseType === "json" ? (
              <CodeBlock code={ep.exampleResponse} language="json" title="application/json" />
            ) : (
              <div className="border border-[#E5E7EB] bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm text-slate-600 dark:text-slate-300">{ep.responseHint}</p>
                <PreviewImage src={ep.exampleRequest} alt={`Vista previa de ${ep.path}`} />
                <a
                  href={ep.exampleRequest}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#1D4ED8] hover:underline dark:text-blue-300"
                >
                  Abrir ejemplo original <IconExternal className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
          </div>

          <div className="grid gap-3">
            <CodeBlock code={jsExampleFor(origin || "", ep)} language="js" title="JavaScript · fetch" />
            <CodeBlock code={curlExampleFor(origin || "", ep)} language="bash" title="cURL" />
          </div>

          <TryPanel endpoint={ep} />
        </div>
      )}
    </article>
  );
}
