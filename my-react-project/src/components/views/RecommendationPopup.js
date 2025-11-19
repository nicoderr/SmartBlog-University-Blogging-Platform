import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Button, 
  Typography, 
  Box, 
  CircularProgress, 
  Grid, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

// Simplified recommendation popup with faster map loading
const RecommendationPopup = ({ open, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [userLocation, setUserLocation] = useState({ lat: 41.8781, lng: -87.6298 }); // Default 
// Clean format with intro and numbered recommendations
// Updated function to preserve dynamic intro
const formatRecommendationAsNumberedList = (text) => {
  if (!text) return "";
  
  // Split the text into sentences
  const sentences = text.split(/[.!?]+\s+/);
  
  // Find an introductory sentence (typically the first one)
  let intro = sentences[0] || "";
  if (!intro.includes("weather") && !intro.includes("location")) {
    // If the first sentence doesn't look like an intro, check for one that does
    for (let i = 0; i < Math.min(3, sentences.length); i++) {
      if (sentences[i].toLowerCase().includes("weather") || 
          sentences[i].toLowerCase().includes("location") || 
          sentences[i].toLowerCase().includes("chicago")) {
        intro = sentences[i];
        break;
      }
    }
  }
  
  // Clean the intro (remove formatting, but keep content)
  intro = intro
    .replace(/\*\*/g, '')
    .replace(/^\d+\.\s*/, '')
    .trim();
  
  // If no good intro was found, use a default one
  if (!intro || intro.length < 10) {
    intro = "Based on your current location and weather in Chicago, here are some recommendations for today:";
  }
  
  // Process the remaining sentences into activities
  const activities = [];
  
  // Start from the sentence after the intro
  const startIdx = sentences.indexOf(intro) + 1;
  
  for (let i = startIdx; i < sentences.length; i++) {
    // Clean the sentence thoroughly
    let cleaned = sentences[i]
      .replace(/^\d+\.\s*/, '') // Remove leading numbers
      .replace(/\*\*/g, '') // Remove ALL asterisks
      .replace(/^\s*\d+\s*/, '') // Remove standalone numbers at start
      .replace(/^[-*•]\s*/, '') // Remove bullet points
      .trim();
    
    // Skip very short sentences
    if (cleaned.length > 5) {
      // Skip sentences that are continuations of the previous point
      if (activities.length > 0 && 
          (cleaned.toLowerCase().startsWith("it's") || 
           cleaned.toLowerCase().startsWith("they're") ||
           cleaned.toLowerCase().startsWith("this is") ||
           cleaned.toLowerCase().startsWith("these are"))) {
        // Append to previous activity
        activities[activities.length - 1] += ". " + cleaned;
      } else {
        activities.push(cleaned);
      }
    }
  }
  
  // Limit to 5 meaningful activities
  const finalActivities = activities
    .filter(act => act.length > 10) // Only keep meaningful activities
    .slice(0, 5);
  
  // Format the final output
  return (
    <>
      <Typography variant="body1" paragraph>
        {intro}
      </Typography>
      <Box component="ol" sx={{ pl: 3 }}>
        {finalActivities.map((activity, index) => (
          <Typography component="li" variant="body1" key={`rec-${index}`} sx={{ mb: 1 }}>
            {activity}
          </Typography>
        ))}
      </Box>
    </>
  );
};

  // Function to fetch recommendations from backend
  const fetchRecommendations = async (latitude, longitude) => {
    try {
      setLoading(true);
      
      // Call the API endpoint
      const response = await fetch('http://localhost:5000/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude, longitude }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('Recommendation data:', data);
      
      // Validate required data structure
      if (!data.structured || !data.recommendation) {
        throw new Error('Invalid data structure received from API');
      }

      setRecommendations(data);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(err.message || 'Failed to load recommendations');
      
      // Provide mock data for testing when API fails
      setRecommendations({
        recommendation: "With the current moderate weather, a great time outdoors in one of Chicago's beautiful parks like the Millennium Park or the Lincoln Park Zoo might be in order. Based on the nearby events, you might want to check out the Navy Pier, known for its beautiful waterfront vistas and its mix of entertainment options. As the night falls, enjoy the vibrant music and nightlife in Chicago by catching a concert or a show from the ongoing local festivals. Don't miss out on the delectable local food in between your adventures!",
        structured: {
          restaurants: [
            { name: "Bella Italian", venue: "123 Main St", lat: userLocation.lat + 0.005, lng: userLocation.lng - 0.003 },
            { name: "Ocean Grill", venue: "456 Park Ave", lat: userLocation.lat - 0.002, lng: userLocation.lng + 0.004 },
            { name: "The Spice Route", venue: "789 Broadway", lat: userLocation.lat + 0.003, lng: userLocation.lng + 0.005 }
          ],
          concerts: [
            { name: "Chicago Cubs vs. Milwaukee Brewers", venue: "Wrigley Field", date: "Oct 2023", lat: userLocation.lat - 0.005, lng: userLocation.lng - 0.004 },
            { name: "Chicago Bulls vs. Detroit Pistons", venue: "United Center", date: "Next Friday", lat: userLocation.lat + 0.007, lng: userLocation.lng - 0.002 },
            { name: "Chicago Blackhawks vs. St. Louis Blues", venue: "United Center", date: "Every Thursday", lat: userLocation.lat - 0.004, lng: userLocation.lng + 0.008 }
          ],
          sports: [
            { name: "University Basketball", venue: "Campus Arena", date: "Tomorrow", lat: userLocation.lat + 0.006, lng: userLocation.lng + 0.002 },
            { name: "City Marathon", venue: "Downtown", date: "Next Sunday", lat: userLocation.lat - 0.003, lng: userLocation.lng - 0.007 },
            { name: "Tennis Tournament", venue: "City Sports Center", date: "This weekend", lat: userLocation.lat - 0.008, lng: userLocation.lng + 0.003 }
          ]
        },
        weather: "59°F, scattered clouds",
        location: {
          city: "Chicago",
          country: "United States of America",
          lat: userLocation.lat,
          lng: userLocation.lng
        }
      });
    } finally {
      setLoading(false);
    }
  };

// Replace the initMap function with this enhanced version:

const initMap = () => {
  // Clear previous markers
  markers.forEach(marker => marker.setMap(null));
  setMarkers([]);
  
  // Skip if no recommendations or already loaded
  if (!recommendations || !open) return;
  
  try {
    // Create map if not already created
    const mapElement = document.getElementById('recommendation-map');
    if (!mapElement) {
      console.error("Map element not found in DOM");
      return;
    }
    
    console.log("Initializing map with userLocation:", userLocation);
    
    // Parse user location coordinates and ensure they are valid
    const userLat = parseFloat(userLocation.lat);
    const userLng = parseFloat(userLocation.lng);
    
    if (isNaN(userLat) || isNaN(userLng) || 
        Math.abs(userLat) > 90 || Math.abs(userLng) > 180) {
      console.error("Invalid user coordinates:", userLocation);
      setError("Invalid user coordinates. Please try again.");
      return;
    }
    
    // Initialize map
    const newMap = new window.google.maps.Map(mapElement, {
      center: { lat: userLat, lng: userLng },
      zoom: 13,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false
    });
    
    // Create info window function
    const createInfoWindow = (marker, item) => {
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px;">${item.name}</h3>
            <p style="margin: 0; font-size: 14px;">${item.venue}</p>
            ${item.date ? `<p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">${item.date}</p>` : ''}
          </div>
        `
      });
      
      marker.addListener('click', () => {
        infoWindow.open(newMap, marker);
      });
    };
    
    setMap(newMap);
    
    // Debug the placement of markers
    console.log("Creating markers with these coordinates:");
    console.log("User location:", { lat: userLat, lng: userLng });
    
    // Add user marker with precise coordinate handling
    const userMarker = new window.google.maps.Marker({
      position: { lat: userLat, lng: userLng },
      map: newMap,
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
      },
      title: 'Your Location',
      zIndex: 100 // Ensure user marker appears on top
    });
    
    // Add info window for user location
    const userInfoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="padding: 8px; max-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px;">Your Location</h3>
          <p style="margin: 0; font-size: 14px;">${recommendations.location.city}, ${recommendations.location.country}</p>
        </div>
      `
    });
    
    userMarker.addListener('click', () => {
      userInfoWindow.open(newMap, userMarker);
    });
    
    const newMarkers = [userMarker];
    let bounds = new window.google.maps.LatLngBounds();
    bounds.extend(new window.google.maps.LatLng(userLat, userLng));
    
    // Function to add marker with validation
    const addMarker = (item, index, category, color, prefix) => {
      if (!item || !item.lat || !item.lng) {
        console.warn(`Invalid marker data for ${category} #${index}:`, item);
        return;
      }
      
      const lat = parseFloat(item.lat);
      const lng = parseFloat(item.lng);
      
      if (isNaN(lat) || isNaN(lng) || 
          Math.abs(lat) > 90 || Math.abs(lng) > 180) {
        console.warn(`Invalid coordinates for ${category} #${index}:`, {lat, lng});
        return;
      }
      
      console.log(`Creating ${category} marker #${index}:`, {lat, lng, name: item.name});
      
      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map: newMap,
        icon: {
          url: `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`
        },
        title: item.name,
        label: {
          text: `${prefix}${index + 1}`,
          color: 'white',
          fontSize: '10px',
          fontWeight: 'bold'
        },
        category: category,
        animation: window.google.maps.Animation.DROP
      });
      
      createInfoWindow(marker, item);
      newMarkers.push(marker);
      bounds.extend(new window.google.maps.LatLng(lat, lng));
    };
    
    // Add restaurant markers
    if (recommendations.structured.restaurants && recommendations.structured.restaurants.length > 0) {
      recommendations.structured.restaurants.forEach((item, idx) => {
        addMarker(item, idx, 'restaurant', 'blue', 'R');
      });
    } else {
      console.warn("No restaurant data available");
    }
    
    // Add concert markers
    if (recommendations.structured.concerts && recommendations.structured.concerts.length > 0) {
      recommendations.structured.concerts.forEach((item, idx) => {
        addMarker(item, idx, 'concert', 'purple', 'C');
      });
    } else {
      console.warn("No concert data available");
    }
    
    // Add sports markers
    if (recommendations.structured.sports && recommendations.structured.sports.length > 0) {
      recommendations.structured.sports.forEach((item, idx) => {
        addMarker(item, idx, 'sport', 'red', 'S');
      });
    } else {
      console.warn("No sports data available");
    }
    
    // Fit map to include all markers
    if (newMarkers.length > 1) {
      console.log(`Fitting map to ${newMarkers.length} markers`);
      newMap.fitBounds(bounds);
      
      // Don't zoom in too far for a single item
      const listener = window.google.maps.event.addListener(newMap, 'idle', function() {
        if (newMap.getZoom() > 15) newMap.setZoom(15);
        window.google.maps.event.removeListener(listener);
      });
    } else {
      // If only user marker, center on it with default zoom
      newMap.setCenter({ lat: userLat, lng: userLng });
      newMap.setZoom(13);
    }
    
    setMarkers(newMarkers);
    setMapLoaded(true);
    console.log(`Map initialized with ${newMarkers.length} markers`);
  } catch (err) {
    console.error('Error initializing map:', err);
    setError('Could not initialize map: ' + err.message);
  }
};

  // Effect to get user location when popup opens
  useEffect(() => {
    if (!open) return;

    setLoading(true);
    setError(null);
    setMapLoaded(false);

    // Get user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        fetchRecommendations(latitude, longitude);
      },
      (err) => {
        console.error('Error getting location:', err);
        setError('Could not get your location. Using default location instead.');
        // Use default location (Chicago)
        fetchRecommendations(41.8781, -87.6298);
      },
      { timeout: 10000 }
    );

    // Cleanup function
    return () => {
      // Clear markers when component unmounts
      markers.forEach(marker => marker?.setMap(null));
      setMarkers([]);
    };
  }, [open]);

  // Effect to initialize map when recommendations are loaded
  useEffect(() => {
    if (!recommendations || !open) return;
    
    // Initialize map with a delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (window.google && window.google.maps) {
        initMap();
      } else {
        console.log('Waiting for Google Maps to load...');
        // Try again in a second
        const retryTimer = setTimeout(() => {
          if (window.google && window.google.maps) {
            initMap();
          } else {
            setError('Google Maps could not be loaded');
          }
        }, 2000);
        
        return () => clearTimeout(retryTimer);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [recommendations, open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      aria-labelledby="recommendation-dialog-title"
    >
      <DialogTitle id="recommendation-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div">
          Recommended For You
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : recommendations ? (
          <Grid container spacing={3}>
            {/* Location and Weather Info */}
            <Grid item xs={12}>
              <Paper elevation={1} sx={{ p: 2, mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                  <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">
                    {recommendations.location.city}, {recommendations.location.region}, {recommendations.location.country}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <WbSunnyIcon color="warning" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">
                    {recommendations.weather}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* AI Recommendation */}
            <Grid item xs={12}>
                <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                {recommendations.recommendation}
              </Paper>
            </Grid>

            {/* Map */}
            <Grid item xs={12} md={7}>
              <Paper elevation={1} sx={{ height: 400, position: 'relative' }}>
                <div id="recommendation-map" style={{ width: '100%', height: '100%' }}></div>
                {!mapLoaded && !error && (
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    backgroundColor: 'rgba(255,255,255,0.7)' 
                  }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Loading map...</Typography>
                  </Box>
                )}
                {error && (
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    flexDirection: 'column',
                    p: 3
                  }}>
                    <Typography color="error" paragraph>
                      {error}
                    </Typography>
                    <Button variant="contained" onClick={initMap}>
                      Retry Loading Map
                    </Button>
                  </Box>
                )}
              </Paper>
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'green', mr: 1 }} />
                  <Typography variant="caption">Your Location</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'blue', mr: 1 }} />
                  <Typography variant="caption">Restaurants</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'purple', mr: 1 }} />
                  <Typography variant="caption">Concerts</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'red', mr: 1 }} />
                  <Typography variant="caption">Sports</Typography>
                </Box>
              </Box>
            </Grid>

            {/* Recommendations Lists */}
            <Grid item xs={12} md={5}>
              <Paper elevation={1} sx={{ p: 2, height: '400px', overflowY: 'auto' }}>
                {/* Restaurants Section */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <RestaurantIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Restaurants</Typography>
                  </Box>
                  <List dense>
                    {recommendations.structured.restaurants.map((item, index) => (
                      <ListItem key={`restaurant-${index}`} sx={{ pl: 2 }}>
                        <ListItemText 
                          primary={
                            <Typography variant="subtitle2">
                              <Box component="span" sx={{ 
                                display: 'inline-block', 
                                width: 18, 
                                height: 18, 
                                lineHeight: '18px',
                                textAlign: 'center', 
                                borderRadius: '50%', 
                                bgcolor: 'blue', 
                                color: 'white', 
                                fontSize: 12,
                                mr: 1 
                              }}>
                                R{index + 1}
                              </Box>
                              {item.name}
                            </Typography>
                          } 
                          secondary={item.venue}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                {/* Concerts Section */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <MusicNoteIcon color="secondary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Concerts</Typography>
                  </Box>
                  <List dense>
                    {recommendations.structured.concerts.map((item, index) => (
                      <ListItem key={`concert-${index}`} sx={{ pl: 2 }}>
                        <ListItemText 
                          primary={
                            <Typography variant="subtitle2">
                              <Box component="span" sx={{ 
                                display: 'inline-block', 
                                width: 18, 
                                height: 18, 
                                lineHeight: '18px',
                                textAlign: 'center', 
                                borderRadius: '50%', 
                                bgcolor: 'purple', 
                                color: 'white', 
                                fontSize: 12,
                                mr: 1 
                              }}>
                                C{index + 1}
                              </Box>
                              {item.name}
                            </Typography>
                          } 
                          secondary={
                            <>
                              {item.venue}
                              {item.date && <> · {item.date}</>}
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                {/* Sports Section */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <SportsSoccerIcon color="error" sx={{ mr: 1 }} />
                    <Typography variant="h6">Sports</Typography>
                  </Box>
                  <List dense>
                    {recommendations.structured.sports.map((item, index) => (
                      <ListItem key={`sport-${index}`} sx={{ pl: 2 }}>
                        <ListItemText 
                          primary={
                            <Typography variant="subtitle2">
                              <Box component="span" sx={{ 
                                display: 'inline-block', 
                                width: 18, 
                                height: 18, 
                                lineHeight: '18px',
                                textAlign: 'center', 
                                borderRadius: '50%', 
                                bgcolor: 'red', 
                                color: 'white', 
                                fontSize: 12,
                                mr: 1 
                              }}>
                                S{index + 1}
                              </Box>
                              {item.name}
                            </Typography>
                          } 
                          secondary={
                            <>
                              {item.venue}
                              {item.date && <> · {item.date}</>}
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        ) : error ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="error">{error}</Typography>
            <Button variant="contained" onClick={() => fetchRecommendations(userLocation.lat, userLocation.lng)} sx={{ mt: 2 }}>
              Try Again
            </Button>
          </Box>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default RecommendationPopup;