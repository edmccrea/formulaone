import prisma from "$lib/prisma";
import { serialize } from "cookie";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ locals }) => {
  const user = await prisma.users.findFirst({
    where: {
      username: locals.user.name,
    },
  });

  if (user) {
    await prisma.users.update({
      where: {
        user_id: user.user_id,
      },
      data: {
        session: null,
      },
    });

    locals.user = {
      name: "",
    };
  }

  const cookieValue = JSON.stringify({ userId: "" });
  const cookieOptions = {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  };

  const cookie = serialize("session", cookieValue, cookieOptions);
  const headers = { "Set-Cookie": cookie };

  return new Response(JSON.stringify({ message: "Logout successful" }), {
    headers,
    status: 200,
  });
};
