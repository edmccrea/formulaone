import type { LayoutServerLoad } from "./$types";
import prisma from "$lib/prisma";
import { redirect } from "@sveltejs/kit";

export const load = (async ({ locals }) => {
  const user = await prisma.users.findFirst({
    where: {
      username: locals.user.name,
    },
  });

  if (!user) {
    throw redirect(301, "/login");
  }

  const bets = await prisma.bets.findMany({
    where: {
      user_id: user.user_id,
    },
  });

  return {
    user,
    bets,
  };
}) satisfies LayoutServerLoad;
