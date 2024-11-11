// import './config.js';
// import express from 'express';
// import cors from 'cors';
// import https from 'https';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import fs from 'fs';
// import connectDB from './db/connection.js'; 
// import authRoutes from './Routes/auth.js'; 
// import transactionRoutes from './Routes/Transaction.js';

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Connect to the database
// connectDB();

// // Middleware
// app.use(helmet()); // Security headers
// app.use(express.json()); // Parse JSON bodies
// app.use(morgan('combined')); // Log HTTP requests
// // app.use(cors({
// //     origin: 'http://localhost:3000', 
// app.use(cors({}));
// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api', transactionRoutes);

// // SSL Certificate and key
// const options = {
//     key: fs.readFileSync('Keys/server.key'),
//     cert: fs.readFileSync('Keys/server.cert')
// };


// // HTTPS Server
// https.createServer(options, app).listen(PORT, () => {
//     console.log(`Secure server is running on https://localhost:${PORT}`);
// });

// // This method was adapted from various tutorials on setting up an HTTPS server with Express
// // https://adamtheautomator.com/https-nodejs/


import './config.js';
import express from 'express';
import cors from 'cors';
import https from 'https';
import helmet from 'helmet';
import morgan from 'morgan';
import fs from 'fs';
import rateLimit from 'express-rate-limit'; // Import rate-limit
import connectDB from './db/connection.js'; 
import authRoutes from './Routes/auth.js'; 
import transactionRoutes from './Routes/Transaction.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});

// Middleware
app.use(helmet()); // Security headers
app.use(express.json()); // Parse JSON bodies
app.use(morgan('combined')); // Log HTTP requests
app.use(cors({})); // Enable CORS for specified origins

// Apply rate limiting to all API routes
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes); // Auth routes, e.g., login, register
app.use('/api', transactionRoutes); // Transaction routes

// SSL Certificate and key
const options = {
    key: fs.readFileSync('Keys/server.key'),
    cert: fs.readFileSync('Keys/server.cert')
};

// HTTPS Server
https.createServer(options, app).listen(PORT, () => {
    console.log(`Secure server is running on https://localhost:${PORT}`);
});
