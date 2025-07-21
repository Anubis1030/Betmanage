module.exports = {
  User: mongoose.model('User', userSchema),
  Match: mongoose.model('Match', matchSchema),
  Bet: mongoose.model('Bet', betSchema),
  Transaction: mongoose.model('Transaction', transactionSchema),
  Report: mongoose.model('Report', reportSchema)
};
