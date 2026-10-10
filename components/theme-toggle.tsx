"use client";

import { useEffect, useState } from "react";
import { IconMoon, IconSun } from "./ui";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("zyro-theme", next ? "dark" : "light");
    } catch {
      /* almacenamiento no disponible */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={dark ? "Modo claro" : "Modo oscuro"}
      className="flex h-9 w-9 items-center justify-center border border-[#E5E7EB] bg-white text-slate-600 transition-colors hover:border-[#1D4ED8] hover:text-[#1D4ED8] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-400 dark:hover:text-blue-300"
    >
      {mounted ? (dark ? <IconSun className="h-4 w-4" /> : <IconMoon className="h-4 w-4" />) : (
        <span className="h-4 w-4" />
      )}
    </button>
  );
}
