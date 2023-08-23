import { XMLParser } from "fast-xml-parser";

import prisma from "$lib/prisma";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  const parser = new XMLParser();

  const url = `http://ergast.com/api/f1/current/last/results`;
  const sprintUrl = `http://ergast.com/api/f1/current/last/sprint`;

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
    getTopThree(sprintResults, sprint);
  }

  const race = raceJSON.MRData.RaceTable.Race;
  if (race) {
    const results = raceJSON.MRData.RaceTable.Race.ResultsList.Result;
    getTopThree(results, race);
  }

  return new Response("Results fetched", { status: 200 });
};

async function getTopThree(results: any, race: any) {
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
