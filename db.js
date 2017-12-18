var mongoose = require("mongoose");
var config = require("./config");

var express = require("express");
var app = express();

mongoose.Promise = global.Promise;
mongoose.connect(
  config.mongoURI[app.settings.env],
  { useMongoClient: true },
  (err, res) => {
    if (err) {
      console.log("Error connecting to database." + err);
    } else {
      console.log(
        `Connected to database: ${config.mongoURI[app.settings.env]}`
      );
    }
  }
);
