"use client";

import { TAGLINE } from "@/lib/endpoints";
import { IconClose, IconSearch } from "./ui";

interface HeroProps {
  query: string;
  onQuery: (value: string) => void;
  shown: number;
  total: number;
  categories: number;
}

const BADGES = ["Sin API Key", "Gratis", "REST"];

export function Hero({ query, onQuery, shown, total, categories }: HeroProps) {
  return (
    <section aria-label="Presentación" className="border-b border-[#E5E7EB] pb-6 dark:border-slate-800">
      <div className="flex flex-wrap gap-2">
        {BADGES.map((b) => (
          <span
            key={b}
            className="border border-[#1D4ED8] bg-blue-50 px-2 py-1 text-xs font-bold text-[#1D4ED8] dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-300"
          >
            {b}
          </span>
        ))}
      </div>

      <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-[#0F172A] dark:text-white sm:text-3xl">
        {TAGLINE}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300 sm:text-base">
        Documentación clara y minimalista. Todos los endpoints son reales, funcionan sin registro
        y devuelven JSON consistente — o imágenes listas para usar.
      </p>

      <div className="mt-4">
        <label htmlFor="endpoint-search" className="sr-only">
          Buscar endpoints por nombre, categoría o descripción
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <IconSearch className="h-4 w-4" />
          </span>
          <input
            id="endpoint-search"
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Buscar endpoints por nombre, categoría o descripción…"
            autoComplete="off"
            className="w-full border border-[#E5E7EB] bg-white py-2.5 pl-9 pr-9 text-sm text-[#0F172A] placeholder:text-slate-400 focus:border-[#1D4ED8] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQuery("")}
              aria-label="Limpiar búsqueda"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-[#0F172A] dark:hover:text-slate-200"
            >
              <IconClose className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <p className="font-semibold text-[#0F172A] dark:text-slate-100" aria-live="polite">
          {shown} de {total} endpoints disponibles
        </p>
        <p className="text-slate-500 dark:text-slate-400">
          {categories} categorías · 100% gratis · 0 claves
        </p>
      </div>
    </section>
  );
}
