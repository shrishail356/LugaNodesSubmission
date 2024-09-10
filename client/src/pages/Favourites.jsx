import React, { useState, useEffect , useRef} from 'react';
import { useContract } from '../context/ContractProvider';
import { getFavoriteTransactions, removeFavoriteTransaction } from '../api/index'; 
import { Spin, Button, Tooltip, notification } from 'antd';
import { CopyOutlined, HeartOutlined, HeartFilled, DeleteOutlined } from '@ant-design/icons';
import { Table, Pagination } from 'antd';
import './styles.css'; 
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SearchOutlined } from '@ant-design/icons';
import { Input, Space } from 'antd';
import Highlighter from 'react-highlight-words';
const trimText = (text) => {
    if (!text) return '';
    const start = text.slice(0, Math.floor(Math.random() * (9 - 6 + 1)) + 6); 
    const end = text.slice(-10); 
    return `${start}...`;
};

const Heading = styled.h1`
  color: ${({ theme }) => theme.text_primary};
  font-family: 'Space Mono', monospace;
`;

const DashboardMain = styled.div`
padding: 20px 30px;
padding-bottom: 200px;
height: 100%;
overflow-y: scroll;
overflow-x: scroll;
display: flex;
flex-direction: column;
gap: 20px;
@media (max-width: 768px){
  padding: 6px 10px;
}
`;

