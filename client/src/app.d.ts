import { SupabaseClient, Session } from "@supabase/supabase-js";

declare global {
  namespace App {
    interface PageData {
      session: Session | null;
    }

    interface Locals {
      user: {
        userId: number;
        email: string | null;
        username: string | null;
        avatar: string | null;
      };
      supabase: SupabaseClient;
      getSession(): Promise<Session | null>;
    }
    interface DatabaseRace {
      raceId: number;
      raceName: string;
      raceType: string;
      countryFlag: string;
      qualifyingTime: string;
      qualifyingDate: string;
      raceTime: string;
      raceDate: string;
      location: string;
      trackName: string;
      raceImage: string;
      trackLayout: string;
      calendarRound: number;
      raceStart: Date;
      qualifyingStart: Date;
    }

    interface Race {
      raceId: number;
      seasonId: number;
      name: string;
      type: string;
      flag: string;
      qualyTime: string;
      qualyDate: string;
      location: string;
      track: string;
      raceTime: string;
      raceDate: string;
      image: string;
      trackLayout: string;
      raceStart: Date;
      qualifyingStart: Date;
    }

    interface Bet {
      betId: number;
      userId: number;
      raceId: number;
      seasonId: number;
      first: string;
      second: string;
      third: string;
    }

    interface User {
      userId: number;
      username: string;
      avatar: string;
      points: number;
      position: number;
      constructorBet: string;
      admin: boolean;
      userBets: Bet[];
    }

    interface Grid {
      id: number;
      raceId: number;
      grid: string[];
    }

    interface Result {
      first: string;
      second: string;
      third: string;
    }

    type BetTable = MappedBet[];

    interface MappedBet {
      username: string;
      userId: number;
      avatar: string;
      bets: {
        first: string;
        second: string;
        third: string;
      };
    }

    interface Comment {
      commentId: number;
      raceId: number;
      userId: number;
      timestamp: Date;
      commentText: string;
    }
  }
}

export {};
