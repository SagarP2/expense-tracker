const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');
const collabRoutes = require('./src/routes/collabRoutes');
const userRoutes = require('./src/routes/userRoutes');

dotenv.config();
connectDB();

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(mongoSanitize());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api',limiter);

app.use(express.json());

// Routes
app.use('/api/auth',authRoutes);
app.use('/api/transactions',transactionRoutes);
app.use('/api/collab',collabRoutes);
app.use('/api/users',userRoutes);

// Error handling middleware
app.use((err,req,res,next) => {
    console.error('Error:',err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT,() => console.log(`Server running on port ${PORT}`));
