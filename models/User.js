const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" }],
  profile: {
    name: { type: String, default: "" },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      zipCode: { type: String, default: "" },
    },
    phoneNumber: { type: String, default: "" },
    bio: { type: String, default: "" },
    dateOfBirth: { type: Date },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Virtual property to get current bookings
userSchema.virtual("currentBookings", {
  ref: "Restaurant",
  localField: "bookings",
  foreignField: "_id",
  justOne: false,
});

// Ensure virtuals are included in JSON output
userSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.password;
  },
});

module.exports = mongoose.model("User", userSchema);
