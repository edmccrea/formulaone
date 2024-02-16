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
    }

    interface Race {
      id: number;
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
    }

    interface Bet {
      user_id: number;
      first: string;
      second: string;
      third: string;
      race_id: BigInt;
    }

    interface User {
      userId: number;
      username: string;
      avatar: string;
      points: number;
      position: number;
      constructorBet: string;
      admin: boolean;
    }

    interface Grid {
      id: number;
      race_id: number;
      grid: string[];
    }

    interface Result {
      race_id: number;
      first: string;
      second: string;
      third: string;
    }

    type BetTable = MappedBet[];

    interface MappedBet {
      username: string;
      user_id: number;
      avatar: string;
      bets: {
        first: string;
        second: string;
        third: string;
      };
    }

    interface Comment {
      id: number;
      race_id: number;
      user_id: number;
      created_at: Date;
      comment: string;
      username: string;
      avatar: string;
    }
  }
}

export {};
