const calculatePoints = require("./calculatePoints.js");
const express = require("express");
// const PORT = process.env.PORT || 3001;
const app = express();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Middleware to parse JSON in the request body
app.use(express.json());

// app.listen(PORT, () => {
//   console.log(`Server listening on ${PORT}`);
// });

app.get("/api", (req, res) => {
  res.json({ message: "Hello from Express!" });
});

app.post("/calculate", async (req, res) => {
  try {
    const { transactions } = req.body;
    const result = await calculatePoints(transactions);

    res.json({ message: "Points calculated successfully", result });
  } catch (error) {
    console.error("Error calculating points:", error);
    res
      .status(500)
      .json({ message: "Error calculating points", error: error.message });
  }
});

module.exports = app;
