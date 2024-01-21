const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function calculatePoints(transactions) {
  const moneySpent = {};
  for (const transactionId in transactions) {
    const transaction = transactions[transactionId];
    const merchantCode = transaction.merchant_code;
    const amountInDollars = transaction.amount_cents / 100;

    if (moneySpent.hasOwnProperty(merchantCode)) {
      // Merchant code already exists in moneySpent, add to the existing amount
      moneySpent[merchantCode] += amountInDollars;
    } else {
      // Merchant code is not in moneySpent, create a new entry
      moneySpent[merchantCode] = amountInDollars;
    }
  }

  for (const transactionId in transactions) {
    moneySpent[transactions[transactionId].merchant_code] = Math.floor(
      moneySpent[transactions[transactionId].merchant_code]
    );
  }

  // Rules
  const rulesFromDB = await prisma.rules.findMany({});
  const rulesExtracted = [];

  for (const rule of rulesFromDB) {
    rulesExtracted.push(rule);
  }

  function isRuleValid(rule, moneyLeft) {
    if (rule.number === 7) {
      let points = 0;
      for (const i in moneyLeft) {
        if (moneyLeft[i] >= 1) {
          points += moneyLeft[i];
          moneyLeft[i] = 0;
        }
      }
      return [points, moneyLeft];
    }
    if (rule.number === 3) console.log(rule, moneyLeft, rule.ruleDefinition);

    const { ruleDefinition, points } = rule;

    for (const key in ruleDefinition) {
      if (!moneyLeft.hasOwnProperty(key)) return [0, moneyLeft];
      if (moneyLeft[key] < ruleDefinition[key]) {
        return [0, moneyLeft];
      }
      moneyLeft[key] -= ruleDefinition[key];
    }
    if (rule.number === 3) console.log("here");
    return [points, moneyLeft];
  }

  const dp = new Map();
  console.log(moneySpent);

  // Calculate maximum value considering different rules
  function calculateMaxValue(moneyLeft, points, notToConsider, used) {
    let index = 0;
    for (const merchant in moneyLeft) {
      if (moneyLeft[merchant] > 1) {
        break;
      }
      if (index === Object.keys(moneyLeft).length - 1) {
        return [points, used];
      }
      index += 1;
    }

    let maximumPoints = 0;

    // Correct Map usage
    if (dp.has(JSON.stringify([moneyLeft, notToConsider]))) {
      return dp.get(JSON.stringify([moneyLeft, notToConsider]));
    }

    let resultMap = Object.assign({}, used);

    for (let i = 0; i < rulesExtracted.length; i++) {
      if (notToConsider.has(i + 1)) {
        continue;
      }
      let newUsed = Object.assign({}, used);
      const [newPoints, newMoney] = isRuleValid(
        rulesExtracted[i],
        Object.assign({}, moneyLeft)
      );

      if (newPoints === 0) notToConsider.add(i + 1);
      if (newPoints > 0) {
        if (rulesExtracted[i].number === 7) {
          if (newUsed.hasOwnProperty(rulesExtracted[i].number))
            newUsed[rulesExtracted[i].number] += newPoints;
          else newUsed[rulesExtracted[i].number] = newPoints;
        } else {
          if (newUsed.hasOwnProperty(rulesExtracted[i].number))
            newUsed[rulesExtracted[i].number] += 1;
          else newUsed[rulesExtracted[i].number] = 1;
        }
      }

      let result = calculateMaxValue(
        newMoney,
        points + newPoints,
        new Set(notToConsider),
        newUsed
      );
      if (result[0] > maximumPoints) {
        maximumPoints = result[0];
        resultMap = result[1];
      }

      dp.set(JSON.stringify([newMoney, notToConsider]), [
        maximumPoints,
        resultMap,
      ]);
    }
    // console.log(maximumPoints, used);
    return [maximumPoints, resultMap];
  }

  const value = calculateMaxValue(moneySpent, 0, new Set(), []);
  return value;
}

module.exports = calculatePoints;
