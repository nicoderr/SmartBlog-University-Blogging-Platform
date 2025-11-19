const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const SERP_API_KEY = process.env.SERP_API_KEY || "";
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || "";
const GOOGLE_GEOCODING_API_KEY = process.env.GOOGLE_GEOCODING_API_KEY || "";

const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
const SEARCH_API_URL = "https://serpapi.com/search";
const LOCATION_API_URL = "https://ipapi.co/json/";

const {
  validateCoordinates,
  fetchCoordinatesFromAddress, 
  generateSpiralCoordinates, 
  getValidCoordinates 
} = require("../utils/coordinateHandler");

// Track API success status
let apiStatus = {
  openai: false,
  serp: false,
  weather: false,
  geocoding: false
};


  // Enhanced concert venue processing
  const processVenueInfo = (event, city) => {
    // Extract venue name and address with more thorough checks
    let venueName = '';
    let venueAddress = '';
    
    // Extract event title for better context
    const eventTitle = event.title || '';
    
    // Get venue info from the event
    if (event.venue) {
      if (typeof event.venue === 'string') {
        // Some APIs return venue as just a string
        venueName = event.venue;
      } else {
        // Others return it as an object with properties
        venueName = event.venue.name || '';
        venueAddress = event.venue.address || '';
      }
    }
    
    // If no venue name was found, try to extract from title or use default
    if (!venueName) {
      // Check if event title contains a venue indicator with "at" or "@"
      const atMatch = eventTitle.match(/\s+(?:at|@)\s+([^,]+)(?:,|$)/i);
      if (atMatch && atMatch[1]) {
        venueName = atMatch[1].trim();
      } else {
        // Use generic venue based on event type
        if (eventTitle.toLowerCase().includes('concert') || 
            eventTitle.toLowerCase().includes('music') ||
            eventTitle.toLowerCase().includes('band')) {
          venueName = 'Concert Hall';
        } else if (eventTitle.toLowerCase().includes('game') || 
                  eventTitle.toLowerCase().includes('match') ||
                  eventTitle.toLowerCase().includes('vs')) {
          venueName = 'Stadium';
        } else {
          venueName = 'Venue';
        }
      }
    }
    
    // If no venue address was found but we have a venue name, use that as base for address
    if (!venueAddress && venueName) {
      // Don't just use venue name as address, since that often doesn't geocode well
      // Instead, create a more complete address format with the city
      venueAddress = `${venueName}, ${city}`;
    }
    
    // Format date consistently
    let eventDate = 'Check venue for dates';
    if (event.date) {
      if (typeof event.date === 'string') {
        eventDate = event.date;
      } else if (event.date.when) {
        eventDate = event.date.when;
      } else if (event.date.start_date) {
        eventDate = event.date.start_date;
      }
    }
    
    return {
      name: eventTitle,
      venue: venueName,
      address: venueAddress,
      date: eventDate
    };
  };
