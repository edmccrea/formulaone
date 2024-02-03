// import { ENV } from "$env/static/private";
// import prisma from "$lib/prisma";
// import { redirect } from "@sveltejs/kit";
// const unProtectedRoutes = [
//   "/login",
//   "/api/generate-calendar",
//   "/api/grid",
//   "/api/result",
// ];
// export const handle = async ({ event, resolve }) => {
//   if (ENV !== "dev" && event.url.pathname !== "/under-construction") {
//     throw redirect(303, "/under-construction");
//   }

//   if (event.url.pathname === "/under-construction") {
//     return resolve(event);
//   }

//   if (event.route.id === "/api/login") {
//     return resolve(event);
//   }
//   const session = event.cookies.get("session");
//   let user;
//   if (session) {
//     user = await prisma.users.findFirst({
//       where: {
//         session,
//       },
//     });
//   }

//   if (session !== undefined && user) {
//     event.locals.user = {
//       name: user.username,
//       admin: user.admin,
//     };
//   } else {
//     event.locals.user = {
//       name: "",
//       admin: false,
//     };
//   }

//   if (
//     !event.locals.user.name.length &&
//     !unProtectedRoutes.includes(event.url.pathname)
//   ) {
//     throw redirect(303, "/login");
//   }
//   return resolve(event);
// };

import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
} from "$env/static/public";
import { createSupabaseServerClient } from "@supabase/auth-helpers-sveltekit";
import type { Handle } from "@sveltejs/kit";
import { ENV } from "$env/static/private";
import { redirect } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  if (ENV !== "dev" && event.url.pathname !== "/under-construction") {
    throw redirect(303, "/under-construction");
  }
  event.locals.supabase = createSupabaseServerClient({
    supabaseUrl: PUBLIC_SUPABASE_URL,
    supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
    event,
  });

  /**
   * A convenience helper so we can just call await getSession() instead const { data: { session } } = await supabase.auth.getSession()
   */
  event.locals.getSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession();
    return session;
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === "content-range";
    },
  });
};
