import { MessageService } from '../services/message.service.js';

/**
 * Получить переписку между двумя пользователями
 */
export const getConversation = async (req, res, next) => {
  try {
    const { userId1, userId2 } = req.query;

    if (!userId1 || !userId2) {
      return res.status(400).json({
        success: false,
        error: { message: 'Необходимо указать userId1 и userId2' }
      });
    }

    const messages = await MessageService.getConversation(userId1, userId2);

    res.json({
      success: true,
      data: messages,
      count: messages.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Получить все диалоги пользователя
 */
export const getUserConversations = async (req, res, next) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Необходимо указать userId' }
      });
    }

    const conversations = await MessageService.getUserConversations(userId);

    res.json({
      success: true,
      data: conversations,
      count: conversations.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Отправить сообщение
 */
export const sendMessage = async (req, res, next) => {
  try {
    const { senderId, receiverId, content } = req.body;

    const message = await MessageService.sendMessage(senderId, receiverId, content);

    res.status(201).json({
      success: true,
      data: message,
      message: 'Сообщение успешно отправлено'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Отметить сообщения как прочитанные
 */
export const markAsRead = async (req, res, next) => {
  try {
    const { senderId, receiverId } = req.body;

    await MessageService.markAsRead(senderId, receiverId);

    res.json({
      success: true,
      message: 'Сообщения отмечены как прочитанные'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Получить непрочитанные сообщения
 */
export const getUnreadMessages = async (req, res, next) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Необходимо указать userId' }
      });
    }

    const messages = await MessageService.getUnreadMessages(userId);

    res.json({
      success: true,
      data: messages,
      count: messages.length
    });
  } catch (error) {
    next(error);
  }
};

