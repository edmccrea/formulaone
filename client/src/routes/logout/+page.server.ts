import { redirect } from "@sveltejs/kit";
import { API_URL, ENV } from "$env/static/private";

export const load = async ({ cookies, fetch, url }) => {
  const apiUrl =
    ENV === "dev"
      ? "http://localhost:8080/auth/logout"
      : `${API_URL}/auth/logout`;
  const res = await fetch(apiUrl, {
    method: "POST",
  });

  if (res.ok) {
    cookies.delete("session_id", { domain: "." + url.hostname });

    throw redirect(301, "/login");
  } else {
    return new Response(await res.text());
  }
};
