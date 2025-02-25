import { error } from "@sveltejs/kit";
import {
  driverStandings,
  constructorStandings,
  seasons,
} from "$lib/drizzle/schema";
import { db } from "$lib/drizzle/db";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import type { ProcessedStanding, ProcessedConstructorStanding } from "./types";

export const load: PageServerLoad = (async () => {
  const currentSeasonResult = await db
    .select()
    .from(seasons)
    .where(eq(seasons.currentSeason, true));

  const currentSeason = currentSeasonResult.at(0);

  if (!currentSeason) {
    error(404, "Current season not found");
  }

  const [driverStandingsResult, constructorStandingsResult] = await Promise.all(
    [
      db
        .select()
        .from(driverStandings)
        .where(eq(driverStandings.seasonId, currentSeason.seasonId)),
      db
        .select()
        .from(constructorStandings)
        .where(eq(constructorStandings.seasonId, currentSeason.seasonId)),
    ],
  );

  const foundDriverStandings = driverStandingsResult.at(0);
  const foundConstructorStandings = constructorStandingsResult.at(0);

  if (!foundDriverStandings) {
    error(404, "Driver standings not found");
  }

  if (!foundConstructorStandings) {
    error(404, "Constructor standings not found");
  }

  const standings = JSON.parse(
    foundDriverStandings.standingsData,
  ) as ProcessedStanding[];

  const constructorStandingsData = JSON.parse(
    foundConstructorStandings.standingsData,
  ) as ProcessedConstructorStanding[];

  return {
    driverStandings: standings,
    constructorStandings: constructorStandingsData,
  };
}) satisfies PageServerLoad;
