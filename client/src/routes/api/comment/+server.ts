import { db } from "$lib/drizzle/db";
import { comments } from "$lib/drizzle/schema";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const commentReq = await request.json();
    const { raceId, userId, commentText, timestamp } = commentReq;
    const comment = {
      raceId,
      userId,
      commentText,
      timestamp: new Date(timestamp),
    };

    type NewComment = typeof comments.$inferInsert;
    const insertComment = async (comment: NewComment) => {
      const res = await db.insert(comments).values(comment);
    };

    await insertComment(comment);

    return new Response("Comment created", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error creating comment", { status: 500 });
  }
};
