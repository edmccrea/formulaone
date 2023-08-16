import prisma from "$lib/prisma";
import bcrypt from "bcrypt";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
  const registerReq = await request.json();
  const existinguser = await prisma.users.findFirst({
    where: {
      username: registerReq.username,
    },
  });

  if (existinguser) {
    return new Response(JSON.stringify({ message: "User already exists" }), {
      status: 404,
    });
  }
  const hashedPassword = await bcrypt.hash(registerReq.password, 10);

  const user = await prisma.users.create({
    data: {
      username: registerReq.username,
      password: hashedPassword,
      avatar: registerReq.avatar,
      points: 0,
      position: 0,
      session: null,
    },
  });

  return new Response("User created", { status: 200 });
};
