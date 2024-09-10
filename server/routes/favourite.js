import express from "express";
const router = express.Router();
import  { addFavoriteTransaction,getFavoriteTransaction,removeFavoriteTransaction, checkTransactionExists} from '../controllers/favoriteTransactionController.js';

router.post('/favorites', addFavoriteTransaction);
router.post('/getfavorites', getFavoriteTransaction);
router.delete('/favorites/:hash', removeFavoriteTransaction);
router.get('/favorites/check/:hash', checkTransactionExists); 
export default router;
