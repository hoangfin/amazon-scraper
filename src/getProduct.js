const { v5: uuidv5 } = require("uuid");
const { NAMESPACE } = require("./namespace");

/**
 * @param {import("playwright").BrowserContext} context
 * @returns {Promise<Product>}
 */
exports.getProduct = async (context, productUrl) => {
    const page = await context.newPage();
    await page.goto(productUrl, { waitUntil: "load" });

    for (const li of await page.locator("#altImages ul li[data-csa-c-action='image-block-alt-image-hover']").all()) {
        await li.hover();
        await new Promise(r => setTimeout(r, Math.random() * 4000 + 1000));
    }

    await page.exposeFunction("uuidv5", uuidv5);

    const product = await page.evaluate(async (ns) => {
        const asin = Array.from(document.querySelectorAll("#prodDetails tr")).find(tr => tr.textContent === "ASIN")
        const uuid = await window.uuidv5(document.querySelector("#attach-baseAsin").value, ns);

        return {
            id: uuid,
            uuid,
            title: document.querySelector("#productTitle")?.textContent.trim() || "",
            price: document.querySelector(".priceToPay > span")?.textContent.trim() || null,
            ratingScore: parseFloat(document.querySelector("#averageCustomerReviews a > span")?.textContent.trim() || 999.99),
            images: Array.from(
                document.querySelectorAll("#main-image-container ul li[class*='itemNo']"),
                li => li.querySelector("img").getAttribute("src")
            ) || [],
            overview: (() => {
                const data = {};
                document.querySelectorAll("#productOverview_feature_div tr")?.forEach(row => {
                    data[row.firstElementChild.textContent.trim()] = row.lastElementChild.textContent.trim()
                });
                return data;
            })(),
            features: Array.from(document.querySelectorAll("#feature-bullets ul li"), li => li.textContent.trim()) || []
        };
    }, NAMESPACE);

    await page.close();
    return product;
};