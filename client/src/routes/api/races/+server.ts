import type { RequestHandler } from "./$types";

export const GET = (async ({ url }) => {
  const id = url.searchParams.get("id");
  let apiUrl = "";
  if (id) {
    apiUrl = `http://localhost:8080/races/${id}`;
  } else {
    apiUrl = `http://localhost:8080/races`;
  }
  const res = await fetch(apiUrl, {
    method: "GET",
  });

  const data = await res.json();
  return new Response(JSON.stringify(data));
}) satisfies RequestHandler;
