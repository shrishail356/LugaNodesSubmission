  import React, { useState } from 'react';
  import styled from 'styled-components';
  import { Link } from 'react-router-dom';
  import { useDispatch, useSelector } from 'react-redux';
  import { Avatar, Menu, MenuItem, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
  import PersonIcon from '@mui/icons-material/Person';
  import MenuIcon from '@mui/icons-material/Menu';
  import AddIcon from '@mui/icons-material/Add'; 
  import DeleteIcon from '@mui/icons-material/Delete';
  import { openSignin } from '../redux/setSigninSlice';
  import { useContract } from '../context/ContractProvider'; 
  import { addContract, deleteContract } from '../api/index';
  import ToastMessage from './ToastMessage';
  import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

  const AvatarWrapper = styled.div`
    margin-left: auto;
  `;

  const NavbarDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 16px 40px;
  box-sizing: border-box;
  color: ${({ theme }) => theme.text_primary};
  gap: 30px;
  background: ${({ theme }) => theme.bg};
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5.7px);
  -webkit-backdrop-filter: blur(5.7px);

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const WrapperDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 16px; 
  margin-left: auto; 
`;

const ButtonDiv = styled.div`
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.primary};
  border: 1px solid ${({ theme }) => theme.primary};
  border-radius: 12px;
  width: 100%;
  max-width: 70px;
  padding: 8px 10px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover {
    background-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.text_primary};
  }
`;
  const ContractButtonDiv = styled.div`
    font-size: 14px;
    cursor: pointer;
    text-decoration: none;
    color: ${({ theme }) => theme.primary};
    border: 1px solid ${({ theme }) => theme.primary};
    border-radius: 12px;
    width: 100%;
    max-width: 70px;
    padding: 8px 10px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;

    &:hover {
      background-color: ${({ theme }) => theme.primary};
      color: ${({ theme }) => theme.text_primary};
    }
  `;
  const Welcome = styled.div`
    font-size: 26px;
    font-weight: 600;

    @media (max-width: 768px) {
      font-size: 16px;
    }
  `;

  const IcoButton = styled(IconButton)`
    color: ${({ theme }) => theme.text_secondary} !important;
  `;

  const DropdownButton = styled(ContractButtonDiv)`
    font-size: 14px;
    padding: 8px 12px;
    width: auto;
    max-width: none;
    display: flex;
    align-items: center;
    gap: 6px;
  `;

  const AddContractButton = styled(IconButton)`
    color: ${({ theme }) => theme.primary};
    &:hover {
      color: ${({ theme }) => theme.secondary}; 
    }
    & svg {
      fill: ${({ theme }) => theme.primary}; 
    }
  `;

  const Navbar = ({ menuOpen, setMenuOpen, setSignInOpen, setSignUpOpen }) => {
    const { currentUser } = useSelector((state) => state.user);
    const { contracts, selectedContract, setSelectedContract, setContracts } = useContract();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [newContract, setNewContract] = useState({ name: '', address: '' });
    const [error, setError] = useState('');

    const handleMenuClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
      setAnchorEl(null);
    };

    const handleContractSelect = (contract) => {
      setSelectedContract(contract);
      handleMenuClose();
    };

    const handleAddContractClick = () => {
      if (contracts.length >= 3) {
        alert('You can only add up to 3 contracts.');
        return;
      }
      setOpenDialog(true);
    };

    const handleDialogClose = () => {
      setOpenDialog(false);
      setNewContract({ name: '', address: '' });
      setError(''); // Clear error message on close
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewContract((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
      try {
        if (!newContract.name || !newContract.address) {
          setError('Please fill out all fields.');
          return;
        }
        const response = await addContract(newContract);
        if (response.status === 200) {
          toast.success("Contract added successfully.");
          setContracts((prev) => [...prev, response.data.contract]);
          handleDialogClose(); // Close dialog
        } else {
          setError('Failed to add contract.');
          toast.error('Failed to add contract.');
        }
      } catch (error) {
        setError('Failed to add contract.');
        toast.error('Failed to add contract.');
        console.error('Error adding contract:', error);
      }
    };

    const handleDeleteContract = async (contract) => {
      try {
        const response = await deleteContract(contract.address);
        if (response.status === 200) {
          toast.success("Successfully deleted contract.");
          setContracts((prev) => prev.filter(c => c.address !== contract.address));
          if (selectedContract?.address === contract.address) {
            setSelectedContract(null);
          }
        } else {
          toast.error('Failed to delete contract.');
        }
      } catch (error) {
        console.error('Error deleting contract:', error);
        toast.error('Failed to delete contract.');
      }
    };

    return (
      <NavbarDiv>
  <IcoButton onClick={() => setMenuOpen(!menuOpen)}>
    <MenuIcon />
  </IcoButton>
  {currentUser ? (
    <>
      <Welcome>
        Welcome, {currentUser.name}
      </Welcome>
      <WrapperDiv>
        <DropdownButton onClick={handleMenuClick}>
          {selectedContract ? selectedContract.name : 'Select Contract'}
        </DropdownButton>
        <AddContractButton onClick={handleAddContractClick}>
          <AddIcon />
        </AddContractButton>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Avatar src={currentUser.img}>
            {currentUser.name.charAt(0).toUpperCase()}
          </Avatar>
        </Link>
      </WrapperDiv>
    </>
  ) : (
    <>
      <>&nbsp;</>
      <ButtonDiv onClick={() => dispatch(openSignin())}>
        <PersonIcon style={{ fontSize: '18px' }} />
        Login
      </ButtonDiv>
    </>
  )}
  <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={handleMenuClose}
  >
    {contracts.length > 0 ? (
      contracts.map((contract) => (
        <MenuItem
          key={contract.address}
          onClick={() => handleContractSelect(contract)}
        >
          {contract.name}
          {contract.name !== 'Beacon Deposit Contract' && (
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => handleDeleteContract(contract)}
              style={{ marginLeft: 'auto' }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </MenuItem>
      ))
    ) : (
      <MenuItem disabled>No contracts available</MenuItem>
    )}
  </Menu>
  <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>Add Smart Contract</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Contract Name"
              type="text"
              fullWidth
              variant="outlined"
              value={newContract.name}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="address"
              label="Contract Address"
              type="text"
              fullWidth
              variant="outlined"
              value={newContract.address}
              onChange={handleInputChange}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
  <ToastContainer position='top-center' />
</NavbarDiv>

    );
  };

  export default Navbar;
