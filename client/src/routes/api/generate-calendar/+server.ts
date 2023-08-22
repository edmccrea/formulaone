import { XMLParser } from "fast-xml-parser";

import prisma from "$lib/prisma";
import type { RequestHandler } from "./$types";

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

export const GET: RequestHandler = async ({}) => {
  const options = {
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  };
  const parser = new XMLParser(options);

  const url = `http://ergast.com/api/f1/current`;
  const ergastRes = await fetch(url);
  const xmlText = await ergastRes.text();
  const json = parser.parse(xmlText);

  const mappedRaces = mapRaces(json.MRData.RaceTable.Race);

  mappedRaces.forEach(async (race) => {
    if (race.sprintObj) {
      const alreadyExistingRace = await prisma.races.findFirst({
        where: {
          race_name: race.sprintObj.race_name,
          race_type: "Sprint",
        },
      });
      if (alreadyExistingRace) {
        console.log("Updating sprint in database");
      } else {
        const sprintObj = race.sprintObj;
        const newSprint = await prisma.races.create({
          data: {
            calendar_round: sprintObj.calendar_id,
            race_name: sprintObj.race_name,
            location: sprintObj.location,
            race_type: sprintObj.race_type,
            country_flag: sprintObj.country_flag,
            qualifying_date: sprintObj.qualifying_date,
            qualifying_time: sprintObj.qualifying_time,
            race_date: sprintObj.race_date,
            race_time: sprintObj.race_time,
            race_image: sprintObj.race_image,
            track_name: sprintObj.track_name,
            track_layout: sprintObj.track_layout,
          },
        });
        console.log(newSprint);
      }
    }

    const alreadyExistingRace = await prisma.races.findFirst({
      where: {
        race_name: race.raceObj.race_name,
        race_type: "Grand Prix",
      },
    });
    if (alreadyExistingRace) {
      console.log("Updating Grand Prix in database");
    } else {
      const raceObj = race.raceObj;
      const newGrandPrix = await prisma.races.create({
        data: {
          calendar_round: raceObj.calendar_id,
          race_name: raceObj.race_name,
          location: raceObj.location,
          race_type: raceObj.race_type,
          country_flag: raceObj.country_flag,
          qualifying_date: raceObj.qualifying_date,
          qualifying_time: raceObj.qualifying_time,
          race_date: raceObj.race_date,
          race_time: raceObj.race_time,
          race_image: raceObj.race_image,
          track_name: raceObj.track_name,
          track_layout: raceObj.track_layout,
        },
      });
      console.log(newGrandPrix);
    }
  });

  return new Response("Calendar created", { status: 200 });
};

function mapRaces(apiData: RaceResponse["MRData"]["RaceTable"]["Race"]) {
  return apiData.map((race: Race) => {
    let raceObj;
    let sprintObj;
    if (race.Sprint) {
      const mappedSprint = mapSprintRace(race);
      sprintObj = { ...mappedSprint };
    }
    const mappedRace = mapGrandPrix(race);
    raceObj = { ...mappedRace };

    if (sprintObj) {
      return {
        raceObj,
        sprintObj,
      };
    } else {
      return {
        raceObj,
      };
    }
  });
}

function mapSprintRace(race: Race) {
  return {
    race_name: race.RaceName,
    race_type: "Sprint",
    country_flag: getCountryFlag(race.Circuit.Location.Country),
    qualifying_date: "UPDATE MANUALLY",
    qualifying_time: "UPDATE MANUALLY",
    race_date: race.Sprint!.Date,
    race_time: convertTime(race.Sprint!.Time),
    location: race.Circuit.Location.Locality,
    track_name: race.Circuit.CircuitName,
    race_image:
      "https://images.unsplash.com/photo-1554579306-94e345617dbc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2231&q=80",
    track_layout: getTrackLayout(race.Circuit.CircuitName),
    calendar_id: Number(race["@_round"]),
  };
}

