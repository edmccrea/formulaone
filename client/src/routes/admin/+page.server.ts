import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
  console.log(event.locals.user);

  if (!event.locals.user.admin) {
    redirect(303, "/");
  }

  return {};
}) satisfies PageServerLoad;
