import { useState, useEffect } from 'react';
import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { FiCopy, FiExternalLink } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Styled Components
const Container = styled.div`
  padding: 24px;
  max-width: 1000px;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.bg};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.text_primary};
`;

const Grid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); // Adjust the min-width to handle long text
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
`;


const Card = styled.div`
  background-color: ${({ theme }) => theme.card};
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-wrap: break-word; // Allow text to wrap within the card
`;

const Subtitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.text_secondary};
`;

const Text = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.text_primary};
  word-break: break-word;  // Prevents breaking words unnecessarily
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;  // Ensure text wraps properly in smaller screens
  min-width: 0;  // Ensure div doesn't shrink too much for long text
`;


const Link = styled.a`
  color: ${({ theme }) => theme.link};
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  &:hover {
    text-decoration: underline;
  }
`;

const Icon = styled.span`
  cursor: pointer;
  margin-left: 8px;
`;

// Helper Functions
const formatDate = (timestamp) => {
  try {
    const date = new Date(timestamp * 1000); // Assuming timestamp is in seconds
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    return format(date, 'MMM d, yyyy h:mm a');
  } catch {
    return 'Invalid timestamp';
  }
};

const formatBigNumber = (bigNumber) => {
  if (bigNumber && bigNumber.hex) {
    return parseInt(bigNumber.hex, 16);
  }
  return 0; 
};

const weiToEth = (wei) => wei ? parseFloat(wei) / 1e18 : 0;

const formatEthAndUsd = (wei, ethPrice) => {
  const ethValue = weiToEth(formatBigNumber(wei)).toFixed(6); 
  const usdValue = ethPrice ? (ethValue * ethPrice).toFixed(2) : '0.00'; 
  return `${ethValue} ETH (${usdValue} USD)`;
};

const TransactionDetail = ({ data, ethPrice }) => {
  const transaction = data[0];
  const handleCopy = (value) => {
    navigator.clipboard.writeText(value);
    toast.success('Copied to clipboard!');
  };


  return (
    <Container>
      <Title>Transaction Details</Title>
      <Grid>
        <Card>
          <Subtitle>Transaction Hash</Subtitle>
          <Text>
            <Link href={`https://etherscan.io/tx/${transaction.hash}`} target="_blank">
              {transaction.hash.slice(0, 10)}...<FiExternalLink size={16} />
            </Link>
          </Text>
        </Card>

        <Card>
          <Subtitle>Block Number</Subtitle>
          <Text>{transaction.blockNumber}</Text>
        </Card>

        <Card>
          <Subtitle>From</Subtitle>
          <Text>
            {transaction.from.slice(0, 10)}...
            <Icon onClick={() => handleCopy(transaction.from)}>
              <FiCopy size={16} />
            </Icon>
          </Text>
        </Card>

        <Card>
          <Subtitle>To</Subtitle>
          <Text>
            {transaction.to.slice(0, 10)}...
            <Icon onClick={() => handleCopy(transaction.to)}>
              <FiCopy size={16} />
            </Icon>
          </Text>
        </Card>

        <Card>
          <Subtitle>Value</Subtitle>
          <Text>{formatEthAndUsd(transaction.value, ethPrice)}</Text>
        </Card>
        <Card>
          <Subtitle>Gas Limit</Subtitle>
          <Text>{formatBigNumber(transaction.gasLimit)}</Text>
        </Card>
      </Grid>
      <ToastContainer position="top-center" />
    </Container>
  );
};

export default TransactionDetail;

