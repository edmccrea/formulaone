-- CreateTable
CREATE TABLE "bets" (
    "user_id" BIGINT NOT NULL,
    "race_id" BIGINT NOT NULL,
    "first" TEXT NOT NULL,
    "second" TEXT NOT NULL,
    "third" TEXT NOT NULL,
    "bet_id" BIGSERIAL NOT NULL,

    CONSTRAINT "bets_pkey" PRIMARY KEY ("race_id","user_id","bet_id")
);

-- CreateTable
CREATE TABLE "races" (
    "race_id" BIGSERIAL NOT NULL,
    "race_name" TEXT NOT NULL,
    "race_type" TEXT NOT NULL,
    "country_flag" TEXT NOT NULL,
    "qualifying_start" TIMESTAMPTZ(6) NOT NULL,
    "location" TEXT NOT NULL,
    "track_name" TEXT NOT NULL,
    "race_start" TIMESTAMPTZ(6) NOT NULL,
    "race_image" TEXT NOT NULL,
    "track_layout" TEXT NOT NULL DEFAULT 'abc',

    CONSTRAINT "Race_pkey" PRIMARY KEY ("race_id")
);

-- CreateTable
CREATE TABLE "results" (
    "race_id" BIGINT NOT NULL,
    "first" TEXT NOT NULL,
    "second" TEXT NOT NULL,
    "third" TEXT NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("race_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" BIGSERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "points" REAL NOT NULL,
    "position" INTEGER NOT NULL,
    "session" TEXT,
    "constructor_bet" TEXT NOT NULL DEFAULT 'Red Bull',

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "grids" (
    "id" BIGSERIAL NOT NULL,
    "race_id" BIGINT,
    "grid" TEXT[],

    CONSTRAINT "grids_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_race_id_fkey" FOREIGN KEY ("race_id") REFERENCES "races"("race_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "grids" ADD CONSTRAINT "grids_race_id_fkey" FOREIGN KEY ("race_id") REFERENCES "races"("race_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
