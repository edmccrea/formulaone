declare global {
  namespace App {
    interface DatabaseRace {
      race_id: BigInt;
      race_name: string | null;
      race_type: string | null;
      country_flag: string | null;
      qualifying_start: Date | null;
      location: string | null;
      track_name: string | null;
      race_start: Date | null;
      race_image: string | null;
    }
    interface Race {
      id: BigInt;
      name: string | null;
      type: string | null;
      flag: string | null;
      qualyStart: Date | null;
      location: string | null;
      track: string | null;
      raceStart: Date | null;
      image: string | null;
    }

    interface Bet {
      user_id: BigInt;
      first: string | null;
      second: string | null;
      third: string | null;
      race_id: BigInt;
    }

    interface User {
      user_id: BigInt;
      username: string;
      avatar: string | null;
      points: number | null;
      position: number | null;
    }

    type BetTable = MappedBet[];

    interface MappedBet {
      username: string | null;
      user_id: BigInt;
      bets: {
        first: string | null;
        second: string | null;
        third: string | null;
      };
    }
  }
}

export {};
