import prisma from "$lib/prisma";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  const users = await prisma.users.findMany();

  return {
    users,
  };
}) satisfies PageServerLoad;
