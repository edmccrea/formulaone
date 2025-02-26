import { db } from "$lib/drizzle/db";
import { races, seasons, results, bets, scores } from "$lib/drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import type { RequestHandler } from "./$types";
import { API_KEY } from "$env/static/private";

export const POST: RequestHandler = async ({ request }) => {
  const apiKey = request.headers.get("x-api-key");
  if (apiKey !== API_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const currentSeasonsResults = await db
      .select()
      .from(seasons)
      .where(eq(seasons.currentSeason, true))
      .limit(1);

    const currentSeason = currentSeasonsResults.at(0);

    if (!currentSeason) {
      throw new Error("Current season not found");
    }

    const racesWithResults = await db
      .select({
        raceId: races.raceId,
        raceType: races.raceType,
        results: results.resultData,
      })
      .from(races)
      .innerJoin(results, eq(races.raceId, results.raceId))
      .where(eq(races.seasonId, currentSeason.seasonId));

    const allBets = await db
      .select()
      .from(bets)
      .where(eq(bets.seasonId, currentSeason.seasonId));

    const userScores = new Map<number, number>();

    for (const race of racesWithResults) {
      const raceResults = JSON.parse(race.results)[0];
      const raceBets = allBets.filter((bet) => bet.raceId === race.raceId);

      for (const bet of raceBets) {
        let points = 0;
        const multiplier = race.raceType === "Sprint" ? 0.5 : 1;

        const resultArray = [
          raceResults.first,
          raceResults.second,
          raceResults.third,
        ];

        if (resultArray.includes(bet.first)) points += 1 * multiplier;
        if (resultArray.includes(bet.second)) points += 1 * multiplier;
        if (resultArray.includes(bet.third)) points += 1 * multiplier;

        if (
          bet.first === raceResults.first &&
          bet.second === raceResults.second &&
          bet.third === raceResults.third
        ) {
          points += 2 * multiplier;
        }

        const currentScore = userScores.get(bet.userId) || 0;
        userScores.set(bet.userId, currentScore + points);
      }
    }

    for (const [userId, score] of userScores) {
      const existingScore = await db
        .select()
        .from(scores)
        .where(
          and(
            eq(scores.userId, userId),
            eq(scores.seasonId, currentSeason.seasonId),
          ),
        )
        .limit(1);
      if (existingScore.length > 0) {
        await db
          .update(scores)
          .set({ score })
          .where(
            and(
              eq(scores.userId, userId),
              eq(scores.seasonId, currentSeason.seasonId),
            ),
          );
      } else {
        await db.insert(scores).values({
          userId,
          seasonId: currentSeason.seasonId,
          score,
          position: 0,
        });
      }
    }

    const allScores = await db
      .select()
      .from(scores)
      .where(eq(scores.seasonId, currentSeason.seasonId))
      .orderBy(desc(scores.score));

    let currentPosition = 1;
    let currentScore = null;
    let skipPositions = 0;

    for (let i = 0; i < allScores.length; i++) {
      const score = allScores[i];

      if (currentScore !== score.score) {
        currentPosition = i + 1;
        currentScore = score.score;
        skipPositions = 0;
      } else {
        skipPositions++;
      }

      await db
        .update(scores)
        .set({ position: currentPosition })
        .where(eq(scores.scoreId, score.scoreId));
    }

    return new Response("Leaderboard updated successfully", { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return new Response(`Error updating leaderboard: ${error.message}`, {
        status: 500,
      });
    } else {
      console.error(error);
      return new Response("Unknown error updating leaderboard", {
        status: 500,
      });
    }
  }
};
