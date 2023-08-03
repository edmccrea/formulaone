import type { RequestHandler } from "./$types";
import { API_URL, ENV } from "$env/static/private";

export const GET = (async ({ params }) => {
  const id = params.id;
  const url =
    ENV === "dev"
      ? `http://localhost:8080/races/${id}`
      : `${API_URL}/races/${id}`;
  const res = await fetch(url, {
    method: "GET",
  });

  const data = await res.json();
  return new Response(JSON.stringify(data));
}) satisfies RequestHandler;
