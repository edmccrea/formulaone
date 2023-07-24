import type { RequestHandler } from "./$types";

export const GET = (async ({ request }) => {
  const sessionId = request.headers.get("x-session-id");

  const url = "http://localhost:8080/races";
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: `session_id=${sessionId}`,
    },
  });

  const data = await res.json();
  return new Response(JSON.stringify(data));
}) satisfies RequestHandler;
