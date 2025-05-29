const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.route.js');
const eventRoutes = require('./routes/events.route.js');

const app = express();

// Middleware
app.use(express.json());

// Configure CORS to allow requests from your frontend
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});