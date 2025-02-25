interface SprintRaceResponse {
  MRData: SprintMRData;
}

interface SprintMRData {
  xmlns: string;
  series: string;
  url: string;
  limit: string;
  offset: string;
  total: string;
  RaceTable: SprintRaceTable;
}

interface SprintRaceTable {
  season: string;
  Races: SprintRace[];
}

interface SprintRace {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: Circuit;
  date: string;
  time: string;
  SprintResults: SprintResult[];
}

interface Circuit {
  circuitId: string;
  url: string;
  circuitName: string;
  Location: Location;
}

interface Location {
  lat: string;
  long: string;
  locality: string;
  country: string;
}

interface SprintResult {
  number: string;
  position: string;
  positionText: string;
  points: string;
  Driver: Driver;
  Constructor: Constructor;
  grid: string;
  laps: string;
  status: string;
  Time?: ResultTime;
  FastestLap: FastestLap;
}

interface Driver {
  driverId: string;
  permanentNumber: string;
  code: string;
  url: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
}

interface Constructor {
  constructorId: string;
  url: string;
  name: string;
  nationality: string;
}

interface ResultTime {
  millis: string;
  time: string;
}

interface FastestLap {
  lap: string;
  Time?: LapTime;
}

interface LapTime {
  time: string;
}
