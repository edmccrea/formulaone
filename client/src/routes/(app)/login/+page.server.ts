import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { AuthApiError } from "@supabase/supabase-js";
import type { Actions } from "./$types";

export const load: PageServerLoad = (async ({ url, locals }) => {
  const session = await locals.getSession();
  if (session) {
    redirect(303, "/");
  }
  return { url: url.origin };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const body = Object.fromEntries(await request.formData());
    const { data, error: err } = await locals.supabase.auth.signInWithPassword({
      email: body.email as string,
      password: body.password as string,
    });

    if (err) {
      if (err instanceof AuthApiError && err.status === 400) {
        return fail(400, { error: "Invalid email or password" });
      }
      return fail(500, { error: "An unexpected error occurred" });
    }

    redirect(303, "/");
  },
};
