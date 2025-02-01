const GEONAMES_USERNAME = "secret8squirrel";
let locationData;

// Fetch user's public IP address
const getIp = async () => {
  const ip = sessionStorage.getItem("ip");
  if (ip) return ip;

  const response = await fetch("https://www.edwards.codes/api/test/feip");
  const data = await response.json();
  const ipAddress = data.ipAdd;
  sessionStorage.setItem("ip", ipAddress);
  return ipAddress;
};

// get the city and state of the user using the IP address
export const getLocationData = async () => {
  if (locationData) return locationData;

  const ip = await getIp();
  // this throws a cors error... so we need to use a proxy server
  const response = await fetch(
    `https://www.edwards.codes/api/test/geoip?ip=${ip}`
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

export const insertFooter = async (state) => {
  const currentYear = new Date().getFullYear();
  
  const $footer = $('#footer');
  
  // Clear existing content
  $footer.empty();

  // Main content container following site's container pattern
  const $container = $('<div>', {
    class: 'main-container'
  }).appendTo($footer);

  // Create footer section following section-container pattern
  const $footerSection = $('<section>', {
    class: 'footer-section'
  }).appendTo($container);

  // Create and append footer elements
  $('<p>', {
    class: 'footer-text',
    html: `&copy; ${currentYear} ${state} Government Office`
  }).appendTo($footerSection);

  $('<p>', {
    class: 'footer-subtext',
    html: 'Powered by ' +
          '<a href="https://www.geonames.org/" target="_blank" rel="noopener noreferrer" class="footer-link">GeoNames</a> ' +
          'and ' +
          '<a href="https://www.wikipedia.org/" target="_blank" rel="noopener noreferrer" class="footer-link">Wikipedia</a>'
  }).appendTo($footerSection);

  $('<p>', {
    class: 'footer-small-text',
    html: 'Made with ' +
          '<a href="https://www.edwards.codes/" target="_blank" rel="noopener noreferrer" class="footer-link">' +
          '<span class="heart-icon">&#10084;</span></a> ' +
          'by ' +
          '<a href="https://www.github.com/andrew87e" target="_blank" rel="noopener noreferrer" class="footer-link author-link">Andrew Edwards</a>'
  }).appendTo($footerSection);

  // Create and append clear storage button using site's button styling
  $('<button>', {
    text: 'Clear Storage',
    id: 'clear-storage',
    click: () => {
      localStorage.clear();
      sessionStorage.clear();
      alert('App storage has been cleared.');
      window.location.reload();
    }
  }).appendTo($footerSection);
};

// Fetch introduction and image from Wikipedia API response
export const getIntroFromWiki = async (state, city, isCity) => {
  insertFooter(state);
  const searchQuery = isCity ? `${city}, ${state}` : state;
  const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&format=json&exintro=&titles=${encodeURIComponent(
    searchQuery
  )}&origin=*&pithumbsize=1000`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    const pageData = pages[pageId];

    // Use the extract as the intro
    let intro = pageData.extract;

    if (!intro) {
      // if city, state doesnt work lets try just the city.
      const newUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&format=json&titles=${encodeURIComponent(
        city
      )}&origin=*&pithumbsize=1000`;

      const newResponse = await fetch(newUrl);
      const newData = await newResponse.json();
      const newPages = newData.query.pages;
      const newPageId = Object.keys(newPages)[0];
      const newPageData = newPages[newPageId];
      intro = newPageData.extract;

      if (!intro) {
        intro = "No information found.";
      }

      return { intro, photo: newPageData.thumbnail.source ?? null };
    }
    // turn our string back into html
    const html = cleanHTML(intro);
    // set the intro to the cleaned html

    // Derive the full image source from the thumbnail URL, if available
    let photo = null;
    if (pageData.thumbnail.source) {
      // console.log(pageData.thumbnail.source);
      photo = pageData.thumbnail.source;
    }

    // console.log({
    //   intro: html,
    //   photo,
    // });

    return { intro: html, photo };
  } catch (error) {
    console.error("Error fetching data from Wikipedia:", error);
    return {
      intro: "An error occurred while fetching information.",
      photo: null,
    };
  }
};

// Helper function to clean unwanted HTML tags
const cleanHTML = (htmlString) => {
  // Parse the HTML string into a document
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  // Remove unwanted tags (e.g., <link>, <style>)
  // doc.querySelectorAll("link, script").forEach((el) => el.remove());

  // Return the cleaned HTML as a string
  return doc.body.innerHTML;
};

