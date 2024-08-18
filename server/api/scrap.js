const puppeteer = require("puppeteer");

// function delay(time) {
//   return new Promise(function (resolve) {
//     setTimeout(resolve, time);
//   });
// }

const scrapNoFrills = async (items) => {
  const url = `https://www.nofrills.ca/search?search-bar=`;
  let browser;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    const lowestPricedProducts = [];

    for (const item of items) {
      console.log(`start waiting for ${item}`);
      await page.goto(`${url}${item}`);
      await page.waitForSelector(".css-epcqr3", { timeout: 8_000 });
      console.log(`done waiting for ${item}`);

      const productNames = await page.evaluate(() => {
        const aTags = document.querySelectorAll(".css-epcqr3 a");
        return Array.from(aTags)
          .slice(0, 10)
          .map((a) => {
            const productName = a.querySelector("h3").innerText;
            return { productName };
          });
      });

      const prices = await page.evaluate(() => {
        const priceTags = document.querySelectorAll(
          ".css-epcqr3 .css-8atqhb p"
        );
        return Array.from(priceTags)
          .slice(0, 10)
          .map((p) => {
            const priceText = p.innerText;
            const newlineIndex = priceText.indexOf("\n");

            if (newlineIndex !== -1) {
              const price = priceText.substring(
                priceText.indexOf("$"),
                newlineIndex
              );
              return { price };
            } else {
              return null;
            }
          })
          .filter((price) => price !== null);
      });

      const products = productNames
        .map((product, index) => {
          if (product.productName.toLowerCase().includes(item.toLowerCase())) {
            return {
              productName: item,
              price: prices[index]
                ? prices[index].price
                : "Price Not Available",
            };
          }
          return null;
        })
        .filter(
          (product) =>
            product !== null && product.price !== "Price Not Available"
        );

      if (products.length > 0) {
        const pricesNum = products.map((product) =>
          parseFloat(product.price.replace("$", ""))
        );
        const minPrice = Math.min(...pricesNum);
        const lowestPricedProduct = products.find(
          (product) => parseFloat(product.price.replace("$", "")) === minPrice
        );

        lowestPricedProducts.push(lowestPricedProduct);
      } else {
        lowestPricedProducts.push({
          productName: item,
          price: "Price Not Available",
        });
      }
    }
  } catch (error) {
    console.error("Error during scraping:", error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  return lowestPricedProducts;
};

const scrapFreshCo = async (items) => {
  const url = `https://freshco.com/flyer/`;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const lowestPricedProducts = [];

  for (const item of items) {
    await page.goto(url);
    console.log(`start waiting for ${item}`);
    await page.waitForSelector("[title='Main Panel']", { timeout: 10_000 });

    await page.waitForFunction(
      () => {
        const iframe = document.querySelector("[title='Main Panel']");
        const iframeDocument =
          iframe.contentDocument || iframe.contentWindow.document;
        return iframeDocument.querySelectorAll("button").length > 0;
      },
      { timeout: 10_000 }
    );

    console.log(`done waiting for ${item}`);

    const products = await page.evaluate((item) => {
      const iframe = document.querySelector("[title='Main Panel']");
      const iframeDocument =
        iframe.contentDocument || iframe.contentWindow.document;

      const buttons = iframeDocument.querySelectorAll("button");
      return Array.from(buttons)
        .slice(2)
        .map((button) => {
          const product = button.getAttribute("aria-label");
          const productName = item;
          const productFullName = product.substring(0, product.indexOf(","));
          const price = product
            .substring(product.lastIndexOf("$"))
            .split(" ")[0];

          if (productFullName.toLowerCase().includes(item.toLowerCase())) {
            return { productName, price };
          }

          return null;
        })
        .filter(
          (product) =>
            product !== null && product.price !== "Price Not Available"
        );
    }, item);

    if (products.length > 0) {
      const pricesNum = products.map((product) =>
        parseFloat(product.price.replace("$", ""))
      );
      const minPrice = Math.min(...pricesNum);
      const lowestPricedProduct = products.find(
        (product) => parseFloat(product.price.replace("$", "")) === minPrice
      );

      lowestPricedProducts.push(lowestPricedProduct);
    } else {
      lowestPricedProducts.push({
        productName: item,
        price: "Price Not Available",
      });
    }
  }

  await browser.close();
  return lowestPricedProducts;
};

const scrapFoodBasics = async (items) => {
  const url = `https://www.foodbasics.ca/search?filter=`;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const lowestPricedProducts = [];

  for (const item of items) {
    await page.goto(`${url}${item}`);
    console.log(`start waiting for ${item}`);
    await page.waitForSelector(".head__title", { timeout: 10_000 });
    console.log(`done waiting for ${item}`);

    const productNames = await page.evaluate(() => {
      const nameTags = document.querySelectorAll(".head__title");
      return Array.from(nameTags)
        .slice(0, 5)
        .map((names) => {
          const productName = names.innerText;
          return { productName };
        });
    });

    const prices = await page.evaluate(() => {
      const priceTags = document.querySelectorAll(".price-update");
      return Array.from(priceTags)
        .slice(0, 5)
        .map((p) => {
          const price = p.innerText;
          return { price };
        });
    });

    const products = productNames
      .map((product, index) => {
        if (product.productName.toLowerCase().includes(item.toLowerCase())) {
          return {
            productName: item,
            price: prices[index] ? prices[index].price : "Price Not Available",
          };
        }
        return null;
      })
      .filter(
        (product) => product !== null && product.price !== "Price Not Available"
      );

    if (products.length > 0) {
      const pricesNum = products.map((product) =>
        parseFloat(product.price.replace("$", ""))
      );
      const minPrice = Math.min(...pricesNum);
      const lowestPricedProduct = products.find(
        (product) => parseFloat(product.price.replace("$", "")) === minPrice
      );

      lowestPricedProducts.push(lowestPricedProduct);
    } else {
      lowestPricedProducts.push({
        productName: item,
        price: "Price Not Available",
      });
    }
  }

  await browser.close();
  return lowestPricedProducts;
};

const scrapTNT = async (items) => {
  const url = `https://www.tntsupermarket.com/eng/search.html?query=`;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const lowestPricedProducts = [];

  for (const item of items) {
    await page.goto(`${url}${item}`);
    console.log(`start waiting for ${item}`);
    await page.waitForSelector(".item-itemDetails-A5Y", { timeout: 10_000 });
    console.log(`done waiting for ${item}`);

    const productNames = await page.evaluate(() => {
      const nameTags = document.querySelectorAll(".item-name--yq");
      return Array.from(nameTags)
        .slice(0, 5)
        .map((names) => {
          const productName = names.innerText;
          return { productName };
        });
    });

    const prices = await page.evaluate(() => {
      const priceTags = document.querySelectorAll(".item-price-zRu");
      return Array.from(priceTags)
        .slice(0, 5)
        .map((p) => {
          const price = p.innerText;
          return { price };
        });
    });

    const products = productNames
      .map((product, index) => {
        if (product.productName.toLowerCase().includes(item.toLowerCase())) {
          return {
            productName: item,
            price: prices[index] ? prices[index].price : "Price Not Available",
          };
        }
        return null;
      })
      .filter(
        (product) => product !== null && product.price !== "Price Not Available"
      );

    if (products.length > 0) {
      const pricesNum = products.map((product) =>
        parseFloat(product.price.replace("$", ""))
      );
      const minPrice = Math.min(...pricesNum);
      const lowestPricedProduct = products.find(
        (product) => parseFloat(product.price.replace("$", "")) === minPrice
      );

      lowestPricedProducts.push(lowestPricedProduct);
    } else {
      lowestPricedProducts.push({
        productName: item,
        price: "Price Not Available",
      });
    }
  }

  await browser.close();
  return lowestPricedProducts;
};

module.exports = { scrapNoFrills, scrapFreshCo, scrapFoodBasics, scrapTNT };
