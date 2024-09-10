import React, { useState, useEffect } from 'react';
import { useContract } from '../context/ContractProvider'; // Adjust path based on your project
import styled from 'styled-components';
import { addContractHook } from '../api/index';
const DashboardMain = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media (max-width: 768px){
    padding: 6px 10px;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLight};
  border-radius: 10px;
  padding: 20px 30px;
`;

const Topic = styled.div`
  color: ${({ theme }) => theme.text_primary};
  font-size: 24px;
  font-weight: 540;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 768px){
    font-size: 18px;
  }
`;

const Select = styled.select`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  font-size: 16px;
  color: ${({ theme }) => theme.text_primary};
  background-color: ${({ theme }) => theme.bgLight};
  margin-top: 10px;
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  margin-top: 20px;
  cursor: pointer;
  font-size: 16px;
  transition: 0.3s ease-in-out;
  &:hover {
    background-color: ${({ theme }) => theme.primaryDark};
  }
`;

const WebhookUrlContainer = styled.div`
  margin-top: 20px;
  background-color: ${({ theme }) => theme.bgLight};
  padding: 10px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CopyButton = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  margin-left: 10px;
  &:hover {
    background-color: ${({ theme }) => theme.primaryDark};
  }
`;

const GenerateWebHooks = () => {
  const { contracts, selectedContract, setSelectedContract } = useContract();
  const [webhookUrl, setWebhookUrl] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');
  const [error, setError] = useState('');
  const baseApiUrl = process.env.REACT_APP_BASE_API_URL; 
  const generateWebhookUrl = async () => {
    if (selectedContract) {
      try {
        await addContractHook({ contractAddress: selectedContract.address });
        setError(''); 
        const url = `${baseApiUrl}/hooks/${selectedContract.address}/webhook`;
        setWebhookUrl(url);
        setCopySuccess(''); 
      } catch (apiError) {
        setError('Failed to add contract address.');
        console.error('Error adding contract:', apiError.response ? apiError.response.data : apiError.message);
      }
    } else {
      setWebhookUrl(null);
    }
  };

  const copyToClipboard = () => {
    if (webhookUrl) {
      navigator.clipboard.writeText(webhookUrl).then(() => {
        setCopySuccess('Webhook URL copied!');
      }, () => {
        setCopySuccess('Failed to copy!');
      });
    }
  };

  useEffect(() => {
    setWebhookUrl(null);
    setCopySuccess('');
    setError('');
  }, [selectedContract]);

  return (
    <DashboardMain>
      <FilterContainer>
        <Topic>Select Contract Address</Topic>
        <Select
          value={selectedContract?.address || ''}
          onChange={(e) => setSelectedContract(contracts.find(contract => contract.address === e.target.value))}
        >
          <option value="" disabled>Select a contract</option>
          {contracts.map((contract) => (
            <option key={contract._id} value={contract.address}>
              {contract.name} - {contract.address}
            </option>
          ))}
        </Select>
        <Button onClick={generateWebhookUrl}>
          Generate Webhook URL
        </Button>
        {webhookUrl && (
          <WebhookUrlContainer>
            Webhook URL: <strong>{webhookUrl}</strong>
            <CopyButton onClick={copyToClipboard}>Copy</CopyButton>
          </WebhookUrlContainer>
        )}
        {copySuccess && <p>{copySuccess}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </FilterContainer>
    </DashboardMain>
  );
};

export default GenerateWebHooks;
