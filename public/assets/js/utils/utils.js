const GEONAMES_USERNAME = "secret8squirrel";
let ip;
let locationData;

// Fetch user's public IP address
const getIp = async () => {
  if (ip) return ip;
  const response = await fetch("https://api.ipify.org?format=json");
  const data = await response.json();
  ip = data.ip;
  return data.ip;
};

// get the city and state of the user using the IP address
export const getLocationData = async () => {
  if (locationData) return locationData;

  const ip = await getIp();
  const response = await fetch(
    `https://api.findip.net/${ip}/?token=85047163909943138b5593dc41e0512c`
  );
  const data = await response.json();

  locationData = data;

  return {
    country: { name: data.country.names.en, code: data.country.iso_code },
    state: {
      name: data.subdivisions[0].names.en,
      code: data.subdivisions[0].iso_code,
    },
    city: data.city.names.en,
    location: {
      latitude: data.location.latitude,
      longitude: data.location.longitude,
    },
  };
};

// Fetch the capital city of a given state using GeoNames API
const getCapitalCity = async (stateCode, countryCode) => {
  const response = await fetch(
    `https://secure.geonames.org/searchJSON?country=${countryCode}&adminCode1=${stateCode}&featureCode=PPLA&maxRows=1&username=secret8squirrel`
  );
  let data = await response.json();
  if (data.geonames.length === 0) {
    const response = await fetch(
      `https://secure.geonames.org/searchJSON?country=${countryCode}&featureCode=PPLA&maxRows=1&username=secret8squirrel`
    );
    data = await response.json();
  }
  return data.geonames[0]?.toponymName;
};

// Fetch the top most populated city of a given state using GeoNames API
const getTop10Cities = async (stateCode, countryCode) => {
  const response = await fetch(
    `https://secure.geonames.org/searchJSON?country=${countryCode}&featureClass=P&adminCode1=${stateCode}&orderby=population&maxRows=10&username=${GEONAMES_USERNAME}`
  );
  let data = await response.json();
  if (data.geonames.length === 0) {
    const response = await fetch(
      `https://secure.geonames.org/searchJSON?country=${countryCode}&featureClass=P&orderby=population&maxRows=10&username=${GEONAMES_USERNAME}`
    );
    data = await response.json();
  }
  return data.geonames;
};

// fetch city data
export const fetchCitiesData = async (stateCode, countryCode) => {
  const capitalCity = await getCapitalCity(stateCode, countryCode);
  const top10 = await getTop10Cities(stateCode, countryCode);

  return {
    capital: capitalCity,
    top10: top10,
  };
};

// Fetch the introduction of a given state using Wikipedia API
export const getIntroFromWiki = async (state, city, isCity) => {
  if (isCity) {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${city}`
    );
    const data = await response.json();
    console.log(data.extract); // Log for debugging
    if (data.extract.includes("refers to:")) {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${city},${state}`
      );
      const data = await response.json();
      console.log(data.extract); // Log for debugging
      if (data.extract.includes("refers to:")) {
        return {
          intro: "No data available",
          photo:
            "https://media.istockphoto.com/id/483724081/photo/yosemite-valley-landscape-and-river-california.jpg?s=2048x2048&w=is&k=20&c=j0OSpP2sAz582wDP0t28BzmwSMb0BJ2li7koJ2yROcA=",
        };
      }
      return { intro: data.extract, photo: data.originalimage.source };
    }
    return { intro: data.extract, photo: data.originalimage.source };
  } else {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${state}`
    );
    const data = await response.json();
    console.log(data.extract); // Log for debugging
    return { intro: data.extract, photo: data.originalimage.source };
  }
};

// Fetch population for a specific city using GeoNames API
export const getPopulationData = async (locationName, countryCode) => {
  const response = await fetch(
    `https://secure.geonames.org/searchJSON?q=${locationName}&country=${countryCode}&maxRows=1&username=${GEONAMES_USERNAME}`
  );
  const data = await response.json();
  return data.geonames[0]?.population || "Population data not available";
};

