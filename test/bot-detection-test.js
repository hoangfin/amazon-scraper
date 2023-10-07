const nodePath = require("node:path");
const UserAgent = require("user-agents");
const { chromium } = require("playwright");

const browserArgs = [
    "--disable-blink-features=AutomationControlled" // navigator.webdriver = false
];

(async () => {
    const browser = await chromium.launch({ headless: false, args: browserArgs });

    const context = await browser.newContext({
        userAgent: new UserAgent({ deviceCategory: "mobile" }).toString()
    });

    const page = await context.newPage();
    await page.goto("https://bot.sannysoft.com/");
    await new Promise(resolve => setTimeout(resolve, 10000));
    await page.screenshot({ path: nodePath.resolve(__dirname, "bot-detection-test.png"), fullPage: true });

    await context.close();
    await browser.close();
})();
