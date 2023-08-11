import prisma from "$lib/prisma";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  const raceId = params.id;

  async function getPageData() {
    const responses = await Promise.all([
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
    ]);

    const race = responses[0] as App.DatabaseRace;
    const bets = responses[1] as App.Bet[];
    const users = responses[2] as App.User[];

    return {
      race,
      bets,
      users,
    };
  }

  const { race, bets, users } = await getPageData();
  const mappedRace = mapRace(race);
  const betTable = createBetTable(users, bets);

  return {
    race: mappedRace,
    betTable,
    users,
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
