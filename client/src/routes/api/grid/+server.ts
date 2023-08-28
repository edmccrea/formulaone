import { XMLParser } from "fast-xml-parser";

import prisma from "$lib/prisma";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({}) => {
  const parser = new XMLParser();

  const url = `http://ergast.com/api/f1/current/last/qualifying`;
  const ergastRes = await fetch(url);
  const xmlText = await ergastRes.text();
  const json = parser.parse(xmlText);
  const race = json.MRData.RaceTable.Race;
  const grid = json.MRData.RaceTable.Race.QualifyingList.QualifyingResult;

  const mappedGrid = grid.map((driver: any) => {
    return {
      name: driver.Driver.GivenName + " " + driver.Driver.FamilyName,
      lapTime: driver.Q3 || driver.Q2 || driver.Q1,
    };
  });

  const dbRace = await prisma.races.findFirst({
    where: {
      race_name: race.RaceName,
      race_type: "Grand Prix",
    },
  });

  if (dbRace) {
    const existingGrid = await prisma.grids.findFirst({
      where: {
        race_id: dbRace.race_id,
      },
    });
    if (!existingGrid) {
      await prisma.grids.create({
        data: {
          race_id: dbRace.race_id,
          grid: JSON.stringify(mappedGrid),
        },
      });
      return new Response(`Grid created for ${race.RaceName}`, {
        status: 200,
      });
    } else if (existingGrid.grid !== JSON.stringify(mappedGrid)) {
      await prisma.grids.update({
        where: {
          id: existingGrid.id,
        },
        data: {
          grid: JSON.stringify(mappedGrid),
        },
      });
      return new Response(`Grid updated for ${race.RaceName}`, { status: 200 });
    } else {
      return new Response(`Grid already exists for ${race.RaceName}`, {
        status: 200,
      });
    }
  }
  return new Response("Something went wrong", { status: 500 });
};
