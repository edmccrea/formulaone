// import prisma from "$lib/prisma";
// import type { RequestHandler } from "./$types";

// export const POST: RequestHandler = async ({ request }) => {
//   const userReq = await request.json();
//   const user = await prisma.users.findFirst({
//     where: {
//       user_id: Number(userReq.user_id),
//     },
//   });

//   if (user) {
//     const updatedUser = await prisma.users.update({
//       where: {
//         user_id: user.user_id,
//       },
//       data: {
//         ...userReq,
//       },
//     });

//     return new Response(JSON.stringify({ message: "User updated" }), {
//       status: 201,
//     });
//   } else {
//     return new Response("User created", { status: 200 });
//   }
// };
