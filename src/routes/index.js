import express from 'express';
import gameRoutes from './game.routes.js';
import userRoutes from './user.routes.js';
import matchRoutes from './match.routes.js';
import likeRoutes from './like.routes.js';
import messageRoutes from './message.routes.js';

const router = express.Router();

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Game Board Match API',
    version: '1.0.0',
    endpoints: {
      games: '/api/games',
      users: '/api/users',
      matches: '/api/matches',
      likes: '/api/likes',
      messages: '/api/messages'
    }
  });
});

// Routes
router.use('/games', gameRoutes);
router.use('/users', userRoutes);
router.use('/matches', matchRoutes);
router.use('/likes', likeRoutes);
router.use('/messages', messageRoutes);

export default router;

