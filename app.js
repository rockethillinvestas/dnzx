var express = require("express");
var app = express();
var db = require("./db");
var logger = require("morgan");
var bodyParser = require("body-parser");

var PortfolioController = require("./portfolio/PortfolioController");

var portfolioUtility = require("./portfolio/portfolioUtility");

const PORT = process.env.PORT || 8080;

// ** MAIN ROUTES ** //
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(PORT, () => {
  console.log(`Node server running on port ${PORT}`);
});
app.use("/", PortfolioController);



module.exports = app;
