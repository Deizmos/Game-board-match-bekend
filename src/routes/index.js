import express from 'express';
import gameRoutes from './game.routes.js';

const router = express.Router();

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Game Board Match API',
    version: '1.0.0',
    endpoints: {
      games: '/api/games'
    }
  });
});

// Game routes
router.use('/games', gameRoutes);

export default router;

