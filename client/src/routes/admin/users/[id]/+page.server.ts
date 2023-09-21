import prisma from "$lib/prisma";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  const userId = params.id;
  const user = await prisma.users.findFirst({
    where: {
      user_id: Number(userId),
    },
  });
  return {
    user,
  };
}) satisfies PageServerLoad;
