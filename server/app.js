import express from 'express';
import connectDB from './utils/db.js'; 
import mainRouter from './routes/userRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect Database
connectDB(); 

// Middleware
app.use(express.json());

// Routes
app.use('/api', mainRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});