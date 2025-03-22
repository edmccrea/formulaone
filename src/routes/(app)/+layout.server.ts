import type { LayoutServerLoad } from "./$types";
import { db } from "$lib/drizzle/db";
import {
  bets,
  constructorsBets,
  races,
  scores,
  seasons,
  users,
} from "$lib/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { error } from "@sveltejs/kit";

export const load = (async ({ locals: { getSession }, fetch }) => {
  const currentSeasonResponse = await db
    .select()
    .from(seasons)
    .where(eq(seasons.currentSeason, true));
  const currentSeason = currentSeasonResponse.at(0);
  if (!currentSeason) {
    error(404, "Current season not found");
  }
  const [allUsersPromise, session] = await Promise.all([
    db
      .select({
        userId: users.userId,
        username: users.username,
        avatar: users.avatar,
        admin: users.admin,
      })
      .from(users)
      .innerJoin(
        scores,
        and(
          eq(scores.userId, users.userId),
          eq(scores.seasonId, currentSeason.seasonId),
        ),
      ),
    getSession(),
  ]);
  const currentSeasonRaces = await db
    .select()
    .from(races)
    .where(eq(races.seasonId, currentSeason.seasonId));

  const allBets = await db
    .select()
    .from(bets)
    .where(eq(bets.seasonId, currentSeason.seasonId));

  const mappedRaces = mapRaces(currentSeasonRaces, currentSeason.seasonId);
  const { previousRaces, upcomingRaces } = sortRaces(mappedRaces);

  const allUsers = allUsersPromise;
  const mappedUsers = await Promise.all(
    allUsers.map(async (user) => {
      const [userScore, userConstructorBet, userBets] = await Promise.all([
        getUserScore(user.userId, currentSeason.seasonId),
        getUserConstructorBet(user.userId, currentSeason.seasonId),
        getUserBets(user.userId),
      ]);

      return {
        userId: user.userId,
        username: user.username,
        avatar: user.avatar,
        points: userScore?.score ?? 0,
        position: userScore?.position ?? 0,
        constructorBet: userConstructorBet?.constructorName ?? "",
        constructorId: userConstructorBet?.constructorId ?? "",
        admin: user.admin,
        userBets,
      };
    }),
  );

  let user = null;
  if (session) {
    const res = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: session.user.email }),
    });
    let data = (await res.json()) as { user: App.User };
    if (res.ok) {
      user = {
        userId: data.user.userId,
        username: data.user.username,
        avatar: data.user.avatar,
        points: data.user.points,
        position: data.user.position,
        constructorBet: data.user.constructorBet,
        constructorId: data.user.constructorId,
        admin: data.user.admin,
        userBets: data.user.userBets,
      };
    }
  }

  return {
    previousRaces,
    upcomingRaces,
    allRaces: mappedRaces,
    users: mappedUsers,
    bets: allBets,
    currentSeason,
    session: await getSession(),
    user,
    userBets: user?.userBets,
  };
}) satisfies LayoutServerLoad;

function mapRaces(
  races: App.DatabaseRace[],
  currentSeasonId: number,
): App.Race[] {
  if (!races) return [];
  return races.map((race) => {
    return {
      raceId: Number(race.raceId), //TODO: Investigate why this is a string
      seasonId: currentSeasonId,
      name: race.raceName,
      type: race.raceType,
      flag: race.countryFlag,
      qualyTime: race.qualifyingTime,
      qualyDate: race.qualifyingDate,
      location: race.location,
      track: race.trackName,
      raceTime: race.raceTime,
      raceDate: race.raceDate,
      image: race.raceImage,
      trackLayout: race.trackLayout,
      raceStart: race.raceStart,
      qualifyingStart: race.qualifyingStart,
    };
  });
}

function sortRaces(mappedRaces: App.Race[]) {
  const date = Date.now();
  const fourHours = 14400000;
  const previousRaces = mappedRaces
    .filter((race) => {
      const raceStartMillis = race.raceStart.getTime();
      return raceStartMillis < date;
    })
    .sort((a, b) => {
      const aMillis = a.raceStart.getTime();
      const bMillis = b.raceStart.getTime();
      return bMillis - aMillis;
    });

  const upcomingRaces = mappedRaces
    .filter((race) => {
      const raceStartMillis = race.raceStart.getTime();
      return raceStartMillis > date - fourHours;
    })
    .sort((a, b) => {
      const aMillis = a.raceStart.getTime();
      const bMillis = b.raceStart.getTime();
      return aMillis - bMillis;
    });

  return {
    previousRaces,
    upcomingRaces,
  };
}

async function getUserScore(userId: number, currentSeasonId: number) {
  const userScore = await db
    .select({ score: scores.score, position: scores.position })
    .from(scores)
    .where(and(eq(scores.userId, userId), eq(scores.seasonId, currentSeasonId)))
    .limit(1);
  return userScore[0];
}

async function getUserConstructorBet(userId: number, currentSeasonId: number) {
  const bet = await db
    .select({
      constructorName: constructorsBets.constructorName,
      constructorId: constructorsBets.constructorId,
    })
    .from(constructorsBets)
    .where(
      and(
        eq(constructorsBets.userId, userId),
        eq(constructorsBets.seasonId, currentSeasonId),
      ),
    );
  return bet[0];
}

async function getUserBets(userId: number) {
  const userBets = await db.select().from(bets).where(eq(bets.userId, userId));
  return userBets;
}
