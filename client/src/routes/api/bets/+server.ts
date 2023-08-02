import { PUBLIC_API_URL, PUBLIC_ENV } from "$env/static/public";
import type { RequestHandler } from "./$types";

export const GET = (async () => {
  const url =
    PUBLIC_ENV === "dev"
      ? "http://localhost:8080/bets"
      : `${PUBLIC_API_URL}/bets`;

  const res = await fetch(url, {
    method: "GET",
  });

  const data = await res.json();
  return new Response(JSON.stringify(data));
}) satisfies RequestHandler;
