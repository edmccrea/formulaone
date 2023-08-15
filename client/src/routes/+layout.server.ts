import type { LayoutServerLoad } from "./$types";
import prisma from "$lib/prisma";

export const load = (async ({ locals }) => {
  const user = await prisma.users.findFirst({
    where: {
      username: locals.user.name,
    },
  });

  if (!user) return {};
  const bets = await prisma.bets.findMany({
    where: {
      user_id: user?.user_id,
    },
  });

  const races = await prisma.races.findMany();
  const mappedRaces = mapRaces(races, bets);
  const { previousRaces, upcomingRaces } = sortRaces(mappedRaces);
  return {
    previousRaces,
    upcomingRaces,
    user,
  };
}) satisfies LayoutServerLoad;

function mapRaces(races: App.DatabaseRace[], bets: App.Bet[]): App.Race[] {
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
      userHasBet: checkIfUserHasBet(race.race_id, bets),
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

function checkIfUserHasBet(raceId: BigInt, bets: App.Bet[]) {
  const usersBets = bets.filter((bet) => Number(bet.user_id) === 1);
  if (usersBets) {
    const userBet = usersBets.find((bet) => bet.race_id === raceId);
    if (userBet) {
      return true;
    }
  }

  return false;
}
