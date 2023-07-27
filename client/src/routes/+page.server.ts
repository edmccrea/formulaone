import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ cookies, fetch }) => {
  const sessionId = cookies.get("session_id");
  if (!sessionId) {
    throw redirect(301, "/login");
  }

  const res = await fetch("/api/races", {
    method: "GET",
    credentials: "include",
    headers: {
      "x-session-id": sessionId || "",
    },
  });

  const races: App.DatabaseRace[] = await res.json();
  const mappedRaces = mapRaces(races);

  const userReq = await fetch("/api/user", {
    method: "GET",
    credentials: "include",
    headers: {
      "x-session-id": sessionId || "",
    },
  });

  const user = await userReq.json();

  return {
    races: mappedRaces,
    user,
  };
}) satisfies PageServerLoad;

function mapRaces(races: App.DatabaseRace[]): App.Race[] {
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
