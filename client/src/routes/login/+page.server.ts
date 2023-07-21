import { redirect } from "@sveltejs/kit";

export const load = async (event) => {
  const sessionId = event.cookies.get("session_id");
  if (sessionId) {
    throw redirect(301, "/");
  }
};
