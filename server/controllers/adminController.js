import User from '../models/User.js';
import Bet from '../models/Bet.js';
import Match from '../models/Match.js';
import WebCoinTransaction from '../models/WebCoinTransaction.js';

// @desc    Get all users (paginated, with optional search)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const query = search
      ? { $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ] }
      : {};
    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await User.countDocuments(query);
    res.json({ success: true, data: users, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

// @desc    Get platform-wide admin stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    const [userCount, betCount, matchCount, transactionCount, users] = await Promise.all([
      User.countDocuments(),
      Bet.countDocuments(),
      Match.countDocuments(),
      WebCoinTransaction.countDocuments(),
      User.find({}, 'coinBalance')
    ]);
    const totalCoins = users.reduce((sum, u) => sum + (u.coinBalance || 0), 0);
    res.json({
      success: true,
      data: {
        userCount,
        betCount,
        matchCount,
        transactionCount,
        totalCoins
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get recent bets (admin)
// @route   GET /api/admin/bets/recent
// @access  Private/Admin
export const getRecentBets = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const bets = await Bet.find()
      .populate('userId', 'name email')
      .populate('matchId', 'title teamA teamB startTime status result')
      .sort({ createdAt: -1 })
      .limit(Number(limit));
    res.json({ success: true, data: bets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};