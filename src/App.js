import React, { useEffect, useState } from 'react';
import {
  ChakraProvider,
  theme,
  Box,
  Text,
  Button,
  Heading,
  VStack,
  Table,
  Textarea,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';

function App() {
  const [transactions, setTransactions] = useState('');
  const [isTransactionInputted, setIsTransactionInputted] = useState(false);
  const [parsedTransactions, setParsedTransactions] = useState(null);
  const [disableButton, setDisabledButton] = useState(true);

  useEffect(() => {
    // Your useEffect logic here (if needed)
    // For example, you can perform calculations or API calls here
  }, [transactions]);

  function handleTransactionInput() {
    try {
      let parsed = JSON.parse(transactions);
      setParsedTransactions(parsed);
      setIsTransactionInputted(true);
    } catch (error) {
      console.error('Error parsing JSON:', error.message);
    }
  }

  function renderInputUI() {
    return (
      <VStack spacing={4} align="center">
        <img src="Capital_One_logo.svg" width={250} alt="Capital One Logo" />
        <Heading size="lg">Enter Transaction History For a Month</Heading>
        <Textarea
          size="lg"
          rows={15}
          height="auto"
          className="tw-w-full tw-h-full"
          value={transactions}
          placeholder={`
          {
            "T01": {"date": "2021-05-01", "merchant_code" : "sportcheck", "amount_cents": 21000},
            .
            .
            .`}
          onChange={event => {
            setTransactions(event.target.value.replace(/'/g, '"'));

            try {
              event.target.value = JSON.stringify(
                JSON.parse(event.target.value.replace(/'/g, '"')),
                null,
                2
              );
              setDisabledButton(false);
            } catch (error) {
              setDisabledButton(true);
            }
          }}
        />

        <Button
          colorScheme="teal"
          onClick={handleTransactionInput}
          isDisabled={disableButton}
        >
          Calculate
        </Button>

        <Button
          colorScheme="teal"
          onClick={() => {
            setTransactions(
              JSON.stringify(
                {
                  T1: {
                    date: '2021-05-09',
                    merchant_code: 'sportcheck',
                    amount_cents: 7326,
                  },
                  T2: {
                    date: '2021-05-10',
                    merchant_code: 'tim_hortons',
                    amount_cents: 1321,
                  },
                },
                null,
                2
              )
            );
            setDisabledButton(false);
          }}
        >
          Example 1
        </Button>

        <Button
          colorScheme="teal"
          onClick={() => {
            setTransactions(
              JSON.stringify(
                {
                  T01: {
                    date: '2021-05-01',
                    merchant_code: 'sportcheck',
                    amount_cents: 21000,
                  },
                  T02: {
                    date: '2021-05-02',
                    merchant_code: 'sportcheck',
                    amount_cents: 8700,
                  },
                  T03: {
                    date: '2021-05-03',
                    merchant_code: 'tim_hortons',
                    amount_cents: 323,
                  },
                  T04: {
                    date: '2021-05-04',
                    merchant_code: 'tim_hortons',
                    amount_cents: 1267,
                  },
                  T05: {
                    date: '2021-05-05',
                    merchant_code: 'tim_hortons',
                    amount_cents: 2116,
                  },
                  T06: {
                    date: '2021-05-06',
                    merchant_code: 'tim_hortons',
                    amount_cents: 2211,
                  },
                  T07: {
                    date: '2021-05-07',
                    merchant_code: 'subway',
                    amount_cents: 1853,
                  },
                  T08: {
                    date: '2021-05-08',
                    merchant_code: 'subway',
                    amount_cents: 2153,
                  },
                  T09: {
                    date: '2021-05-09',
                    merchant_code: 'sportcheck',
                    amount_cents: 7326,
                  },
                  T10: {
                    date: '2021-05-10',
                    merchant_code: 'tim_hortons',
                    amount_cents: 1321,
                  },
                },
                null,
                2
              )
            );
            setDisabledButton(false);
          }}
        >
          {' '}
          Example 2
        </Button>

        {disableButton && (
          <Text color="red">Please enter a valid JSON transaction</Text>
        )}
      </VStack>
    );
  }

  function renderDifferentUI() {
    const value = calculatePoints(parsedTransactions);
    return (
      <VStack spacing={4} align="center">
        {parsedTransactions && (
          <Box>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Transaction</Th>
                    <Th>Date</Th>
                    <Th>Merchant Code</Th>
                    <Th isNumeric>Amount (cents)</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Object.entries(parsedTransactions).map(([key, value]) => (
                    <Tr key={key}>
                      <Td>{key}</Td>
                      <Td>{value.date}</Td>
                      <Td>{value.merchant_code}</Td>
                      <Td isNumeric>{value.amount_cents}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        )}

        <Text fontSize="xl">Total Points: {value}</Text>

        <Button
          onClick={() => {
            setIsTransactionInputted(false);
            setTransactions('');
          }}
        >
          Recalculate
        </Button>
      </VStack>
    );
  }

  return (
    <ChakraProvider theme={theme}>
      <Box p={8}>
        {isTransactionInputted ? renderDifferentUI() : renderInputUI()}
      </Box>
    </ChakraProvider>
  );
}

export default App;

function calculatePoints(transactions) {
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

  function rule1(moneyLeft) {
    if (
      moneyLeft.sportcheck >= 75 &&
      moneyLeft.tim_hortons >= 25 &&
      moneyLeft.subway >= 25
    ) {
      moneyLeft.sportcheck -= 75;
      moneyLeft.tim_hortons -= 25;
      moneyLeft.subway -= 25;
      return [500, moneyLeft];
    } else {
      return [0, moneyLeft];
    }
  }

  function rule2(moneyLeft) {
    if (moneyLeft.sportcheck >= 75 && moneyLeft.tim_hortons >= 25) {
      moneyLeft.sportcheck -= 75;
      moneyLeft.tim_hortons -= 25;
      return [300, moneyLeft];
    } else {
      return [0, moneyLeft];
    }
  }

  function rule3(moneyLeft) {
    if (moneyLeft.sportcheck >= 75) {
      moneyLeft.sportcheck -= 75;
      return [200, moneyLeft];
    } else {
      return [0, moneyLeft];
    }
  }

  function rule4(moneyLeft) {
    if (
      moneyLeft.sportcheck >= 25 &&
      moneyLeft.tim_hortons >= 10 &&
      moneyLeft.subway >= 10
    ) {
      moneyLeft.sportcheck -= 25;
      moneyLeft.tim_hortons -= 10;
      moneyLeft.subway -= 10;
      return [150, moneyLeft];
    } else {
      return [0, moneyLeft];
    }
  }

  function rule5(moneyLeft) {
    if (moneyLeft.sportcheck >= 25 && moneyLeft.tim_hortons >= 10) {
      moneyLeft.sportcheck -= 25;
      moneyLeft.tim_hortons -= 10;
      return [75, moneyLeft];
    } else {
      return [0, moneyLeft];
    }
  }

  function rule6(moneyLeft) {
    if (moneyLeft.sportcheck >= 20) {
      moneyLeft.sportcheck -= 20;
      return [75, moneyLeft];
    } else {
      return [0, moneyLeft];
    }
  }

  function rule7(moneyLeft) {
    let points = 0;
    for (const i in moneyLeft) {
      if (moneyLeft[i] >= 1) {
        points += moneyLeft[i];
        moneyLeft[i] = 0;
      }
    }
    return [points, moneyLeft];
  }

  // Example usage:
  const rules = [rule1, rule2, rule3, rule4, rule5, rule6, rule7];

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
        return points;
      }
      index += 1;
    }

    let maximumPoints = 0;

    // Correct Map usage
    if (dp.has(JSON.stringify([moneyLeft, notToConsider]))) {
      return dp.get(JSON.stringify([moneyLeft, notToConsider]));
    }

    for (let i = 0; i < rules.length; i++) {
      if (notToConsider.has(i + 1)) {
        continue;
      }
      const [newPoints, newMoney] = rules[i](Object.assign({}, moneyLeft));
      if (newPoints === 0) notToConsider.add(i + 1);

      // Log new points and rule applied
      // if (newPoints) console.log(newPoints, "rule: ", i + 1, " ", newMoney);

      maximumPoints = Math.max(
        maximumPoints,
        calculateMaxValue(
          newMoney,
          points + newPoints,
          new Set(notToConsider),
          [...used, i + 1]
        )
      );
      dp.set(JSON.stringify([newMoney, notToConsider]), maximumPoints);
    }
    // console.log(maximumPoints, used);
    return maximumPoints;
  }

  return calculateMaxValue(moneySpent, 0, new Set(), []);
}

// {
//   'T1': {'date': '2021-05-09', 'merchant_code' : 'sportcheck', 'amount_cents': 7326}, 'T2': {'date': '2021-05-10', 'merchant_code' : 'tim_hortons', 'amount_cents': 1321}
//   }
