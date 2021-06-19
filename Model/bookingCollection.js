const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  problem: {
    type: String,
    required: true,
  },

  payWith: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  
});

const BookingCollection = mongoose.model("bookingCollection", bookingSchema);

module.exports = { BookingCollection };