import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserGames,
  addGameToUser,
  removeGameFromUser,
  findUsersByGames
} from '../controllers/user.controller.js';
import { validateUser, validateUserId, validatePagination } from '../middleware/validation.js';

const router = express.Router();

// GET /api/users - Получить всех пользователей
router.get('/', validatePagination, getUsers);

// GET /api/users/:id - Получить пользователя по ID
router.get('/:id', validateUserId, getUserById);

// POST /api/users - Создать нового пользователя
router.post('/', validateUser, createUser);

// PUT /api/users/:id - Обновить пользователя
router.put('/:id', validateUserId, updateUser);

// DELETE /api/users/:id - Удалить пользователя
router.delete('/:id', validateUserId, deleteUser);

// GET /api/users/:id/games - Получить игры пользователя
router.get('/:id/games', validateUserId, getUserGames);

// POST /api/users/:id/games - Добавить игру пользователю
router.post('/:id/games', validateUserId, addGameToUser);

// DELETE /api/users/:id/games/:gameId - Удалить игру у пользователя
router.delete('/:id/games/:gameId', validateUserId, removeGameFromUser);

// GET /api/users/search - Поиск пользователей по играм
router.get('/search/by-games', findUsersByGames);

export default router;

