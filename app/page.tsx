"use client";

import { useEffect, useMemo, useState } from "react";
import { CategorySection } from "@/components/category-section";
import { EndpointCard } from "@/components/endpoint-card";
import { Hero } from "@/components/hero";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import { CATEGORIES, TOTAL_ENDPOINTS, VERSION } from "@/lib/endpoints";

const DEFAULT_OPEN_ENDPOINTS = CATEGORIES.flatMap((c) => c.endpoints)
  .filter((e) => e.openByDefault)
  .map((e) => e.id);

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [openCats, setOpenCats] = useState<Set<string>>(
    () => new Set(CATEGORIES.map((c) => c.slug))
  );
  const [openEps, setOpenEps] = useState<Set<string>>(() => new Set(DEFAULT_OPEN_ENDPOINTS));
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const q = query.trim().toLowerCase();
  const searching = q.length > 0;

  const filtered = useMemo(() => {
    if (!searching) return CATEGORIES;
    return CATEGORIES.map((cat) => ({
      ...cat,
      endpoints: cat.endpoints.filter((e) =>
        `${e.name} ${e.path} ${e.description} ${cat.name} ${cat.slug} ${e.id}`
          .toLowerCase()
          .includes(q)
      ),
    })).filter((cat) => cat.endpoints.length > 0);
  }, [q, searching]);

  const shownCount = filtered.reduce((acc, c) => acc + c.endpoints.length, 0);

  function toggleCat(slug: string) {
    setOpenCats((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function toggleEp(id: string) {
    setOpenEps((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function isCatOpen(slug: string): boolean {
    if (searching) return true;
    return openCats.has(slug);
  }

  function isEpOpen(id: string): boolean {
    if (searching) return true;
    return openEps.has(id);
  }

  return (
    <div id="top" className="min-h-screen scroll-mt-20">
      <TopBar onOpenMenu={() => setMenuOpen(true)} total={TOTAL_ENDPOINTS} />
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} categories={CATEGORIES} total={TOTAL_ENDPOINTS} />

      <div className="lg:pl-72">
        <main className="mx-auto w-full max-w-5xl px-3 py-5 sm:px-6 sm:py-8">
          <Hero query={query} onQuery={setQuery} shown={shownCount} total={TOTAL_ENDPOINTS} categories={CATEGORIES.length} />

          {filtered.length === 0 ? (
            <div className="mt-6 border border-dashed border-[#E5E7EB] px-4 py-10 text-center dark:border-slate-700">
              <p className="text-base font-bold text-[#0F172A] dark:text-white">
                Sin resultados para «{query.trim()}»
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Prueba con otro nombre, categoría o descripción.
              </p>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="mt-4 bg-[#1D4ED8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1E40AF]"
              >
                Limpiar búsqueda
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              {filtered.map((cat) => (
                <CategorySection
                  key={cat.slug}
                  slug={cat.slug}
                  name={cat.name}
                  description={cat.description}
                  count={cat.endpoints.length}
                  open={isCatOpen(cat.slug)}
                  onToggle={() => toggleCat(cat.slug)}
                >
                  {cat.endpoints.map((ep) => (
                    <EndpointCard
                      key={ep.id}
                      endpoint={ep}
                      open={isEpOpen(ep.id)}
                      onToggle={() => toggleEp(ep.id)}
                      origin={origin}
                    />
                  ))}
                </CategorySection>
              ))}
            </div>
          )}

          <footer className="mt-10 border-t border-[#E5E7EB] pt-6 text-sm dark:border-slate-800">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-bold text-[#0F172A] dark:text-white">
                Zyro<span className="text-[#1D4ED8] dark:text-blue-400">API</span>
                <span className="ml-2 font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {VERSION}
                </span>
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                APIs REST gratuitas · Sin API key · Hecho con Next.js
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              <a href="/api" className="font-semibold text-[#1D4ED8] hover:underline dark:text-blue-300">
                Índice JSON de la API
              </a>
              <a href="#top" className="font-semibold text-[#1D4ED8] hover:underline dark:text-blue-300">
                Volver arriba
              </a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
