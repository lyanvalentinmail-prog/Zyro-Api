"use client";

import { SITE_NAME, VERSION } from "@/lib/endpoints";
import { ThemeToggle } from "./theme-toggle";
import { IconMenu } from "./ui";

export function TopBar({ onOpenMenu, total }: { onOpenMenu: () => void; total: number }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-white dark:border-slate-800 dark:bg-[#0B1220]">
      <div className="flex h-14 items-center gap-2 px-3 sm:gap-3 sm:px-4">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Abrir menú de navegación"
          className="flex h-9 w-9 items-center justify-center border border-[#E5E7EB] text-[#0F172A] transition-colors hover:border-[#1D4ED8] hover:text-[#1D4ED8] dark:border-slate-700 dark:text-slate-200 lg:hidden"
        >
          <IconMenu className="h-5 w-5" />
        </button>

        <a href="#top" className="flex min-w-0 items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-[#1D4ED8] text-sm font-extrabold text-white">
            Z
          </span>
          <span className="truncate text-base font-extrabold tracking-tight text-[#0F172A] dark:text-white sm:text-lg">
            Zyro<span className="text-[#1D4ED8] dark:text-blue-400">API</span>
          </span>
        </a>

        <span className="shrink-0 border border-[#E5E7EB] bg-slate-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          {VERSION}
        </span>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden shrink-0 border border-[#E5E7EB] px-2 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300 md:inline-block">
            {total} endpoints
          </span>
          <span className="sr-only">{SITE_NAME}</span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
