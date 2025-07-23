import Bet from '../models/Bet.js';
import User from '../models/User.js';
import Match from '../models/Match.js';

// @desc    Place a new bet
// @route   POST /api/bets
// @access  Private
export const placeBet = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const match = await Match.findById(req.body.matchId);
    
    // Validate bet
    if(!match || match.status !== 'Scheduled') {
      return res.status(400).json({ 
        success: false,
        message: 'Match not available for betting' 
      });
    }
    
    if(req.body.amount > user.coinBalance) {
      return res.status(400).json({ 
        success: false,
        message: 'Insufficient coins' 
      });
    }
    
    // Deduct coins from user
    user.coinBalance -= req.body.amount;
    await user.save();
    
    // Create bet
    const bet = new Bet({
      userId: req.user._id,
      matchId: req.body.matchId,
      teamChosen: req.body.teamChosen,
      amount: req.body.amount,
      odds: req.body.teamChosen === 'TeamA' ? match.oddsA : match.oddsB
    });
    
    const createdBet = await bet.save();
    
    res.status(201).json({
      success: true,
      data: createdBet
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get all bets for current user
// @route   GET /api/bets/my-bets
// @access  Private
export const getUserBets = async (req, res) => {
  try {
    const bets = await Bet.find({ userId: req.user._id })
      .populate('matchId', 'title teamA teamB startTime status result')
      .sort({ createdAt: -1 });
      
    res.json({
      success: true,
      count: bets.length,
      data: bets
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get all bets for a specific match
// @route   GET /api/bets/match/:matchId
// @access  Private/Admin
export const getMatchBets = async (req, res) => {
  try {
    const bets = await Bet.find({ matchId: req.params.matchId })
      .populate('userId', 'name phone')
      .sort({ createdAt: -1 });
      
    res.json({
      success: true,
      count: bets.length,
      data: bets
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Process completed bets (admin only)
// @route   POST /api/bets/process
// @access  Private/Admin
export const processBets = async (req, res) => {
  try {
    const completedMatches = await Match.find({ 
      status: 'Completed', 
      result: { $ne: null } 
    });
    
    let processedCount = 0;
    
    for(const match of completedMatches) {
      const bets = await Bet.find({ 
        matchId: match._id, 
        status: 'pending' 
      });
      
      for(const bet of bets) {
        const user = await User.findById(bet.userId);
        if(!user) continue;
        
        if(bet.teamChosen === match.result) {
          // User won
          const winnings = bet.amount * bet.odds;
          bet.status = 'won';
          bet.resultAmount = winnings;
          user.coinBalance += winnings;
        } else {
          // User lost
          bet.status = 'lost';
          bet.resultAmount = 0;
        }
        
        await bet.save();
        await user.save();
        processedCount++;
      }
    }
    
    res.json({
      success: true,
      message: `Processed ${processedCount} bets`,
      data: processedCount
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};