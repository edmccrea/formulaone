import prisma from "$lib/prisma";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params, locals }) => {
  const raceId = params.id;

  async function getPageData() {
    const [user, race, bets, users, result] = await Promise.all([
      prisma.users.findFirst({
        where: {
          username: locals.user.name,
        },
      }),
      prisma.races.findFirst({
        where: {
          race_id: Number(raceId),
        },
      }),
      prisma.bets.findMany({
        where: {
          race_id: Number(raceId),
        },
      }),
      prisma.users.findMany(),
      prisma.results.findFirst({
        where: {
          race_id: Number(raceId),
        },
      }),
    ]);

    if (!user || !race || !bets || !users)
      throw new Error("Failed to load page data");

    return {
      user,
      race,
      bets,
      users,
      result,
    };
  }

  const { user, race, bets, users, result } = await getPageData();
  const mappedRace = mapRace(race);
  const betTable = createBetTable(users, bets);

  return {
    user,
    race: mappedRace,
    betTable,
    users,
    result,
  };
}) satisfies PageServerLoad;

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
    trackLayout: race.track_layout,
  };
}

function createBetTable(users: App.User[], bets: App.Bet[]): App.BetTable {
  const betTable: App.BetTable = [];

  users.forEach((user) => {
    betTable.push({
      username: user.username,
      user_id: user.user_id,
      bets: {
        first: "",
        second: "",
        third: "",
      },
    });
  });

  bets.forEach((bet) => {
    const user = betTable.find((user) => user.user_id === bet.user_id);
    if (user)
      user.bets = {
        first: bet.first,
        second: bet.second,
        third: bet.third,
      };
  });

  return betTable;
}
