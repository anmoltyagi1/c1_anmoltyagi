const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function calculatePoints(transactions) {
  // Retrieve rules from the database
  const rulesFromDB = await prisma.rules.findMany({});
  const extractedRules = rulesFromDB.slice();

  // Dynamic programming memoization
  const memoizationMap = new Map();

  // Track money spent for each merchant
  const moneySpent = {};

  // Calculate points for each transaction
  const transactionPoints = [];

  // Calculate money spent for each merchant and populate transactionPoints
  for (const transactionId in transactions) {
    const transaction = transactions[transactionId];
    const merchantToPrice = {
      [transaction.merchant_code]: Math.floor(transaction.amount_cents / 100),
    };

    transactionPoints.push(
      calculateMaxPoints(merchantToPrice, 0, new Set(), [])
    );

    const merchantCode = transaction.merchant_code;
    const amountInDollars = transaction.amount_cents / 100;

    moneySpent[merchantCode] =
      (moneySpent[merchantCode] || 0) + amountInDollars;
  }

  // Round money spent for each merchant to the nearest dollar
  for (const transactionId in transactions) {
    moneySpent[transactions[transactionId].merchant_code] = Math.floor(
      moneySpent[transactions[transactionId].merchant_code]
    );
  }

  // Function to check if a rule is valid and calculate points
  function isValidRule(rule, remainingMoney) {
    if (rule.number === 7) {
      let points = 0;
      for (const merchant in remainingMoney) {
        if (remainingMoney[merchant] >= 1) {
          points += remainingMoney[merchant];
          remainingMoney[merchant] = 0;
        }
      }
      return [points, remainingMoney];
    }

    const { ruleDefinition, points } = rule;
    const remainingMoneyCopy = Object.assign({}, remainingMoney);

    for (const merchant in ruleDefinition) {
      if (
        !remainingMoney.hasOwnProperty(merchant) ||
        remainingMoney[merchant] < ruleDefinition[merchant]
      ) {
        return [0, remainingMoney];
      }
      remainingMoneyCopy[merchant] -= ruleDefinition[merchant];
    }
    return [points, remainingMoneyCopy];
  }

  // Calculate maximum value considering different rules
  function calculateMaxPoints(
    remainingMoney,
    points,
    excludedRules,
    usedRules
  ) {
    let index = 0;
    // Check to see if rules can be applied
    for (const merchant in remainingMoney) {
      if (remainingMoney[merchant] > 1) {
        break;
      }
      if (index === Object.keys(remainingMoney).length - 1) {
        return [points, usedRules];
      }
      index += 1;
    }

    let maxPoints = 0;
    let resultMap = Object.assign({}, usedRules);

    if (memoizationMap.has(JSON.stringify([remainingMoney, excludedRules]))) {
      return memoizationMap.get(
        JSON.stringify([remainingMoney, excludedRules])
      );
    }

    for (let i = 0; i < extractedRules.length; i++) {
      if (excludedRules.has(i + 1)) {
        continue;
      }
      let newUsedRules = Object.assign({}, usedRules);
      const [newPoints, newRemainingMoney] = isValidRule(
        extractedRules[i],
        Object.assign({}, remainingMoney)
      );

      if (newPoints === 0) {
        excludedRules.add(i + 1);
      }
      if (newPoints > 0) {
        newUsedRules[extractedRules[i].number] =
          newUsedRules[extractedRules[i].number] || 0;
        newUsedRules[extractedRules[i].number] +=
          extractedRules[i].number === 7 ? newPoints : 1;
      }

      let result = calculateMaxPoints(
        newRemainingMoney,
        points + newPoints,
        new Set(excludedRules),
        newUsedRules
      );

      if (result[0] > maxPoints) {
        maxPoints = result[0];
        resultMap = result[1];
      }

      memoizationMap.set(JSON.stringify([newRemainingMoney, excludedRules]), [
        maxPoints,
        resultMap,
      ]);
    }
    return [maxPoints, resultMap];
  }

  const result = calculateMaxPoints(moneySpent, 0, new Set(), []);
  return [result, transactionPoints];
}

module.exports = calculatePoints;
