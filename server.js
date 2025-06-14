
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./utils/db");
const weatherRoutes = require("./routes/weatherRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: "https://weather-5sedbpzxo-adprasad1996s-projects.vercel.app", // Replace with your actual Vercel URL
  credentials: true
}));

app.use(express.json());

// Root Route
app.get("/", (req, res) => {
  res.send({ message: "Weather App API is running!" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/weather", weatherRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
