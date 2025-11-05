import express from 'express';
import {
  createLike,
  getUserLikes,
  checkMutualLike,
  removeLike
} from '../controllers/like.controller.js';
import { validateLike } from '../middleware/validation.js';

const router = express.Router();

// GET /api/likes - Получить лайки пользователя
router.get('/', getUserLikes);

// GET /api/likes/mutual - Проверить взаимную симпатию
router.get('/mutual', checkMutualLike);

// POST /api/likes - Поставить лайк/дизлайк
router.post('/', validateLike, createLike);

// DELETE /api/likes/:senderId/:receiverId - Удалить лайк
router.delete('/:senderId/:receiverId', removeLike);

export default router;

