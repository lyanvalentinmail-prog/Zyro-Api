import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZyroAPI — APIs REST gratuitas para tus proyectos",
  description:
    "Documentación de ZyroAPI: 27 endpoints REST gratuitos y sin API key. IA, imágenes, generadores, anime, herramientas, datos, diversión y utilidades.",
};

const THEME_INIT = `(function(){try{var t=localStorage.getItem('zyro-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="bg-white font-sans text-slate-600 dark:bg-[#0B1220] dark:text-slate-300">
        {children}
      </body>
    </html>
  );
}
