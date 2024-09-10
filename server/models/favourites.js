import mongoose from 'mongoose';

// Define the FavoriteTransaction schema
const favoriteTransactionSchema = new mongoose.Schema({
    hash: {
        type: String,
        required: true
    },
    nonce: {
        type: String
    },
    transaction_index: {
        type: String
    },
    from_address_entity: {
        type: String
    },
    from_address_entity_logo: {
        type: String
    },
    from_address: {
        type: String,
        required: true
    },
    from_address_label: {
        type: String
    },
    to_address_entity: {
        type: String
    },
    to_address_entity_logo: {
        type: String
    },
    to_address: {
        type: String,
        required: true
    },
    to_address_label: {
        type: String
    },
    value: {
        type: String,
        required: true
    },
    gas: {
        type: String
    },
    gas_price: {
        type: String
    },
    input: {
        type: String
    },
    receipt_cumulative_gas_used: {
        type: String
    },
    receipt_gas_used: {
        type: String
    },
    receipt_contract_address: {
        type: String
    },
    receipt_root: {
        type: String
    },
    receipt_status: {
        type: String
    },
    block_timestamp: {
        type: Date,
        required: true
    },
    block_number: {
        type: String,
        required: true
    },
    block_hash: {
        type: String
    },
    transfer_index: {
        type: [Number] 
    },
    transaction_fee: {
        type: String
    }
}, {
    timestamps: true 
});

export default mongoose.model('FavoriteTransaction', favoriteTransactionSchema);
