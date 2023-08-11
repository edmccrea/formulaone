import type { LayoutServerLoad } from "./$types";
import prisma from "$lib/prisma";

export const load = (async () => {
  const races = await prisma.races.findMany();
  const mappedRaces = mapRaces(races);

  const user = prisma.users.findFirst({
    where: {
      user_id: 1,
    },
  });

  return {
    races: mappedRaces,
    user,
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
    };
  });
}
