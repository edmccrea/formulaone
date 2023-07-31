declare global {
  namespace App {
    interface DatabaseRace {
      race_id: number;
      race_name: string;
      race_type: string;
      country_flag: string;
      qualifying_start: Date;
      location: string;
      track_name: string;
      race_start: Date;
      race_image: string;
    }
    interface Race {
      id: number;
      name: string;
      type: string;
      flag: string;
      qualyStart: Date;
      location: string;
      track: string;
      raceStart: Date;
      image: string;
    }

    interface Bet {
      user_id: number;
      first: string;
      second: string;
      third: string;
      race_id: number;
    }

    interface User {
      user_id: number;
      username: string;
      avatar: string;
      points: number;
      position: number;
    }

    type BetTable = MappedBet[];

    interface MappedBet {
      username: string;
      user_id: number;
      bets: {
        first: string;
        second: string;
        third: string;
      };
    }
  }
}

export {};
