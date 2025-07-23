import mongoose from 'mongoose';

const MatchSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startTime: { type: Date, required: true },
  teamA: { type: String, required: true },
  teamB: { type: String, required: true },
  oddsA: { type: Number, required: true, min: 1 },
  oddsB: { type: Number, required: true, min: 1 },
  status: { 
    type: String, 
    enum: ['Scheduled', 'Ongoing', 'Completed'], 
    default: 'Scheduled' 
  },
  result: { 
    type: String, 
    enum: ['TeamA', 'TeamB', 'Draw'], 
    default: null 
  }
}, { timestamps: true });

export default mongoose.model('Match', MatchSchema);