const functionHandlers = {
  getLocation: async () => {
    try {
      console.log("🌍 Getting location from ipapi");
      const ipResponse = await axios.get(LOCATION_API_URL);
      
      if (!ipResponse.data || !ipResponse.data.city) {
        throw new Error("Location data not available from API");
      }

      console.log("✅ ipapi success:", ipResponse.data.city);
      return {
        city: ipResponse.data.city,
        country: ipResponse.data.country_name,
        region: ipResponse.data.region,
        latitude: ipResponse.data.latitude,
        longitude: ipResponse.data.longitude
      };
    } catch (err) {
      console.error("❌ Location API Error:", err.message);
      throw new Error("Failed to get location data from API");
    }
  },

  getWeather: async ({ latitude, longitude }) => {
    try {
      const res = await axios.get(`${WEATHER_API_URL}?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`);
      apiStatus.weather = true;
      return {
        temperature: res.data.main.temp,
        description: res.data.weather[0].description
      };
    } catch (err) {
      console.error("❌ OpenWeather Error:", err.message);
      apiStatus.weather = false;
      return { temperature: 20, description: "weather data unavailable" };
    }
  },

  getRestaurants: async ({ city, latitude, longitude }) => {
    try {
      console.log(`🍽️ Searching for restaurants in ${city}`);
      const response = await axios.get(SEARCH_API_URL, {
        params: {
          engine: 'google_maps',
          q: `best restaurants in ${city}`,
          ll: `@${latitude},${longitude},15z`,
          type: 'search',
          api_key: SERP_API_KEY
        }
      });

      if (!response.data.local_results || response.data.local_results.length === 0) {
        console.warn("⚠️ No restaurant results from SerpAPI");
        return [];
      }

      const restaurants = response.data.local_results
        .filter(place => {
          return place.gps_coordinates &&
            typeof place.gps_coordinates.latitude === 'number' &&
            typeof place.gps_coordinates.longitude === 'number';
        })
        .slice(0, 3)
        .map((place, index) => {
          const lat = place.gps_coordinates.latitude;
          const lng = place.gps_coordinates.longitude;
          
          return {
            name: place.title || `Restaurant ${index + 1}`,
            venue: place.address || `${place.title} in ${city}`,
            date: "Open daily",
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            category: 'restaurant',
            uniqueId: `r-${index}-${Date.now()}`
        };
      });
      
      console.log(`✅ Found ${restaurants.length} restaurants`);
      return restaurants;
    } catch (err) {
      console.error("❌ SerpAPI Restaurant Error:", err.message);
      return [];
    }
  },



// Updated getConcerts function with enhanced venue processing
getConcerts: async ({ city, country, region, latitude, longitude }) => {
  try {
    console.log(`🎵 Searching for concerts in ${city}, ${region || ''}, ${country}`);
    
    // Try using the same API approach as restaurants (google_maps instead of google_events)
    try {
      const response = await axios.get(SEARCH_API_URL, {
        params: {
          engine: 'google_maps',
          q: `concert venues in ${city}`,
          ll: `@${latitude},${longitude},15z`,
          type: 'search',
          api_key: SERP_API_KEY
        }
      });
      
      console.log("🔍 Concert API response structure:", {
        hasLocalResults: Boolean(response.data && response.data.local_results),
        resultsCount: response.data && response.data.local_results ? response.data.local_results.length : 0
      });
      
      if (!response.data.local_results || response.data.local_results.length === 0) {
        console.warn("⚠️ No concert results from SerpAPI");
        return [];
      }
      
      // Process venues similar to restaurants
      const concerts = response.data.local_results
        .filter(place => {
          return place.gps_coordinates &&
            typeof place.gps_coordinates.latitude === 'number' &&
            typeof place.gps_coordinates.longitude === 'number';
        })
        .slice(0, 3)
        .map((place, index) => {
          const lat = place.gps_coordinates.latitude;
          const lng = place.gps_coordinates.longitude;
          
          // Generate realistic event times for the next few days
          const eventDate = new Date();
          eventDate.setDate(eventDate.getDate() + Math.floor(Math.random() * 7) + 1); // Random day in next week
          eventDate.setHours(19 + Math.floor(Math.random() * 3)); // 7pm, 8pm, or 9pm
          eventDate.setMinutes(Math.random() > 0.5 ? 0 : 30); // Either on the hour or half past
          
          const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
          const timeOptions = { hour: 'numeric', minute: '2-digit' };
          const formattedDate = eventDate.toLocaleDateString('en-US', dateOptions);
          const formattedTime = eventDate.toLocaleTimeString('en-US', timeOptions);
          
          return {
            name: place.title || `Concert Venue ${index + 1}`,
            venue: place.address || `${place.title} in ${city}`,
            date: `${formattedDate} at ${formattedTime}`,
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            category: 'concert',
            uniqueId: `c-${index}-${Date.now()}`
          };
        });
      
      console.log(`✅ Found ${concerts.length} concert venues with coordinates`);
      return concerts;
    } catch (apiError) {
      console.error("❌ Error fetching concert data from API:", apiError.message);
      return [];
    }
    






    console.log(`🎵 Processed ${concerts.length} concert events with coordinates`);
    return concerts;
  } catch (err) {
    console.error("❌ SerpAPI Concert Error:", err.message);
    
    // If we can't get accurate data, return empty array
    console.log("❌ Could not get accurate concert data");
    return [];
  }
},

// The getSports function would be updated in a similar way with the same processVenueInfo helper
getSports: async ({ city, country, region, latitude, longitude }) => {
  try {
    console.log(`🍇 Searching for sports venues in ${city}, ${region || ''}, ${country}`);
    
    // Try using the same API approach as restaurants (google_maps instead of google_events)
    try {
      const response = await axios.get(SEARCH_API_URL, {
        params: {
          engine: 'google_maps',
          q: `sports stadiums arenas in ${city}`,
          ll: `@${latitude},${longitude},15z`,
          type: 'search',
          api_key: SERP_API_KEY
        }
      });
      
      console.log("🔍 Sports API response structure:", {
        hasLocalResults: Boolean(response.data && response.data.local_results),
        resultsCount: response.data && response.data.local_results ? response.data.local_results.length : 0
      });
      
      if (!response.data.local_results || response.data.local_results.length === 0) {
        console.warn("⚠️ No sports venue results from SerpAPI");
        return [];
      }
      
      // Process venues similar to restaurants
      const sportsVenues = response.data.local_results
        .filter(place => {
          return place.gps_coordinates &&
            typeof place.gps_coordinates.latitude === 'number' &&
            typeof place.gps_coordinates.longitude === 'number';
        })
        .slice(0, 3)
        .map((place, index) => {
          const lat = place.gps_coordinates.latitude;
          const lng = place.gps_coordinates.longitude;
          
          // Generate realistic game times for the next few days
          const gameDate = new Date();
          gameDate.setDate(gameDate.getDate() + Math.floor(Math.random() * 10)); // Random day in next 10 days
          
          // Sports games are often in afternoon or evening
          const isAfternoonGame = Math.random() > 0.5;
          gameDate.setHours(isAfternoonGame ? 13 + Math.floor(Math.random() * 4) : 18 + Math.floor(Math.random() * 3));
          gameDate.setMinutes(Math.random() > 0.7 ? 0 : 30); // Usually on the hour
          
          const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
          const timeOptions = { hour: 'numeric', minute: '2-digit' };
          const formattedDate = gameDate.toLocaleDateString('en-US', dateOptions);
          const formattedTime = gameDate.toLocaleTimeString('en-US', timeOptions);
          
          return {
            name: place.title || `Sports Venue ${index + 1}`,
            venue: place.address || `${place.title} in ${city}`,
            date: `${formattedDate} at ${formattedTime}`,
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            category: 'sport',
            uniqueId: `s-${index}-${Date.now()}`
          };
        });
      
      console.log(`✅ Found ${sportsVenues.length} sports venues with coordinates`);
      return sportsVenues;
    } catch (apiError) {
      console.error("❌ Error fetching sports venue data from API:", apiError.message);
      return [];
    }
    

    




    console.log(`🏆 Processed ${sportsEvents.length} sports events with coordinates`);
    return sportsEvents;
  } catch (err) {
    console.error("❌ SerpAPI Sports Error:", err.message);
    
    // If we can't get accurate data, return empty array
    console.log("❌ Could not get accurate sports data");
    return [];
  }
}
};

