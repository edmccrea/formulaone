import { db } from "$lib/drizzle/db";
import { races, grids, seasons } from "$lib/drizzle/schema";
import { eq, and } from "drizzle-orm";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const req = await request.json();
    const response = await fetch(
      `http://api.jolpi.ca/ergast/f1/${req.season}/${req.calendarRound ? req.calendarRound : "last"}/qualifying`,
    );

    const data = (await response.json()) as QualifyingResponse;

    const qualifyingResults = data.MRData.RaceTable.Races[0].QualifyingResults;

    const season = await db
      .select()
      .from(seasons)
      .where(eq(seasons.year, req.season));
    const firstSeason = season.at(0);
    if (!firstSeason) {
      throw new Error("Season not found");
    }

    const formattedResults = qualifyingResults.map((result) => {
      const lapTime = result.Q3 || result.Q2 || result.Q1 || "";
      return {
        name: `${result.Driver.givenName} ${result.Driver.familyName}`,
        lapTime: lapTime,
      };
    });

    console.log(formattedResults);

    const race = await db
      .select()
      .from(races)
      .where(
        and(
          eq(races.calendarRound, parseInt(data.MRData.RaceTable.round)),
          eq(races.seasonId, firstSeason.seasonId),
        ),
      );

    const first = race.at(0);

    if (!first) {
      throw new Error("Race not found");
    }

    const existingResults = await db
      .select()
      .from(grids)
      .where(eq(grids.raceId, first.raceId));

    if (existingResults) {
      await db
        .update(grids)
        .set({ gridData: JSON.stringify(formattedResults) })
        .where(eq(grids.raceId, first.raceId));
    } else {
      await db.insert(grids).values({
        raceId: first.raceId,
        gridData: JSON.stringify(formattedResults),
      });
    }

    return new Response("Qualifying results updated successfully", {
      status: 200,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return new Response(
        `Error updating qualifying results: ${error.message}`,
        {
          status: 500,
        },
      );
    } else {
      console.error(error);
      return new Response("Unknown error updating qualifying results", {
        status: 500,
      });
    }
  }
};
