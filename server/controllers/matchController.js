import Match from '../models/Match.js';
import asyncHandler from 'express-async-handler';

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
      // Get the winner from request body
      match.result = req.body.winner;
      match.status = 'Completed';
      
      // Store scores if provided (optional fields)
      if (req.body.teamAScore !== undefined) {
        match.teamAScore = req.body.teamAScore;
      }
      
      if (req.body.teamBScore !== undefined) {
        match.teamBScore = req.body.teamBScore;
      }
      
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

// @desc    Update match details
// @route   PUT /api/matches/:id
// @access  Private/Admin
export const updateMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Only allow updates if match is in Scheduled status
    if (match.status !== 'Scheduled') {
      return res.status(400).json({ message: 'Cannot update match that is already locked or completed' });
    }

    const { title, startTime, teamA, teamB, oddsA, oddsB } = req.body;

    if (title) match.title = title;
    if (startTime) match.startTime = startTime;
    if (teamA) match.teamA = teamA;
    if (teamB) match.teamB = teamB;
    if (oddsA) match.oddsA = oddsA;
    if (oddsB) match.oddsB = oddsB;

    const updatedMatch = await match.save();

    res.json(updatedMatch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};