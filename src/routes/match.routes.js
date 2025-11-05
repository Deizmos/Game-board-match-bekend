import express from 'express';
import {
  getUserMatches,
  createMatch,
  updateMatchStatus,
  getAcceptedMatches
} from '../controllers/match.controller.js';
import { validateMatch, validateMatchStatus } from '../middleware/validation.js';

const router = express.Router();

// GET /api/matches - Получить все матчи пользователя
router.get('/', getUserMatches);

// GET /api/matches/accepted - Получить принятые матчи
router.get('/accepted', getAcceptedMatches);

// POST /api/matches - Создать новый матч
router.post('/', validateMatch, createMatch);

// PUT /api/matches/:senderId/:receiverId - Обновить статус матча
router.put('/:senderId/:receiverId', validateMatchStatus, updateMatchStatus);

export default router;

