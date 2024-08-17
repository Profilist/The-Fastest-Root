const express = require('express');
const app = express();
const PORT = 8080;
const cors = require('cors');
const {scrapNoFrills, scrapFreshCo, scrapFoodBasics, scrapTNT} = require('./scrap');

app.use(cors());

app.get("/api/home", (req, res) => {
    res.json({ message: "Welcome to the home page!" });
});

app.get("/api/scrap", async (req, res) => {
    const items = req.query.items.split(',');

    const pricesNoFrills = await scrapNoFrills(items);
    const pricesFreshCo = await scrapFreshCo(items);
    const pricesFoodBasics = await scrapFoodBasics(items);
    const pricesTNT = await scrapTNT(items);

    console.log("done prices");
    
    res.json({
        noFrills: pricesNoFrills,
        freshCo: pricesFreshCo,
        foodBasics: pricesFoodBasics,
        tnt: pricesTNT
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})