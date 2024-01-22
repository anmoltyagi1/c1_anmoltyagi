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
  Spinner,
  useDisclosure,
  CardHeader,
} from '@chakra-ui/react';

function App() {
  const [transactions, setTransactions] = useState('');
  const [isTransactionInputted, setIsTransactionInputted] = useState(false);
  const [parsedTransactions, setParsedTransactions] = useState(null);
  const [disableButton, setDisabledButton] = useState(true);
  const [value, setValue] = useState(null);
  const [rulesUsed, setRulesUsed] = useState(null);
  const [transactionPoints, setTransactionPoints] = useState(null);

  useEffect(() => {
    if (!parsedTransactions) return;
    const fetchDataAndSetState = async () => {
      try {
        const result = await fetchData(parsedTransactions);
        const [resultValue, resultRulesUsed] = result[0];
        const transactionPoints = result[1];

        setTransactionPoints(transactionPoints);
        setValue(resultValue);
        setRulesUsed(resultRulesUsed);
      } catch (error) {
        console.error('Error:', error);
        // Handle error if needed
      }
    };

    fetchDataAndSetState();
  }, [parsedTransactions]);

  function handleTransactionInput() {
    try {
      setRulesUsed(null);
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
        <Heading size="2xl">Points Calculator</Heading>

        <Heading size="sm">
          Enter your transactions in the box below for a specific month to
          calculate your points
        </Heading>
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
            "T02": {"date": "2021-05-02", "merchant_code" : "sportcheck", "amount_cents": 8700},
            "T03": {"date": "2021-05-03", "merchant_code" : "tim_hortons", "amount_cents": 323},
          }`}
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
            color={'#004977'}
            border={'1px solid'}
            size={'sm'}
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
            color={'#004977'}
            border={'1px solid'}
            size={'sm'}
            onClick={() => {
              setTransactions(
                JSON.stringify(
                  {
                    T1: {
                      date: '2021-05-09',
                      merchant_code: 'sportcheck',
                      amount_cents: 2500,
                    },
                    T2: {
                      date: '2021-05-10',
                      merchant_code: 'tim_hortons',
                      amount_cents: 1000,
                    },
                    T3: {
                      date: '2021-05-10',
                      merchant_code: 'the_bay',
                      amount_cents: 500,
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

          <Button
            color={'#004977'}
            border={'1px solid'}
            size={'sm'}
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
            Example 3
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

  return (
    <ChakraProvider theme={theme}>
      <Box p={8}>
        {isTransactionInputted ? (
          <div>
            <VStack spacing={4} align="center">
              {/* Title Section */}
              <Text fontSize="2xl" fontWeight="bold">
                Transaction Details and Insights
              </Text>

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
                {value && (
                  <ConfettiExplosion
                    force={0.2}
                    duration={3000}
                    colors={['#d03027', '#004977']}
                  />
                )}
                <Heading fontSize="xl">
                  Total Points Earned: {value ? value : <Spinner />}
                </Heading>
              </Card>

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
                          {Object.entries(parsedTransactions).map(
                            ([key, value]) => (
                              <Tr key={key}>
                                <Td>{key}</Td>
                                <Td>{value.date}</Td>
                                <Td>{value.merchant_code}</Td>
                                <Td isNumeric>{value.amount_cents}</Td>
                              </Tr>
                            )
                          )}
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
                    Transaction Points
                  </CardHeader>
                  {rulesUsed ? (
                    <Table size={'md'} variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Transaction</Th>
                          <Th>Points</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {transactionPoints.map((transactionPoint, index) => (
                          <Tr key={index}>
                            <Td>T{index + 1}</Td>
                            <Td>{transactionPoint[0]}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  ) : (
                    <Spinner />
                  )}
                </Card>
              </div>

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
                {rulesUsed ? (
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
                          <Td>{value * rewardRules[key].points} points</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                ) : (
                  <Spinner />
                )}
              </Card>

              {/* Reward Rules Section */}

              <RulesModal />

              {/* Recalculate Button */}
              <Button
                border={'1px solid'}
                color={'#004977'}
                onClick={() => {
                  setValue(null);
                  setIsTransactionInputted(false);
                  setTransactions('');
                }}
              >
                Recalculate
              </Button>
            </VStack>
          </div>
        ) : (
          renderInputUI()
        )}
      </Box>
    </ChakraProvider>
  );
}

export default App;

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

async function fetchData(parsedTransactions) {
  try {
    const response = await fetch('/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transactions: parsedTransactions }),
    });

    const data = await response.json();

    return data.result; // Assuming data.result is an array
  } catch (error) {
    console.error('Error:', error);
    throw error; // Rethrow the error to handle it elsewhere if needed
  }
}
