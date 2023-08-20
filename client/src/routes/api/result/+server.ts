import { XMLParser } from "fast-xml-parser";

import prisma from "$lib/prisma";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({}) => {
  const parser = new XMLParser();

  const url = `http://ergast.com/api/f1/current/last/results`;
  const ergastRes = await fetch(url);
  const xmlText = await ergastRes.text();
  const json = parser.parse(xmlText);

  const results = json.MRData.RaceTable.Race.ResultsList.Result;
  const topThree = [];

  for (let i = 0; i < 3; i++) {
    topThree.push(
      results[i].Driver.GivenName + " " + results[i].Driver.FamilyName
    );
  }

  console.log(topThree);

  return new Response("Results fetched", { status: 200 });
};
