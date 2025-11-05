import { GameService } from '../services/game.service.js';
import prisma from '../db/prisma.js';

/**
 * Получить все игры
 */
export const getGames = async (req, res, next) => {
  try {
    const skip = parseInt(req.query.skip, 10) || 0;
    const take = parseInt(req.query.take, 10) || 50;
    
    const games = await GameService.getAllGames(skip, take);
    
    res.json({
      success: true,
      data: games,
      count: games.length,
      pagination: {
        skip,
        take
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Поиск игр
 */
export const searchGames = async (req, res, next) => {
  try {
    const { query, category } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: { message: 'Необходимо указать параметр query' }
      });
    }

    const games = await GameService.searchGames(query, category);

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

