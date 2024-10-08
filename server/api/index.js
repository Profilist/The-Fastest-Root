const express = require("express");
const app = express();
const PORT = 8080;
const cors = require("cors");
const {
  scrapNoFrills,
  scrapFreshCo,
  scrapFoodBasics,
  scrapTNT,
} = require("./scrap");
const { cheapestRouteCalculator, calculateSavings } = require("./route");

app.use(cors());

app.get("/api/locations", (req, res) => {
    res.json({ locations: ["No Frills", "Food Basics", "FreshCo", "TNT"] });
  });

app.get("/api/scrap", async (req, res) => {
  const items = req.query.items.split(",");
  const maxStores = req.query.maxStores;

  const pricesNoFrills = await scrapNoFrills(items);
  // const pricesFreshCo = await scrapFreshCo(items);
  // const pricesFoodBasics = await scrapFoodBasics(items);
  // const pricesTNT = await scrapTNT(items);

  // const ret = cheapestRouteCalculator(
  //   pricesNoFrills,
  //   pricesFreshCo,
  //   pricesFoodBasics,
  //   pricesTNT,
  //   maxStores
  // );
  const ret = cheapestRouteCalculator(
    pricesNoFrills,
    pricesNoFrills,
    pricesNoFrills,
    pricesNoFrills,
    maxStores
  );

  // const savings = calculateSavings(
  //   pricesNoFrills,
  //   pricesFreshCo,
  //   pricesFoodBasics,
  //   pricesTNT
  // );
  const savings = calculateSavings(
    pricesNoFrills,
    pricesNoFrills,
    pricesNoFrills,
    pricesNoFrills
  );

  console.log(ret);
  console.log(savings);

  res.json({
    ret,
    savings
  });
});

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

module.exports = app;