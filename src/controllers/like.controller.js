import { LikeService } from '../services/like.service.js';

/**
 * Поставить лайк/дизлайк
 */
export const createLike = async (req, res, next) => {
  try {
    const { senderId, receiverId, status } = req.body;

    const like = await LikeService.createLike(senderId, receiverId, status);

    res.status(201).json({
      success: true,
      data: like,
      message: 'Лайк успешно поставлен'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Получить лайки пользователя
 */
export const getUserLikes = async (req, res, next) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Необходимо указать userId' }
      });
    }

    const likes = await LikeService.getUserLikes(userId);

    res.json({
      success: true,
      data: likes,
      count: likes.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Проверить взаимную симпатию
 */
export const checkMutualLike = async (req, res, next) => {
  try {
    const { userId1, userId2 } = req.query;

    if (!userId1 || !userId2) {
      return res.status(400).json({
        success: false,
        error: { message: 'Необходимо указать userId1 и userId2' }
      });
    }

    const isMutual = await LikeService.checkMutualLike(userId1, userId2);

    res.json({
      success: true,
      data: { isMutual }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Удалить лайк
 */
export const removeLike = async (req, res, next) => {
  try {
    const { senderId, receiverId } = req.params;

    await LikeService.removeLike(senderId, receiverId);

    res.json({
      success: true,
      message: 'Лайк успешно удален'
    });
  } catch (error) {
    next(error);
  }
};

