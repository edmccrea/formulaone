import type { LayoutServerLoad } from "./$types";
import prisma from "$lib/prisma";

export const load = (async () => {
  const user = prisma.users.findFirst({
    where: {
      user_id: 1,
    },
  });

  const bets = await prisma.bets.findMany({
    where: {
      user_id: 1,
    },
  });

  const races = await prisma.races.findMany();
  const mappedRaces = mapRaces(races, bets);

  return {
    races: mappedRaces,
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
