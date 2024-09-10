import express from "express";
const router = express.Router();
import { fetchContracts, addContract, deleteContract } from '../controllers/contract.js'; // Import the deleteContract function

router.post("/fetch", fetchContracts);
router.post("/add", addContract);
router.delete("/delete", deleteContract); 

export default router;
