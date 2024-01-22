const express = require("express");
const api = require("./api");
const app = express();
const cors = require("cors");
// Middleware to parse JSON in the request body
app.use(express.json());

app.use(cors());

app.use("/", api);

app.listen(3001, () => {
  console.log(`Server listening on 3001`);
});

// module.exports.handler = serverless(app);
module.exports = app;
