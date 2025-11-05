import { GameService } from '../services/game.service.js';

/**
 * Получить все игры
 */
export const getGames = async (req, res, next) => {
  try {
    const games = await GameService.getAllGames();
    res.json({
      success: true,
      data: games,
      count: games.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Получить игру по ID
 */
export const getGameById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const game = await GameService.getGameById(id);

    if (!game) {
      return res.status(404).json({
        success: false,
        error: { message: 'Игра не найдена' }
      });
    }

    res.json({
      success: true,
      data: game
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Создать новую игру
 */
export const createGame = async (req, res, next) => {
  try {
    const gameData = req.body;
    const newGame = await GameService.createGame(gameData);

    res.status(201).json({
      success: true,
      data: newGame,
      message: 'Игра успешно создана'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Обновить игру
 */
export const updateGame = async (req, res, next) => {
  try {
    const { id } = req.params;
    const gameData = req.body;
    
    const updatedGame = await GameService.updateGame(id, gameData);

    if (!updatedGame) {
      return res.status(404).json({
        success: false,
        error: { message: 'Игра не найдена' }
      });
    }

    res.json({
      success: true,
      data: updatedGame,
      message: 'Игра успешно обновлена'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Удалить игру
 */
export const deleteGame = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await GameService.deleteGame(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: { message: 'Игра не найдена' }
      });
    }

    res.json({
      success: true,
      message: 'Игра успешно удалена'
    });
  } catch (error) {
    next(error);
  }
};

