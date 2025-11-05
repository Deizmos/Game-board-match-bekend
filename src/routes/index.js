import express from 'express';
import authRoutes from './auth.routes.js';
import gameRoutes from './game.routes.js';
import userRoutes from './user.routes.js';
import matchRoutes from './match.routes.js';
import likeRoutes from './like.routes.js';
import messageRoutes from './message.routes.js';
import geolocationRoutes from './geolocation.routes.js';

const router = express.Router();

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Game Board Match API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      games: '/api/games',
      users: '/api/users',
      matches: '/api/matches',
      likes: '/api/likes',
      messages: '/api/messages',
      geolocation: '/api/geolocation'
    }
  });
});

// Routes
router.use('/auth', authRoutes);
router.use('/games', gameRoutes);
router.use('/users', userRoutes);
router.use('/matches', matchRoutes);
router.use('/likes', likeRoutes);
router.use('/messages', messageRoutes);
router.use('/geolocation', geolocationRoutes);

export default router;

