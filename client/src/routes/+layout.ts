import type { LayoutLoad } from "./$types";

export const load = (async ({ fetch }) => {
  const res = await fetch("/api/race", {
    method: "GET",
  });

  const races: App.DatabaseRace[] = await res.json();
  const mappedRaces = mapRaces(races);
  return {
    races: mappedRaces,
  };
}) satisfies LayoutLoad;

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
