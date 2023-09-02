const UserAgent = require("user-agents");
const { chromium } = require("playwright");
const { getProduct } = require("./getProduct");

const browserArgs = [
    "--disable-blink-features=AutomationControlled" // navigator.webdriver = false
];

const navigate = async (page, department, category) => {
    await page.locator("a#nav-hamburger-menu").click();
    await new Promise(resolve => setTimeout(resolve, 2000));

    await page.getByRole("link", { name: department }).click();
    await new Promise(resolve => setTimeout(resolve, 2000));

    const categoryLink = page.getByRole("link", { name: category }).nth(1);
    const navigation = page.waitForURL(
        `https://www.amazon.com${await categoryLink.getAttribute("href")}`
    );
    await categoryLink.click();
    await navigation;
};

/**
 * @param {String} department
 * @param {String} [category]
 * @returns {Promise<Array<Product>}
 */
exports.getProducts = async (department, category) => {
    const browser = await chromium.launch({ headless: false, args: browserArgs });
    const context = await browser.newContext({
        userAgent: new UserAgent({ deviceCategory: "desktop" }).toString()
    });
    const page = await context.newPage();

    await page.goto("https://www.amazon.com", { waitUntil: "load" });
    await navigate(page, department, category);

    const uidToProduct = new Map();

    const next = page.getByRole("link", { name: "Next" });

    while (true) {
        try {
            const nextPath = await next.getAttribute("href", { timeout: 10000 });

            const productLinks = await page.evaluate(() => Array.from(
                document.querySelectorAll("span[data-component-type='s-product-image'] a"),
                a => `https://www.amazon.com${a.getAttribute("href")}`
            ));

            for (const link of productLinks) {
                const product = await getProduct(context, link);
                uidToProduct.set(product.id, product);
                await new Promise(r => setTimeout(r, Math.random() * 4000 + 1000));
            }

            await new Promise(r => setTimeout(r, Math.random() * 4000 + 1000));

            const nextPage = page.waitForURL(`https://www.amazon.com${nextPath}`);
            await next.click();
            await nextPage;
        } catch (error) {
            break;
        }
    }

    await context.close();
    await browser.close();

    return Array.from(uidToProduct.values());
};