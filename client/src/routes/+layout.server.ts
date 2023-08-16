import type { LayoutServerLoad } from "./$types";
import prisma from "$lib/prisma";

export const load = (async ({ locals }) => {
  const races = await prisma.races.findMany();
  const mappedRaces = mapRaces(races);
  const { previousRaces, upcomingRaces } = sortRaces(mappedRaces);
  return {
    previousRaces,
    upcomingRaces,
  };
}) satisfies LayoutServerLoad;

function mapRaces(races: App.DatabaseRace[]): App.Race[] {
  if (!races) return [];
  return races.map((race) => {
    return {
      id: race.race_id,
      name: race.race_name,
      type: race.race_type,
      flag: race.country_flag,
      qualyStart: race.qualifying_start,
      location: race.location,
      track: race.track_name,
      raceStart: race.race_start,
      image: race.race_image,
      trackLayout: race.track_layout,
    };
  });
}

function sortRaces(mappedRaces: App.Race[]) {
  const date = Date.now();
  const previousRaces = mappedRaces
    .filter((race) => {
      const raceStartMillis = new Date(race.raceStart).getTime();
      return raceStartMillis < date;
    })
    .sort((a, b) => {
      const aMillis = new Date(a.raceStart).getTime();
      const bMillis = new Date(b.raceStart).getTime();
      return bMillis - aMillis;
    });

  const upcomingRaces = mappedRaces
    .filter((race) => {
      const raceStartMillis = new Date(race.raceStart).getTime();
      return raceStartMillis > date;
    })
    .sort((a, b) => {
      const aMillis = new Date(a.raceStart).getTime();
      const bMillis = new Date(b.raceStart).getTime();
      return aMillis - bMillis;
    });

  return {
    previousRaces,
    upcomingRaces,
  };
}
