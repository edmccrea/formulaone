import { XMLParser } from "fast-xml-parser";

import prisma from "$lib/prisma";
import type { RequestHandler } from "./$types";
import { deepEqual } from "$lib/utils/deep-equal";
import { mapRaces } from "./functions/map-races";

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.user.admin) return new Response("Unauthorized", { status: 401 });
  const options = {
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  };
  const parser = new XMLParser(options);

  const url = `http://ergast.com/api/f1/current`;
  const ergastRes = await fetch(url);
  const xmlText = await ergastRes.text();
  const json = parser.parse(xmlText);

  const mappedRaces = mapRaces(json.MRData.RaceTable.Race);

  mappedRaces.forEach(async (race) => {
    if (race.sprintObj) {
      const alreadyExistingRace = await prisma.races.findFirst({
        where: {
          race_name: race.sprintObj.race_name,
          race_type: "Sprint",
          race_date: race.sprintObj.race_date,
        },
      });
      if (alreadyExistingRace) {
        const comparisonObject = {
          ...alreadyExistingRace,
          calendar_id: alreadyExistingRace.calendar_round,
          race_image: "",
          qualifying_date: "",
          qualifying_time: "",
        };

        const sprintComparisonObject = {
          ...race.sprintObj,
          calendar_round: race.sprintObj.calendar_id,
          race_id: alreadyExistingRace.race_id,
          race_image: "",
          qualifying_date: "",
          qualifying_time: "",
        };

        const areEqual = deepEqual(comparisonObject, sprintComparisonObject);
        if (areEqual) {
          console.log(`No new updates for ${race.sprintObj.race_name} Sprint`);
        } else {
          const sprintObj = race.sprintObj;
          await prisma.races.update({
            where: {
              race_id: alreadyExistingRace.race_id,
            },
            data: {
              calendar_round: sprintObj.calendar_id,
              race_name: sprintObj.race_name,
              location: sprintObj.location,
              race_type: sprintObj.race_type,
              country_flag: sprintObj.country_flag,
              race_date: sprintObj.race_date,
              race_time: sprintObj.race_time,
              track_name: sprintObj.track_name,
              track_layout: sprintObj.track_layout,
            },
          });
          console.log(`Updating ${race.sprintObj.race_name} Sprint`);
        }
      } else {
        const sprintObj = race.sprintObj;
        const newSprint = await prisma.races.create({
          data: {
            calendar_round: sprintObj.calendar_id,
            race_name: sprintObj.race_name,
            location: sprintObj.location,
            race_type: sprintObj.race_type,
            country_flag: sprintObj.country_flag,
            qualifying_date: sprintObj.qualifying_date,
            qualifying_time: sprintObj.qualifying_time,
            race_date: sprintObj.race_date,
            race_time: sprintObj.race_time,
            race_image: sprintObj.race_image,
            track_name: sprintObj.track_name,
            track_layout: sprintObj.track_layout,
          },
        });
        console.log(`Sprint race created for ${newSprint.race_name}`);
      }
    }

    const alreadyExistingRace = await prisma.races.findFirst({
      where: {
        race_name: race.raceObj.race_name,
        race_type: "Grand Prix",
        race_date: race.raceObj.race_date,
      },
    });
    if (alreadyExistingRace) {
      const comparisonObject = {
        ...alreadyExistingRace,
        calendar_id: alreadyExistingRace.calendar_round,
        race_image: "",
      };

      const grandPrixComparisonObject = {
        ...race.raceObj,
        calendar_round: race.raceObj.calendar_id,
        race_id: alreadyExistingRace.race_id,
        race_image: "",
      };

      const areEqual = deepEqual(comparisonObject, grandPrixComparisonObject);

      if (areEqual) {
        console.log(`No new updates for ${alreadyExistingRace.race_name} GP`);
      } else {
        const raceObj = race.raceObj;
        await prisma.races.update({
          where: {
            race_id: alreadyExistingRace.race_id,
          },
          data: {
            calendar_round: raceObj.calendar_id,
            race_name: raceObj.race_name,
            location: raceObj.location,
            race_type: raceObj.race_type,
            country_flag: raceObj.country_flag,
            qualifying_date: raceObj.qualifying_date,
            qualifying_time: raceObj.qualifying_time,
            race_date: raceObj.race_date,
            race_time: raceObj.race_time,
            track_name: raceObj.track_name,
            track_layout: raceObj.track_layout,
          },
        });
        console.log(`Updating ${race.raceObj.race_name} Sprint`);
      }
    } else {
      const raceObj = race.raceObj;
      const newGrandPrix = await prisma.races.create({
        data: {
          calendar_round: raceObj.calendar_id,
          race_name: raceObj.race_name,
          location: raceObj.location,
          race_type: raceObj.race_type,
          country_flag: raceObj.country_flag,
          qualifying_date: raceObj.qualifying_date,
          qualifying_time: raceObj.qualifying_time,
          race_date: raceObj.race_date,
          race_time: raceObj.race_time,
          race_image: raceObj.race_image,
          track_name: raceObj.track_name,
          track_layout: raceObj.track_layout,
        },
      });
      console.log(`Grand prix created for ${newGrandPrix.race_name}`);
    }
  });

  return new Response("Success", { status: 200 });
};
