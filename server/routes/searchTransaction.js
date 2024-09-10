
import  express from 'express';
import { Alchemy, Network } from 'alchemy-sdk';

const router = express.Router();

const config = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET, 
};


const alchemy = new Alchemy(config);

router.post('/transaction', async (req, res) => {
  try {
    const { txHash } = req.body;

    if (!txHash || typeof txHash !== 'string') {
      return res.status(400).json({ error: 'Invalid transaction hash' });
    }

    const response = await alchemy.transact.getTransaction(txHash);

    res.json(response);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
