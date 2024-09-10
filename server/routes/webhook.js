import express from 'express';
import bodyParser from 'body-parser';
import Contract from '../models/contract.js';
import User from '../models/User.js';
import nodemailer from 'nodemailer';
import TelegramBot from 'node-telegram-bot-api';

const router = express.Router();
const app = express();
app.use(bodyParser.json());

// Nodemailer setup
const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
        user: 'placements@shrishail.io',
        pass: 'Shrishail@356',
    },
});

async function sendEmailNotification(toEmail, fromAddress, toAddress, hash, value, asset, blockNumber) {
    const mailOptions = {
        from: 'placements@shrishail.io',
        to: toEmail,
        subject: '💸 New Transaction Alert - Details Inside!',
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px;">
                <h2 style="color: #4caf50;">💸 New Transaction Detected!</h2>
                <p style="font-size: 16px; color: #555;">Exciting news! A new transaction has just occurred on the blockchain.</p>
            </div>
            
            <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin-top: 20px;">
                <h3 style="margin-bottom: 10px;">🔗 Transaction Details</h3>
                <p style="font-size: 15px;">
                    <strong>Transaction Hash:</strong> 
                    <a href="https://etherscan.io/tx/${hash}" style="color: #007bff; text-decoration: none;" target="_blank">${hash}</a>
                </p>
                <p style="font-size: 15px;">
                    <strong>From:</strong> 
                    <span style="background-color: #f1f1f1; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${fromAddress}</span>
                </p>
                <p style="font-size: 15px;">
                    <strong>To:</strong> 
                    <span style="background-color: #f1f1f1; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${toAddress}</span>
                </p>
                <p style="font-size: 15px;">
                    <strong>Value:</strong> 
                    <span style="color: #28a745; font-weight: bold;">${value} ${asset}</span>
                </p>
                <p style="font-size: 15px;">
                    <strong>Block Number:</strong> 
                    <span style="color: #6c757d;">${blockNumber}</span>
                </p>
            </div>

            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin-top: 20px;">
                <p style="font-size: 14px; color: #555;">
                    🎉 Stay tuned for more updates on your blockchain activity!
                </p>
                <p style="font-size: 12px; color: #888;">
                    If you did not initiate this transaction, please contact support immediately.
                </p>
            </div>

            <footer style="text-align: center; padding-top: 10px; font-size: 12px; color: #aaa;">
                <p>Powered by <a href="https://etherscan.io" style="color: #007bff; text-decoration: none;" target="_blank">Etherscan</a></p>
            </footer>
        </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${toEmail}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

const botToken = process.env.BOT_TOKEN;
const bot = new TelegramBot(botToken, { polling: true });
let chatId = undefined; 

bot.onText(/\/start/, (msg) => {
    chatId = msg.chat.id;
    bot.sendMessage(chatId, "Hello! Your transaction notification bot is now active.");
});

async function sendTelegramNotification(fromAddress, toAddress, hash, value, blockNumber, asset) {
    if (!chatId) {
        console.log("Chat ID is not set. Please send /start command to the bot.");
        return;
    }

    const message = `
<b>💸 New Transaction Detected!</b>

🔗 <b>Transaction Hash:</b> <a href="https://etherscan.io/tx/${hash}">${hash}</a>

👤 <b>From:</b> <code>${fromAddress}</code>
🏦 <b>To:</b> <code>${toAddress}</code>
💰 <b>Value:</b> ${value} ${asset}
🔢 <b>Block Number:</b> ${blockNumber}

🎉 Stay tuned for more updates! 🎉
    `;

    try {
        await bot.sendMessage(chatId, message, { parse_mode: "HTML" });
        console.log(`Telegram message sent to chat ID: ${chatId}`);
    } catch (error) {
        console.error('Error sending message to Telegram:', error);
    }
}
router.post('/addContract', async (req, res) => {
    try {
        const { contractAddress } = req.body;

        if (!contractAddress) {
            return res.status(400).json({ success: false, message: 'Contract address is required' });
        }

        const existingContract = await Contract.find({ contractAddress });

        if (existingContract) {
            return res.status(400).json({ success: false, message: 'Contract with this address already exists' });
        }

        const newContract = new Contract({
            contractAddress,
            deposits: [] 
        });

        await newContract.save();

        res.status(201).json({ success: true, message: 'Contract added successfully', contract: newContract });
    } catch (error) {
        console.error('Error adding contract:', error);
        res.status(500).json({ success: false, message: 'Error adding contract' });
    }
});

router.post('/:contractAddress/webhook', async (req, res) => {
    try {
        const { contractAddress } = req.params;
        const { event } = req.body;

        if (!event || !event.activity || event.activity.length === 0) {
            return res.status(400).json({ success: false, message: 'No activity data found in the request.' });
        }

        const user = await User.findOne();
        if (!user || !user.email) {
            return res.status(500).json({ success: false, message: 'User email not found.' });
        }

        for (const activity of event.activity) {
            const { fromAddress, toAddress, blockNum, hash, value, asset, category, rawContract } = activity;

            if (toAddress.toLowerCase() !== contractAddress.toLowerCase()) {
                return res.status(400).json({ success: false, message: 'Invalid contract address' });
            }

            const newDeposit = {
                blockNumber: parseInt(blockNum, 16),  
                blockTimestamp: new Date(), 
                hash: hash, 
                pubkey: fromAddress,  
                fee: 0,  
                additionalData: {
                    value: value,  
                    asset: asset,  
                    category: category,  
                    rawContract: rawContract  
                }
            };

            let contract = await Contract.findOne({ contractAddress });

            if (contract) {
                const depositExists = contract.deposits.some(deposit => deposit.hash === newDeposit.hash);
                if (depositExists) {
                    return res.status(200).json({ success: true, message: `Transaction already exists for contract ${contractAddress}` });
                }

                contract.deposits.push(newDeposit);
            } else {
                contract = new Contract({
                    contractAddress: contractAddress,
                    deposits: [newDeposit]
                });
            }

            await contract.save();
            await sendEmailNotification(user.email, fromAddress, toAddress, hash, value);
            await sendTelegramNotification(fromAddress, toAddress, hash, value, newDeposit.blockNumber, asset);
        }

        res.status(200).json({ success: true, message: `Transaction data for contract ${contractAddress} saved and notifications sent.` });
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({ success: false, message: `Error saving transaction data: ${error.message}` });
    }
});

export default router;
