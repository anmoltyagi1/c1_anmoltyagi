import React, { useEffect, useState } from 'react';
import { ChakraProvider, Input, theme, Box, Text } from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';

function App() {
  const [transactions, setTransactions] = useState('');
  const [isTransactionInputted, setIsTransactionInputted] = useState(false);

  useEffect(() => {
    // Your useEffect logic here (if needed)
    // For example, you can perform calculations or API calls here
  }, [transactions]);

  function handleTransactionInput() {
    // You can add additional logic if needed
    setIsTransactionInputted(true);
  }

  function renderInputUI() {
    return (
      <div className="container">
        <h1>Enter your transactions to calculate your points</h1>
        <Input
          onChange={event => setTransactions(event.target.value)}
          placeholder="Basic usage"
        />
        <button onClick={handleTransactionInput}>Submit</button>
      </div>
    );
  }

  function renderDifferentUI() {
    let parsed = JSON.parse(transactions);
    return (
      <Box>
        <Text>{transactions}</Text>

        <Text> {parsed} </Text>
      </Box>
    );
  }

  return (
    <ChakraProvider theme={theme}>
      {isTransactionInputted ? renderDifferentUI() : renderInputUI()}
      <ColorModeSwitcher />
    </ChakraProvider>
  );
}

export default App;
