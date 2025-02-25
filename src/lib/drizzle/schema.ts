import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  userId: serial("user_id").primaryKey(),
  username: text("username").notNull(),
  email: text("email").notNull(),
  avatar: text("avatar").notNull(),
  admin: boolean("admin").notNull(),
});

export const bets = pgTable("bets", {
  betId: serial("bet_id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.userId)
    .notNull(),
  raceId: serial("race_id").references(() => races.raceId),
  seasonId: serial("season_id").references(() => seasons.seasonId),
  first: text("first").notNull(),
  second: text("second").notNull(),
  third: text("third").notNull(),
});

export const comments = pgTable("comments", {
  commentId: serial("comment_id").primaryKey(),
  userId: serial("user_id").references(() => users.userId),
  raceId: serial("race_id").references(() => races.raceId),
  commentText: text("comment_text").notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull(),
});

export const constructorsBets = pgTable("constructors_bets", {
  constructorBetId: serial("constructor_bet_id").primaryKey(),
  userId: serial("user_id").references(() => users.userId),
  seasonId: serial("season_id").references(() => seasons.seasonId),
  constructorName: text("constructor_name"),
  constructorId: text("constructor_id"),
});

export const grids = pgTable("grids", {
  gridId: serial("grid_id").primaryKey(),
  raceId: serial("race_id").references(() => races.raceId),
  gridData: text("grid_data").notNull(),
});

export const races = pgTable("races", {
  raceId: serial("race_id").primaryKey(),
  seasonId: integer("season_id").references(() => seasons.seasonId),
  raceName: text("race_name").notNull(),
  raceType: text("race_type").notNull(),
  countryFlag: text("country_flag").notNull(),
  qualifyingStart: timestamp("qualifying_start", {
    withTimezone: true,
  }).notNull(),
  raceStart: timestamp("race_start", { withTimezone: true }).notNull(),
  location: text("location").notNull(),
  trackName: text("track_name").notNull(),
  raceImage: text("race_image").notNull(),
  trackLayout: text("track_layout").notNull(),
  calendarRound: integer("calendar_round").notNull(),
  qualifyingTime: text("qualifying_time").notNull(),
  qualifyingDate: text("qualifying_date").notNull(),
  raceTime: text("race_time").notNull(),
  raceDate: text("race_date").notNull(),
});

export const results = pgTable("results", {
  resultId: serial("result_id").primaryKey(),
  raceId: integer("race_id").references(() => races.raceId),
  resultData: text("result_data").notNull(),
});

export const scores = pgTable("scores", {
  scoreId: serial("score_id").primaryKey(),
  userId: integer("user_id").references(() => users.userId),
  seasonId: integer("season_id"),
  score: integer("score"),
  position: integer("position").notNull(),
});

export const seasons = pgTable("seasons", {
  seasonId: serial("season_id").primaryKey(),
  year: integer("year"),
  currentSeason: boolean("current_season").notNull(),
});

export const driverStandings = pgTable("driver_standings", {
  id: serial("id").primaryKey(),
  seasonId: integer("season_id")
    .references(() => seasons.seasonId)
    .notNull(),
  standingsData: text("standings_data").notNull(),
});

export const constructorStandings = pgTable("constructor_standings", {
  id: serial("id").primaryKey(),
  seasonId: integer("season_id")
    .references(() => seasons.seasonId)
    .notNull(),
  standingsData: text("standings_data").notNull(),
});
