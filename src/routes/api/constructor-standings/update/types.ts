interface ConstructorStandingsResponse {
  MRData: ConstructorStandingsMRData;
}

interface ConstructorStandingsMRData {
  xmlns: string;
  series: string;
  url: string;
  limit: string;
  offset: string;
  total: string;
  StandingsTable: ConstructorStandingsTable;
}

interface ConstructorStandingsTable {
  season: string;
  round: string;
  StandingsLists: ConstructorStandingsList[];
}

interface ConstructorStandingsList {
  season: string;
  round: string;
  ConstructorStandings: ConstructorStanding[];
}

interface ConstructorStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Constructor: Constructor;
}

interface Constructor {
  constructorId: string;
  url: string;
  name: string;
  nationality: string;
}
