import prisma from "$lib/prisma";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
  const commentReq = await request.json();
  const { race_id, user_id, comment, username, avatar } = commentReq;
  console.log(commentReq);
  await prisma.comments.create({
    data: {
      race_id,
      user_id,
      created_at: new Date(),
      comment,
      username,
      avatar,
    },
  });

  return new Response("Comment created", { status: 200 });
};
