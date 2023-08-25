export function getTrackLayout(track: string) {
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
