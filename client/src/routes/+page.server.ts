import type { LayoutServerLoad } from "./$types";
import prisma from "$lib/prisma";
import { redirect } from "@sveltejs/kit";

export const load = (async ({ locals }) => {
  const user = await prisma.users.findFirst({
    where: {
      username: locals.user.name,
    },
  });

  if (!user) {
    throw redirect(301, "/login");
  }

  const bets = await prisma.bets.findMany({
    where: {
      user_id: user.user_id,
    },
  });

  const results = await prisma.results.findMany();

  const users = await prisma.users.findMany();
  // // users.sort((a, b) => b.points - a.points);
  // // users.forEach(async (user, index) => {
  // //   await prisma.users.update({
  // //     where: {
  // //       user_id: user.user_id,
  // //     },
  // //     data: {
  // //       position: index + 1,
  // //     },
  // //   });
  // // });

  // const sprintRaceIds = [14, 10, 4];
  // users.forEach(async (user) => {
  //   const bets = await prisma.bets.findMany({
  //     where: {
  //       user_id: user.user_id,
  //     },
  //   });

  //   let points = 0;
  //   bets.forEach((bet) => {
  //     const result = results.find((result) => result.race_id === bet.race_id);
  //     if (result) {
  //       if (
  //         result.first === bet.first &&
  //         result.second === bet.second &&
  //         result.third === bet.third
  //       ) {
  //         if (sprintRaceIds.includes(Number(bet.race_id))) {
  //           points += 2.5;
  //         } else {
  //           points += 5;
  //         }
  //         return;
  //       } else {
  //         if (
  //           result.first === bet.first ||
  //           result.first === bet.second ||
  //           result.first === bet.third
  //         ) {
  //           if (sprintRaceIds.includes(Number(bet.race_id))) {
  //             points += 0.5;
  //           } else {
  //             points++;
  //           }
  //         }

  //         if (
  //           result.second === bet.first ||
  //           result.second === bet.second ||
  //           result.second === bet.third
  //         ) {
  //           if (sprintRaceIds.includes(Number(bet.race_id))) {
  //             points += 0.5;
  //           } else {
  //             points++;
  //           }
  //         }

  //         if (
  //           result.third === bet.first ||
  //           result.third === bet.second ||
  //           result.third === bet.third
  //         ) {
  //           if (sprintRaceIds.includes(Number(bet.race_id))) {
  //             points += 0.5;
  //           } else {
  //             points++;
  //           }
  //         }
  //       }
  //     }
  //   });
  //   console.log("user id", user.user_id);
  //   console.log("points", points);
  //   await prisma.users.update({
  //     where: {
  //       user_id: user.user_id,
  //     },
  //     data: {
  //       points: points,
  //     },
  //   });
  // });

  return {
    user,
    users,
    bets,
    results,
  };
}) satisfies LayoutServerLoad;
