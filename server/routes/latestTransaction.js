import  axios from 'axios';
import express from "express";
const router = express.Router();
const fetchTransactions = async (address, limit = 100, maxTransactions = 1000) => {
    try {
        let cursor = null;
        let allData = [];

        while (allData.length < maxTransactions) {
            let url = `${process.env.MORALIS_BASE_URL}/${address}?chain=eth&limit=${limit}&order=DESC`;
            if (cursor) {
                url += `&cursor=${cursor}`;
            }
            const response = await axios.get(url, {
                headers: {
                    'accept': 'application/json',
                    'X-API-Key': process.env.MORALIS_API_KEY,
                }
            });

            const data = response.data.result;
            allData = allData.concat(data);

            cursor = response.data.cursor;
            if (!cursor || allData.length >= maxTransactions) {
                break;
            }
        }

        return allData.slice(0, maxTransactions);
    } catch (error) {
        if (error.response) {
            console.error('Moralis API Error:', error.response.data);
            throw new Error(`Moralis API Error: ${error.response.statusText} (status code: ${error.response.status})`);
        } else if (error.request) {
            console.error('No response received from Moralis API:', error.request);
            throw new Error('No response from Moralis API. Please try again later.');
        } else {
            console.error('Error setting up the Moralis API request:', error.message);
            throw new Error('Error in Moralis API request setup.');
        }
    }
};

router.post('/transaction', async (req, res) => {
    const { address } = req.body;
    if (!address) {
        return res.status(400).json({ error: 'Ethereum address is required' });
    }
    try {
        const transactions = await fetchTransactions(address);
        
        if (transactions && transactions.length > 0) {
            return res.status(200).json({ message: 'Transactions fetched successfully', data: transactions });
        } else {
            return res.status(404).json({ message: 'No transactions found for the given address' });
        }
    } catch (error) {
        console.error('Error in /transaction route:', error.message);
        return res.status(500).json({ error: error.message || 'An unexpected error occurred' });
    }
});
export default router;

