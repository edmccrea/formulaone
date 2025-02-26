import { db } from "$lib/drizzle/db";
import { driverStandings, seasons } from "$lib/drizzle/schema";
import { eq } from "drizzle-orm";
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
      `http://api.jolpi.ca/ergast/f1/${req.season}/driverstandings/`,
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
      .from(driverStandings)
      .where(eq(driverStandings.seasonId, firstSeason.seasonId));

    if (existingStandings.length > 0) {
      await db
        .update(driverStandings)
        .set({
          standingsData: JSON.stringify(formattedStandings),
        })
        .where(eq(driverStandings.seasonId, firstSeason.seasonId));
    } else {
      await db.insert(driverStandings).values({
        seasonId: firstSeason.seasonId,
        standingsData: JSON.stringify(formattedStandings),
      });
    }

    return new Response("Driver standings updated successfully", {
      status: 200,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return new Response(`Error updating driver standings: ${error.message}`, {
        status: 500,
      });
    } else {
      console.error(error);
      return new Response("Unknown error updating driver standings", {
        status: 500,
      });
    }
  }
};

function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}

function formatStandingsData(data: DriverStandingsResponse) {
  return data.MRData.StandingsTable.StandingsLists[0].DriverStandings.map(
    (standing: any) => ({
      position: parseInt(standing.position),
      driverName: `${standing.Driver.givenName} ${standing.Driver.familyName}`,
      driverId: standing.Driver.driverId,
      points: parseInt(standing.points),
      nationality: standing.Driver.nationality,
      age: calculateAge(standing.Driver.dateOfBirth),
      constructor: standing.Constructors[0].name,
      constructorId: standing.Constructors[0].constructorId,
      wins: parseInt(standing.wins),
      number: standing.Driver.permanentNumber,
      helmet: `https://res.cloudinary.com/edmccrea/image/upload/v1740431201/F1/Helmets/${standing.Driver.driverId}.png`,
    }),
  );
}
