import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
} from "$env/static/public";
import { createSupabaseServerClient } from "@supabase/auth-helpers-sveltekit";
import type { Handle } from "@sveltejs/kit";
import { UNDER_CONSTRUCTION } from "$env/static/private";
import { redirect } from "@sveltejs/kit";

const unProtectedRoutes = [
  "/login",
  "/register",
  "/api/generate-calendar",
  "/api/grid",
  "/api/result",
];

export const handle: Handle = async ({ event, resolve }) => {
  if (
    UNDER_CONSTRUCTION === "true" &&
    event.url.pathname !== "/under-construction"
  ) {
    redirect(303, "/under-construction");
  }
  event.locals.supabase = createSupabaseServerClient({
    supabaseUrl: PUBLIC_SUPABASE_URL,
    supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
    event,
  });

  const checkIfUserIsLoggedIn = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession();
    return session && session.user != null;
  };

  const isLoggedIn = await checkIfUserIsLoggedIn();
  if (!isLoggedIn && !unProtectedRoutes.includes(event.url.pathname)) {
    redirect(303, "/login");
  }

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
