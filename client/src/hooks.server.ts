import { ENV } from "$env/static/private";
import prisma from "$lib/prisma";
import { redirect } from "@sveltejs/kit";
const unProtectedRoutes = [
  "/login",
  "/api/generate-calendar",
  "/api/grid",
  "/api/result",
];
export const handle = async ({ event, resolve }) => {
  if (ENV !== "dev" && event.url.pathname !== "/under-construction") {
    throw redirect(303, "/under-construction");
  }

  if (event.url.pathname === "/under-construction") {
    return resolve(event);
  }

  if (event.route.id === "/api/login") {
    return resolve(event);
  }
  const session = event.cookies.get("session");
  let user;
  if (session) {
    user = await prisma.users.findFirst({
      where: {
        session,
      },
    });
  }

  if (session !== undefined && user) {
    event.locals.user = {
      name: user.username,
      admin: user.admin,
    };
  } else {
    event.locals.user = {
      name: "",
      admin: false,
    };
  }

  if (
    !event.locals.user.name.length &&
    !unProtectedRoutes.includes(event.url.pathname)
  ) {
    throw redirect(303, "/login");
  }
  return resolve(event);
};
