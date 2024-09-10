import styled from 'styled-components';
import { Table } from 'antd';

const ThemedTable = styled(Table)`
  .ant-table {
    border-radius: 10px;
    font-family: 'Space Mono', monospace;
    background-color: ${({ theme }) => theme.card};
  }
  .ant-table-header {
    background-color: ${({ theme }) => theme.header};
  }

  .ant-table-thead > tr > th {
    background-color: ${({theme})=> theme.card}
    color: ${({ theme }) => theme.text_primary};
    font-size: 20px;
    font-family: 'Space Mono', monospace;
  }

  .ant-table-tbody > tr > td {
    color: ${({ theme }) => theme.text_secondary};
    font-size: 18px;
    font-family: 'Space Mono', monospace;
  }

  .ant-table-tbody > tr.ant-table-row-hover > td {
    background-color: ${({ theme }) => theme.bgLight};
  }

  .ant-table-thead th {
    border-bottom: 1px solid ${({ theme }) => theme.border};
  }

  .ant-table-tbody td {
    border-bottom: 1px solid ${({ theme }) => theme.border};
  }
`;

export default ThemedTable;
