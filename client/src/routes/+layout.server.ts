import type { LayoutServerLoad } from "./$types";
import prisma from "$lib/prisma";

export const load = (async () => {
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
      qualyTime: race.qualifying_time,
      qualyDate: race.qualifying_date,
      location: race.location,
      track: race.track_name,
      raceTime: race.race_time,
      raceDate: race.race_date,
      image: race.race_image,
      trackLayout: race.track_layout,
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
