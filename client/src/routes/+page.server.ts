import { redirect } from "@sveltejs/kit";

export const load = async (event) => {
  const sessionId = event.cookies.get("session_id");
  console.log(sessionId);
  if (!sessionId) {
    throw redirect(301, "/login");
  }
};
