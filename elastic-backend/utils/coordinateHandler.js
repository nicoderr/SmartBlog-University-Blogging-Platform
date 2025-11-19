const axios = require("axios");

function validateCoordinates(lat, lng) {
  lat = parseFloat(lat);
  lng = parseFloat(lng);
  return !isNaN(lat) && !isNaN(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
}

async function fetchCoordinatesFromAddress(address, city, apiKey) {
  try {
    // ✅ Clean the venue name before sending to Geocoding API
    const cleanedAddress = address
      .replace(/@.*/, '') // remove anything after @
      .replace(/[^a-zA-Z0-9\s]/g, '') // remove special characters
      .trim();

    console.log(`📍 Fetching coordinates for: "${cleanedAddress}"`);

    const response = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: {
            address: `${address}, ${city}`,
            key: apiKey
          }
          
      });
      

    if (response.data.status !== "OK" || !response.data.results.length) {
      console.error(`❌ No geocode result for: "${cleanedAddress}", status: ${response.data.status}`);
      throw new Error("No geocode result");
    }

    const location = response.data.results[0].geometry.location;
    console.log(`✅ Geocode result for "${cleanedAddress}":`, location);
    return { lat: location.lat, lng: location.lng };
  } catch (err) {
    console.error(" Geocoding error:", err.message);
    throw err;
  }
}

function getValidCoordinates(source) {
    const lat = parseFloat(source?.latitude || source?.lat);
    const lng = parseFloat(source?.longitude || source?.lng);
  
    if (
      !isNaN(lat) && !isNaN(lng) &&
      Math.abs(lat) <= 90 && Math.abs(lng) <= 180
    ) {
      return { lat, lng };
    }
  
    throw new Error("Invalid or missing coordinates");
  }
  
function generateSpiralCoordinates(base, index, category) {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const angleOffset = category === 'concert' ? 2 : category === 'sport' ? 4 : 0;
  const theta = index * goldenAngle + angleOffset;
  const radius = 0.005 + index * 0.002;
  const noise = 0.001 * (Math.random() - 0.5);

  return {
    lat: base.lat + radius * Math.cos(theta) + noise,
    lng: base.lng + radius * Math.sin(theta) + noise
  };
}

module.exports = {
  validateCoordinates,
  fetchCoordinatesFromAddress,
  generateSpiralCoordinates,
  getValidCoordinates
};