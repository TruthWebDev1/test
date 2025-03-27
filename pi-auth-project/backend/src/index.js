const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/payment', paymentRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
