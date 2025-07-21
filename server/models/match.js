import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  matchId: {
    type: String,
    required: true
  },
  teamA: String,
  teamB: String,
  matchTime: Date,
  odds: {
    teamA: Number,
    teamB: Number,
    draw: Number
  },
  isActive: {
    type: Boolean,
    default: true
  },
  result: {
    type: String,
    enum: ['teamA', 'teamB', 'draw', 'pending'],
    default: 'pending'
  }
});

module.exports = mongoose.model('Match', matchSchema);