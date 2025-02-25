export type ProcessedStanding = {
  position: number;
  driverName: string;
  driverId: string;
  points: number;
  nationality: string;
  age: number;
  constructor: string;
  constructorId: string;
  wins: number;
  helmet: string;
};

export interface ProcessedConstructorStanding {
  position: number;
  constructorName: string;
  constructorId: string;
  points: number;
  nationality: string;
  wins: number;
  logo: string;
}
