import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['withdrawal', 'issue', 'request'], 
    required: true 
  },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'resolved', 'rejected'], 
    default: 'pending' 
  }
}, { timestamps: true });

export default mongoose.model('Report', ReportSchema);