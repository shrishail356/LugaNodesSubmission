import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const PriceContext = createContext();

export const PriceProvider = ({ children }) => {
  const [ethPrice, setEthPrice] = useState(null);

  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_MORALIS_API_URL, 
          {
            headers: {
              accept: 'application/json',
              'X-API-Key': process.env.REACT_APP_MORALIS_API_KEY, 
            },
          }
        );
        setEthPrice(response.data.usdPrice); 
      } catch (error) {
        console.error('Error fetching ETH price:', error);
      }
    };

    fetchEthPrice();
  }, []);

  return (
    <PriceContext.Provider value={ethPrice}>
      {children}
    </PriceContext.Provider>
  );
};


export const useEthPrice = () => useContext(PriceContext);
