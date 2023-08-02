import type { RequestHandler } from "./$types";
import { PUBLIC_API_URL, PUBLIC_ENV } from "$env/static/public";

export const GET = (async ({ params }) => {
  const raceId = params.id;
  const url =
    PUBLIC_ENV === "dev"
      ? `http://localhost:8080/bets/race/${raceId}`
      : `${PUBLIC_API_URL}/bets/race/${raceId}`;
  const res = await fetch(url, {
    method: "GET",
  });

  const data = await res.json();
  return new Response(JSON.stringify(data));
}) satisfies RequestHandler;
