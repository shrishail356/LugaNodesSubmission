import  FavoriteTransaction from '../models/favourites.js';

export const addFavoriteTransaction = async (req, res) => {
    const { transaction } = req.body;

    try {
        
        const existingTransaction = await FavoriteTransaction.findOne({ hash: transaction.hash });

        if (existingTransaction) {
            return res.status(400).json({ message: 'Transaction is already marked as a favorite.' });
        }

        
        const newFavoriteTransaction = new FavoriteTransaction({
            ...transaction 
        });
        const savedTransaction = await newFavoriteTransaction.save();
        res.status(201).json(savedTransaction);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add favorite transaction' });
    }
};

export const getFavoriteTransaction = async (req, res) => {
    try {
        const favoriteTransactions = await FavoriteTransaction.find();
        res.status(200).json(favoriteTransactions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch favorite transactions' });
    }
};

export const removeFavoriteTransaction = async (req, res) => {
    const { hash } = req.params;

    try {
        const result = await FavoriteTransaction.deleteOne({ hash });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Transaction not found in favorites.' });
        }

        res.status(200).json({ message: 'Transaction removed from favorites.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove favorite transaction' });
    }
};

export const checkTransactionExists = async (req, res) => {
    const { hash } = req.params;

    try {
        
        const existingTransaction = await FavoriteTransaction.findOne({ hash });
        res.status(200).json({ exists: !!existingTransaction });
    } catch (error) {
        res.status(500).json({ error: 'Failed to check transaction existence' });
    }
};