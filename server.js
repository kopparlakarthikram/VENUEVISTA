const express = require("express");
const connectDB = require("./db");
const cors = require("cors");
const restaurantRoutes = require("./routes/restaurants");
const userRoutes = require("./routes/users"); // Import user routes

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/users", userRoutes); // Use user routes

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
