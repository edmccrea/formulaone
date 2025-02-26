import { eq } from "drizzle-orm";
import { db } from "$lib/drizzle/db";
import type { RequestHandler } from "./$types";
import { constructorStandings, seasons } from "$lib/drizzle/schema";
import { API_KEY } from "$env/static/private";

export const POST: RequestHandler = async ({ request }) => {
  const apiKey = request.headers.get("x-api-key");
  if (apiKey !== API_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const req = await request.json();
    const response = await fetch(
      `http://api.jolpi.ca/ergast/f1/${req.season}/constructorStandings/`,
    );

    const data = await response.json();

    const season = await db
      .select()
      .from(seasons)
      .where(eq(seasons.year, req.season));

    const firstSeason = season.at(0);
    if (!firstSeason) {
      throw new Error("Season not found");
    }

    const formattedStandings = formatStandingsData(data);

    const existingStandings = await db
      .select()
      .from(constructorStandings)
      .where(eq(constructorStandings.seasonId, firstSeason.seasonId));

    if (existingStandings.length > 0) {
      await db
        .update(constructorStandings)
        .set({
          standingsData: JSON.stringify(formattedStandings),
        })
        .where(eq(constructorStandings.seasonId, firstSeason.seasonId));
    } else {
      await db.insert(constructorStandings).values({
        seasonId: firstSeason.seasonId,
        standingsData: JSON.stringify(formattedStandings),
      });
    }

    return new Response("Constructor standings updated successfully", {
      status: 200,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return new Response(
        `Error updating constructor standings: ${error.message}`,
        {
          status: 500,
        },
      );
    } else {
      console.error(error);
      return new Response("Unknown error updating constructor standings", {
        status: 500,
      });
    }
  }
};

function formatStandingsData(data: ConstructorStandingsResponse) {
  return data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings.map(
    (standing) => ({
      position: parseInt(standing.position),
      constructorName: standing.Constructor.name,
      constructorId: standing.Constructor.constructorId,
      points: parseInt(standing.points),
      nationality: standing.Constructor.nationality,
      wins: parseInt(standing.wins),
      logo: `https://res.cloudinary.com/edmccrea/image/upload/v1740431201/F1/Constructors/${standing.Constructor.constructorId}.png`,
    }),
  );
}
