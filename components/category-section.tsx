"use client";

import type { ReactNode } from "react";
import { IconChevron } from "./ui";

interface CategorySectionProps {
  slug: string;
  name: string;
  description: string;
  count: number;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export function CategorySection({
  slug,
  name,
  description,
  count,
  open,
  onToggle,
  children,
}: CategorySectionProps) {
  return (
    <section id={`cat-${slug}`} aria-label={name} className="scroll-mt-20">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`cat-body-${slug}`}
        className="flex w-full items-center gap-3 border border-[#E5E7EB] bg-white px-3 py-3 text-left transition-colors hover:border-[#1D4ED8] dark:border-slate-800 dark:bg-slate-900/40 sm:px-4"
      >
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center bg-[#0F172A] text-white transition-transform dark:bg-slate-700 ${
            open ? "rotate-180" : ""
          }`}
        >
          <IconChevron className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-base font-extrabold text-[#0F172A] dark:text-white sm:text-lg">
              {name}
            </span>
            <span className="bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {count}
            </span>
          </span>
          <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            {description}
          </span>
        </span>
      </button>

      {open && (
        <div id={`cat-body-${slug}`} className="mt-3 space-y-3">
          {children}
        </div>
      )}
    </section>
  );
}
