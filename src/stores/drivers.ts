import { writable } from "svelte/store";

export const drivers = writable([
  {
    number: 4,
    name: "Lando Norris",
    value: "Lando Norris",
    team: "McLaren",
    constructorId: "mclaren",
    country: "United Kingdom",
    image: "",
    points: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    fastestLaps: 0,
    retirements: 0,
  },

  {
    number: 81,
    name: "Oscar Piastri",
    value: "Oscar Piastri",
    team: "McLaren",
    constructorId: "mclaren",
    country: "Australia",
    image: "",
    points: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    fastestLaps: 0,
    retirements: 0,
  },
  {
    number: 16,
    name: "Charles Leclerc",
    value: "Charles Leclerc",
    team: "Ferrari",
    constructorId: "ferrari",
    country: "Monaco",
    image: "",
    points: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    fastestLaps: 0,
    retirements: 0,
  },
  {
    number: 44,
    name: "Lewis Hamilton",
    value: "Lewis Hamilton",
    team: "Ferrari",
    constructorId: "ferrari",
    country: "United Kingdom",
    image: "",
    points: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    fastestLaps: 0,
    retirements: 0,
  },
  {
    number: 1,
    name: "Max Verstappen",
    value: "Max Verstappen",
    team: "Red Bull Racing",
    constructorId: "red_bull",
    country: "Netherlands",
    image: "",
    points: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    fastestLaps: 0,
    retirements: 0,
  },
  {
    number: 22,
    name: "Yuki Tsunoda",
    value: "Yuki Tsunoda",
    team: "Red Bull Racing",
    constructorId: "red_bull",
    country: "Japan",
    image: "",
    points: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    fastestLaps: 0,
    retirements: 0,
  },
  {
    number: 12,
    name: "Andrea Kimi Antonelli",
    value: "Andrea Kimi Antonelli",
    team: "Mercedes",
    constructorId: "mercedes",
    country: "Italy",
    image: "",
    points: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    fastestLaps: 0,
    retirements: 0,
  },
  {
    number: 63,
    name: "George Russell",
    value: "George Russell",
    team: "Mercedes",
    constructorId: "mercedes",
    country: "United Kingdom",
    image: "",
    points: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    fastestLaps: 0,
    retirements: 0,
  },
  {
    number: 14,
    name: "Fernando Alonso",
    value: "Fernando Alonso",
    team: "Aston Martin",
    constructorId: "aston_martin",
    country: "Spain",
    image: "",
    points: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    fastestLaps: 0,
    retirements: 0,
  },
  {
    number: 18,
    name: "Lance Stroll",
    value: "Lance Stroll",
    team: "Aston Martin",
    constructorId: "aston_martin",
    country: "Canada",
    image: "",
    points: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    fastestLaps: 0,
    retirements: 0,
  },
  {
    number: 7,
    name: "Jack Doohan",
    value: "Jack Doohan",
    team: "Alpine",
    constructorId: "alpine",
    country: "Australia",
    image: "",
    points: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    fastestLaps: 0,
    retirements: 0,
  },
  {
    number: 10,
    name: "Pierre Gasly",
    value: "Pierre Gasly",
    team: "Alpine",
    constructorId: "alpine",
    country: "France",
    image: "",
    points: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    fastestLaps: 0,
    retirements: 0,
  },
  {
    number: 23,
    name: "Alexander Albon",
    value: "Alexander Albon",
    team: "Williams",
    constructorId: "williams",
    country: "Thailand",
    image: "",
    points: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    fastestLaps: 0,
    retirements: 0,
  },
  {
    number: 55,
    name: "Carlos Sainz",
    value: "Carlos Sainz",
    team: "Williams",
    constructorId: "williams",
    country: "Spain",
    image: "",
    points: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    fastestLaps: 0,
    retirements: 0,
  },
  {
    number: 31,
    name: "Esteban Ocon",
    value: "Esteban Ocon",
    team: "Haas",
    constructorId: "haas",
    country: "France",
    image: "",
    points: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    fastestLaps: 0,
    retirements: 0,
  },
  {
    number: 87,
    name: "Oliver Bearman",
    value: "Oliver Bearman",
    team: "Haas",
    constructorId: "haas",
    country: "United Kingdom",
    image: "",
    points: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    fastestLaps: 0,
    retirements: 0,
  },
  {
    number: 27,
    name: "Nico Hulkenberg",
    value: "Valtteri Bottas",
    team: "Kick Sauber",
    constructorId: "sauber",
    country: "Germany",
    image: "",
    points: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    fastestLaps: 0,
    retirements: 0,
  },
  {
    number: 5,
    name: "Gabriel Bortoleto",
    value: "Gabriel Bortoleto",
    team: "Kick Sauber",
    constructorId: "sauber",
    country: "Brazil",
    image: "",
    points: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    fastestLaps: 0,
    retirements: 0,
  },
  {
    number: 30,
    name: "Liam Lawson",
    value: "Liam Lawson",
    team: "Racing Bulls",
    constructorId: "rb",
    country: "New Zealand",
    image: "",
    points: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    fastestLaps: 0,
    retirements: 0,
  },
  {
    number: 6,
    name: "Isack Hadjar",
    value: "Isack Hadjar",
    team: "Racing Bulls",
    constructorId: "rb",
    country: "Australia",
    image: "",
    points: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    fastestLaps: 0,
    retirements: 0,
  },
]);
