import type { RequestHandler } from "./$types";

export const GET = (async ({ params }) => {
  const id = params.id;
  const url = `http://localhost:8080/races/${id}`;
  const res = await fetch(url, {
    method: "GET",
  });

  const data = await res.json();
  return new Response(JSON.stringify(data));
}) satisfies RequestHandler;
