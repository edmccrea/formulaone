import type { PageLoad } from "./$types";

export const load = (async ({ url, fetch }) => {
  const raceId = url.searchParams.get("id");

  const res = await fetch(`/api/races?id=${raceId}`, {
    method: "GET",
  });

  const race = (await res.json()) as App.DatabaseRace;
  const mappedRace = mapRace(race);

  return {
    race: mappedRace,
  };
}) satisfies PageLoad;

function mapRace(race: App.DatabaseRace): App.Race {
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
}
