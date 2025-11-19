class RecommendationController {
  static async getRecommendations(latitude, longitude) {
    try {
      console.log(`Fetching recommendations for coordinates: ${latitude}, ${longitude}`);
      
      const res = await fetch("http://localhost:5000/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ latitude, longitude })
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error:", errorText);
        throw new Error(`API Error: ${res.status} ${errorText}`);
      }
      
      const data = await res.json();
      console.log("API Response:", data);
      
      // Ensure the response has the expected structure
      if (!data.structured || !data.recommendation || !data.location) {
        console.error("Invalid API response structure:", data);
        throw new Error("Invalid response structure from recommendation API");
      }
      
      // Ensure we have arrays for each category
      const structured = {
        restaurants: Array.isArray(data.structured.restaurants) ? data.structured.restaurants : [],
        concerts: Array.isArray(data.structured.concerts) ? data.structured.concerts : [],
        sports: Array.isArray(data.structured.sports) ? data.structured.sports : []
      };
      
      return {
        ...data,
        structured
      };
    } catch (error) {
      console.error("Recommendation controller error:", error);
      throw error;
    }
  }
}

export default RecommendationController