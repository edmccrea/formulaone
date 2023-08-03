import { redirect } from "@sveltejs/kit";
import { API_URL, ENV } from "$env/static/private";

export const load = async (event) => {
  const url =
    ENV === "dev"
      ? "http://localhost:8080/auth/logout"
      : `${API_URL}/auth/logout`;
  const res = await fetch(url, {
    method: "POST",
  });

  if (res.ok) {
    event.cookies.set("session_id", "", {
      path: "/",
    });

    throw redirect(301, "/login");
  } else {
    return new Response(await res.text());
  }
};
