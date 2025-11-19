const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const SERP_API_KEY = process.env.SERP_API_KEY || "";
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || "";

// APIs for fetching weather, location, and real-time events
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
const LOCATION_API_URL = "https://ipapi.co/json/";
const SEARCH_API_URL = "https://serpapi.com/search.json";

// ✅ Function to get user's location
async function getUserLocation() {
    try {
        const response = await axios.get(LOCATION_API_URL);
        if (!response.data || !response.data.city) throw new Error("Invalid location response");
        console.log("📍 User Location:", response.data);
        return {
            city: response.data.city,
            country: response.data.country_name,
            latitude: response.data.latitude,
            longitude: response.data.longitude
        };
    } catch (error) {
        console.error("❌ Location fetch error:", error.message);
        return { city: "New York", country: "USA", latitude: 40.7128, longitude: -74.0060 }; // Fallback
    }
}

// ✅ Function to get current weather
async function getWeather(latitude, longitude) {
    try {
        const response = await axios.get(`${WEATHER_API_URL}?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`);
        if (!response.data || !response.data.weather) throw new Error("Invalid weather response");
        console.log("🌦️ Weather Data:", response.data);
        return {
            temperature: response.data.main.temp,
            description: response.data.weather[0].description
        };
    } catch (error) {
        console.error("❌ Weather fetch error:", error.message);
        return { temperature: "unknown", description: "unable to fetch weather" };
    }
}

// ✅ Function to get real-time events
async function getRealTimeEvents(city) {
    try {
        const response = await axios.get(SEARCH_API_URL, {
            params: {
              q: `events in ${city}`,
              api_key: SERP_API_KEY
            }
          });
                  if (!response.data || !response.data.organic_results) throw new Error("Invalid search response");
        console.log("🎭 Events Data:", response.data);
        return response.data.organic_results.slice(0, 3).map(event => event.title);
    } catch (error) {
        console.error("❌ Event search error:", error.message);
        return ["No events found"];
    }
}

// ✅ OpenAI API to generate recommended activity
async function getAIRecommendations(weather, events, city) {
    try {
        const response = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are an AI that suggests activity based on weather, local events, and location." },
                { role: "user", content: `I am in ${city}. The weather is ${weather.temperature}°C with ${weather.description}. Nearby events are ${events.join(", ")}. Suggest activities.` }
            ],
            max_tokens: 300,
        }, {
            headers: { "Authorization": `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" }
        });

        console.log("🤖 AI Recommendation:", response.data);
        return response.data.choices[0]?.message?.content || "No suggestions available.";
    } catch (error) {
        console.error("❌ OpenAI API error:", error.response ? error.response.data : error.message);
        return "Could not generate recommendations.";
    }
}

// ✅ Main API function to get recommendations
const getActivityRecommendations = async (req, res) => {
    try {
        console.log("🚀 Fetching activity recommendations...");
        const location = await getUserLocation();
        console.log("📍 Location:", location);

        const weather = await getWeather(location.latitude, location.longitude);
        console.log("🌦️ Weather:", weather);

        const events = await getRealTimeEvents(location.city);
        console.log("🎭 Events:", events);

        const recommendation = await getAIRecommendations(weather, events, location.city);
        console.log("🤖 Recommendation:", recommendation);

        res.json({ recommendation });
    } catch (error) {
        console.error("❌ Failed to get activity recommendation:", error.message);
        res.status(500).json({ recommendation: "Could not fetch recommendations." });
    }
};

module.exports = { getActivityRecommendations };