function mapGrandPrix(race: Race) {
  //TODO: Deal with the edge case of las vegas race and the time and date
  return {
    race_name: race.RaceName,
    race_type: "Grand Prix",
    country_flag: getCountryFlag(race.Circuit.Location.Country),
    qualifying_date: race.Qualifying.Date,
    qualifying_time: convertTime(race.Qualifying.Time),
    race_date: race.Date,
    race_time: convertTime(race.Time),
    location: race.Circuit.Location.Locality,
    track_name: race.Circuit.CircuitName,
    race_image:
      "https://images.unsplash.com/photo-1554579306-94e345617dbc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2231&q=80",
    track_layout: getTrackLayout(race.Circuit.CircuitName),
    calendar_id: Number(race["@_round"]),
  };
}

function getCountryFlag(country: string) {
  const countries = Object.keys(countryFlagsDict);
  //Send an alert somehow is the country is not in the list?
  if (!countries.includes(country)) {
    console.log(`No flag for ${country}`);
    return `https://ott-img.formula1.com/countries/21.png`;
  } else {
    return `https://ott-img.formula1.com/countries/${
      countryFlagsDict[country as keyof typeof countryFlagsDict]
    }.png`;
  }
}

function getTrackLayout(track: string) {
  const tracks = Object.keys(trackLayoutDict);
  //Send an alert somehow is the country is not in the list?
  if (!tracks.includes(track)) {
    console.log(`No layout for ${track}`);
    return `https://media.formula1.com/image/upload/f_auto/q_auto/v1677245032/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/Austria.png.transform/8col-retina/image.png`;
  } else {
    return `https://media.formula1.com/image/upload/f_auto/q_auto/v1677245032/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/${
      trackLayoutDict[track as keyof typeof trackLayoutDict]
    }.png.transform/8col-retina/image.png`;
  }
}

function convertTime(utcTime: string): string {
  const timeParts = utcTime.split(":");
  const hours = parseInt(timeParts[0]);
  const minutes = parseInt(timeParts[1]);
  const seconds = parseInt(timeParts[2].replace("Z", ""));

  const newHours = (hours + 1) % 24;

  const formattedTime = `${newHours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  return formattedTime;
}

const countryFlagsDict = {
  Bahrain: 36,
  "Saudi Arabia": 153,
  Australia: 5,
  Azerbaijan: 30,
  USA: 19,
  "United States": 19,
  Monaco: 114,
  Spain: 1,
  Canada: 46,
  Austria: 17,
  UK: 2,
  Hungary: 14,
  Belgium: 16,
  Netherlands: 133,
  Italy: 13,
  Singapore: 157,
  Japan: 4,
  Qatar: 149,
  Mexico: 8,
  Brazil: 10,
  UAE: 21,
};

const trackLayoutDict = {
  "Bahrain International Circuit": "Bahrain",
  "Jeddah Corniche Circuit": "Saudi%20Arabia",
  "Albert Park Grand Prix Circuit": "Australia",
  "Baku City Circuit": "Azerbaijan",
  "Miami International Autodrome": "Miami",
  "Circuit de Monaco": "Monaco",
  "Circuit de Barcelona-Catalunya": "Spain",
  "Circuit Gilles Villeneuve": "Canada",
  "Red Bull Ring": "Austria",
  "Silverstone Circuit": "Great%20Britain",
  Hungaroring: "Hungary",
  "Circuit de Spa-Francorchamps": "Belgium",
  "Circuit Park Zandvoort": "Netherlands",
  "Autodromo Nazionale di Monza": "Italy",
  "Marina Bay Street Circuit": "Singapore",
  "Suzuka Circuit": "Japan",
  "Losail International Circuit": "Qatar",
  "Circuit of the Americas": "USA",
  "Autódromo Hermanos Rodríguez": "Mexico",
  "Autódromo José Carlos Pace": "Brazil",
  "Las Vegas Strip Street Circuit": "Las%20Vegas",
  "Yas Marina Circuit": "Abu%20Dhabi",
};
