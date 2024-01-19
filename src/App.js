import React, { useEffect, useState } from 'react';
import {
  ChakraProvider,
  Input,
  theme,
  Box,
  Text,
  VStack,
  Code,
  Grid,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';

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
    // Replace this with the UI you want to show after a transaction is inputted
    return (
      <Box>
        <Text>Transaction inputted! Display your different UI here.</Text>
      </Box>
    );
  }

  return (
    <ChakraProvider theme={theme}>
      {isTransactionInputted ? renderDifferentUI() : renderInputUI()}
      {/* You can also include other components/UI elements */}
      <ColorModeSwitcher />
      <Logo />
    </ChakraProvider>
  );
}

export default App;
