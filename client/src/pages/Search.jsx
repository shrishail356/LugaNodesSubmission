import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { searchTransactions,getEthPrice  } from '../api/index'; 
import TransactionDetail from './TransactionDetail';
import { useEthPrice } from '../context/PriceContext'; // Import the context hook

const SearchMain = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media (max-width: 768px) {
    padding: 20px 9px;
  }
`;

const Heading = styled.div`
  align-items: flex-start;
  color: ${({ theme }) => theme.text_primary};
  font-size: 22px;
  font-weight: 540;
  margin: 10px 14px;
`;

const Categories = styled.div`
  margin: 20px 10px;
`;

const SearchWhole = styled.div`
  max-width: 700px;
  display: flex;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  border-radius: 30px;
  cursor: pointer;
  padding: 12px 16px;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.text_secondary};
`;

const ResultsContainer = styled.div`
  margin-top: 20px;
  max-width: 700px;
  width: 100%;
`;

const SearchResultItem = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.text_secondary};
  padding: 10px 0;
`;

const Search = () => {
  const [searched, setSearched] = useState("");
  const [searchedTransactions, setSearchedTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ethPrice, setEthPrice] = useState(null);
  // Use the ETH price from the context
  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const price = await getEthPrice();
        setEthPrice(price);
      } catch (err) {
        console.error('Error fetching ETH price:', err);
        setError('Error fetching ETH price');
      }
    };

    fetchEthPrice();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (searched.length > 2) { // Start searching after 3 characters
        setLoading(true);
        setError(null);
        try {
          const response = await searchTransactions(searched);
          const { data } = response; // Extract the data from the response
          console.log("SS Transaction : ", [response]);
          setSearchedTransactions([response]); // Wrap the data in an array
        } catch (err) {
          setError('Error fetching transactions');
        } finally {
          setLoading(false);
        }
      } else {
        setSearchedTransactions([]);
      }
    };

    fetchTransactions();
  }, [searched]);

  const handleChange = (e) => {
    setSearched(e.target.value);
  };

  return (
    <SearchMain>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <SearchWhole>
          <SearchOutlinedIcon sx={{ color: "inherit" }} />
          <input
            type='text'
            placeholder='Search Txn Hash'
            style={{ border: "none", outline: "none", width: "100%", background: "inherit", color: "inherit" }}
            value={searched}
            onChange={handleChange}
          />
        </SearchWhole>
      </div>
      {loading ? (
        <Categories>
          <Heading>Loading...</Heading>
        </Categories>
      ) : error ? (
        <Categories>
          <Heading>{error}</Heading>
        </Categories>
      ) : searched === "" ? (
        <Categories>
          <Heading>Transaction Details</Heading>
        </Categories>
      ) : (
        <div style={{alignContent: "center", justifyContent: "center", display: "flex"}}>
            <ResultsContainer>
          {searchedTransactions.length === 0 ? (
            <Heading>No results found</Heading>
          ) : (
            <TransactionDetail data={searchedTransactions} ethPrice={ethPrice} />
          )}
        </ResultsContainer>
        </div>
        
      )}
    </SearchMain>
  );
};

export default Search;
