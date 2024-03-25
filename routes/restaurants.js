const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant");
const Review = require("../models/Review");// Assuming you have a Review model
const jwt = require("jsonwebtoken");
const User = require("../models/User");
router.get("/", async (req, res) => {
  try {
    console.log("Received query parameters:", req.query);

    const filterOptions = {};

    if (req.query.hasOwnProperty("Average Cost")) {
      const averageCostValue = parseInt(req.query["Average Cost"], 10);
      if (!isNaN(averageCostValue)) {
        filterOptions["Average Cost"] = { $lte: averageCostValue };
      } else {
        throw new Error("Invalid Average Cost value");
      }
    }

    if (req.query.hasOwnProperty("Capacity")) {
      const capacityValue = parseInt(req.query["Capacity"], 10);
      if (!isNaN(capacityValue)) {
        filterOptions["Capacity"] = { $gte: capacityValue };
      } else {
        throw new Error("Invalid Capacity value");
      }
    }

    if (req.query.Cuisine) {
      const cuisineValue = req.query.Cuisine.trim();
      filterOptions.Cuisine = new RegExp(`\\b${cuisineValue}\\b`, "i");
    }

    console.log("Constructed filter options:", filterOptions);

    const restaurants = await Restaurant.find(filterOptions);

    console.log("Filtered Restaurants Count:", restaurants.length);

    res.json(restaurants);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Get a single restaurant
router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new restaurant
router.post("/", async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a restaurant
router.put("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a restaurant
router.delete("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a review for a restaurant
router.post("/:id/reviews", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const review = new Review({
      restaurant: req.params.id,
      rating: req.body.rating,
      comment: req.body.comment,
      user: req.body.user, // Assuming you will provide the user in the request body
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.post("/:id/book", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(
      token,
      "377fc8160979b9ea861e34a4c2e8c183123b970d74001e091835677588a8bce5"
    );
    const userId = decodedToken.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    user.bookings.push(restaurant._id);
    await user.save();

    res.status(201).json({ message: "Booking successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
