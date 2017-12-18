var express = require("express");
var router = express.Router();
var Portfolio = require("./portfolioModel");
var axios = require("axios");

// *** api routes *** //
router.get("/portfolio", getPortfolio);
router.get("/portfolio/:id", getPortfolioByID);
router.post("/portfolio", addPortfolio);
router.put("/portfolio/:id", updatePortfolio);

// *** get portfolio *** //
function getPortfolio(req, res) {
  Portfolio.find((err, portfolio) => {
    if (err) {
      res.json({ ERROR: err });
    } else {
      res.json(portfolio);
    }
  });
}

// *** get portfolio by ID*** //
function getPortfolioByID(req, res) {
  Portfolio.findById(req.params.id, (err, portfolio) => {
    if (err) {
      res.json({ ERROR: err });
    } else {
      res.json(portfolio);
    }
  });
}

// *** post portfolio *** //
function addPortfolio(req, res) {
  var portfolio = new Portfolio({
    capital: req.body.capital,
    startDate: Date.now(),
    name: req.body.name,
    limit: req.body.limit
  });
  portfolio.save(err => {
    if (err) {
      res.json({ ERROR: err });
    } else {
      res.json({ SUCCESS: portfolio });
    }
  });
}

// *** put portfolio *** //
function updatePortfolio(req, res) {
  Portfolio.findById(req.params.id, (err, portfolio) => {
    portfolio.name = req.body.name;
    portfolio.save(err => {
      if (err) {
        res.json({ ERROR: err });
      } else {
        res.json({ UPDATED: portfolio });
      }
    });
  });
}

module.exports = router;
