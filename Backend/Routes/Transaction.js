import express from 'express';
import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js';
import Joi from 'joi';

const router = express.Router();

// Helper function to validate SWIFT code
const validateSwiftCode = (swiftCode) => {
    const swiftCodeRegex = /^[A-Z0-9]{8,11}$/;
    return typeof swiftCode === 'string' && swiftCodeRegex.test(swiftCode);
};

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const transactionSchema = Joi.object({
    fromAccountNumber: Joi.string()
      .required()
      .messages({
        'string.empty': 'From Account is required'
      }),
  
    toAccountNumber: Joi.string()
      .required()
      .messages({
        'string.empty': 'To Account is required'
      }),
  
    amount: Joi.number()
      .min(1)
      .required()
      .messages({
        'number.base': 'Amount is required',
        'number.min': 'Amount must be at least 1'
      }),
  
    currency: Joi.string()
      .valid('USD', 'EUR', 'GBP', 'JPY', 'AUD', 'ZAR', 'CAD', 'CHF', 'CNY')
      .length(3)
      .uppercase()
      .required()
      .messages({
        'string.empty': 'Currency is required',
        'any.only': 'Invalid currency',
        'string.length': 'Currency must be exactly 3 characters',
        'string.uppercase': 'Currency must be uppercase'
      }),
  
    paymentMethod: Joi.string()
      .valid('Credit Card', 'Debit Card', 'Bank Transfer', 'Paypal')
      .required()
      .messages({
        'string.empty': 'Payment method is required',
        'any.only': 'Invalid payment method'
      }),
  
    swiftCode: Joi.string()
      .required()
      .messages({
        'string.empty': 'Swift code is required'
      }),
  });

// Route to get all pending transactions (for employees)
router.get('/get', authMiddleware, async (req, res) => {
    try {
        const transactions = await Transaction.find({ status: 'Pending' });
        res.status(200).json({ transactions });
    } catch (err) {
        console.error('Error fetching transactions:', err.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to create a new transaction (for customers)
router.post('/create', authMiddleware, async (req, res) => {
    const { error } = transactionSchema.validate(req.body);
    if (error) return res.status(400).json({ message: 'Invalid input', details: error.details });

    const { fromAccountNumber, toAccountNumber, amount, currency, swiftCode, paymentMethod } = req.body;
    if (!validateSwiftCode(swiftCode)) return res.status(400).json({ message: 'Invalid SWIFT code' });

    try {

        console.log("From Account Number:", fromAccountNumber);
        console.log("To Account Number:", toAccountNumber);

        const fromUser = await User.findOne({ accountNumber: fromAccountNumber.toString().trim() }).lean();
        const toUser = await User.findOne({ accountNumber: toAccountNumber.toString().trim() }).lean();

        let errorMessage;

        if (!fromUser && !toUser) {
            errorMessage = 'Both account numbers not found';
        } else if (!fromUser) {
            errorMessage = 'From account number not found';
        } else if (!toUser) {
            errorMessage = 'To account number not found';
        }

        if (errorMessage) {
            return res.status(404).json({ message: errorMessage });
        }

        const transaction = new Transaction({
            fromAccount: fromUser._id,
            toAccount: toUser._id,
            fromAccountNumber,
            toAccountNumber,
            amount,
            currency: currency.toUpperCase().trim(),
            swiftCode: swiftCode.trim(),
            paymentMethod
        });

        await transaction.save();
        res.status(201).json({ message: 'Transaction created successfully', transaction });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// Route to update transaction status
router.put('/status/:id', authMiddleware, async (req, res) => {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });

    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

        transaction.status = status;
        await transaction.save();
        res.status(200).json({ message: `Transaction status updated to ${status}`, transaction });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// Route for employees to verify transactions
router.put('/verify/:id', authMiddleware, async (req, res) => {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid transaction ID' });

    try {
        const transaction = await Transaction.findOneAndUpdate(
            { _id: req.params.id, status: { $ne: 'completed' } },
            { status: 'verified' },
            { new: true }
        ).lean();

        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

        res.status(200).json({ message: 'Transaction verified and ready for submission' });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// Route to finalize submission to SWIFT
router.post('/submit/:id', authMiddleware, async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction || transaction.status !== 'verified') {
            return res.status(400).json({ message: 'Transaction not found or not verified' });
        }

        transaction.status = 'completed';
        await transaction.save();
        res.status(200).json({ message: 'Transaction successfully submitted', transaction });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

router.get('/my-transactions', authMiddleware, async (req, res) => {
    try {
        // Log user details from the token
        console.log('User information from token:', req.user);

        // Retrieve and log the account number for the logged-in user
        const accountNumber = req.user.userId;
        console.log('Logged-in user account number:', accountNumber);

        // Log that the transaction query is about to execute
        console.log('Querying transactions for account number:', accountNumber);

        const transactions = await Transaction.find({
            $or: [
                { fromAccount: accountNumber },
                { toAccount: accountNumber }
            ]
        })
        .populate('fromAccount', 'accountNumber fullName')  // Populate fromAccount details
        .populate('toAccount', 'accountNumber fullName');    // Populate toAccount details

        // Log the transactions returned from the database query
        console.log('Transactions found:', transactions);

        if (!transactions || transactions.length === 0) {
            console.log('No transactions found for account number:', accountNumber);
            return res.status(404).json({ message: 'No transactions found' });
        }

        // Log successful response before sending data
        console.log('Returning transactions for account number:', accountNumber);
        res.status(200).json({ transactions });
    } catch (err) {
        // Log the error in case of an exception
        console.error('Error fetching transactions:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});


// Logout Route
router.post('/logout', (req, res) => {
    try {
        // This response tells the client that the logout action was successful
        res.status(200).json({
            message: 'Logout successful.',
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to process logout', error: error.message });
    }
});

export default router;