export function getCountryFlag(country: string) {
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
