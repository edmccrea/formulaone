import { db } from "$lib/drizzle/db";
import { races, results, seasons } from "$lib/drizzle/schema";
import { eq, and } from "drizzle-orm";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const req = await request.json();
    const response = await fetch(
      `http://api.jolpi.ca/ergast/f1/${req.season}/sprint/`,
    );

    const data = (await response.json()) as SprintRaceResponse;

    const season = await db
      .select()
      .from(seasons)
      .where(eq(seasons.year, req.season));
    const firstSeason = season.at(0);
    if (!firstSeason) {
      throw new Error("Season not found");
    }

    for (const sprintRace of data.MRData.RaceTable.Races) {
      const raceResults = sprintRace.SprintResults;
      const podiumResults = raceResults.slice(0, 3);

      const formattedResults = [
        {
          first: `${podiumResults[0].Driver.givenName} ${podiumResults[0].Driver.familyName}`,
          second: `${podiumResults[1].Driver.givenName} ${podiumResults[1].Driver.familyName}`,
          third: `${podiumResults[2].Driver.givenName} ${podiumResults[2].Driver.familyName}`,
        },
      ];

      const race = await db
        .select()
        .from(races)
        .where(
          and(
            eq(races.calendarRound, parseInt(sprintRace.round)),
            eq(races.seasonId, firstSeason.seasonId),
            eq(races.raceType, "Sprint"),
          ),
        );

      const first = race.at(0);

      if (!first) {
        console.warn(`Race not found for round ${sprintRace.round}`);
        continue;
      }

      const existingResults = await db
        .select()
        .from(results)
        .where(eq(results.raceId, first.raceId));

      if (existingResults.length > 0) {
        await db
          .update(results)
          .set({ resultData: JSON.stringify(formattedResults) })
          .where(eq(results.raceId, first.raceId));
      } else {
        await db.insert(results).values({
          raceId: first.raceId,
          resultData: JSON.stringify(formattedResults),
        });
      }
    }

    return new Response("Sprint race results updated successfully", {
      status: 200,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return new Response(
        `Error updating sprint race results: ${error.message}`,
        {
          status: 500,
        },
      );
    } else {
      console.error(error);
      return new Response("Unknown error updating sprint race results", {
        status: 500,
      });
    }
  }
};
