import type { LayoutServerLoad } from "./$types";

export const load = (async ({ cookies }) => {
  const sessionId = cookies.get("session_id");

  if (sessionId) {
    return {
      sessionId,
    };
  }
}) satisfies LayoutServerLoad;
