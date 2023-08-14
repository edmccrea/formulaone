import prisma from "$lib/prisma";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
  const betReq = await request.json();
  const existingBet = await prisma.bets.findFirst({
    where: {
      AND: [{ user_id: betReq.user_id }, { race_id: betReq.race_id }],
    },
  });
  if (existingBet) {
    await prisma.bets.update({
      where: {
        race_id_user_id_bet_id: {
          race_id: existingBet.race_id,
          user_id: existingBet.user_id,
          bet_id: existingBet.bet_id,
        },
      },
      data: {
        first: betReq.first,
        second: betReq.second,
        third: betReq.third,
      },
    });

    return new Response("Bet updated", { status: 200 });
  } else {
    await prisma.bets.create({
      data: {
        user_id: betReq.user_id,
        race_id: betReq.race_id,
        first: betReq.first,
        second: betReq.second,
        third: betReq.third,
      },
    });

    return new Response("Bet created", { status: 201 });
  }
  return new Response();
};
