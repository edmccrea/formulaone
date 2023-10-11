import { XMLParser } from "fast-xml-parser";

import prisma from "$lib/prisma";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
  const parser = new XMLParser();
  const raceId = params.raceId;

  const dbRace = await prisma.races.findFirst({
    where: {
      race_id: Number(raceId),
    },
  });

  const url = `http://ergast.com/api/f1/current/${dbRace?.calendar_round}/results`;
  const sprintUrl = `http://ergast.com/api/f1/current/${dbRace?.calendar_round}/sprint`;

  const raceRes = await fetch(url);
  const raceXmlText = await raceRes.text();
  const raceJSON = parser.parse(raceXmlText);

  const sprintRes = await fetch(sprintUrl);
  const sprintXmlText = await sprintRes.text();
  const sprintJSON = parser.parse(sprintXmlText);

  const sprint = sprintJSON.MRData.RaceTable.Race;
  if (sprint) {
    const sprintResults =
      sprintJSON.MRData.RaceTable.Race.SprintList.SprintResult;
    await saveTopThreeToDatabase(sprintResults, sprint);
  }

  const race = raceJSON.MRData.RaceTable.Race;
  if (race) {
    const results = raceJSON.MRData.RaceTable.Race.ResultsList.Result;
    await saveTopThreeToDatabase(results, race);
  }

  updateLeaderboard();
  return new Response(`Results fetched for ${dbRace?.race_name}`, {
    status: 200,
  });
};

async function saveTopThreeToDatabase(results: any, race: any) {
  console.log(race);
  const topThree = [];

  for (let i = 0; i < 3; i++) {
    topThree.push(
      results[i].Driver.GivenName + " " + results[i].Driver.FamilyName
    );
  }

  const raceType = race.SprintList ? "Sprint" : "Grand Prix";
  const databaseRace = await prisma.races.findFirst({
    where: {
      race_name: race.RaceName,
      race_type: raceType,
    },
  });

  if (databaseRace) {
    const alreadyExistingResults = await prisma.results.findFirst({
      where: {
        race_id: databaseRace.race_id,
      },
    });

    if (alreadyExistingResults) {
      console.log(
        `Results already exist for ${databaseRace.race_name} ${databaseRace.race_type}`
      );
    } else {
      console.log(
        `Creating results for ${databaseRace.race_name} ${databaseRace.race_type}`
      );
      await prisma.results.create({
        data: {
          race_id: databaseRace.race_id,
          first: topThree[0],
          second: topThree[1],
          third: topThree[2],
        },
      });
    }
  } else {
    //Error handling
  }
}

async function updateLeaderboard() {
  const results = await prisma.results.findMany();
  const users = await prisma.users.findMany();
  const races = await prisma.races.findMany();

  users.forEach(async (user) => {
    const bets = await prisma.bets.findMany({
      where: {
        user_id: user.user_id,
      },
    });

    let points = 0;
    bets.forEach((bet) => {
      const race = races.find((race) => race.race_id === bet.race_id);
      const result = results.find((result) => result.race_id === bet.race_id);
      if (result) {
        if (
          result.first === bet.first &&
          result.second === bet.second &&
          result.third === bet.third
        ) {
          if (race?.race_type === "Sprint") {
            points += 2.5;
          } else {
            points += 5;
          }
          return;
        } else {
          if (
            result.first === bet.first ||
            result.first === bet.second ||
            result.first === bet.third
          ) {
            if (race?.race_type === "Sprint") {
              points += 0.5;
            } else {
              points++;
            }
          }

          if (
            result.second === bet.first ||
            result.second === bet.second ||
            result.second === bet.third
          ) {
            if (race?.race_type === "Sprint") {
              points += 0.5;
            } else {
              points++;
            }
          }

          if (
            result.third === bet.first ||
            result.third === bet.second ||
            result.third === bet.third
          ) {
            if (race?.race_type === "Sprint") {
              points += 0.5;
            } else {
              points++;
            }
          }
        }
      }
    });

    await prisma.users.update({
      where: {
        user_id: user.user_id,
      },
      data: {
        points: points,
      },
    });
    rankUsers();
  });
}

async function rankUsers() {
  const users = await prisma.users.findMany();
  users.sort((a, b) => b.points - a.points);

  let currentPosition = 1;
  for (let i = 0; i < users.length; i++) {
    if (i > 0 && users[i].points < users[i - 1].points) {
      currentPosition = i + 1;
    }
    users[i].position = currentPosition;
  }

  users.forEach(async (user) => {
    await prisma.users.update({
      where: {
        user_id: user.user_id,
      },
      data: {
        position: user.position,
      },
    });
  });
}
