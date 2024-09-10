import mongoose from 'mongoose';

const contractSchemaHooks = new mongoose.Schema({
    contractAddress: { type: String, required: true, unique: true },
    deposits: [
        {
            blockNumber: { type: Number, required: true },
            blockTimestamp: { type: Date, required: true },
            fee: { type: Number, required: true },
            hash: { type: String, required: true },
            pubkey: { type: String, required: true },
            additionalData: { type: Object }
        }
    ]
});

export default mongoose.model("ContractHooks", contractSchemaHooks);

