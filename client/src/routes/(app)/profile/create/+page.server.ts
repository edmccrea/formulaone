import { redirect } from "@sveltejs/kit";
import { users } from "$lib/drizzle/schema";
import type { PageServerLoad } from "./$types";
import { eq } from "drizzle-orm";
import { db } from "$lib/drizzle/db";

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
  if (!session) {
    redirect(303, "/");
  }
}) satisfies PageServerLoad;
