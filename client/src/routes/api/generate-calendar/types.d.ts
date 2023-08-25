interface RaceResponse {
  MRData: {
    RaceTable: {
      Race: Race[];
    };
  };
}

interface Race {
  RaceName: string;
  Circuit: {
    CircuitName: string;
    Location: {
      Locality: string;
      Country: string;
    };
  };
  Date: string;
  Time: string;
  FirstPractice: {
    Date: string;
    Time: string;
  };
  SecondPractice: {
    Date: string;
    Time: string;
  };
  ThirdPractice?: {
    Date: string;
    Time: string;
  };
  Qualifying: {
    Date: string;
    Time: string;
  };
  Sprint?: {
    Date: string;
    Time: string;
  };
  "@_round": string;
}