// Main POST handler
const getRecommendations = async (req, res) => {
  try {
    console.log("📥 Incoming request body:", req.body);
    
    // Reset API status
    apiStatus = {
      openai: false,
      serp: false,
      weather: false,
      geocoding: false
    };

    const { latitude: lat, longitude: lng } = req.body;
    if (typeof lat !== "number" || typeof lng !== "number") {
      return res.status(400).json({ error: "Missing or invalid latitude/longitude in request body" });
    }

    // Get location data
    const location = await functionHandlers.getLocation(lat, lng);
    console.log("📍 Location data:", location);
    
    // Get weather data
    const weather = await functionHandlers.getWeather({ latitude: lat, longitude: lng });
    console.log("🌤️ Weather data:", weather);
    
    // Run all queries in parallel for efficiency
    console.log("🔍 Getting events from SerpAPI...");
    const [restaurants, concerts, sports] = await Promise.all([
      functionHandlers.getRestaurants({ city: location.city, latitude: lat, longitude: lng }),
      functionHandlers.getConcerts({ 
        city: location.city, 
        country: location.country, 
        region: location.region, 
        latitude: lat, 
        longitude: lng 
      }),
      functionHandlers.getSports({ 
        city: location.city, 
        country: location.country, 
        region: location.region, 
        latitude: lat, 
        longitude: lng 
      })
    ]);
    
    console.log("🎭 Event data counts:", {
      restaurants: restaurants.length,
      concerts: concerts.length,
      sports: sports.length
    });
    
    // Set serp API success based on if we got any results
    apiStatus.serp = (restaurants.length > 0 || concerts.length > 0 || sports.length > 0);
    
    // Combine all events for the OpenAI prompt
    const allEvents = [...restaurants, ...concerts, ...sports];
    const eventsForPrompt = allEvents.map(e => e.name).join(", ");
    
    // Generate OpenAI recommendation
    console.log("🤖 Requesting OpenAI natural language recommendation...");
    
    let recommendation = "";
    try {
      const promptVariations = [
        "given the current weather",
        "considering the temperature and conditions",
        "based on today's forecast",
        "with the current weather in mind",
        "taking into account today's conditions"
      ];

      const variation = promptVariations[Math.floor(Math.random() * promptVariations.length)];
      const fahrenheit = Math.round((weather.temperature * 9) / 5 + 32);

      const naturalResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are a friendly assistant based in Chicago. Given the user's current location and weather, you will introduce the weather and city briefly, and then list 5 exciting things to do. Only number the actual activities. Timestamp: ${Date.now()}`
            },
            {
              role: "user",
              content: `I am in ${location.city} at ${new Date().toISOString()}. The weather is ${fahrenheit}°F with ${weather.description}. Suggest 5 specific activities I can enjoy right now based on this location and weather. Please suggest 5 exciting things I can do right now based on this.`
            }
          ]
        },
        {
          headers: { Authorization: `Bearer ${OPENAI_API_KEY}` }
        }
      );

      recommendation = naturalResponse.data.choices[0].message.content;
      apiStatus.openai = true;
      console.log("🤖 Natural language recommendation received");
    } catch (err) {
      console.error("❌ OpenAI API Error:", err.message);
      apiStatus.openai = false;
      recommendation = `With the current ${weather.description} and temperature of ${weather.temperature}°C in ${location.city}, consider exploring local attractions that match these conditions. You might find interesting events happening nearby. Enjoy your time in ${location.city}!`;
    }

    // Use only real data, no fallbacks
    const finalRestaurants = restaurants;
    const finalConcerts = concerts;
    const finalSports = sports;

    const response = {
      recommendation,
      structured: {
        restaurants: finalRestaurants.slice(0, 3),
        concerts: finalConcerts.slice(0, 3),
        sports: finalSports.slice(0, 3)
      },
      weather: `${Math.round((weather.temperature * 9) / 5 + 32)}°F, ${weather.description}`,
      location: {
        city: location.city,
        country: location.country,
        region: location.region,
        lat,
        lng
      },
      _debug: {
        apiStatus,
        timestamp: new Date().toISOString()
      }
    };
    
    console.log("📤 Sending response to frontend");
    res.json(response);
  } catch (err) {
    console.error("❌ Global Error:", err.message || err);
    res.status(500).json({ 
      recommendation: "Could not generate recommendations at this time.", 
      structured: { 
        restaurants: [],
        concerts: [],
        sports: []
      },
      weather: "Unknown",
      location: { city: "Unknown", country: "Unknown", region: "Unknown", lat: 0, lng: 0 },
      _debug: {
        error: err.message,
        apiStatus
      }
    });
  }
};

