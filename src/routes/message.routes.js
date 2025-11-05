import express from 'express';
import {
  getConversation,
  getUserConversations,
  sendMessage,
  markAsRead,
  getUnreadMessages
} from '../controllers/message.controller.js';
import { validateMessage } from '../middleware/validation.js';

const router = express.Router();

// GET /api/messages/conversations - Получить все диалоги пользователя
router.get('/conversations', getUserConversations);

// GET /api/messages/conversation - Получить переписку между двумя пользователями
router.get('/conversation', getConversation);

// GET /api/messages/unread - Получить непрочитанные сообщения
router.get('/unread', getUnreadMessages);

// POST /api/messages - Отправить сообщение
router.post('/', validateMessage, sendMessage);

// PUT /api/messages/read - Отметить сообщения как прочитанные
router.put('/read', markAsRead);

export default router;

