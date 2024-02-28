import { convertTimeWithDate } from "./convert-time";
import { getTrackLayout } from "./get-track-layout";
import { getCountryFlag } from "./get-country-flag";

export function mapRaces(apiData: RaceResponse["MRData"]["RaceTable"]["Race"]) {
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
    country_flag: "WAITING FOR CLOUDINARY CONNECTION",
    qualifying_date: "UPDATE MANUALLY",
    qualifying_time: "UPDATE MANUALLY",
    race_date: race.Sprint!.Date,
    race_time: race.Sprint!.Time
      ? convertTimeWithDate(race.Sprint!.Time, new Date(race.Sprint!.Date))
      : "TBD",
    location: race.Circuit.Location.Locality,
    track_name: race.Circuit.CircuitName,
    race_image:
      "https://images.pexels.com/photos/12359137/pexels-photo-12359137.jpeg",
    track_layout: "WAITING FOR CLOUDINARY CONNECTION",
    calendar_id: Number(race["@_round"]),
  };
}

function mapGrandPrix(race: Race) {
  //TODO: Deal with the edge case of las vegas race and the time and date
  return {
    race_name: race.RaceName,
    race_type: "Grand Prix",
    country_flag: "WAITING FOR CLOUDINARY CONNECTION",
    qualifying_date: race.Qualifying?.Date ?? "TBD",
    qualifying_time: race.Qualifying?.Time
      ? convertTimeWithDate(
          race.Qualifying.Time,
          new Date(race.Qualifying.Date)
        )
      : "TBD",
    race_date: race.Date,
    race_time: race.Time
      ? convertTimeWithDate(race.Time, new Date(race.Date))
      : "TBD",
    location: race.Circuit.Location.Locality,
    track_name: race.Circuit.CircuitName,
    race_image:
      "https://images.pexels.com/photos/12359137/pexels-photo-12359137.jpeg",
    track_layout: "WAITING FOR CLOUDINARY CONNECTION",
    calendar_id: Number(race["@_round"]),
  };
}
