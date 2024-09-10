import type { RequestHandler } from "./$types";
import { db } from "$lib/drizzle/db";
import {
  users,
  scores,
  constructorsBets,
  seasons,
  bets,
} from "$lib/drizzle/schema";
import { eq, and } from "drizzle-orm";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const [currentSeason] = await db
      .select()
      .from(seasons)
      .where(eq(seasons.currentSeason, true))
      .limit(1);
    const userReq = await request.json();
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, userReq.email))
      .limit(1);

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
    const [userScore] = await db
      .select({ score: scores.score, position: scores.position })
      .from(scores)
      .where(
        and(
          eq(scores.userId, user.userId),
          eq(scores.seasonId, currentSeason.seasonId)
        )
      )
      .limit(1);

    const [constructorBet] = await db
      .select({ constructorName: constructorsBets.constructorName })
      .from(constructorsBets)
      .where(
        and(
          eq(constructorsBets.userId, user.userId),
          eq(constructorsBets.seasonId, currentSeason.seasonId)
        )
      )
      .limit(1);

    const userBets = await db
      .select()
      .from(bets)
      .where(eq(bets.userId, user.userId));

    const mappedUser = {
      ...user,
      points: userScore?.score ?? 0,
      position: userScore?.position ?? 0,
      constructorBet: constructorBet?.constructorName ?? 0,
      userBets,
    };

    return new Response(JSON.stringify({ user: mappedUser }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
};
