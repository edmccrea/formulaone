import { AuthApiError } from "@supabase/supabase-js";
import type { Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { users } from "$lib/drizzle/schema";
import { db } from "$lib/drizzle/db";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = (async ({ locals }) => {
  const session = await locals.getSession();
  if (session && session.user.email) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email));
    if (user) {
      redirect(303, "/");
    }
  }
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const whitelsit = [
      "ed-mccrea@hotmail.co.uk",
      "mccreasteelem@aol.com",
      "peter@wrmontor.com",
      "emily.bengtsson@hotmail.com",
      "alastairpm@hotmail.com",
    ];
    const body = Object.fromEntries(await request.formData());
    if (!whitelsit.includes(body.email.toString())) {
      return fail(400, { error: "Invalid email" });
    }
    const { data, error: err } = await locals.supabase.auth.signUp({
      email: body.email as string,
      password: body.password as string,
    });

    if (err) {
      if (err instanceof AuthApiError && err.status === 400) {
        return fail(400, { error: "Invalid email or password" });
      }
      return fail(500, { error: "An unexpected error occurred" });
    }

    redirect(303, "/login");
  },
};
