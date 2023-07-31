import type { RequestHandler } from "./$types";

export const GET = (async ({ params }) => {
  const raceId = params.id;
  const url = `http://localhost:8080/bets/race/${raceId}`;
  const res = await fetch(url, {
    method: "GET",
  });

  const data = await res.json();
  return new Response(JSON.stringify(data));
}) satisfies RequestHandler;
