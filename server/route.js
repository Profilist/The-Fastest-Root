function parsePrice(priceString) {
    if (priceString.charAt(0) !== "$") {
        return 100;
    }
    return parseFloat(priceString.replace('$', ''));
}

function cheapestRouteCalculator(firstStore, secondStore, thirdStore, fourthStore, maxNumberOfStores) {
    if (!maxNumberOfStores || isNaN(parseInt(maxNumberOfStores))) {
        maxNumberOfStores = 4;
    } else {
        maxNumberOfStores = parseInt(maxNumberOfStores);
    }

    if (maxNumberOfStores > 4 || maxNumberOfStores < 1) {
        maxNumberOfStores = 4;
    }
    console.log(maxNumberOfStores);

    const AllStores = [firstStore, secondStore, thirdStore, fourthStore];
    const StoreNames = ["NoFrills", "FreshCo", "Food Basics", "T&T"];

    if (maxNumberOfStores === 2) {
        let minimum_cheapest_price = 10000;
        let pathInstructions = [];

        for (let i = 0; i < 4; i++) {
            for (let a = i + 1; a < 4; a++) {
                let store_info = [];
                let cheapest_price = 0;

                for (let b = 0; b < firstStore.length; b++) {
                    const price1 = parsePrice(AllStores[i][b].price);
                    const price2 = parsePrice(AllStores[a][b].price);

                    if (price1 < price2) {
                        cheapest_price += price1;
                        store_info.push({ store: StoreNames[i], productName: AllStores[i][b].productName, price: AllStores[i][b].price });
                    } else {
                        cheapest_price += price2;
                        store_info.push({ store: StoreNames[a], productName: AllStores[a][b].productName, price: AllStores[a][b].price });
                    }
                }

                if (cheapest_price < minimum_cheapest_price) {
                    minimum_cheapest_price = cheapest_price;
                    pathInstructions = store_info;
                    console.log(minimum_cheapest_price);
                    console.log(pathInstructions);
                }
            }
        }
        return pathInstructions;
    } else if (maxNumberOfStores === 3) {
        let minimum_cheapest_price = 10000;
        let pathInstructions = [];

        for (let i = 0; i < 2; i++) {
            for (let a = i + 1; a < 3; a++) {
                for (let j = a + 1; j < 4; j++) {
                    let store_info = [];
                    let cheapest_price = 0;

                    for (let b = 0; b < firstStore.length; b++) {
                        const prices = [
                            parsePrice(AllStores[i][b].price),
                            parsePrice(AllStores[a][b].price),
                            parsePrice(AllStores[j][b].price)
                        ];
                        const min_price = Math.min(...prices);
                        const min_index = prices.indexOf(min_price);

                        store_info.push({ store: StoreNames[[i, a, j][min_index]], productName: AllStores[[i, a, j][min_index]][b].productName, price: AllStores[[i, a, j][min_index]][b].price });
                        cheapest_price += min_price;
                    }

                    if (cheapest_price < minimum_cheapest_price) {
                        minimum_cheapest_price = cheapest_price;
                        pathInstructions = store_info;
                        console.log(minimum_cheapest_price);
                        console.log(pathInstructions);
                    }
                }
            }
        }
        return pathInstructions;
    } else if (maxNumberOfStores === 1) {
        let minimum_cheapest_price = 10000;
        let pathInstructions = [];

        for (let i = 0; i < 4; i++) {
            let price = 0;
            let store_info = [];

            for (let b = 0; b < firstStore.length; b++) {
                const itemPrice = parsePrice(AllStores[i][b].price);
                price += itemPrice;
                store_info.push({ store: StoreNames[i], productName: AllStores[i][b].productName, price: AllStores[i][b].price });
            }

            if (price < minimum_cheapest_price) {
                minimum_cheapest_price = price;
                pathInstructions = store_info;
                console.log(minimum_cheapest_price);
                console.log(pathInstructions);
            }
        }
        return pathInstructions;
    } else if (maxNumberOfStores === 4) {
        let store_info = [];

        for (let b = 0; b < firstStore.length; b++) {
            const prices = [
                parsePrice(AllStores[0][b].price),
                parsePrice(AllStores[1][b].price),
                parsePrice(AllStores[2][b].price),
                parsePrice(AllStores[3][b].price)
            ];
            const min_price = Math.min(...prices);
            const min_index = prices.indexOf(min_price);

            store_info.push({ store: StoreNames[min_index], productName: AllStores[min_index][b].productName, price: AllStores[min_index][b].price });
        }

        return store_info;
    }
}

module.exports = { cheapestRouteCalculator };
