import type { LayoutServerLoad } from "./$types";

export const load = ((event) => {
  const sessionId = event.cookies.get("session_id");
  if (sessionId) {
    return {
      sessionId,
    };
  }
}) satisfies LayoutServerLoad;
