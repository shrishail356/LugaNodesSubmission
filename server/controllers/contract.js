import { createError } from "../error.js";
import Contract from "../models/contractSchema.js";
  
export const fetchContracts = async (req, res, next) => {
    try {
        const contractData = await Contract.findOne();
        if (!contractData) {
          return res.status(404).json({ message: 'No contracts found' });
        }
        res.status(200).json({ contracts: contractData.contracts });
      } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
      }
}

export const addContract = async (req, res, next) => {
  try {
    const { name, address } = req.body;

    if (!name || !address) {
      return res.status(400).json({ message: 'Contract name and address are required' });
    }


    const contractData = await Contract.findOne();

    if (!contractData) {
      const newContract = new Contract({
        contracts: [{ name, address }]
      });
      await newContract.save();
    } else {

      if (contractData.contracts.length >= 3) {
        return res.status(400).json({ message: 'Cannot add more than 3 contracts' });
      }

      contractData.contracts.push({ name, address });
      await contractData.save();
    }

    res.status(200).json({ message: 'Contract added successfully', contract: { name, address } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteContract = async (req, res) => {
    try {
      const { address } = req.body;
      if (!address) {
        return res.status(400).json({ message: 'Contract address is required' });
      }
      
      const contractData = await Contract.findOne();
      if (!contractData) {
        return res.status(404).json({ message: 'Contract not found' });
      }
  
      const updatedContracts = contractData.contracts.filter(contract => contract.address !== address);
      
      if (updatedContracts.length === contractData.contracts.length) {
        return res.status(404).json({ message: 'Contract not found' });
      }
      
      contractData.contracts = updatedContracts;
      await contractData.save();
  
      res.status(200).json({ message: 'Contract deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  