const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan"); // ✅ Log requests
const elasticRoutes = require("./routes/elasticRoutes");

dotenv.config();
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json()); // Modern alternative to bodyParser
app.use(morgan("dev")); // ✅ Logs all API requests

// ✅ Elasticsearch API Routes
app.use("/api/elasticsearch", elasticRoutes); // FIX: Match frontend API call

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.send({ message: "Elasticsearch API is running 🚀" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
