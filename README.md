# ZyroAPI

Documentación profesional de **APIs REST gratuitas para tus proyectos**: 27 endpoints reales, sin API key y sin registro.

- **Diseño**: blanco minimalista, esquinas cuadradas, responsive mobile-first.
- **Stack**: Next.js 14, TypeScript, Tailwind CSS.
- **Modo claro / oscuro** con interruptor en la barra superior.

## Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) para ver la documentación.

## Producción

```bash
npm run build
npm start
```

## Estructura

```
app/
  page.tsx            # Documentación (búsqueda, categorías, endpoints)
  layout.tsx          # Layout + fuente Inter + tema
  globals.css         # Estilos globales (cuadrado total, sin redondeos)
  api/.../route.ts    # 27 rutas API reales
  s/[code]/route.ts   # Redirección del acortador
components/
  top-bar.tsx         # Barra superior (menú ☰, logo, versión, tema)
  sidebar.tsx         # Menú lateral deslizante
  hero.tsx            # Presentación + búsqueda + contador
  category-section.tsx# Secciones desplegables
  endpoint-card.tsx   # Ficha de cada endpoint
  try-panel.tsx       # Probador de endpoints con fetch real
  code-block / ui.tsx # Código con resaltado, copiar, insignias
lib/
  endpoints.ts        # Documentación centralizada (añade aquí tus endpoints)
  api.ts / fun.ts     # Utilidades del servidor
  svg.ts              # Generadores de imágenes SVG
  data.ts             # Citas, chistes y datos locales
  store.ts            # Almacén en memoria del acortador
```

## Añadir un endpoint

1. Crea la ruta real en `app/api/<categoria>/<nombre>/route.ts`.
2. Añade su ficha en `lib/endpoints.ts` con ejemplos que coincidan con la respuesta real.
3. Aparecerá automáticamente en la documentación, el buscador y el contador.

## Índice JSON

`GET /api` devuelve el catálogo completo de categorías y endpoints en JSON.
