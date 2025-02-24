import { db } from "$lib/drizzle/db";
import { races, seasons } from "$lib/drizzle/schema";
import { eq, sql } from "drizzle-orm";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const req = await request.json();
    const response = await fetch(
      `http://api.jolpi.ca/ergast/f1/${req.season}/races`,
    );

    const data = (await response.json()) as RacesResponse;

    const requestedSeason = await db
      .select()
      .from(seasons)
      .where(eq(seasons.year, req.season));
    const first = requestedSeason.at(0);

    if (!first) {
      throw new Error("Requested season not found");
    }

    const mappedRaces = mapRaces({
      races: data.MRData.RaceTable.Races,
      seasonId: first.seasonId,
    });

    await db
      .insert(races)
      .values(mappedRaces)
      .onConflictDoUpdate({
        target: [races.seasonId, races.raceName, races.raceType],
        set: {
          countryFlag: sql`excluded.country_flag`,
          qualifyingStart: sql`excluded.qualifying_start`,
          raceStart: sql`excluded.race_start`,
          location: sql`excluded.location`,
          trackName: sql`excluded.track_name`,
          raceImage: sql`excluded.race_image`,
          trackLayout: sql`excluded.track_layout`,
          calendarRound: sql`excluded.calendar_round`,
          qualifyingTime: sql`excluded.qualifying_time`,
          qualifyingDate: sql`excluded.qualifying_date`,
          raceTime: sql`excluded.race_time`,
          raceDate: sql`excluded.race_date`,
        },
      });

    return new Response("Calendar updated successfully", { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return new Response(`Error updating calendar: ${error.message}`, {
        status: 500,
      });
    } else {
      console.error(error);
      return new Response("Unknown error updating calendar", {
        status: 500,
      });
    }
  }
};

function mapRaces({ races, seasonId }: { races: Race[]; seasonId: number }) {
  return races.flatMap((race) => {
    const country =
      race.Circuit.Location.country === "United States"
        ? "USA"
        : race.Circuit.Location.country;

    const raceName = race.raceName.includes("Emilia")
      ? "Imola Grand Prix"
      : race.raceName;

    const baseRace = {
      seasonId,
      location: race.Circuit.Location.locality,
      raceName,
      trackName: race.Circuit.circuitName,
      trackLayout: `https://res.cloudinary.com/edmccrea/image/upload/c_scale,w_300/v1708764272/F1/Track%20Layouts/${race.Circuit.circuitId}.avif`,
      calendarRound: Number(race.round),
      countryFlag: `https://res.cloudinary.com/edmccrea/image/upload/v1695236190/F1/Flags/Named/${country.replace(/\s/g, "")}.png`,
    };

    if (race.Sprint) {
      return [
        {
          ...baseRace,
          raceType: "Sprint",
          qualifyingStart: new Date(
            `${race.SprintQualifying!.date}T${race.SprintQualifying!.time}`,
          ),
          raceStart: new Date(`${race.Sprint.date}T${race.Sprint.time}`),
          raceImage: `https://res.cloudinary.com/edmccrea/image/upload/c_scale,w_379/v1695140315/F1/Race%20Images/Named/${race.Circuit.circuitId}-sprint.avif`,
          qualifyingTime: race.SprintQualifying!.time,
          qualifyingDate: race.SprintQualifying!.date,
          raceTime: race.Sprint.time,
          raceDate: race.Sprint.date,
        },
        {
          ...baseRace,
          raceType: "Grand Prix",
          qualifyingStart: new Date(
            `${race.Qualifying.date}T${race.Qualifying.time}`,
          ),
          raceStart: new Date(`${race.date}T${race.time}`),
          raceImage: `https://res.cloudinary.com/edmccrea/image/upload/c_scale,w_379/v1695140315/F1/Race%20Images/Named/${race.Circuit.circuitId}.avif`,
          qualifyingTime: race.Qualifying.time,
          qualifyingDate: race.Qualifying.date,
          raceTime: race.time,
          raceDate: race.date,
        },
      ];
    } else {
      return [
        {
          ...baseRace,
          raceName,
          raceType: "Grand Prix",
          qualifyingStart: new Date(
            `${race.Qualifying.date}T${race.Qualifying.time}`,
          ),
          raceStart: new Date(`${race.date}T${race.time}`),
          raceImage: `https://res.cloudinary.com/edmccrea/image/upload/c_scale,w_379/v1695140315/F1/Race%20Images/Named/${race.Circuit.circuitId}.avif`,
          qualifyingTime: race.Qualifying.time,
          qualifyingDate: race.Qualifying.date,
          raceTime: race.time,
          raceDate: race.date,
        },
      ];
    }
  });
}
