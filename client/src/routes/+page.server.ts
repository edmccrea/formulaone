import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ cookies, fetch }) => {
  const sessionId = cookies.get("session_id");
  if (!sessionId) {
    throw redirect(301, "/login");
  }

  const userReq = await fetch("/api/user", {
    method: "GET",
    credentials: "include",
    headers: {
      "x-session-id": sessionId || "",
    },
  });

  const user = await userReq.json();

  return {
    user,
  };
}) satisfies PageServerLoad;
