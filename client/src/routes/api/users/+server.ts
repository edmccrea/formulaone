import type { RequestHandler } from "./$types";
import { API_URL, ENV } from "$env/static/private";

export const GET = (async () => {
  const url =
    ENV === "dev" ? "http://localhost:8080/users" : `${API_URL}/users`;
  const res = await fetch(url, {
    method: "GET",
  });

  const data = await res.json();
  return new Response(JSON.stringify(data));
}) satisfies RequestHandler;
