// import prisma from "$lib/prisma";
// import type { RequestHandler } from "./$types";

// export const POST: RequestHandler = async ({ request }) => {
//   const raceReq = await request.json();
//   const race = await prisma.races.findFirst({
//     where: {
//       race_id: Number(raceReq.race_id),
//     },
//   });

//   if (race) {
//     const updatedRace = await prisma.races.update({
//       where: {
//         race_id: race.race_id,
//       },
//       data: {
//         ...raceReq,
//       },
//     });

//     return new Response(JSON.stringify({ message: "Race updated" }), {
//       status: 201,
//     });
//   } else {
//     return new Response("User created", { status: 200 });
//   }
// };
