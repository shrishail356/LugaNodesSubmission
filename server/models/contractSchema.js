import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema({
  contracts: [
    {
      name: { type: String, required: true },
      address: { type: String, required: true }
    }
  ]
});

export default mongoose.model('Contract', contractSchema);
