import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import Contract from './models/contractSchema.js';  
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import contractRoutes from './routes/contracts.js';
import latestTransactionRoutes from './routes/latestTransaction.js';
import favouritesRoute from "./routes/favourite.js";
import searchTransactionRoute from "./routes/searchTransaction.js";
import ethPriceRoute from "./routes/ethPrice.js";
import webhookRoutes from "./routes/webhook.js";
const app = express();
dotenv.config();

app.use(express.json());
const corsConfig = {
    credentials: true,
    origin: true,
};
app.use(cors(corsConfig));

const port = process.env.PORT || 8000;  


const connect = async () => {
    mongoose.set('strictQuery', true);
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✅ MongoDB connected successfully');
        await initializeDefaultContract(); 
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
    }
};

const initializeDefaultContract = async () => {
    try {
        const existingContracts = await Contract.findOne(); 
        if (!existingContracts) {
            const defaultContract = {
                name: "Beacon Deposit Contract",
                address: "0x00000000219ab540356cBB839Cbe05303d7705Fa"
            };
            const newContractData = new Contract({
                contracts: [defaultContract],
            });
            await newContractData.save();
            console.log("🟢 Default contract initialized in the database.");
        } else {
            console.log("⚠️ Contracts already exist. No need to add default.");
        }
    } catch (error) {
        console.error("❌ Error initializing default contract:", error.message);
    }
};

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/contract", contractRoutes);
app.use("/api/latest", latestTransactionRoutes);
app.use("/api/add", favouritesRoute);
app.use("/api/get", favouritesRoute);
app.use("/api/remove", favouritesRoute);
app.use("/api/check", favouritesRoute);
app.use("/api/search", searchTransactionRoute);
app.use("/api/price", ethPriceRoute);
app.use("/api/hooks", webhookRoutes);
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(status).json({
        success: false,
        status,
        message
    });
});

app.listen(port, () => {
    console.log(`🚀 Server started and listening on port ${port}`);
    connect(); 
});
