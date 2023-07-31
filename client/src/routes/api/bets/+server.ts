import type { RequestHandler } from "./$types";

export const GET = (async () => {
  const url = `http://localhost:8080/bets`;

  const res = await fetch(url, {
    method: "GET",
  });

  const data = await res.json();
  return new Response(JSON.stringify(data));
}) satisfies RequestHandler;
