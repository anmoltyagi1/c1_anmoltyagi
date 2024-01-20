import React, { useEffect, useState } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';
import {
  ChakraProvider,
  theme,
  Box,
  Card,
  Text,
  HStack,
  Button,
  Heading,
  VStack,
  Table,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Textarea,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  UnorderedList,
  ListItem,
  useDisclosure,
  CardHeader,
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
        <Text fontSize="lg" fontWeight="bold">
          Made By: Anmol Tyagi
        </Text>
        <Textarea
          size="sm"
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
          bgColor={'#004977'}
          color={'white'}
          onClick={handleTransactionInput}
          isDisabled={disableButton}
        >
          Calculate
        </Button>

        <HStack spacing={4}>
          <Button
            bgColor={'#004977'}
            color={'white'}
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
            Example 1
          </Button>

          <Button
            bgColor={'#004977'}
            color={'white'}
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
            Example 2
          </Button>
        </HStack>

        {disableButton && (
          <Text color="red">Please enter a valid JSON transaction</Text>
        )}
      </VStack>
    );
  }
  function RulesModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
      <div>
        <Button bgColor="#004977" color="white" onClick={onOpen}>
          Show Rules
        </Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent
            bg="white"
            borderRadius="md"
            boxShadow="md"
            p={4}
            maxWidth="4xl"
          >
            <ModalHeader>Reward Rules</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <UnorderedList listStyleType="none" pl={0}>
                {Object.entries(rewardRules).map(([ruleNumber, ruleBody]) => (
                  <ListItem
                    key={ruleNumber}
                    borderBottom="1px solid #ccc"
                    py={2}
                    display="flex"
                    alignItems="flex-start"
                    justifyContent="space-between"
                  >
                    <Box flex="1">
                      <strong>{`Rule ${ruleNumber}:`}</strong>
                      <Text mt={1} fontSize="sm">
                        {ruleBody.description}
                      </Text>
                    </Box>
                  </ListItem>
                ))}
              </UnorderedList>
            </ModalBody>
          </ModalContent>
        </Modal>
      </div>
    );
  }

  function renderDifferentUI() {
    const [value, rulesUsed] = calculatePoints(parsedTransactions);

    return (
      <VStack spacing={4} align="center">
        {/* Title Section */}
        <Text fontSize="2xl" fontWeight="bold">
          Transaction Details and Insights
        </Text>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            margin: '20px', // Add margin for spacing
          }}
        >
          {/* Transaction Table Section */}
          {parsedTransactions && (
            <Card
              width="48%" // Adjust width for spacing
              align={'center'}
              justify={'center'}
              border={'1px solid'}
              borderColor={'#004977'}
              boxShadow="base"
            >
              <CardHeader fontSize="xl" mb="4">
                Transactions
              </CardHeader>
              <TableContainer>
                <Table size={'md'} variant="simple">
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
            </Card>
          )}

          <Card
            width="48%" // Adjust width for spacing
            align={'center'}
            justify={'center'}
            border={'1px solid'}
            borderColor={'#004977'}
            boxShadow="base"
          >
            <CardHeader fontSize="xl" mb="4">
              Rules Used
            </CardHeader>
            <Table size={'md'} variant="simple">
              <Thead>
                <Tr>
                  <Th>Rule</Th>
                  <Th>Times Used</Th>
                  <Th>Reward</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Object.entries(rulesUsed).map(([key, value]) => (
                  <Tr key={key}>
                    <Td b>{key}</Td>
                    <Td>x{value}</Td>
                    <Td>{rewardRules[key].points} points</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Card>
        </div>

        {/* Total Points Section within a Card */}
        <Card
          width="30%"
          align={'center'}
          justify={'center'}
          border={'4px solid'}
          borderColor={'#004977'}
          p={4}
          boxShadow="base"
        >
          <ConfettiExplosion duration={3000} colors={['#d03027', '#004977']} />
          <Heading fontSize="xl">Total Points Earned: {value}</Heading>
        </Card>

        {/* Reward Rules Section */}

        <RulesModal />

        {/* Recalculate Button */}
        <Button
          bgColor={'#004977'}
          color={'white'}
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

    for (let i = 0; i < rules.length; i++) {
      if (notToConsider.has(i + 1)) {
        continue;
      }
      let newUsed = Object.assign({}, used);
      const [newPoints, newMoney] = rules[i](Object.assign({}, moneyLeft));
      if (newPoints === 0) notToConsider.add(i + 1);
      if (newPoints > 0) {
        if (i + 1 === 7) {
          if (newUsed.hasOwnProperty(i + 1)) newUsed[i + 1] += newPoints;
          else newUsed[i + 1] = newPoints;
        } else {
          if (newUsed.hasOwnProperty(i + 1)) newUsed[i + 1] += 1;
          else newUsed[i + 1] = 1;
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

  return calculateMaxValue(moneySpent, 0, new Set(), []);
}

// const rewardRules = {
//   1: '500 points for every $75 spend at Sport Check, $25 spend at Tim Hortons, and $25 spend at Subway',
//   2: '300 points for every $75 spend at Sport Check and $25 spend at Tim Hortons',
//   3: '200 points for every $75 spend at Sport Check',
//   4: '150 points for every $25 spend at Sport Check, $10 spend at Tim Hortons, and $10 spend at Subway',
//   5: '75 points for every $25 spend at Sport Check and $10 spend at Tim Hortons',
//   6: '75 points for every $20 spend at Sport Check',
//   7: '1 point for every $1 spend for all other purchases (including leftover amount)',
// };

const rewardRules = {
  1: {
    description:
      '500 points for every $75 spend at Sport Check, $25 spend at Tim Hortons, and $25 spend at Subway',
    points: 500,
  },
  2: {
    description:
      '300 points for every $75 spend at Sport Check and $25 spend at Tim Hortons',
    points: 300,
  },
  3: {
    description: '200 points for every $75 spend at Sport Check',
    points: 200,
  },
  4: {
    description:
      '150 points for every $25 spend at Sport Check, $10 spend at Tim Hortons, and $10 spend at Subway',
    points: 150,
  },
  5: {
    description:
      '75 points for every $25 spend at Sport Check and $10 spend at Tim Hortons',
    points: 75,
  },
  6: {
    description: '75 points for every $20 spend at Sport Check',
    points: 75,
  },
  7: {
    description:
      '1 point for every $1 spend for all other purchases (including leftover amount)',
    points: 1,
  },
};
