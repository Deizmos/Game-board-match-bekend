import prisma from '../db/prisma.js';

/**
 * Сервис для работы с настольными играми
 */
export class GameService {
  /**
   * Получить все игры
   */
  static async getAllGames(skip = 0, take = 50) {
    return prisma.game.findMany({
      skip,
      take,
      orderBy: {
        name: 'asc'
      }
    });
  }

  /**
   * Получить игру по ID
   */
  static async getGameById(id) {
    return prisma.game.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        userGames: {
          include: {
            user: {
              include: {
                profile: true
              }
            }
          }
        }
      }
    });
  }

  /**
   * Поиск игр по названию или категории
   */
  static async searchGames(query, category) {
    const where = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ],
      ...(category && { category })
    };

    return prisma.game.findMany({
      where,
      orderBy: {
        name: 'asc'
      }
    });
  }

  /**
   * Создать новую игру
   */
  static async createGame(gameData) {
    return prisma.game.create({
      data: gameData
    });
  }

  /**
   * Обновить игру
   */
  static async updateGame(id, gameData) {
    return prisma.game.update({
      where: { id: parseInt(id, 10) },
      data: gameData
    });
  }

  /**
   * Удалить игру
   */
  static async deleteGame(id) {
    return prisma.game.delete({
      where: { id: parseInt(id, 10) }
    });
  }

  /**
   * Добавить игру пользователю
   */
  static async addGameToUser(userId, gameId, skillLevel, isFavorite) {
    return prisma.userGame.create({
      data: {
        userId: parseInt(userId, 10),
        gameId: parseInt(gameId, 10),
        skillLevel,
        isFavorite: isFavorite || false
      },
      include: {
        game: true,
        user: {
          include: {
            profile: true
          }
        }
      }
    });
  }

  /**
   * Удалить игру у пользователя
   */
  static async removeGameFromUser(userId, gameId) {
    return prisma.userGame.delete({
      where: {
        userId_gameId: {
          userId: parseInt(userId, 10),
          gameId: parseInt(gameId, 10)
        }
      }
    });
  }

  /**
   * Получить игры пользователя
   */
  static async getUserGames(userId) {
    return prisma.userGame.findMany({
      where: {
        userId: parseInt(userId, 10)
      },
      include: {
        game: true
      },
      orderBy: {
        isFavorite: 'desc'
      }
    });
  }
}