// Fetch population for a specific city using GeoNames API
export const getPopulationData = async (locationName, countryCode) => {
  // console.log("pop data0 ", locationName, countryCode);
  const response = await fetch(
    `https://secure.geonames.org/searchJSON?q=${locationName}&maxRows=10&orderby=population&username=${GEONAMES_USERNAME}`
  );
  const data = await response.json();
  // console.log("pop data1 ", JSON.stringify(data, null, 2));

  // query wont always return the city we want, so we need to find the matching city
  const matchingLocation = data.geonames.find(
    (loc) => loc.name === locationName
  );

  // console.log("pop data2 ", JSON.stringify(matchingLocation, null, 2));

  return (
    matchingLocation.population ||
    "Population data not available. Please use our form to update this information! Thank you!"
  );
};

export const getDataFromStorage = () => {
  const initialData = JSON.parse(localStorage.getItem("initialData"));
  const citiesData = JSON.parse(localStorage.getItem("citiesData"));
  return { initialData, citiesData };
};

export const getPopulationDataForTable = async (locationName, countryCode) => {
  const response = await fetch(
    `https://secure.geonames.org/searchJSON?q=${locationName}&country=${countryCode}&featureCode=PPLA2&maxRows=10&orderby=population&username=${GEONAMES_USERNAME}`
  );
  const data = await response.json();
  // console.log("pop data", JSON.stringify(data, null, 2));
  return data || "Error";
};

export const createInterestingFacts = async (locationName, countryCode, isState = false) => {
  // Insert styles if they don't exist
  // if (!$('.city-facts-container').length) {
  //   $('head').append(styles);
  // }

  // Create container
  const $container = $('<div>', {
    class: 'city-facts-container'
  }).append($('<h3>', {
    text: 'Quick Facts'
  }));

  // Create the ordered list
  const $list = $('<ol>', {
    class: 'city-facts-list'
  });
  $container.append($list);

  try {
    // Get location data from GeoNames
    const featureCode = isState ? 'ADM1' : 'PPLA2'; // ADM1 for states, PPLA2 for cities
    const response = await fetch(
      `https://secure.geonames.org/searchJSON?q=${locationName}&country=${countryCode}&featureCode=${featureCode}&maxRows=1&username=secret8squirrel`
    );
    const data = await response.json();
    const locationData = data.geonames[0];

    if (!locationData) {
      throw new Error('Location data not found');
    }

    // Get timezone info
    const tzResponse = await fetch(
      `https://secure.geonames.org/timezoneJSON?lat=${locationData.lat}&lng=${locationData.lng}&username=secret8squirrel`
    );
    const tzData = await tzResponse.json();

    // Create facts array based on whether it's a state or city
    const facts = isState ? [
      {
        icon: '📍',
        title: 'Geographic Center',
        value: `${locationData.lat}°N, ${locationData.lng}°W`
      },
      {
        icon: '🗺️',
        title: 'Region',
        value: locationData.adminCode1 ? `Part of the ${locationData.adminName1} region` : 'Regional data not available'
      },
      {
        icon: '⏰',
        title: 'Time Zones',
        value: `Primary: ${tzData.timezoneId} (GMT${tzData.gmtOffset})`
      },
      {
        icon: '📏',
        title: 'Area Coverage',
        value: locationData.bbox ? 
          `Spans from ${locationData.bbox.west}°W to ${locationData.bbox.east}°E longitude` :
          'Area data not available'
      },
      {
        icon: '🏛️',
        title: 'Administrative Level',
        value: `${locationData.fcodeName || 'First-order administrative division'}`
      }
    ] : [
      {
        icon: '🌎',
        title: 'Geographic Location',
        value: `Located at ${locationData.lat}°N, ${locationData.lng}°W`
      },
      {
        icon: '👥',
        title: 'Population',
        value: `${locationData.population.toLocaleString()} residents`
      },
      {
        icon: '⏰',
        title: 'Time Zone',
        value: `${tzData.timezoneId} (GMT${tzData.gmtOffset})`
      },
      {
        icon: '🏔️',
        title: 'Elevation',
        value: `${locationData.elevation || 0} meters above sea level`
      },
      {
        icon: '🌆',
        title: 'Municipality Type',
        value: `${locationData.fcodeName || 'City'}`
      }
    ];

    // Create and append each fact
    facts.forEach(fact => {
      const $li = $('<li>').append(
        $('<span>', {
          class: 'fact-icon',
          text: fact.icon
        }),
        $('<div>', {
          class: 'fact-content'
        }).append(
          $('<div>', {
            class: 'fact-title',
            text: fact.title
          }),
          $('<div>', {
            class: 'fact-value',
            text: fact.value
          })
        )
      );
      $list.append($li);
    });

    // Remove existing facts if present and insert new ones
    $('.city-facts-container').remove();
    $('#aside-container').prepend($container);

  } catch (error) {
    console.error('Error creating interesting facts:', error);
    $container.html('<div>Error loading interesting facts. Please try again later.</div>');
  }
};
