const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    alias: "Name of the Venue",
  },
  address: {
    type: String,
    trim: true,
    alias: "Address",
  },
  capacity: {
    type: String,
    trim: true,
    alias: "Capacity",
  },
  averageCost: {
    type: Number, // Changed to Number
    alias: "Average Cost",
  },
  openingClosingHours: {
    type: String,
    trim: true,
    alias: "opening and closing hours",
  },
  city: {
    type: String,
    trim: true,
    alias: "City",
  },
  state: {
    type: String,
    trim: true,
    alias: "State",
  },
  pinCode: {
    type: Number,
    trim: true,
    alias: "PIN code",
  },
  contactNumber: {
    type: String,
    trim: true,
    alias: "Contact Number",
  },
  email: {
    type: String,
    trim: true,
    alias: "Email",
  },
  facilities: {
    type: String,
    trim: true,
    alias: "Facilities",
  },
  ambiance: {
    type: String,
    trim: true,
    alias: "Ambiance",
  },
  diningOptions: {
    type: String,
    trim: true,
    alias: "Dining Options",
  },
  cuisine: {
    type: [String], // Array of strings for multiple cuisines
    trim: true,
    alias: "Cuisine",
  },
  menu: {
    type: String,
    trim: true,
    alias: "Menu",
  },
  policies: {
    type: String,
    trim: true,
    alias: "Policies",
  },
  specialOffersDeals: {
    type: String,
    trim: true,
    alias: "Special offers/Deals",
  },
  eventPackages: {
    type: String,
    trim: true,
    alias: "Event Packages",
  },
  images: {
    type: [String],
    alias: "Images",
  },
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
