import express from 'express';
import {
  updateLocation,
  getUserLocation,
  findUsersInRadius,
  findNearestUsers,
  getDistanceBetweenUsers
} from '../controllers/geolocation.controller.js';
import { validateGeolocation, validateUserId } from '../middleware/validation.js';

const router = express.Router();

// PUT /api/geolocation/:userId - Обновить геолокацию пользователя
router.put('/:userId', validateUserId, validateGeolocation, updateLocation);

// GET /api/geolocation/:userId - Получить геолокацию пользователя
router.get('/:userId', validateUserId, getUserLocation);

// GET /api/geolocation/:userId/radius - Найти пользователей в радиусе
router.get('/:userId/radius', validateUserId, findUsersInRadius);

// GET /api/geolocation/:userId/nearest - Найти ближайших пользователей
router.get('/:userId/nearest', validateUserId, findNearestUsers);

// GET /api/geolocation/distance/:userId1/:userId2 - Получить расстояние между пользователями
router.get('/distance/:userId1/:userId2', getDistanceBetweenUsers);

export default router;

