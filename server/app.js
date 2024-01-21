const express = require("express");
const api = require("./api");
const app = express();

// Middleware to parse JSON in the request body
app.use(express.json());

app.use("/", api);

// module.exports.handler = serverless(app);
module.exports = app;
