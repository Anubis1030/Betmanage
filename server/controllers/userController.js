import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Bet from "../models/Bet.js";
import WebCoinTransaction from "../models/WebCoinTransaction.js";
import Notification from "../models/Notification.js";

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc    Register new user
export const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    // Check if email exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      phone: phone || null,
      coinBalance: 100, // Starting balance
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      coinBalance: user.coinBalance,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        coinBalance: user.coinBalance,
        role: user.role,
        isBlocked: user.isBlocked,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user stats (coins, active bets, win rate, total winnings)
// @route   GET /api/users/:id/stats
// @access  Private
export const getUserStats = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const bets = await Bet.find({ userId });
    const totalCoins = user.coinBalance;
    const activeBets = bets.filter(b => b.status === 'pending').length;
    const wonBets = bets.filter(b => b.status === 'won').length;
    const totalBets = bets.length;
    const winRate = totalBets > 0 ? Math.round((wonBets / totalBets) * 100) : 0;
    const totalWinnings = bets.filter(b => b.status === 'won').reduce((sum, b) => sum + (b.resultAmount || 0), 0);

    res.json({
      totalCoins,
      activeBets,
      winRate,
      totalWinnings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user recent activity (last 10 bets)
// @route   GET /api/users/:id/activity
// @access  Private
export const getUserActivity = async (req, res) => {
  try {
    const userId = req.params.id;
    const bets = await Bet.find({ userId })
      .populate('matchId', 'teamA teamB startTime result')
      .sort({ createdAt: -1 })
      .limit(10);
    const activities = bets.map(bet => ({
      id: bet._id,
      type: bet.status === 'pending' ? 'bet' : bet.status === 'won' ? 'win' : 'loss',
      description: bet.status === 'pending' ? 'New bet placed' : bet.status === 'won' ? 'Prediction won' : 'Prediction lost',
      amount: bet.amount,
      timestamp: bet.createdAt,
      match: bet.matchId ? `${bet.matchId.teamA} vs ${bet.matchId.teamB}` : '',
      odds: bet.odds,
      selectedTeam: bet.teamChosen,
      matchResult: bet.matchId && bet.matchId.result ? bet.matchId.result : null,
      matchDate: bet.matchId && bet.matchId.startTime ? bet.matchId.startTime : null
    }));
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user coin transaction history
// @route   GET /api/users/:id/transactions
// @access  Private
export const getUserTransactions = async (req, res) => {
  try {
    const userId = req.params.id;
    const transactions = await WebCoinTransaction.find({ userId })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user notifications
// @route   GET /api/users/:id/notifications
// @access  Private
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.id;
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      coinBalance: user.coinBalance,
      role: user.role,
      isBlocked: user.isBlocked
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};