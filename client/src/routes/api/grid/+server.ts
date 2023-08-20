import { XMLParser } from "fast-xml-parser";

import prisma from "$lib/prisma";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({}) => {
  const parser = new XMLParser();

  const url = `http://ergast.com/api/f1/current/last/qualifying`;
  const ergastRes = await fetch(url);
  const xmlText = await ergastRes.text();
  const json = parser.parse(xmlText);

  const race = json.MRData.RaceTable;
  const grid = json.MRData.RaceTable.Race.QualifyingList.QualifyingResult;
  //   const gridArray = [];

  console.log(race);

  return new Response("Results fetched", { status: 200 });
};
