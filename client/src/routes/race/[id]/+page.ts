import type { PageLoad } from "../$types";

export const load = (async ({ params, fetch, data }) => {
  const user = data.user;
  const raceId = params.id;

  async function getPageData() {
    const raceUrl = `/api/race/${raceId}`;
    const betUrl = `/api/bets/${raceId}`;
    const userUrl = `/api/users`;

    const responses = await Promise.all([
      fetch(raceUrl),
      fetch(betUrl),
      fetch(userUrl),
    ]);

    const race = (await responses[0].json()) as App.DatabaseRace;
    const bets = (await responses[1].json()) as App.Bet[];
    const users = (await responses[2].json()) as App.User[];

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
    bets,
    betTable,
    user,
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
