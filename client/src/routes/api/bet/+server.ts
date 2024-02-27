import type { RequestHandler } from "./$types";
import { db } from "$lib/drizzle/db";
import { bets } from "$lib/drizzle/schema";
import { and, eq } from "drizzle-orm";

export const POST: RequestHandler = async ({ request }) => {
  const betReq = await request.json();

  const [existingBet] = await db
    .select()
    .from(bets)
    .where(and(eq(bets.userId, betReq.userId), eq(bets.raceId, betReq.raceId)));
  if (existingBet) {
    await db
      .update(bets)
      .set({ first: betReq.first, second: betReq.second, third: betReq.third })
      .where(
        and(eq(bets.userId, betReq.userId), eq(bets.raceId, betReq.raceId))
      );

    return new Response("Bet updated", { status: 200 });
  } else {
    type NewBet = typeof bets.$inferInsert;
    const insertBet = async (bet: NewBet) => {
      return await db.insert(bets).values(bet).returning({
        betId: bets.betId,
        userId: bets.userId,
        raceId: bets.raceId,
        seasonId: bets.seasonId,
        first: bets.first,
        second: bets.second,
        third: bets.third,
      });
    };
    const insertedBet = insertBet({
      userId: betReq.userId,
      raceId: betReq.raceId,
      seasonId: betReq.seasonId,
      first: betReq.first,
      second: betReq.second,
      third: betReq.third,
    });

    return new Response(JSON.stringify({ insertedBet }), { status: 201 });
  }
};
