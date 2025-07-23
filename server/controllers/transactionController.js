import WebCoinTransaction from '../models/WebCoinTransaction.js';
import User from '../models/User.js';

// @desc    Adjust user coins
// @route   POST /api/transactions/adjust
// @access  Private/Admin
export const adjustUserCoins = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    
    if(!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user balance
    if(req.body.type === 'credit') {
      user.coinBalance += req.body.amount;
    } else {
      if(req.body.amount > user.coinBalance) {
        return res.status(400).json({ message: 'Insufficient coins' });
      }
      user.coinBalance -= req.body.amount;
    }
    
    await user.save();
    
    // Create transaction record
    const transaction = new WebCoinTransaction({
      userId: req.body.userId,
      type: req.body.type,
      amount: req.body.amount,
      reason: req.body.reason
    });
    
    const createdTransaction = await transaction.save();
    res.status(201).json(createdTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user transactions
// @route   GET /api/transactions/user/:userId
// @access  Private/Admin
export const getUserTransactions = async (req, res) => {
  try {
    const transactions = await WebCoinTransaction.find({ 
      userId: req.params.userId 
    }).sort({ createdAt: -1 });
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};