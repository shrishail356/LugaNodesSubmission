import React from 'react';
import styled from 'styled-components';


const ComingSoonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.bg}; // Match the background to the theme
`;

const ComingSoonText = styled.div`
  font-size: 48px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary}; // Use the primary text color from the theme
  text-align: center;
  padding: 20px;
  
  @media (max-width: 768px) {
    font-size: 36px;
  }
  
  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

const ComingSoonSubText = styled.div`
  font-size: 18px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary}; // Use the secondary text color from the theme
  text-align: center;
  margin-top: 10px;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
  
  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const ComingSoonPage = () => {
  return (
    <ComingSoonContainer>
      <div>
        <ComingSoonText>Coming Soon</ComingSoonText>
        <ComingSoonSubText>something amazing soon...!</ComingSoonSubText>
      </div>
    </ComingSoonContainer>
  );
};

export default ComingSoonPage;
