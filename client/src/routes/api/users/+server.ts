import type { RequestHandler } from "./$types";

export const GET = (async ({ request }) => {
  const authToken = request.headers.get("Authorization") || "";
  console.log("authToken", authToken);

  const url = "http://localhost:8080/users";
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: authToken,
    },
  });

  const data = await res.json();
  return new Response(JSON.stringify(data));
}) satisfies RequestHandler;
