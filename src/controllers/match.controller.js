import { MatchService } from '../services/match.service.js';

/**
 * Получить все матчи пользователя
 */
export const getUserMatches = async (req, res, next) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Необходимо указать userId' }
      });
    }

    const matches = await MatchService.getUserMatches(userId);

    res.json({
      success: true,
      data: matches,
      count: matches.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Создать матч (отправить запрос на встречу)
 */
export const createMatch = async (req, res, next) => {
  try {
    const { senderId, receiverId, message } = req.body;

    const match = await MatchService.createMatch(senderId, receiverId, message);

    res.status(201).json({
      success: true,
      data: match,
      message: 'Запрос на встречу успешно отправлен'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Обновить статус матча
 */
export const updateMatchStatus = async (req, res, next) => {
  try {
    const { senderId, receiverId } = req.params;
    const { status } = req.body;

    const match = await MatchService.updateMatchStatus(senderId, receiverId, status);

    res.json({
      success: true,
      data: match,
      message: 'Статус матча успешно обновлен'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Получить принятые матчи
 */
export const getAcceptedMatches = async (req, res, next) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Необходимо указать userId' }
      });
    }

    const matches = await MatchService.getAcceptedMatches(userId);

    res.json({
      success: true,
      data: matches,
      count: matches.length
    });
  } catch (error) {
    next(error);
  }
};

