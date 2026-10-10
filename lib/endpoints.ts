/**
 * Documentación centralizada de ZyroAPI.
 * Para añadir un endpoint nuevo:
 *  1. Crea su ruta real en `app/api/.../route.ts`.
 *  2. Añade su ficha aquí (sin inventar respuestas: el ejemplo debe
 *     coincidir con la forma real que devuelve el servidor).
 */

export const VERSION = "v1.0.0";
export const SITE_NAME = "ZyroAPI";
export const TAGLINE = "APIs REST gratuitas para tus proyectos";

export type HttpMethod = "GET";
export type ResponseType = "json" | "image";

export interface ApiParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
}

export interface ApiEndpoint {
  id: string;
  method: HttpMethod;
  path: string;
  name: string;
  description: string;
  params: ApiParam[];
  /** Ruta con query de ejemplo, p. ej. "/api/data/quote?lang=es" */
  exampleRequest: string;
  /** JSON de ejemplo tal cual lo devuelve el servidor ("" si es imagen). */
  exampleResponse: string;
  responseType: ResponseType;
  /** Texto mostrado cuando la respuesta es una imagen. */
  responseHint?: string;
  note?: string;
  openByDefault?: boolean;
}

export interface ApiCategory {
  slug: string;
  name: string;
  description: string;
  endpoints: ApiEndpoint[];
}