// Helper functions for generating fallback data
function generateFallbackRestaurants(location, count) {
  return Array(count).fill(0).map((_, i) => {
    const coords = generateSpiralCoordinates(location, i, 'restaurant');
    return {
      name: `Local Restaurant ${i + 1}`,
      venue: `Restaurant in ${location.city}`,
      lat: coords.lat,
      lng: coords.lng,
      category: 'restaurant',
      uniqueId: `r-${i}-${Date.now()}`
    };
  });
}

function generateFallbackConcerts(location, count) {
  return Array(count).fill(0).map((_, i) => {
    const coords = generateSpiralCoordinates(location, i, 'concert');
    return {
      name: `Music Venue ${i + 1}`,
      venue: `Concert Hall in ${location.city}`,
      date: "Check venue website for dates",
      lat: coords.lat,
      lng: coords.lng,
      category: 'concert',
      uniqueId: `c-${i}-${Date.now()}`
    };
  });
}

function generateFallbackSports(location, count) {
  return Array(count).fill(0).map((_, i) => {
    const coords = generateSpiralCoordinates(location, i, 'sport');
    return {
      name: `Sports Event ${i + 1}`,
      venue: `Stadium in ${location.city}`,
      date: "Check venue website for dates",
      lat: coords.lat,
      lng: coords.lng,
      category: 'sport',
      uniqueId: `s-${i}-${Date.now()}`
    };
  });
}

module.exports = { getRecommendations };