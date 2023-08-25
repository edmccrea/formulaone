declare global {
  namespace App {
    interface Locals {
      user: {
        name: string;
      };
    }
    interface DatabaseRace {
      race_id: BigInt;
      race_name: string;
      race_type: string;
      country_flag: string;
      qualifying_time: string;
      qualifying_date: string;
      race_time: string;
      race_date: string;
      location: string;
      track_name: string;
      race_image: string;
      track_layout: string;
      calendar_round: number;
    }

    interface Race {
      id: BigInt;
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
      user_id: BigInt;
      first: string;
      second: string;
      third: string;
      race_id: BigInt;
    }

    interface User {
      user_id: BigInt;
      username: string;
      avatar: string;
      points: number;
      position: number;
      constructor_bet: string;
    }

    interface Grid {
      id: BigInt;
      race_id: BigInt;
      grid: string[];
    }

    interface Result {
      race_id: BigInt;
      first: string;
      second: string;
      third: string;
    }

    type BetTable = MappedBet[];

    interface MappedBet {
      username: string;
      user_id: BigInt;
      bets: {
        first: string;
        second: string;
        third: string;
      };
    }
  }
}

export {};
