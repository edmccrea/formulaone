import type { RequestHandler } from "./$types";
import { db } from "$lib/drizzle/db";
import { users, scores, constructorsBets } from "$lib/drizzle/schema";
import { eq } from "drizzle-orm";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const userReq = await request.json();
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, userReq.email))
      .limit(1);

    const userScore = await db
      .select({ score: scores.score })
      .from(scores)
      .where(eq(scores.userId, user[0].userId))
      .limit(1);

    const constructorBet = await db
      .select({ constructorName: constructorsBets.constructorName })
      .from(constructorsBets)
      .where(eq(constructorsBets.userId, user[0].userId))
      .limit(1);

    const mappedUser = {
      ...user[0],
      points: userScore[0]?.score ?? 0,
      constructorBet: constructorBet[0]?.constructorName ?? 0,
    };

    if (user.length) {
      return new Response(JSON.stringify({ user: mappedUser }), {
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
};
