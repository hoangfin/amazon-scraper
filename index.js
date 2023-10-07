const express = require("express");
const { getProducts } = require("./src/getProducts");
const { asyncHandler } = require("./src/utils");

const app = express();
const port = 3000;

app.get("/getProducts", asyncHandler(async (req, res, next) => {
    const department = req.query.department;

    if (!department) {
        return res.status(400).json({ error: "Missing query parameter: Query parameter 'department' is required" });
    }

    const products = await getProducts(department, req.query.category);

    // Set the headers to indicate a file download
    res.setHeader("Content-disposition", "attachment; filename=products.json");
    res.setHeader("Content-type", "application/json");

    // Send the JSON data as a response
    res.send(JSON.stringify(products));
}));

app.listen(port, () => {
    console.log(`Amazon Scraper is listening on port ${port}`);
});
