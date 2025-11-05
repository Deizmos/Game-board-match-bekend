import express from 'express';
import {
  getGames,
  getGameById,
  searchGames,
  createGame,
  updateGame,
  deleteGame
} from '../controllers/game.controller.js';
import { validateGame, validateGameId } from '../middleware/validation.js';

const router = express.Router();

// GET /api/games - Получить все игры
router.get('/', getGames);

// GET /api/games/search - Поиск игр
router.get('/search', searchGames);

// GET /api/games/:id - Получить игру по ID
router.get('/:id', validateGameId, getGameById);

// POST /api/games - Создать новую игру
router.post('/', validateGame, createGame);

// PUT /api/games/:id - Обновить игру
router.put('/:id', validateGameId, validateGame, updateGame);

// DELETE /api/games/:id - Удалить игру
router.delete('/:id', validateGameId, deleteGame);

export default router;

