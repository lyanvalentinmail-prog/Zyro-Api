import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";
import { CITIES_ES, FIRST_NAMES, LAST_NAMES } from "@/lib/data";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");
}

/** Genera un perfil de usuario ficticio. */
export async function GET(req: NextRequest) {
  const gender = (req.nextUrl.searchParams.get("gender") ?? "any").trim().toLowerCase();
  if (gender !== "male" && gender !== "female" && gender !== "any") {
    return fail("Parámetro 'gender' inválido. Usa 'male', 'female' o 'any'.", 400);
  }

  const firstName = pick(FIRST_NAMES);
  const lastName = `${pick(LAST_NAMES)} ${pick(LAST_NAMES)}`;
  const name = `${firstName} ${lastName.split(" ")[0]}`;
  const num = Math.floor(Math.random() * 90) + 10;
  const username = `${slugify(firstName)}.${slugify(lastName.split(" ")[0])}${num}`;
  const phone = `+34 6${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)} ${String(
    Math.floor(Math.random() * 1000)
  ).padStart(3, "0")} ${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;

  return ok({
    user: {
      name,
      username,
      email: `${username}@example.com`,
      phone,
      city: pick(CITIES_ES),
      country: "España",
      avatar: `/api/image/avatar?name=${encodeURIComponent(name)}`,
    },
  });
}
