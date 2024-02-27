import type { RequestHandler } from "./$types";
import { db } from "$lib/drizzle/db";
import { scores, users, seasons, constructorsBets } from "$lib/drizzle/schema";
import { eq } from "drizzle-orm";
import cloudinary from "cloudinary";
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from "$env/static/private";

cloudinary.v2.config({
  cloud_name: "edmccrea",
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

type NewUser = typeof users.$inferInsert;
const insertUser = async (user: NewUser) => {
  const res = await db
    .insert(users)
    .values(user)
    .returning({
      insertedId: users.userId,
      username: users.username,
      avatar: users.avatar,
    });
  return res;
};

type NewScore = typeof scores.$inferInsert;
const insertScore = async (score: NewScore) => {
  const res = await db.insert(scores).values(score);
};

type NewConstructorBet = typeof constructorsBets.$inferInsert;
const insertConstructorBet = async (constructorBet: NewConstructorBet) => {
  const res = await db.insert(constructorsBets).values(constructorBet);
};

export const POST: RequestHandler = async ({ request, locals }) => {
  const userReq = await request.json();
  const { username, avatar, constructorName } = userReq;

  const session = await locals.getSession();
  const dbUsers = await db.select().from(users);
  const [currentSeason] = await db
    .select()
    .from(seasons)
    .where(eq(seasons.currentSeason, true));

  const result = await cloudinary.v2.uploader.upload(avatar, {
    folder: "f1/avatars",
    resource_type: "image",
    transformation: [{ width: 500, crop: "scale" }],
  });
  const avatarUrl = result.url;

  if (session && session.user.email) {
    const newUser = {
      email: session?.user.email,
      username: username.toString(),
      avatar: avatarUrl,
      admin: false,
    };
    const [user] = await insertUser(newUser);
    const score = {
      userId: user.insertedId,
      score: 0,
      position: dbUsers.length + 1,
      seasonId: currentSeason.seasonId,
    };
    await insertScore(score);
    await insertConstructorBet({
      userId: user.insertedId,
      seasonId: currentSeason.seasonId,
      constructorName: constructorName.toString(),
    });
    return new Response(JSON.stringify(user), {
      status: 201,
    });
  }
  return new Response(JSON.stringify({ messgae: "Something went wrong" }), {
    status: 500,
  });
};
