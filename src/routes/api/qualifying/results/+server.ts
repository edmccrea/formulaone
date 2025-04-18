import { db } from "$lib/drizzle/db";
import { races, grids, seasons } from "$lib/drizzle/schema";
import { eq, and } from "drizzle-orm";
import type { RequestHandler } from "./$types";
import { API_KEY } from "$env/static/private";

export const POST: RequestHandler = async ({ request }) => {
  const apiKey = request.headers.get("x-api-key");
  if (apiKey !== API_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const req = await request.json();
    const response = await fetch(
      `http://api.jolpi.ca/ergast/f1/${req.season}/${req.calendarRound ? req.calendarRound : "next"}/qualifying`,
    );

    const data = (await response.json()) as QualifyingResponse;

    const availableRaces = data.MRData.RaceTable.Races;
    if (!availableRaces || availableRaces.length === 0) {
      return new Response("No wualifying data available yet", { status: 200 });
    }

    const qualifyingResults = availableRaces[0].QualifyingResults;

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

    if (existingResults.length) {
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