export const CATEGORIES: ApiCategory[] = [
  {
    slug: "ia",
    name: "IA / Chat",
    description: "Utilidades de texto: traducción, resúmenes y un asistente de demostración.",
    endpoints: [
      {
        id: "ai-chat",
        method: "GET",
        path: "/api/ai/chat",
        name: "Chat demo",
        description:
          "Asistente conversacional de demostración que responde con reglas locales. Ideal para probar flujos de chat sin API key.",
        params: [
          { name: "message", type: "string", required: true, description: "Mensaje del usuario.", example: "Hola, ¿qué puedes hacer?" },
        ],
        exampleRequest: "/api/ai/chat?message=Hola%2C%20%C2%BFqu%C3%A9%20puedes%20hacer%3F",
        exampleResponse: `{
  "status": true,
  "creator": "ZyroAPI",
  "engine": "rule-based-demo",
  "message": "Hola, ¿qué puedes hacer?",
  "reply": "Puedo ayudarte con: decir la hora (escribe \\"hora\\"), contar un chiste (\\"chiste\\"), listar endpoints (\\"endpoints\\") o saludarte. Soy una demo con reglas locales.",
  "note": "Demo local basada en reglas. No es un modelo LLM."
}`,
        responseType: "json",
        note: "Demo transparente: las respuestas se generan con reglas locales en el servidor, no con un modelo de lenguaje.",
      },
      {
        id: "ai-translate",
        method: "GET",
        path: "/api/ai/translate",
        name: "Traductor",
        description: "Traduce texto entre idiomas usando un proveedor gratuito. Sin API key y con caché del proveedor.",
        params: [
          { name: "text", type: "string", required: true, description: "Texto a traducir (máx. 500 caracteres).", example: "Hello world" },
          { name: "from", type: "string", required: false, description: "Idioma de origen (ISO 639-1). Por defecto: en.", example: "en" },
          { name: "to", type: "string", required: false, description: "Idioma de destino (ISO 639-1). Por defecto: es.", example: "es" },
        ],
        exampleRequest: "/api/ai/translate?text=Hello%20world&from=en&to=es",
        exampleResponse: `{
  "status": true,
  "creator": "ZyroAPI",
  "provider": "mymemory",
  "from": "en",
  "to": "es",
  "original": "Hello world",
  "translated": "Hola mundo"
}`,
        responseType: "json",
      },
      {
        id: "ai-summarize",
        method: "GET",
        path: "/api/ai/summarize",
        name: "Resumidor extractivo",
        description:
          "Resume un texto largo seleccionando sus frases más relevantes con un algoritmo local de frecuencia de palabras.",
        params: [
          { name: "text", type: "string", required: true, description: "Texto a resumir (mín. 40 caracteres, máx. 5000).", example: "ZyroAPI ofrece endpoints gratuitos. No requiere API key. La documentación es clara y minimalista. Cada respuesta sigue un formato consistente." },
          { name: "sentences", type: "integer", required: false, description: "Nº de frases del resumen (1–5). Por defecto: 3.", example: "2" },
        ],
        exampleRequest: "/api/ai/summarize?sentences=2&text=ZyroAPI%20ofrece%20endpoints%20gratuitos.%20No%20requiere%20API%20key.",
        exampleResponse: `{
  "status": true,
  "creator": "ZyroAPI",
  "method": "extractive-frequency",
  "original_length": 612,
  "sentences": 2,
  "summary": "ZyroAPI ofrece endpoints gratuitos. No requiere API key."
}`,
        responseType: "json",
      },
    ],
  },
  {
    slug: "imagenes",
    name: "Imágenes",
    description: "Imágenes aleatorias, avatares y generadores de imágenes reales.",
    endpoints: [
      {
        id: "image-random",
        method: "GET",
        path: "/api/image/random",
        name: "Imagen aleatoria",
        description: "Devuelve una fotografía aleatoria. La API redirige a la imagen, lista para usar en un <img>.",
        params: [
          { name: "width", type: "integer", required: false, description: "Ancho en píxeles (1–2000). Por defecto: 800.", example: "800" },
          { name: "height", type: "integer", required: false, description: "Alto en píxeles (1–2000). Por defecto: 600.", example: "600" },
          { name: "seed", type: "string", required: false, description: "Semilla para obtener siempre la misma imagen.", example: "zyro" },
        ],
        exampleRequest: "/api/image/random?width=800&height=600&seed=zyro",
        exampleResponse: "",
        responseType: "image",
        responseHint: "Redirección HTTP 307 a una fotografía (image/jpeg).",
      },
      {
        id: "image-brat",
        method: "GET",
        path: "/api/image/brat",
        name: "Portada estilo brat",
        description: "Genera una imagen estilo «brat»: fondo verde lima con tu texto en negro, centrada y lista para compartir.",
        params: [
          { name: "text", type: "string", required: false, description: "Texto de la portada (máx. 60 caracteres). Por defecto: brat.", example: "hola mundo" },
        ],
        exampleRequest: "/api/image/brat?text=hola%20mundo",
        exampleResponse: "",
        responseType: "image",
        responseHint: "Imagen SVG de 512 × 512 (image/svg+xml) generada en el servidor.",
      },
      {
        id: "image-cat",
        method: "GET",
        path: "/api/image/cat",
        name: "Gato aleatorio",
        description: "Devuelve la foto de un gato aleatorio. Redirige a la imagen, lista para usar en un <img>.",
        params: [
          { name: "width", type: "integer", required: false, description: "Ancho en píxeles (opcional).", example: "600" },
          { name: "height", type: "integer", required: false, description: "Alto en píxeles (opcional).", example: "600" },
        ],
        exampleRequest: "/api/image/cat?width=600&height=600",
        exampleResponse: "",
        responseType: "image",
        responseHint: "Redirección HTTP 307 a una foto de gato (image/jpeg).",
      },
      {
        id: "image-avatar",
        method: "GET",
        path: "/api/image/avatar",
        name: "Avatar con iniciales",
        description: "Genera un avatar cuadrado con las iniciales del nombre y un color de fondo determinista.",
        params: [
          { name: "name", type: "string", required: true, description: "Nombre para extraer las iniciales.", example: "Ana García" },
          { name: "size", type: "integer", required: false, description: "Tamaño en píxeles (32–1024). Por defecto: 256.", example: "256" },
          { name: "bg", type: "string", required: false, description: "Color de fondo en hex sin #. Por defecto: automático.", example: "1D4ED8" },
          { name: "color", type: "string", required: false, description: "Color del texto en hex sin #. Por defecto: FFFFFF.", example: "FFFFFF" },
        ],
        exampleRequest: "/api/image/avatar?name=Ana%20Garc%C3%ADa&size=256",
        exampleResponse: "",
        responseType: "image",
        responseHint: "Imagen SVG cuadrada (image/svg+xml) generada en el servidor.",
      },
      {
        id: "image-ship",
        method: "GET",
        path: "/api/image/ship",
        name: "Imagen ship",
        description: "Genera una tarjeta con dos nombres, su porcentaje de compatibilidad y un corazón.",
        params: [
          { name: "name1", type: "string", required: true, description: "Primer nombre.", example: "Ana" },
          { name: "name2", type: "string", required: true, description: "Segundo nombre.", example: "Luis" },
        ],
        exampleRequest: "/api/image/ship?name1=Ana&name2=Luis",
        exampleResponse: "",
        responseType: "image",
        responseHint: "Imagen SVG de 800 × 400 (image/svg+xml) generada en el servidor.",
      },
    ],
  },
  {
    slug: "generadores",
    name: "Generadores",
    description: "Creadores de tarjetas, porcentajes y compatibilidades.",
    endpoints: [
      {
        id: "maker-iqc",
        method: "GET",
        path: "/api/maker/iqc",
        name: "Tarjeta de cita (IQC)",
        description: "Genera una tarjeta de cita con tu texto y autor, ideal para compartir en redes.",
        params: [
          { name: "text", type: "string", required: true, description: "Texto de la cita (máx. 280 caracteres).", example: "Hazlo simple, hazlo real." },
          { name: "author", type: "string", required: false, description: "Autor de la cita. Por defecto: ZyroAPI.", example: "ZyroAPI" },
        ],
        exampleRequest: "/api/maker/iqc?text=Hazlo%20simple%2C%20hazlo%20real.&author=ZyroAPI",
        exampleResponse: "",
        responseType: "image",
        responseHint: "Imagen SVG de 1200 × 630 (image/svg+xml) generada en el servidor.",
      },
      {
        id: "maker-ship",
        method: "GET",
        path: "/api/maker/ship",
        name: "Compatibilidad (JSON)",
        description: "Calcula el porcentaje de compatibilidad entre dos nombres de forma determinista.",
        params: [
          { name: "name1", type: "string", required: true, description: "Primer nombre.", example: "Ana" },
          { name: "name2", type: "string", required: true, description: "Segundo nombre.", example: "Luis" },
        ],
        exampleRequest: "/api/maker/ship?name1=Ana&name2=Luis",
        exampleResponse: `{
  "status": true,
  "creator": "ZyroAPI",
  "name1": "Ana",
  "name2": "Luis",
  "percentage": 87,
  "bar": "█████████░",
  "message": "¡Combinación legendaria!"
}`,
        responseType: "json",
      },
      {
        id: "maker-brat",
        method: "GET",
        path: "/api/maker/brat",
        name: "Portada estilo brat",
        description: "Alias de /api/image/brat: genera la misma portada verde lima con tu texto.",
        params: [
          { name: "text", type: "string", required: false, description: "Texto de la portada (máx. 60 caracteres). Por defecto: brat.", example: "zyro" },
        ],
        exampleRequest: "/api/maker/brat?text=zyro",
        exampleResponse: "",
        responseType: "image",
        responseHint: "Imagen SVG de 512 × 512 (image/svg+xml) generada en el servidor.",
      },
      {
        id: "maker-percentage",
        method: "GET",
        path: "/api/maker/percentage",
        name: "Porcentaje aleatorio fijo",
        description: "Devuelve un porcentaje determinista para cualquier texto. El mismo texto siempre da el mismo valor.",
        params: [
          { name: "text", type: "string", required: true, description: "Texto a evaluar.", example: "Lunes" },
        ],
        exampleRequest: "/api/maker/percentage?text=Lunes",
        exampleResponse: `{
  "status": true,
  "creator": "ZyroAPI",
  "text": "Lunes",
  "percentage": 42,
  "bar": "████░░░░░░"
}`,
        responseType: "json",
      },
    ],
  },
  {
    slug: "anime",
    name: "Anime y manga",
    description: "Búsqueda de anime, fichas aleatorias y citas, con proveedores gratuitos.",
    endpoints: [
      {
        id: "anime-search",
        method: "GET",
        path: "/api/anime/search",
        name: "Buscar anime",
        description: "Busca anime por título y devuelve fichas simplificadas con imagen, puntuación y sinopsis.",
        params: [
          { name: "q", type: "string", required: true, description: "Término de búsqueda (mín. 2 caracteres).", example: "naruto" },
          { name: "limit", type: "integer", required: false, description: "Nº de resultados (1–10). Por defecto: 5.", example: "3" },
        ],
        exampleRequest: "/api/anime/search?q=naruto&limit=3",
        exampleResponse: `{
  "status": true,
  "creator": "ZyroAPI",
  "provider": "jikan.moe",
  "query": "naruto",
  "count": 3,
  "results": [
    {
      "mal_id": 20,
      "title": "Naruto",
      "type": "TV",
      "episodes": 220,
      "score": 8.01,
      "image": "https://cdn.myanimelist.net/images/anime/13/17405.jpg",
      "url": "https://myanimelist.net/anime/20/Naruto"
    }
  ]
}`,
        responseType: "json",
        note: "Los datos y la disponibilidad dependen del proveedor gratuito Jikan (MyAnimeList). Respeta sus límites de uso.",
      },
      {
        id: "anime-random",
        method: "GET",
        path: "/api/anime/random",
        name: "Anime aleatorio",
        description: "Devuelve la ficha de un anime aleatorio con imagen, puntuación y sinopsis.",
        params: [],
        exampleRequest: "/api/anime/random",
        exampleResponse: `{
  "status": true,
  "creator": "ZyroAPI",
  "provider": "jikan.moe",
  "result": {
    "mal_id": 1535,
    "title": "Death Note",
    "type": "TV",
    "episodes": 37,
    "score": 8.62,
    "image": "https://cdn.myanimelist.net/images/anime/9/9453.jpg",
    "url": "https://myanimelist.net/anime/1535/Death_Note"
  }
}`,
        responseType: "json",
        note: "Los datos y la disponibilidad dependen del proveedor gratuito Jikan (MyAnimeList).",
      },
      {
        id: "anime-quote",
        method: "GET",
        path: "/api/anime/quote",
        name: "Cita de anime",
        description: "Devuelve una cita aleatoria de anime con su personaje y serie. Incluye respaldo local si el proveedor falla.",
        params: [],
        exampleRequest: "/api/anime/quote",
        exampleResponse: `{
  "status": true,
  "creator": "ZyroAPI",
  "provider": "animechan",
  "quote": {
    "content": "Si no arriesgas tu vida, no podrás crear un futuro.",
    "character": "Monkey D. Luffy",
    "anime": "One Piece"
  }
}`,
        responseType: "json",
      },
    ],
  },
  {
    slug: "herramientas",
    name: "Herramientas",
    description: "Utilidades prácticas: QR, acortador de URLs y Base64.",
    endpoints: [
      {
        id: "tools-qr",
        method: "GET",
        path: "/api/tools/qr",
        name: "Generador QR",
        description: "Genera un código QR en PNG a partir de cualquier texto o URL.",
        params: [
          { name: "text", type: "string", required: true, description: "Contenido del QR (máx. 1000 caracteres).", example: "https://zyroapi.dev" },
          { name: "size", type: "integer", required: false, description: "Tamaño en píxeles (100–1000). Por defecto: 256.", example: "256" },
        ],
        exampleRequest: "/api/tools/qr?text=https%3A%2F%2Fzyroapi.dev&size=256",
        exampleResponse: "",
        responseType: "image",
        responseHint: "Imagen PNG cuadrada (image/png) con el código QR.",
      },
      {
        id: "tools-shorten",
        method: "GET",
        path: "/api/tools/shorten",
        name: "Acortador de URLs",
        description: "Crea un enlace corto que redirige a tu URL. Los enlaces viven en la memoria del servidor.",
        params: [
          { name: "url", type: "string", required: true, description: "URL completa con http(s).", example: "https://example.com/articulo-largo" },
        ],
        exampleRequest: "/api/tools/shorten?url=https%3A%2F%2Fexample.com%2Farticulo-largo",
        exampleResponse: `{
  "status": true,
  "creator": "ZyroAPI",
  "original": "https://example.com/articulo-largo",
  "code": "aB3x9Q",
  "short_url": "https://zyroapi.dev/s/aB3x9Q",
  "note": "Los enlaces se guardan en memoria y pueden expirar al reiniciar el servidor."
}`,
        responseType: "json",
      },
      {
        id: "tools-base64",
        method: "GET",
        path: "/api/tools/base64",
        name: "Codificador Base64",
        description: "Codifica o decodifica texto en Base64, con soporte completo de UTF-8.",
        params: [
          { name: "text", type: "string", required: true, description: "Texto a codificar o decodificar.", example: "Hola Zyro" },
          { name: "action", type: "string", required: false, description: "encode o decode. Por defecto: encode.", example: "encode" },
        ],
        exampleRequest: "/api/tools/base64?text=Hola%20Zyro&action=encode",
        exampleResponse: `{
  "status": true,
  "creator": "ZyroAPI",
  "action": "encode",
  "input": "Hola Zyro",
  "output": "SG9sYSBaeXJv"
}`,
        responseType: "json",
      },
    ],
  },
  {
    slug: "datos",
    name: "Datos",
    description: "Citas, usuarios aleatorios y chistes para tus proyectos.",
    endpoints: [
      {
        id: "data-quote",
        method: "GET",
        path: "/api/data/quote",
        name: "Cita aleatoria",
        description: "Devuelve una cita motivadora aleatoria en español o inglés.",
        params: [
          { name: "lang", type: "string", required: false, description: "Idioma: es o en. Por defecto: es.", example: "es" },
        ],
        exampleRequest: "/api/data/quote?lang=es",
        exampleResponse: `{
  "status": true,
  "creator": "ZyroAPI",
  "lang": "es",
  "quote": {
    "text": "La simplicidad es la máxima sofisticación.",
    "author": "Leonardo da Vinci"
  }
}`,
        responseType: "json",
        openByDefault: true,
      },
      {
        id: "data-user",
        method: "GET",
        path: "/api/data/user",
        name: "Usuario aleatorio",
        description: "Genera un perfil de usuario ficticio: nombre, email, teléfono, ciudad y avatar.",
        params: [
          { name: "gender", type: "string", required: false, description: "male, female o any. Por defecto: any.", example: "female" },
        ],
        exampleRequest: "/api/data/user?gender=female",
        exampleResponse: `{
  "status": true,
  "creator": "ZyroAPI",
  "user": {
    "name": "Lucía Fernández",
    "username": "lucia.fernandez42",
    "email": "lucia.fernandez42@example.com",
    "phone": "+34 612 345 678",
    "city": "Madrid",
    "country": "España",
    "avatar": "/api/image/avatar?name=Luc%C3%ADa%20Fern%C3%A1ndez"
  }
}`,
        responseType: "json",
      },
      {
        id: "data-joke",
        method: "GET",
        path: "/api/data/joke",
        name: "Chiste aleatorio",
        description: "Devuelve un chiste aleatorio de programación y humor general.",
        params: [
          { name: "lang", type: "string", required: false, description: "Idioma: es o en. Por defecto: es.", example: "es" },
        ],
        exampleRequest: "/api/data/joke?lang=es",
        exampleResponse: `{
  "status": true,
  "creator": "ZyroAPI",
  "lang": "es",
  "joke": {
    "id": 7,
    "text": "¿Por qué los programadores prefieren el modo oscuro? Porque la luz atrae a los bugs."
  }
}`,
        responseType: "json",
      },
    ],
  },
  {
    slug: "entretenimiento",
    name: "Entretenimiento",
    description: "Juegos de compatibilidad, CI y porcentajes divertidos.",
    endpoints: [
      {
        id: "fun-ship",
        method: "GET",
        path: "/api/fun/ship",
        name: "Shippeo",
        description: "Calcula el porcentaje de compatibilidad entre dos nombres de forma determinista.",
        params: [
          { name: "name1", type: "string", required: true, description: "Primer nombre.", example: "Ana" },
          { name: "name2", type: "string", required: true, description: "Segundo nombre.", example: "Luis" },
        ],
        exampleRequest: "/api/fun/ship?name1=Ana&name2=Luis",
        exampleResponse: `{
  "status": true,
  "creator": "ZyroAPI",
  "name1": "Ana",
  "name2": "Luis",
  "percentage": 87,
  "bar": "█████████░",
  "message": "¡Combinación legendaria!"
}`,
        responseType: "json",
      },
      {
        id: "fun-iq",
        method: "GET",
        path: "/api/fun/iq",
        name: "Test de CI",
        description: "Genera un CI divertido y determinista para cualquier nombre. Solo por entretenimiento.",
        params: [{ name: "name", type: "string", required: true, description: "Nombre a evaluar.", example: "Ana" }],
        exampleRequest: "/api/fun/iq?name=Ana",
        exampleResponse: `{
  "status": true,
  "creator": "ZyroAPI",
  "name": "Ana",
  "iq": 128,
  "level": "Muy superior"
}`,
        responseType: "json",
        note: "Resultado ficticio con fines de entretenimiento. El mismo nombre siempre devuelve el mismo valor.",
      },
      {
        id: "fun-gayrate",
        method: "GET",
        path: "/api/fun/gayrate",
        name: "Gayrate",
        description: "El clásico medidor divertido de los bots: devuelve un porcentaje determinista para cualquier nombre.",
        params: [{ name: "name", type: "string", required: true, description: "Nombre a evaluar.", example: "Ana" }],
        exampleRequest: "/api/fun/gayrate?name=Ana",
        exampleResponse: `{
  "status": true,
  "creator": "ZyroAPI",
  "name": "Ana",
  "percentage": 82,
  "bar": "████████░░",
  "message": "¡Fabulosidad máxima!"
}`,
        responseType: "json",
        note: "Juego sin ninguna base real: el mismo nombre siempre devuelve el mismo valor.",
      },
    ],
  },
  {
    slug: "utilidades",
    name: "Utilidades",
    description: "Hora, UUIDs y números aleatorios.",
    endpoints: [
      {
        id: "utils-time",
        method: "GET",
        path: "/api/utils/time",
        name: "Hora actual",
        description: "Devuelve la hora UTC, la marca de tiempo Unix y la hora en la zona horaria que elijas.",
        params: [
          { name: "tz", type: "string", required: false, description: "Zona horaria IANA. Por defecto: Europe/Madrid.", example: "America/Mexico_City" },
        ],
        exampleRequest: "/api/utils/time?tz=America%2FMexico_City",
        exampleResponse: `{
  "status": true,
  "creator": "ZyroAPI",
  "utc": "2026-10-10T12:00:00.000Z",
  "timestamp": 1791566400,
  "timezone": "America/Mexico_City",
  "local": "10/10/2026, 06:00:00",
  "offset": "UTC-6"
}`,
        responseType: "json",
      },
      {
        id: "utils-uuid",
        method: "GET",
        path: "/api/utils/uuid",
        name: "Generador UUID",
        description: "Genera uno o varios UUID v4 criptográficamente aleatorios.",
        params: [
          { name: "count", type: "integer", required: false, description: "Cantidad (1–10). Por defecto: 1.", example: "3" },
          { name: "uppercase", type: "boolean", required: false, description: "true para mayúsculas. Por defecto: false.", example: "false" },
        ],
        exampleRequest: "/api/utils/uuid?count=3",
        exampleResponse: `{
  "status": true,
  "creator": "ZyroAPI",
  "count": 3,
  "uuids": [
    "3f7d9b1a-4c2e-4f8a-9b1d-2e3f4a5b6c7d",
    "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    "9e8d7c6b-5a4f-4e3d-2c1b-0a9f8e7d6c5b"
  ]
}`,
        responseType: "json",
      },
      {
        id: "utils-random",
        method: "GET",
        path: "/api/utils/random",
        name: "Números aleatorios",
        description: "Genera números enteros aleatorios en un rango, usando aleatoriedad criptográfica.",
        params: [
          { name: "min", type: "integer", required: false, description: "Mínimo (inclusive). Por defecto: 1.", example: "1" },
          { name: "max", type: "integer", required: false, description: "Máximo (inclusive). Por defecto: 100.", example: "10" },
          { name: "count", type: "integer", required: false, description: "Cantidad (1–100). Por defecto: 5.", example: "5" },
        ],
        exampleRequest: "/api/utils/random?min=1&max=10&count=5",
        exampleResponse: `{
  "status": true,
  "creator": "ZyroAPI",
  "min": 1,
  "max": 10,
  "count": 5,
  "numbers": [3, 7, 1, 9, 4]
}`,
        responseType: "json",
      },
    ],
  },
];

export const TOTAL_ENDPOINTS: number = CATEGORIES.reduce((acc, c) => acc + c.endpoints.length, 0);

/** Ejemplo de código JavaScript (fetch) generado para cada endpoint. */
export function jsExampleFor(origin: string, ep: ApiEndpoint): string {
  const url = `${origin}${ep.exampleRequest}`;
  if (ep.responseType === "image") {
    return `// Mostrar la imagen en tu web
const img = document.createElement("img");
img.src = "${url}";
img.alt = "${ep.name}";
document.body.appendChild(img);`;
  }
  return `const res = await fetch("${url}");
if (!res.ok) throw new Error("HTTP " + res.status);
const data = await res.json();
console.log(data);`;
}

/** Ejemplo de solicitud cURL. */
export function curlExampleFor(origin: string, ep: ApiEndpoint): string {
  return `curl "${origin}${ep.exampleRequest}"`;
}
