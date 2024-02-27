// import prisma from "$lib/prisma";
// import type { PageServerLoad } from "./$types";

// export const load = (async ({ params }) => {
//   const raceId = params.id;
//   const race = await prisma.races.findFirst({
//     where: {
//       race_id: Number(raceId),
//     },
//   });
//   return {
//     race,
//   };
// }) satisfies PageServerLoad;
