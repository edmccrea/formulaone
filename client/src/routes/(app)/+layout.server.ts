import type { LayoutServerLoad } from "./$types";
import { db } from "$lib/drizzle/db";
import { races, seasons } from "$lib/drizzle/schema";
import { eq } from "drizzle-orm";

export const load = (async ({ locals: { getSession } }) => {
  const currentSeason = await db
    .select()
    .from(seasons)
    .where(eq(seasons.currentSeason, true))
    .limit(1);
  const currentSeasonRaces = await db
    .select()
    .from(races)
    .where(eq(races.seasonId, currentSeason[0].seasonId));

  const mappedRaces = mapRaces(currentSeasonRaces);
  const { previousRaces, upcomingRaces } = sortRaces(mappedRaces);

  return {
    previousRaces,
    upcomingRaces,
    session: await getSession(),
  };
}) satisfies LayoutServerLoad;

function mapRaces(races: App.DatabaseRace[]): App.Race[] {
  if (!races) return [];
  return races.map((race) => {
    return {
      id: race.raceId,
      name: race.raceName,
      type: race.raceType,
      flag: race.countryFlag,
      qualyTime: race.qualifyingTime,
      qualyDate: race.qualifyingDate,
      location: race.location,
      track: race.trackName,
      raceTime: race.raceTime,
      raceDate: race.raceDate,
      image: race.raceImage,
      trackLayout: race.trackLayout,
    };
  });
}

function sortRaces(mappedRaces: App.Race[]) {
  const date = Date.now();
  const oneDay = 86400000;
  const previousRaces = mappedRaces
    .filter((race) => {
      const raceStartMillis = new Date(race.raceDate).getTime();
      return raceStartMillis < date;
    })
    .sort((a, b) => {
      const aMillis = new Date(a.raceDate).getTime();
      const bMillis = new Date(b.raceDate).getTime();
      return bMillis - aMillis;
    });

  const upcomingRaces = mappedRaces
    .filter((race) => {
      const raceStartMillis = new Date(race.raceDate).getTime();
      return raceStartMillis > date - oneDay;
    })
    .sort((a, b) => {
      const aMillis = new Date(a.raceDate).getTime();
      const bMillis = new Date(b.raceDate).getTime();
      return aMillis - bMillis;
    });

  return {
    previousRaces,
    upcomingRaces,
  };
}