const Favourites = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [favorites, setFavorites] = useState([]); 
    const { selectedContract } = useContract();
    const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
    const fetchAndSetTransactions = async () => {
      setLoading(true);
      try {
          const response = await getFavoriteTransactions();
  
          if (Array.isArray(response)) {
              setTransactions(response); 
          } else {
              throw new Error('Unexpected response format');
          }
      } catch (error) {
          console.error('Failed to fetch transactions:', error);
          toast.error('Failed to fetch transactions. Please try again later.');
          setTransactions([]); 
      }
      setLoading(false);
    };

    useEffect(() => {
        fetchAndSetTransactions();
    }, [selectedContract]);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    const handleRemove = async (hash) => {
        try {
            
            await removeFavoriteTransaction(hash);
           
            setTransactions(transactions.filter(tx => tx.hash !== hash));
            toast.success('Transaction removed from favorites.');
        } catch (error) {
            console.error('Failed to remove transaction:', error);
            toast.error('Failed to remove transaction. Please try again later.');
        }
    };
    
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  const sliceAddress = (address) => {
    if (!address) return ''; 
    return address.substring(0, 6) + '...' + address.slice(-6);
}
    const columns = [
        {
            title: 'Transaction Hash',
            dataIndex: 'hash',
            key: 'hash',
            ...getColumnSearchProps('hash'),
            render: (text) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: "black",textTransform: 'uppercase', fontWeight: 'bold', display: 'inline-flex', boxAlign: 'center', alignItems: 'center', transition: 'color 0.3s ease 0s', marginBottom: '6px',marginRight:"10px" }} onClick={() => handleCopy({text})}>{sliceAddress(text)}</span>
                    <a className='ml-3' href={"https://etherscan.io/tx/" + text} target="_blank" rel="noreferrer">
                    <svg width="18" height="18" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="css-76npg2 ej48xn30"><path d="M6.60024 1.80078C6.44111 1.80078 6.2885 1.864 6.17598 1.97652C6.06346 2.08904 6.00024 2.24165 6.00024 2.40078C6.00024 2.55991 6.06346 2.71252 6.17598 2.82505C6.2885 2.93757 6.44111 3.00078 6.60024 3.00078H8.15184L4.37604 6.77658C4.31874 6.83193 4.27303 6.89814 4.24158 6.97134C4.21014 7.04454 4.19359 7.12327 4.19289 7.20294C4.1922 7.28261 4.20738 7.36162 4.23755 7.43535C4.26772 7.50909 4.31227 7.57608 4.36861 7.63242C4.42494 7.68875 4.49193 7.7333 4.56567 7.76347C4.63941 7.79364 4.71842 7.80882 4.79808 7.80813C4.87775 7.80744 4.95648 7.79089 5.02969 7.75944C5.10289 7.728 5.1691 7.68229 5.22444 7.62498L9.00024 3.84918V5.40078C9.00024 5.55991 9.06346 5.71252 9.17598 5.82505C9.2885 5.93757 9.44111 6.00078 9.60024 6.00078C9.75937 6.00078 9.91199 5.93757 10.0245 5.82505C10.137 5.71252 10.2002 5.55991 10.2002 5.40078V2.40078C10.2002 2.24165 10.137 2.08904 10.0245 1.97652C9.91199 1.864 9.75937 1.80078 9.60024 1.80078H6.60024Z" fill="#787878"></path><path d="M2.9998 3C2.68154 3 2.37632 3.12643 2.15128 3.35147C1.92623 3.57652 1.7998 3.88174 1.7998 4.2V9C1.7998 9.31826 1.92623 9.62349 2.15128 9.84853C2.37632 10.0736 2.68154 10.2 2.9998 10.2H7.7998C8.11806 10.2 8.42329 10.0736 8.64833 9.84853C8.87338 9.62349 8.9998 9.31826 8.9998 9V7.2C8.9998 7.04087 8.93659 6.88826 8.82407 6.77574C8.71155 6.66321 8.55893 6.6 8.3998 6.6C8.24067 6.6 8.08806 6.66321 7.97554 6.77574C7.86302 6.88826 7.7998 7.04087 7.7998 7.2V9H2.9998V4.2H4.7998C4.95893 4.2 5.11155 4.13679 5.22407 4.02426C5.33659 3.91174 5.3998 3.75913 5.3998 3.6C5.3998 3.44087 5.33659 3.28826 5.22407 3.17574C5.11155 3.06321 4.95893 3 4.7998 3H2.9998Z" fill="#787878"></path></svg>
                  </a>
                </div>
            ),
            width: 200, 
        },
        {
            title: 'Age',
            dataIndex: 'block_timestamp',
            key: 'block_timestamp',
            sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
            render: (text) => <span>{new Date(text).toLocaleDateString()}</span>,
            width: 150, 
        },
        {
            title: 'From Address',
            dataIndex: 'from_address',
            key: 'from_address',
            ...getColumnSearchProps('from_address'),
            render: (text) => (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: "black",textTransform: 'uppercase', fontWeight: 'bold', display: 'inline-flex', boxAlign: 'center', alignItems: 'center', transition: 'color 0.3s ease 0s', marginBottom: '6px',marginRight:"10px" }} onClick={() => handleCopy({text})}>{sliceAddress(text)}</span>
                  <a className='ml-3' href={"https://etherscan.io/tx/" + text} target="_blank" rel="noreferrer">
                  <svg width="18" height="18" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="css-76npg2 ej48xn30"><path d="M6.60024 1.80078C6.44111 1.80078 6.2885 1.864 6.17598 1.97652C6.06346 2.08904 6.00024 2.24165 6.00024 2.40078C6.00024 2.55991 6.06346 2.71252 6.17598 2.82505C6.2885 2.93757 6.44111 3.00078 6.60024 3.00078H8.15184L4.37604 6.77658C4.31874 6.83193 4.27303 6.89814 4.24158 6.97134C4.21014 7.04454 4.19359 7.12327 4.19289 7.20294C4.1922 7.28261 4.20738 7.36162 4.23755 7.43535C4.26772 7.50909 4.31227 7.57608 4.36861 7.63242C4.42494 7.68875 4.49193 7.7333 4.56567 7.76347C4.63941 7.79364 4.71842 7.80882 4.79808 7.80813C4.87775 7.80744 4.95648 7.79089 5.02969 7.75944C5.10289 7.728 5.1691 7.68229 5.22444 7.62498L9.00024 3.84918V5.40078C9.00024 5.55991 9.06346 5.71252 9.17598 5.82505C9.2885 5.93757 9.44111 6.00078 9.60024 6.00078C9.75937 6.00078 9.91199 5.93757 10.0245 5.82505C10.137 5.71252 10.2002 5.55991 10.2002 5.40078V2.40078C10.2002 2.24165 10.137 2.08904 10.0245 1.97652C9.91199 1.864 9.75937 1.80078 9.60024 1.80078H6.60024Z" fill="#787878"></path><path d="M2.9998 3C2.68154 3 2.37632 3.12643 2.15128 3.35147C1.92623 3.57652 1.7998 3.88174 1.7998 4.2V9C1.7998 9.31826 1.92623 9.62349 2.15128 9.84853C2.37632 10.0736 2.68154 10.2 2.9998 10.2H7.7998C8.11806 10.2 8.42329 10.0736 8.64833 9.84853C8.87338 9.62349 8.9998 9.31826 8.9998 9V7.2C8.9998 7.04087 8.93659 6.88826 8.82407 6.77574C8.71155 6.66321 8.55893 6.6 8.3998 6.6C8.24067 6.6 8.08806 6.66321 7.97554 6.77574C7.86302 6.88826 7.7998 7.04087 7.7998 7.2V9H2.9998V4.2H4.7998C4.95893 4.2 5.11155 4.13679 5.22407 4.02426C5.33659 3.91174 5.3998 3.75913 5.3998 3.6C5.3998 3.44087 5.33659 3.28826 5.22407 3.17574C5.11155 3.06321 4.95893 3 4.7998 3H2.9998Z" fill="#787878"></path></svg>
                </a>
              </div>
            ),
            width: 200, 
        },
        {
            title: 'To Address',
            dataIndex: 'to_address',
            ...getColumnSearchProps('to_address'),
            key: 'to_address',
            render: (text) => (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: "black",textTransform: 'uppercase', fontWeight: 'bold', display: 'inline-flex', boxAlign: 'center', alignItems: 'center', transition: 'color 0.3s ease 0s', marginBottom: '6px', marginRight:"10px" }} onClick={() => handleCopy({text})}>{sliceAddress(text)}</span>
                  <a className='ml-3' href={"https://etherscan.io/tx/" + text} target="_blank" rel="noreferrer">
                  <svg width="18" height="18" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="css-76npg2 ej48xn30"><path d="M6.60024 1.80078C6.44111 1.80078 6.2885 1.864 6.17598 1.97652C6.06346 2.08904 6.00024 2.24165 6.00024 2.40078C6.00024 2.55991 6.06346 2.71252 6.17598 2.82505C6.2885 2.93757 6.44111 3.00078 6.60024 3.00078H8.15184L4.37604 6.77658C4.31874 6.83193 4.27303 6.89814 4.24158 6.97134C4.21014 7.04454 4.19359 7.12327 4.19289 7.20294C4.1922 7.28261 4.20738 7.36162 4.23755 7.43535C4.26772 7.50909 4.31227 7.57608 4.36861 7.63242C4.42494 7.68875 4.49193 7.7333 4.56567 7.76347C4.63941 7.79364 4.71842 7.80882 4.79808 7.80813C4.87775 7.80744 4.95648 7.79089 5.02969 7.75944C5.10289 7.728 5.1691 7.68229 5.22444 7.62498L9.00024 3.84918V5.40078C9.00024 5.55991 9.06346 5.71252 9.17598 5.82505C9.2885 5.93757 9.44111 6.00078 9.60024 6.00078C9.75937 6.00078 9.91199 5.93757 10.0245 5.82505C10.137 5.71252 10.2002 5.55991 10.2002 5.40078V2.40078C10.2002 2.24165 10.137 2.08904 10.0245 1.97652C9.91199 1.864 9.75937 1.80078 9.60024 1.80078H6.60024Z" fill="#787878"></path><path d="M2.9998 3C2.68154 3 2.37632 3.12643 2.15128 3.35147C1.92623 3.57652 1.7998 3.88174 1.7998 4.2V9C1.7998 9.31826 1.92623 9.62349 2.15128 9.84853C2.37632 10.0736 2.68154 10.2 2.9998 10.2H7.7998C8.11806 10.2 8.42329 10.0736 8.64833 9.84853C8.87338 9.62349 8.9998 9.31826 8.9998 9V7.2C8.9998 7.04087 8.93659 6.88826 8.82407 6.77574C8.71155 6.66321 8.55893 6.6 8.3998 6.6C8.24067 6.6 8.08806 6.66321 7.97554 6.77574C7.86302 6.88826 7.7998 7.04087 7.7998 7.2V9H2.9998V4.2H4.7998C4.95893 4.2 5.11155 4.13679 5.22407 4.02426C5.33659 3.91174 5.3998 3.75913 5.3998 3.6C5.3998 3.44087 5.33659 3.28826 5.22407 3.17574C5.11155 3.06321 4.95893 3 4.7998 3H2.9998Z" fill="#787878"></path></svg>
                </a>
              </div>  
            ),
            width: 200, 
        },
        {
            title: 'Amount',
            dataIndex: 'value',
            key: 'value',
            sorter: (a, b) => 1 * a.value - 1 * b.value,
            render: (text) => <span>{(parseFloat(text) / 1e18).toFixed(4)} ETH</span>,
            width: 150, 
        },
        {
            title: 'Txn Fees',
            dataIndex: 'transaction_fee',
            key: 'transaction_fee',
            sorter: (a, b) => 1 * a.value - 1 * b.value,
            render: (text) => <span>{text} ETH</span>,
            width: 150, 
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemove(record.hash)}
                    type="danger"
                />
            ),
            width: 100, 
        },
    ];

    const handlePageChange = (page, pageSize) => {
        setCurrent(page);
        setPageSize(pageSize);
    };

    return (
        <DashboardMain>
            <div className="desktop-view">
                <Heading>Your Favourite Transactions</Heading>
                <div className="table-wrapper">
                    <div className="table-bg-white p-6 rounded-lg table-box-shadow responsive-table">
                        {loading ? (
                            <div className="loading-container">
                                <Spin size="large" />
                            </div>
                        ) : (
                            <>
                                <Table
                                    columns={columns}
                                    dataSource={transactions}
                                    rowKey="hash"
                                    bordered
                                    size="small"
                                    pagination={false}
                                    className="ant-table-rounded ant-table-striped"
                                    scroll={{ x: 1000 }} 
                                />
                                <Pagination
                                    current={current}
                                    pageSize={pageSize}
                                    total={transactions.length}
                                    onChange={handlePageChange}
                                    style={{ marginTop: 20, textAlign: 'center' }}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>  
            <ToastContainer position='top-center'/>
        </DashboardMain>
    );
};

export default Favourites;

