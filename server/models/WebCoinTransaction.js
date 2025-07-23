import mongoose from 'mongoose';

const WebCoinTransactionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['credit', 'debit'], 
    required: true 
  },
  amount: { type: Number, required: true, min: 1 },
  reason: { type: String, trim: true }
}, { timestamps: true });

export default mongoose.model('WebCoinTransaction', WebCoinTransactionSchema);