import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import sequelize from './config/database.js';
import employeeRoutes from './routes/employeeRoutes.js';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/employees', employeeRoutes);

// Test DB Connection and Sync
sequelize.sync({ force: false }).then(() => {
    console.log('Database synced successfully.');
}).catch(err => {
    console.error('Database sync failed:', err);
});

// Transporter Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Store OTPs temporarily (In-memory for simplicity, use Redis/DB in prod)
const otpStore = new Map();

// Endpoint to Send OTP
app.post('/api/send-otp', async (req, res) => {
    const { email, name } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        // Save OTP with expiry (5 mins)
        otpStore.set(email, {
            otp,
            expires: Date.now() + 5 * 60 * 1000
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'DayFlow - Verify Your Identity',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #A855F7;">DayFlow Identity Verification</h2>
                    <p>Hello ${name || 'User'},</p>
                    <p>You are attempting to activate your HR Administrator account.</p>
                    <p>Your One-Time Password (OTP) is:</p>
                    <h1 style="background: #f3f3f3; padding: 10px; display: inline-block; border-radius: 5px;">${otp}</h1>
                    <p>This code expires in 5 minutes.</p>
                    <p>If you did not request this, please ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}`);
        res.status(200).json({ message: "OTP sent successfully" });

    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email. Check server logs." });
    }
});

// Endpoint to Verify OTP
app.post('/api/verify-otp', (req, res) => {
    const { email, otp } = req.body;

    const record = otpStore.get(email);

    if (!record) {
        return res.status(400).json({ valid: false, message: "No OTP found for this email. Please request a new one." });
    }

    if (Date.now() > record.expires) {
        otpStore.delete(email);
        return res.status(400).json({ valid: false, message: "OTP has expired." });
    }

    if (record.otp === otp) {
        otpStore.delete(email); // Invalidate after use
        return res.status(200).json({ valid: true, message: "Verification Successful" });
    } else {
        return res.status(400).json({ valid: false, message: "Invalid OTP" });
    }
});


if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Backend Server running on http://localhost:${PORT}`);
    });
}

export default app;

