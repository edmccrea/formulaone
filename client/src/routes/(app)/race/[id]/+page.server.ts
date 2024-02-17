import { db } from "$lib/drizzle/db";
import { comments, grids, results } from "$lib/drizzle/schema";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  const raceId = Number(params.id);
  const [raceGrid] = await db
    .select()
    .from(grids)
    .where(eq(grids.raceId, raceId));

  const userComments = await db
    .select()
    .from(comments)
    .where(eq(comments.raceId, raceId));

  const [result] = await db
    .select()
    .from(results)
    .where(eq(results.raceId, raceId));

  return {
    raceId,
    grid: raceGrid?.gridData,
    comments: userComments,
    result: result?.resultData,
  };
}) satisfies PageServerLoad;

//TODO: Move this to the client
