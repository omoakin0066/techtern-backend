const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config(); // Load .env variables

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://techtern-frontend.vercel.app"
    ],
    credentials: true,
  })
);
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Routes
const userRoutes = require("./routes/userRoutes");
const internshipRoutes = require("./routes/internshipRoutes");
const geocodeRoutes = require("./routes/geocodeRoutes");

app.use("/api/users", userRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/geocode", geocodeRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("TechTern Backend Running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

