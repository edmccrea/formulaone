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
  }
}

export {};
