import { redirect } from "@sveltejs/kit";

export const load = async (event) => {
  const url = "http://localhost:8080/auth/logout";
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
