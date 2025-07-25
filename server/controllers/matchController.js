import Match from '../models/Match.js';

// @desc    Create a new match
// @route   POST /api/matches
// @access  Private/Admin
export const createMatch = async (req, res) => {
  try {
    const match = new Match({
      title: req.body.title,
      startTime: req.body.startTime,
      teamA: req.body.teamA,
      teamB: req.body.teamB,
      oddsA: req.body.oddsA,
      oddsB: req.body.oddsB
    });

    const createdMatch = await match.save();  
    res.status(201).json(createdMatch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lock a match
// @route   PUT /api/matches/:id/lock
// @access  Private/Admin
export const lockMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    
    if(match) {
      match.status = 'Locked';
      const updatedMatch = await match.save();
      res.json(updatedMatch);
    } else {
      res.status(404).json({ message: 'Match not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Set match result
// @route   PUT /api/matches/:id/result
// @access  Private/Admin
export const setMatchResult = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    
    if(match) {
      match.result = req.body.result;
      match.status = 'Completed';
      
      const updatedMatch = await match.save();
      res.json(updatedMatch);
    } else {
      res.status(404).json({ message: 'Match not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get active matches
// @route   GET /api/matches/active
// @access  Public
export const getActiveMatches = async (req, res) => {
  try {
    const matches = await Match.find({ status: { $in: ['Scheduled', 'Ongoing'] } });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get match by ID
// @route   GET /api/matches/:id
// @access  Public
export const getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (match) {
      res.json(match);
    } else {
      res.status(404).json({ message: 'Match not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get completed matches
// @route   GET /api/matches/completed
// @access  Public
export const getCompletedMatches = async (req, res) => {
  try {
    const matches = await Match.find({ status: 'Completed' });
    res.json({ success: true, data: matches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get upcoming matches
// @route   GET /api/matches/upcoming
// @access  Public
export const getUpcomingMatches = async (req, res) => {
  try {
    const matches = await Match.find({ status: 'Scheduled' });
    res.json({ success: true, data: matches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};