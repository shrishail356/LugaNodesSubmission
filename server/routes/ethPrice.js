

import express from 'express';
import axios from 'axios';
const router = express.Router();

router.get('/getPrice', async (req, res) => {
  try {
    const moralisBaseUrl = process.env.MORALIS_BASE_URL;
    const moralisApiKey = process.env.MORALIS_API_KEY;
    if (!moralisBaseUrl || !moralisApiKey) {
      throw new Error('Missing environment variables');
    }
    const url = `${moralisBaseUrl}/erc20/0xC02aaA39b223FE8D0A0E5C4F27eAD9083C756Cc2/price?chain=eth&include=percent_change`;

    const response = await axios.get(url, {
      headers: {
        accept: 'application/json',
        'X-API-Key': moralisApiKey,
      },
    });

    const ethPriceInUSD = response.data.usdPrice;
    console.log(ethPriceInUSD);
    return res.status(200).json({ price: ethPriceInUSD });
  } catch (error) {
    console.error('Error fetching price:', error.message);
    return res.status(500).json({ message: 'Error fetching price' });
  }
});

export default router;

