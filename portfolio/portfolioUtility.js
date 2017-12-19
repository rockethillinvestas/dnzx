var cron = require("node-cron");
var Portfolio = require("./portfolioModel");
var axios = require("axios");
var _ = require("lodash");

cron.schedule("*/5 * * * *", () => {
  updatePortfolio();
});

function updatePortfolio() {
  var apiURL = "https://api.coinmarketcap.com/v1/ticker/?convert=NOK";
  var tickers = [];
  axios
    .get(apiURL)
    .then(res => {
      tickers = res.data;
      Portfolio.find((err, portfolio) => {
        portfolio.forEach(e => {
          var totalMarketCap = 0;
          tickers.forEach((el, i) => {
            if (i >= e.limit) return;
            totalMarketCap += parseFloat(el.market_cap_nok);
          });
          var positions = calculatePortfolio(e, tickers, totalMarketCap);
          var updatedDate = Date.now();
          var currentValue = calculateCurrentValue(e);
          e.update(
            {
              $push: { timestamps: Date.now() },
              positions: positions,
              updatedDate: updatedDate,
              currentValue: currentValue
            },
            err => {
              if (err) {
                console.error(err);
              } else {
                console.log(`Updated ${e.name} successfully`);
              }
            }
          );
        });
      });
    })
    .catch(err => {
      console.error(err);
    });
}

function calculatePortfolio(portfolio, tickers, totalMarketCap) {
  if (_.isEmpty(portfolio.positions)) {
    var positions = [];
    tickers.forEach((e, i) => {
      if (i >= portfolio.limit) return;
      var percentage =
        1 - (totalMarketCap - parseFloat(e.market_cap_nok)) / totalMarketCap;
      var amount = percentage * portfolio.capital / parseFloat(e.price_nok);
      var position = {
        id: e.id,
        position: [amount, parseFloat(e.price_nok)]
      };
      positions.push(position);
    });
    return positions;
  } else {
    var positions = portfolio.positions;
    var currentCapital = 0;
    positions.forEach(el => {
      tickers.forEach(e => {
        if (!(e.id === el.id)) return;
        currentCapital += el.position[el.position.length - 2] * e.price_nok;
      });
    });
    positions.forEach(el => {
      tickers.forEach((e, i) => {
        if (!(e.id === el.id) || i > portfolio.limit) return;
        var percentage =
          1 - (totalMarketCap - parseFloat(e.market_cap_nok)) / totalMarketCap;
        var amount = percentage * currentCapital / parseFloat(e.price_nok);
        var position = [amount, parseFloat(e.price_nok)];
        el.position.push(...position);
      });
    });
    return positions;
  }
}

function calculateCurrentValue(portfolio) {
  var currentValue = 0;
  portfolio.positions.forEach(e => {
    currentValue +=
      e.position[e.position.length - 1] * e.position[e.position.length - 2];
  });
  return currentValue;
}
