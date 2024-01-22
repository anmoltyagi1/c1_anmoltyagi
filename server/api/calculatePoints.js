const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function calculatePoints(transactions) {
  // Retrieve rules from the database
  const rulesFromDB = await prisma.rules.findMany({});
  const rules = rulesFromDB.slice();

  // Dynamic programming memoization
  const memoizationMap = new Map();

  // Track money spent for each merchant
  const totalMoneySpentPerMerchant = {};

  // Calculate points for each transaction
  const transactionPoints = [];

  // Calculate money spent for each merchant and populate transactionPoints
  for (const transactionId in transactions) {
    const transaction = transactions[transactionId];
    const merchantToPrice = {
      [transaction.merchant_code]: Math.floor(transaction.amount_cents / 100),
    };

    // Add points for each transaction
    transactionPoints.push(
      calculateMaxPoints(merchantToPrice, 0, new Set(), [])
    );

    const merchantCode = transaction.merchant_code;
    const amountInDollars = transaction.amount_cents / 100;

    totalMoneySpentPerMerchant[merchantCode] =
      (totalMoneySpentPerMerchant[merchantCode] || 0) + amountInDollars;
  }

  // Round money spent for each merchant to the nearest dollar and add to hashmap
  for (const transaction in transactions) {
    totalMoneySpentPerMerchant[transactions[transaction].merchant_code] =
      Math.floor(
        totalMoneySpentPerMerchant[transactions[transaction].merchant_code]
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
    const remainingMoneyCopy = Object.assign({}, remainingMoney); // create a copy of the remaining money

    for (const merchant in ruleDefinition) {
      // iterate over the merchant in the rule
      if (
        !remainingMoney.hasOwnProperty(merchant) ||
        remainingMoney[merchant] < ruleDefinition[merchant]
      ) {
        // if the merchant is not in the remaining money or the remaining money is less than the rule definition
        return [0, remainingMoney];
      }
      remainingMoneyCopy[merchant] -= ruleDefinition[merchant]; // subtract the rule definition from the remaining money
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
    // Check to see if rules can be applied (BASE CASE)
    for (const merchant in remainingMoney) {
      if (remainingMoney[merchant] > 1) {
        break;
      }
      if (index === Object.keys(remainingMoney).length - 1) {
        // if the index is equal to the length of the remaining money then return the points and used rules
        return [points, usedRules];
      }
      index += 1;
    }

    let maxPoints = 0;
    let resultMap = Object.assign({}, usedRules);

    if (memoizationMap.has(JSON.stringify([remainingMoney, excludedRules]))) {
      // if the memoization map has the remaining money and excluded rules
      return memoizationMap.get(
        JSON.stringify([remainingMoney, excludedRules])
      );
    }

    for (let i = 0; i < rules.length; i++) {
      // iterate over the extracted rules
      if (excludedRules.has(i + 1)) {
        continue;
      }
      let newUsedRules = Object.assign({}, usedRules);
      const [newPoints, newRemainingMoney] = isValidRule(
        // check if the rule is valid and applies
        rules[i],
        Object.assign({}, remainingMoney)
      );

      if (newPoints === 0) {
        // if the rule doesn't work, add it to the excluded rules
        excludedRules.add(i + 1);
      }
      if (newPoints > 0) {
        // if the rule works, add it to the used rules
        newUsedRules[rules[i].number] = newUsedRules[rules[i].number] || 0;
        newUsedRules[rules[i].number] += rules[i].number === 7 ? newPoints : 1;
      }

      let result = calculateMaxPoints(
        // recursively call the function
        newRemainingMoney,
        points + newPoints,
        new Set(excludedRules),
        newUsedRules
      );

      if (result[0] > maxPoints) {
        // if the result is greater than the max points, update the max points and result map
        maxPoints = result[0];
        resultMap = result[1];
      }

      memoizationMap.set(JSON.stringify([newRemainingMoney, excludedRules]), [
        maxPoints,
        resultMap,
      ]); // add the result to the memoization map
    }
    return [maxPoints, resultMap];
  }

  const result = calculateMaxPoints(
    totalMoneySpentPerMerchant,
    0,
    new Set(),
    []
  );
  return [result, transactionPoints];
}

module.exports = calculatePoints;
