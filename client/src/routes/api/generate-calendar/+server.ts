import { XMLParser } from "fast-xml-parser";

import { db } from "$lib/drizzle/db";
import { races, seasons } from "$lib/drizzle/schema";
import type { RequestHandler } from "./$types";
import { deepEqual } from "$lib/utils/deep-equal";
import { mapRaces } from "./functions/map-races";
import { and, eq } from "drizzle-orm";

type NewRace = typeof races.$inferInsert;
const insertRaces = async (race: NewRace) => {
  const res = await db.insert(races).values(race);
};

export const GET: RequestHandler = async ({ locals }) => {
  // if (!locals.user.admin) return new Response("Unauthorized", { status: 401 });
  const options = {
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  };
  const parser = new XMLParser(options);

  const url = `http://ergast.com/api/f1/2024`;
  const ergastRes = await fetch(url);
  const xmlText = await ergastRes.text();
  const json = parser.parse(xmlText);

  const [currentSeason] = await db
    .select()
    .from(seasons)
    .where(eq(seasons.currentSeason, true));

  const mappedRaces = mapRaces(json.MRData.RaceTable.Race);

  mappedRaces.forEach(async (race) => {
    if (race.sprintObj) {
      const [alreadyExistingRace] = await db
        .select()
        .from(races)
        .where(
          and(
            eq(races.raceName, race.sprintObj.race_name),
            eq(races.raceType, "Sprint")
          )
        )
        .limit(1);

      if (alreadyExistingRace) {
        const comparisonObject = {
          ...alreadyExistingRace,
          calendar_id: alreadyExistingRace.calendarRound,
          race_image: "",
          qualifying_date: "",
          qualifying_time: "",
        };

        const sprintComparisonObject = {
          ...race.sprintObj,
          calendar_round: race.sprintObj.calendar_id,
          race_id: alreadyExistingRace.raceId,
          race_image: "",
          qualifying_date: "",
          qualifying_time: "",
        };

        const areEqual = deepEqual(comparisonObject, sprintComparisonObject);
        if (areEqual) {
          console.log(`No new updates for ${race.sprintObj.race_name} Sprint`);
        } else {
          const sprintObj = race.sprintObj;
          await db
            .update(races)
            .set({
              calendarRound: sprintObj.calendar_id,
              raceName: sprintObj.race_name,
              location: sprintObj.location,
              raceType: sprintObj.race_type,
              countryFlag: sprintObj.country_flag,
              raceDate: sprintObj.race_date,
              raceTime: sprintObj.race_time,
              trackName: sprintObj.track_name,
              raceImage: sprintObj.race_image,
              trackLayout: sprintObj.track_layout,
            })
            .where(eq(races.raceId, alreadyExistingRace.raceId));
          console.log(`Updating ${race.sprintObj.race_name} Sprint`);
        }
      } else {
        const sprintObj = race.sprintObj;
        const newSprintRace = {
          calendarRound: sprintObj.calendar_id,
          raceName: sprintObj.race_name,
          location: sprintObj.location,
          raceType: sprintObj.race_type,
          countryFlag: sprintObj.country_flag,
          qualifyingStart: new Date(),
          qualifyingDate: sprintObj.qualifying_date,
          qualifyingTime: sprintObj.qualifying_time,
          raceStart: new Date(),
          raceDate: sprintObj.race_date,
          raceTime: sprintObj.race_time,
          raceImage: sprintObj.race_image,
          trackName: sprintObj.track_name,
          trackLayout: sprintObj.track_layout,
          seasonId: currentSeason.seasonId,
        };
        await insertRaces(newSprintRace);
        console.log(`Sprint race created for ${newSprintRace.raceName}`);
      }
    }

    const [alreadyExistingRace] = await db
      .select()
      .from(races)
      .where(
        and(
          eq(races.raceName, race.raceObj.race_name),
          eq(races.raceType, "Grand Prix")
        )
      )
      .limit(1);

    if (alreadyExistingRace) {
      const comparisonObject = {
        ...alreadyExistingRace,
        calendar_id: alreadyExistingRace.calendarRound,
        race_image: "",
      };

      const grandPrixComparisonObject = {
        ...race.raceObj,
        calendar_round: race.raceObj.calendar_id,
        race_id: alreadyExistingRace.raceId,
        race_image: "",
      };

      const areEqual = deepEqual(comparisonObject, grandPrixComparisonObject);

      if (areEqual) {
        console.log(`No new updates for ${alreadyExistingRace.raceName} GP`);
      } else {
        const raceObj = race.raceObj;
        await db
          .update(races)
          .set({
            calendarRound: raceObj.calendar_id,
            raceName: raceObj.race_name,
            location: raceObj.location,
            raceType: raceObj.race_type,
            countryFlag: raceObj.country_flag,
            qualifyingDate: raceObj.qualifying_date,
            qualifyingTime: raceObj.qualifying_time,
            raceDate: raceObj.race_date,
            raceTime: raceObj.race_time,
            trackName: raceObj.track_name,
            raceImage: raceObj.race_image,
            trackLayout: raceObj.track_layout,
          })
          .where(eq(races.raceId, alreadyExistingRace.raceId));

        console.log(`Updating ${race.raceObj.race_name} GP`);
      }
    } else {
      const raceObj = race.raceObj;
      const newGrandPrix = {
        calendarRound: raceObj.calendar_id,
        raceName: raceObj.race_name,
        location: raceObj.location,
        raceType: raceObj.race_type,
        countryFlag: raceObj.country_flag,
        qualifyingStart: new Date(),
        qualifyingDate: raceObj.qualifying_date,
        qualifyingTime: raceObj.qualifying_time,
        raceStart: new Date(),
        raceDate: raceObj.race_date,
        raceTime: raceObj.race_time,
        raceImage: raceObj.race_image,
        trackName: raceObj.track_name,
        trackLayout: raceObj.track_layout,
        seasonId: currentSeason.seasonId,
      };
      await insertRaces(newGrandPrix);
      console.log(`Grand prix created for ${newGrandPrix.raceName}`);
    }
  });

  return new Response("Success", { status: 200 });
};
