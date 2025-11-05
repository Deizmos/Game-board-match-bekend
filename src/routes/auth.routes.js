import express from 'express';
import {
  register,
  login,
  refresh,
  logout,
  getCurrentUser
} from '../controllers/auth.controller.js';
import { validateUser, validateLogin } from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// POST /api/auth/register - Регистрация
router.post('/register', validateUser, register);

// POST /api/auth/login - Вход
router.post('/login', validateLogin, login);

// POST /api/auth/refresh - Обновление токенов
router.post('/refresh', refresh);

// POST /api/auth/logout - Выход
router.post('/logout', authenticate, logout);

// GET /api/auth/me - Получить текущего пользователя
router.get('/me', authenticate, getCurrentUser);

export default router;

