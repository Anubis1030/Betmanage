import User from '../models/User.js';
import Bet from '../models/Bet.js';
import Report from '../models/report.js';
import WebCoinTransaction from '../models/WebCoinTransaction.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } 
};

// @desc    Toggle user block status
// @route   PUT /api/admin/users/:id/block
// @access  Private/Admin
export const toggleUserBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if(user) {
      user.isBlocked = !user.isBlocked;
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate settlement report
// @route   GET /api/admin/reports/settlement
// @access  Private/Admin
export const generateSettlementReport = async (req, res) => {
  try {
    // Get all completed bets in the last week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const bets = await Bet.find({ 
      createdAt: { $gte: oneWeekAgo },
      status: { $in: ['won', 'lost'] }
    }).populate('userId', 'name phone');
    
    // Get all manual transactions
    const transactions = await WebCoinTransaction.find({
      createdAt: { $gte: oneWeekAgo },
      reason: 'Manual Adjustment'
    }).populate('userId', 'name phone');
    
    // Calculate net balance changes
    const userBalances = {};
    
    bets.forEach(bet => {
      if(!userBalances[bet.userId._id]) {
        userBalances[bet.userId._id] = {
          user: bet.userId,
          netChange: 0
        };
      }
      
      if(bet.status === 'won') {
        userBalances[bet.userId._id].netChange += bet.resultAmount;
      } else {
        userBalances[bet.userId._id].netChange -= bet.amount;
      }
    });
    
    transactions.forEach(transaction => {
      if(!userBalances[transaction.userId._id]) {
        userBalances[transaction.userId._id] = {
          user: transaction.userId,
          netChange: 0
        };
      }
      
      if(transaction.type === 'credit') {
        userBalances[transaction.userId._id].netChange += transaction.amount;
      } else {
        userBalances[transaction.userId._id].netChange -= transaction.amount;
      }
    });
    
    // Format report
    const report = Object.values(userBalances).map(entry => ({
      userId: entry.user._id,
      name: entry.user.name,
      phone: entry.user.phone,
      netChange: entry.netChange,
      action: entry.netChange > 0 ? 'Collect' : 'Pay'
    }));
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};