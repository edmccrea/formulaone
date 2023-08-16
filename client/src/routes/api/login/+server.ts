import prisma from "$lib/prisma";
import bcrypt from "bcrypt";
import { serialize } from "cookie";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
  const loginReq = await request.json();
  const user = await prisma.users.findFirst({
    where: {
      username: loginReq.username,
    },
  });

  if (!user) {
    return new Response(JSON.stringify({ message: "User not found" }), {
      status: 404,
    });
  }

  const isPasswordValid = await bcrypt.compare(
    loginReq.password,
    user.password
  );

  if (!isPasswordValid) {
    return new Response(
      JSON.stringify({ message: "Invalid usename or password" }),
      {
        status: 401,
      }
    );
  }

  const cookieValue = JSON.stringify({ userId: user.user_id.toString() });
  const cookieOptions = {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };

  const cookie = serialize("session", cookieValue, cookieOptions);
  const headers = { "Set-Cookie": cookie };

  await prisma.users.update({
    where: {
      user_id: user.user_id,
    },
    data: {
      session: cookieValue,
    },
  });

  return new Response("Login successful", { headers });
};
