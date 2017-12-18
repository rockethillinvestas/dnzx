var mongoose = require("mongoose");

var PortfolioSchema = new mongoose.Schema({
  name: String,
  capital: Number,
  positions: [],
  startDate: Date,
  limit: Number,
  currentValue: Number,
  timestamps: [Number],
  updatedDate: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("Portfolio", PortfolioSchema);
