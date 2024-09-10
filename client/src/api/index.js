import axios from 'axios';
import jwt_decode from 'jwt-decode';
const baseApiUrl = process.env.REACT_APP_BASE_API_URL
const API = axios.create({ baseURL: baseApiUrl }); 

//auth
export const signIn = async ({ email, password }) => await API.post('/auth/signin', { email, password });
export const signUp = async ({
    name,
    email,
    phoneNumber,
    password,
    telegramId 
}) => {
    const payload = {
        name,
        email,
        phoneNumber,
        password,
    };
    if (telegramId) {
        payload.telegramId = telegramId;
    }
    return await API.post('/auth/signup', payload);
};

export const googleSignIn = async ({
    name,
    email,
    img,
}) => await API.post('/auth/google', {
    name,
    email,
    img,
});
export const findUserByEmail = async (email) => await API.get(`/auth/findbyemail?email=${email}`);
export const generateOtp = async (email,name,reason) => await API.get(`/auth/generateotp?email=${email}&name=${name}&reason=${reason}`);
export const verifyOtp = async (otp) => await API.get(`/auth/verifyotp?code=${otp}`);
export const resetPassword = async (email,password) => await API.put(`/auth/forgetpassword`,{email,password});

//user api
export const getUsers = async (token) => await API.get('/user', { headers: { "Authorization" : `Bearer ${token}` }},{
    withCredentials: true
    });
export const searchUsers = async (search,token) => await API.get(`users/search/${search}`,{ headers: { "Authorization" : `Bearer ${token}` }},{ withCredentials: true });
// api/index.js
export const getContracts = async () => {
    try {
      const response = await API.post('/contract/fetch');
      console.log('API Response:', response); // Add this log
      return response;
    } catch (error) {
      console.error('API Call Error:', error);
      throw error;
    }
  };

  export const addContract = async ({ name, address }) => {
    try {
      const response = await API.post('/contract/add', { name, address });
      console.log('Add Contract Response:', response); 
      return response;
    } catch (error) {
      console.error('API Call Error:', error);
      throw error;
    }
  };
// In api/index.js
export const deleteContract = async (address) => {
    try {
      const response = await API.delete('/contract/delete', { data: { address } });
      console.log('Delete Contract Response:', response);
      return response;
    } catch (error) {
      console.error('API Call Error:', error);
      throw error;
    }
  };
  
export const fetchTransactions = async (address) => {
  try {
    const response = await API.post('/latest/transaction', { address });
    console.log('Fetch Transactions Response:', response);
    return response;
  } catch (error) {
    console.error('API Call Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const addToFavorites = async (transaction) => {
  try {
    const response = await API.post('/add/favorites', { transaction });
    return response.data;
  } catch (error) {
    console.error('Error adding to favorites', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getFavoriteTransactions = async () => {
  try {
    const response = await API.post('/get/getfavorites');
    console.log("FAVOURITES DATA : ", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching favorite transactions', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const removeFavoriteTransaction = async (hash) => {
  try {
      const response = await API.delete(`/remove/favorites/${hash}`);
      console.log('Remove Favorite Transaction Response:', response);
      return response.data;
  } catch (error) {
      console.error('Error removing favorite transaction', error.response ? error.response.data : error.message);
      throw error;
  }
};
export const checkTransactionExists = async (hash) => {
  try {
    const response = await API.get(`/favorites/check/${hash}`);
    console.log('Check Transaction Exists Response:', response);
    return response.data.exists; 
  } catch (error) {
    console.error('Error checking transaction existence', error.response ? error.response.data : error.message);
    throw error;
  }
};

// In api/index.js
export const searchTransactions = async (txHash) => {
  try {
    const response = await API.post('/search/transaction', { txHash });
    console.log('Search Transactions Response:', response);
    return response.data; // Assuming response.data contains the transaction details
  } catch (error) {
    console.error('API Call Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getEthPrice = async () => {
  try {
    const response = await API.get('/price/getPrice');
    console.log('Get ETH Price Response:', response);
    return response.data.price; // Adjust if your API response format is different
  } catch (error) {
    console.error('Error fetching ETH price:', error.response ? error.response.data : error.message);
    throw error;
  }
};
export const addContractHook = async ({ contractAddress }) => {
  try {
    // Make a POST request to the /hooks/addContract endpoint
    const response = await API.post('/hooks/addContract', { contractAddress });
    console.log('Add Contract Response:', response); // Log the response for debugging
    return response; // Return the response to be handled by the caller
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.error('Error: Contract already exists in the database');
      return { success: false, message: 'Contract with this address already exists in the database' };
    } else {
      console.error('API Call Error:', error.response ? error.response.data : error.message);
      throw error; // Re-throw the error to be handled by the caller
    }
  }
};
