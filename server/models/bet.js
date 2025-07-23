import mongoose from 'mongoose';

const BetSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  matchId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Match', 
    required: true 
  },
  teamChosen: { 
    type: String, 
    enum: ['TeamA', 'TeamB'], 
    required: true 
  },
  amount: { type: Number, required: true, min: 1 },
  odds: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'won', 'lost'], 
    default: 'pending' 
  },
  resultAmount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Bet', BetSchema);