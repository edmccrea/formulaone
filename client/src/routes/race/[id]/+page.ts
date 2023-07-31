import type { PageLoad } from "../$types";

export const load = (async ({ params, fetch }) => {
  const raceId = params.id;

  const racesRes = await fetch(`/api/race/${raceId}`, {
    method: "GET",
  });

  const race = (await racesRes.json()) as App.DatabaseRace;
  const mappedRace = mapRace(race);

  const betsRes = await fetch(`/api/bets/${raceId}`, {
    method: "GET",
  });
  const bets = (await betsRes.json()) as App.Bet[];

  const userRes = await fetch(`/api/users`, {
    method: "GET",
  });
  const users = (await userRes.json()) as App.User[];

  const betTable = createBetTable(users, bets);
  console.log(betTable);

  return {
    race: mappedRace,
    bets,
    betTable,
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
