const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan"); // ✅ Log requests
const elasticRoutes = require("./routes/elasticRoutes");
const activityRoutes = require("./routes/activityRoutes");
const authRoutes = require("./routes/authRoutes");
const { getRecommendations } = require("./controllers/FindRecommendationAgent");


dotenv.config();
const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",  // Change this if your frontend is hosted elsewhere
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json()); // Modern alternative to bodyParser
app.use(morgan("dev")); // ✅ Logs all API requests

// ✅ Auth Routes (NEW)
app.use("/api/auth", authRoutes);

app.post("/api/recommend", getRecommendations);

app.use("/api/activity", activityRoutes); // ✅ Fix the API endpoint
// ✅ Elasticsearch API Routes
app.use("/api/elasticsearch", elasticRoutes);

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.send({ message: "Elasticsearch API is running 🚀" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
