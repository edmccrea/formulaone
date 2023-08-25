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
    country_flag: getCountryFlag(race.Circuit.Location.Country),
    qualifying_date: "UPDATE MANUALLY",
    qualifying_time: "UPDATE MANUALLY",
    race_date: race.Sprint!.Date,
    race_time: convertTimeWithDate(
      race.Sprint!.Time,
      new Date(race.Sprint!.Date)
    ),
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
    qualifying_time: convertTimeWithDate(
      race.Qualifying.Time,
      new Date(race.Qualifying.Date)
    ),
    race_date: race.Date,
    race_time: convertTimeWithDate(race.Time, new Date(race.Date)),
    location: race.Circuit.Location.Locality,
    track_name: race.Circuit.CircuitName,
    race_image:
      "https://images.unsplash.com/photo-1554579306-94e345617dbc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2231&q=80",
    track_layout: getTrackLayout(race.Circuit.CircuitName),
    calendar_id: Number(race["@_round"]),
  };
}
