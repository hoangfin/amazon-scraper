const UserAgent = require("user-agents");
const { chromium } = require("playwright");
const { getProduct } = require("../src/getProduct");

const browserArgs = [
    "--disable-blink-features=AutomationControlled" // navigator.webdriver = false
];

(async () => {
    const browser = await chromium.launch({ headless: false, args: browserArgs });

    const context = await browser.newContext({
        userAgent: new UserAgent({ deviceCategory: "desktop" }).toString()
    });

    const product = await getProduct(context, process.argv[2]);
    console.log(product);

    await context.close();
    await browser.close();
})();
