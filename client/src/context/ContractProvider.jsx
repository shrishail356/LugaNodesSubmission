import React, { createContext, useState, useContext, useEffect } from 'react';
import { getContracts } from '../api/index';

const ContractContext = createContext();
export const useContract = () => {
  return useContext(ContractContext);
};

export const ContractProvider = ({ children }) => {
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await getContracts();
        setContracts(response.data.contracts); 
        if (response.data.contracts.length > 0) {
          setSelectedContract(response.data.contracts[0]); 
        }
      } catch (error) {
        console.error('Failed to fetch contracts', error);
      }
    };

    fetchContracts();
  }, []);

  const value = {
    contracts,
    selectedContract,
    setContracts,
    setSelectedContract,
  };
  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
};
