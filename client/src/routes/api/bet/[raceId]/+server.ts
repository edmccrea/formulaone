import prisma from "$lib/prisma";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ request, params }) => {
  const { raceId } = params;
  const bets = await prisma.bets.findMany({
    where: {
      race_id: Number(raceId),
    },
  });

  return new Response(JSON.stringify(bets), { status: 200 });
};
