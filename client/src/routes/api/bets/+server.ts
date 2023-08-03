import { API_URL, ENV } from "$env/static/private";

import type { RequestHandler } from "./$types";

export const GET = (async () => {
  const url = ENV === "dev" ? "http://localhost:8080/bets" : `${API_URL}/bets`;

  const res = await fetch(url, {
    method: "GET",
  });

  const data = await res.json();
  return new Response(JSON.stringify(data));
}) satisfies RequestHandler;
