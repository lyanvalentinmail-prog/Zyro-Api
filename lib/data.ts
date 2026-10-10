/** Datos locales reales para los endpoints de datos y entretenimiento. */

export interface Quote {
  text: string;
  author: string;
}

export const QUOTES_ES: Quote[] = [
  { text: "La simplicidad es la máxima sofisticación.", author: "Leonardo da Vinci" },
  { text: "El único modo de hacer un gran trabajo es amar lo que haces.", author: "Steve Jobs" },
  { text: "No cuentes los días, haz que los días cuenten.", author: "Muhammad Ali" },
  { text: "La mejor forma de predecir el futuro es crearlo.", author: "Peter Drucker" },
  { text: "Todo lo que siempre quisiste está al otro lado del miedo.", author: "George Addair" },
  { text: "El éxito es la suma de pequeños esfuerzos repetidos día tras día.", author: "Robert Collier" },
  { text: "Haz hoy lo que otros no quieren y mañana vivirás lo que otros no pueden.", author: "Anónimo" },
  { text: "La imaginación es más importante que el conocimiento.", author: "Albert Einstein" },
  { text: "Empieza donde estás, usa lo que tienes, haz lo que puedas.", author: "Arthur Ashe" },
  { text: "No hay atajos para ningún lugar al que merezca la pena ir.", author: "Beverly Sills" },
  { text: "La disciplina es el puente entre las metas y los logros.", author: "Jim Rohn" },
  { text: "Cae siete veces y levántate ocho.", author: "Proverbio japonés" },
];

export const QUOTES_EN: Quote[] = [
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
  { text: "What we think, we become.", author: "Buddha" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "Well begun is half done.", author: "Aristotle" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
];

export const JOKES_ES: string[] = [
  "¿Qué hace una abeja en el gimnasio? ¡Zum-ba!",
  "¿Por qué los programadores prefieren el modo oscuro? Porque la luz atrae a los bugs.",
  "¿Qué le dice un bit al otro? Nos vemos en el bus.",
  "¿Cómo se llama el primo vegano de Bruce Lee? Brócoli.",
  "¿Qué hace un moco en una API? Nada, solo anda por los endpoints.",
  "¿Por qué el JavaScript rompió con el HTML? Porque necesitaba más espacio.",
  "Mi código funciona y no sé por qué. Mi código no funciona y no sé por qué. La vida del programador.",
  "¿Cuántos programadores hacen falta para cambiar una bombilla? Ninguno, es un problema de hardware.",
  "¿Qué es un endpoint sin documentación? Un misterio sin resolver.",
  "Le pregunté a la base de datos si me quería. Me devolvió NULL.",
  "¿Por qué los desarrolladores odian la naturaleza? Demasiados bugs.",
  "HTTP 404: chiste no encontrado. Pero este sí cuenta.",
];

export const JOKES_EN: string[] = [
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "There are only 10 kinds of people: those who understand binary and those who don't.",
  "Why did the developer go broke? Because he used up all his cache.",
  "Real programmers count from 0.",
  "!false — it's funny because it's true.",
  "A SQL query walks into a bar, sees two tables and asks: mind if I join you?",
  "Why do Java developers wear glasses? Because they don't C#.",
  "Debugging: being the detective in a crime movie where you are also the murderer.",
];

export const FIRST_NAMES = [
  "Lucía", "Mateo", "Sofía", "Hugo", "Martina", "Pablo", "Valeria", "Adrián",
  "Carmen", "Diego", "Elena", "Iker", "Noa", "Leo", "Alba", "Mario",
];

export const LAST_NAMES = [
  "García", "Fernández", "López", "Martínez", "Sánchez", "Pérez", "Gómez",
  "Martín", "Ruiz", "Hernández", "Díaz", "Moreno", "Álvarez", "Romero", "Navarro",
];

export const CITIES_ES = [
  "Madrid", "Barcelona", "Valencia", "Sevilla", "Bilbao", "Málaga",
  "Zaragoza", "Granada", "Alicante", "Vigo", "Murcia", "Oviedo",
];

export interface AnimeQuote {
  content: string;
  character: string;
  anime: string;
}

/** Citas de respaldo si el proveedor externo no responde. */
export const ANIME_QUOTES_FALLBACK: AnimeQuote[] = [
  { content: "No importa lo difícil que sea, seguiré adelante.", character: "Naruto Uzumaki", anime: "Naruto" },
  { content: "Si no arriesgas tu vida, no podrás crear un futuro.", character: "Monkey D. Luffy", anime: "One Piece" },
  { content: "El miedo no es malo. Te dice que hay algo que debes superar.", character: "Gildarts Clive", anime: "Fairy Tail" },
  { content: "Incluso si olvidas, seguiré aquí para recordarte.", character: "Spike Spiegel", anime: "Cowboy Bebop" },
  { content: "La gente que no puede desprenderse de nada jamás podrá cambiar nada.", character: "Armin Arlert", anime: "Attack on Titan" },
  { content: "Un corazón herido sanará con el tiempo.", character: "Son Goku", anime: "Dragon Ball" },
];
