import { db } from "$lib/drizzle/db";
import { comments, grids, results } from "$lib/drizzle/schema";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  const raceId = Number(params.id);
  const [raceGridPromise, userCommentsPromise, resultPromise] =
    await Promise.all([
      db.select().from(grids).where(eq(grids.raceId, raceId)),
      db.select().from(comments).where(eq(comments.raceId, raceId)),
      db.select().from(results).where(eq(results.raceId, raceId)),
    ]);

  const [raceGrid] = raceGridPromise;
  const userComments = userCommentsPromise;
  const [result] = resultPromise;

  const userCommentsUTC = userCommentsPromise.map((comment) => {
    const utcDate = new Date(comment.timestamp);
    const newComment = {
      ...comment,
      timestamp: utcDate.toISOString(),
    };
    return newComment;
  });

  let grid = null;
  if (raceGrid) {
    grid = JSON.parse(raceGrid.gridData);
  }
  let topThree = null;
  if (result) {
    const parsedResult = JSON.parse(result.resultData);
    topThree = {
      first: parsedResult[0].first,
      second: parsedResult[0].second,
      third: parsedResult[0].third,
    };
  }

  return {
    raceId,
    grid,
    comments: userCommentsUTC,
    result: topThree,
  };
}) satisfies PageServerLoad;
