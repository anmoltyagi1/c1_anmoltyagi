const calculatePoints = require("./calculatePoints.js");
// const serverless = require("serverless-http");
const PORT = process.env.PORT || 3001;
const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const r = Router();

// Middleware to parse JSON in the request body

r.get("/api", (req, res) => {
  res.json({ message: "Hello from Express!" });
});

r.get("/", (req, res) => {
  res.json({ message: "This is a test" });
});

r.post("/calculate", async (req, res) => {
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

module.exports = r;
