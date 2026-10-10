"use client";

import type { ApiCategory } from "@/lib/endpoints";
import { VERSION } from "@/lib/endpoints";
import { IconClose } from "./ui";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  categories: ApiCategory[];
  total: number;
}

export function Sidebar({ open, onClose, categories, total }: SidebarProps) {
  return (
    <>
      {/* Fondo oscuro solo en móvil cuando el menú está abierto */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`sidebar-panel fixed inset-y-0 left-0 z-50 flex w-80 max-w-[85vw] flex-col border-r border-[#E5E7EB] bg-white dark:border-slate-800 dark:bg-[#0B1220] lg:bottom-0 lg:top-14 lg:z-30 lg:w-72 lg:max-w-none ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        aria-label="Navegación de la documentación"
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#E5E7EB] px-4 dark:border-slate-800 lg:hidden">
          <span className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center bg-[#1D4ED8] text-xs font-extrabold text-white">
              Z
            </span>
            <span className="text-sm font-extrabold text-[#0F172A] dark:text-white">
              Zyro<span className="text-[#1D4ED8] dark:text-blue-400">API</span>
            </span>
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú de navegación"
            className="flex h-9 w-9 items-center justify-center border border-[#E5E7EB] text-[#0F172A] hover:border-[#1D4ED8] hover:text-[#1D4ED8] dark:border-slate-700 dark:text-slate-200"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
          <a
            href="#top"
            onClick={onClose}
            className="block border border-transparent px-2 py-2 text-sm font-semibold text-[#0F172A] hover:border-[#E5E7EB] hover:bg-slate-50 dark:text-slate-100 dark:hover:border-slate-700 dark:hover:bg-slate-900"
          >
            Inicio
          </a>

          <p className="mb-1 mt-4 px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Categorías · {total}
          </p>

          <ul className="space-y-4">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <a
                  href={`#cat-${cat.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between gap-2 border border-[#E5E7EB] bg-slate-50 px-2 py-2 text-sm font-bold text-[#0F172A] hover:border-[#1D4ED8] dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-100"
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="shrink-0 bg-white px-1.5 py-0.5 font-mono text-[11px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                    {cat.endpoints.length}
                  </span>
                </a>
                <ul className="mt-1 space-y-px border-l border-[#E5E7EB] pl-2 dark:border-slate-800">
                  {cat.endpoints.map((ep) => (
                    <li key={ep.id}>
                      <a
                        href={`#ep-${ep.id}`}
                        onClick={onClose}
                        className="flex items-center gap-2 px-2 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-[#1D4ED8] dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-blue-300"
                      >
                        <span className="shrink-0 bg-[#16A34A] px-1 py-0.5 text-[9px] font-bold leading-none text-white">
                          GET
                        </span>
                        <span className="truncate font-mono text-xs">{ep.path}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-[#E5E7EB] px-4 py-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <p className="font-semibold text-slate-600 dark:text-slate-300">{VERSION} · Sin API Key</p>
          <p className="mt-0.5">Gratis para tus proyectos.</p>
        </div>
      </aside>
    </>
  );
}
