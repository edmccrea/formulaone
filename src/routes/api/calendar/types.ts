interface RacesResponse {
  MRData: MRData;
}

interface MRData {
  xmlns: string;
  series: string;
  url: string;
  limit: string;
  offset: string;
  total: string;
  RaceTable: RaceTable;
}

interface RaceTable {
  season: string;
  Races: Race[];
}

interface Race {
  season: string;
  round: string;
  raceName: string;
  Circuit: Circuit;
  date: string;
  time: string;
  FirstPractice: Session;
  SecondPractice?: Session;
  ThirdPractice?: Session;
  Qualifying: Session;
  Sprint?: Session;
  SprintQualifying?: Session;
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

interface Session {
  date: string;
  time: string;
}
