import { UserService } from '../services/user.service.js';
import { GameService } from '../services/game.service.js';

/**
 * Получить всех пользователей
 */
export const getUsers = async (req, res, next) => {
  try {
    const skip = parseInt(req.query.skip, 10) || 0;
    const take = parseInt(req.query.take, 10) || 10;
    
    const users = await UserService.getAllUsers(skip, take);
    
    res.json({
      success: true,
      data: users,
      count: users.length,
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
 * Получить пользователя по ID
 */
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await UserService.getUserById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'Пользователь не найден' }
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Создать нового пользователя
 */
export const createUser = async (req, res, next) => {
  try {
    const userData = req.body;
    const newUser = await UserService.createUser(userData);

    // Убираем пароль из ответа
    const { password, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      data: userWithoutPassword,
      message: 'Пользователь успешно создан'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Обновить пользователя
 */
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    
    const updatedUser = await UserService.updateUser(id, userData);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: { message: 'Пользователь не найден' }
      });
    }

    // Убираем пароль из ответа
    const { password, ...userWithoutPassword } = updatedUser;

    res.json({
      success: true,
      data: userWithoutPassword,
      message: 'Пользователь успешно обновлен'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Удалить пользователя
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await UserService.deleteUser(id);

    res.json({
      success: true,
      message: 'Пользователь успешно удален'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Получить игры пользователя
 */
export const getUserGames = async (req, res, next) => {
  try {
    const { id } = req.params;
    const games = await GameService.getUserGames(id);

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
 * Добавить игру пользователю
 */
export const addGameToUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { gameId, skillLevel, isFavorite } = req.body;

    const userGame = await GameService.addGameToUser(id, gameId, skillLevel, isFavorite);

    res.status(201).json({
      success: true,
      data: userGame,
      message: 'Игра успешно добавлена пользователю'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Удалить игру у пользователя
 */
export const removeGameFromUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { gameId } = req.params;

    await GameService.removeGameFromUser(id, gameId);

    res.json({
      success: true,
      message: 'Игра успешно удалена у пользователя'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Поиск пользователей по играм
 */
export const findUsersByGames = async (req, res, next) => {
  try {
    const { gameIds, userId } = req.query;
    
    if (!gameIds) {
      return res.status(400).json({
        success: false,
        error: { message: 'Необходимо указать gameIds' }
      });
    }

    const gameIdsArray = Array.isArray(gameIds) 
      ? gameIds 
      : gameIds.split(',').map(id => id.trim());

    const users = await UserService.findUsersByGames(gameIdsArray, userId || null);

    res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    next(error);
  }
};

