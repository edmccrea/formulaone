import type { RequestHandler } from "./$types";
import { PUBLIC_API_URL, PUBLIC_ENV } from "$env/static/public";

export const GET = (async ({ request }) => {
  const sessionId = request.headers.get("x-session-id");

  const url =
    PUBLIC_ENV === "dev"
      ? "http://localhost:8080/user"
      : `${PUBLIC_API_URL}/user`;
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
