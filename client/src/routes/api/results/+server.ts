import type { RequestHandler } from "./$types";
import { API_URL, ENV } from "$env/static/private";

export const GET = (async ({ request }) => {
  const sessionId = request.headers.get("x-session-id");

  const url =
    ENV === "dev" ? "http://localhost:8080/results" : `${API_URL}/results`;
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
