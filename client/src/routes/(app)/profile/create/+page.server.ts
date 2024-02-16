import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { db } from "$lib/drizzle/db";
import { users } from "$lib/drizzle/schema";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = (async ({ url, locals }) => {
  //   const session = await locals.getSession();
  //   if (session) {
  //     redirect(303, "/");
  //   }
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const body = Object.fromEntries(await request.formData());
    const { username, avatar } = body;
    const session = await locals.getSession();

    type NewUser = typeof users.$inferInsert;
    const insertUser = async (user: NewUser) => {
      const res = await db.insert(users).values(user);
    };
    if (session && session.user.email) {
      const newUser = {
        email: session?.user.email,
        username: username.toString(),
        avatar: avatar.toString(),
        admin: false,
      };
      await insertUser(newUser);
    }
  },
};
