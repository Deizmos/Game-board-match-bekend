import prisma from '../db/prisma.js';
import bcrypt from 'bcryptjs';

/**
 * Сервис для работы с пользователями
 */
export class UserService {
  /**
   * Получить всех пользователей
   */
  static async getAllUsers(skip = 0, take = 10) {
    return prisma.user.findMany({
      skip,
      take,
      include: {
        profile: true,
        userGames: {
          include: {
            game: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * Получить пользователя по ID
   */
  static async getUserById(id) {
    return prisma.user.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        profile: true,
        userGames: {
          include: {
            game: true
          }
        }
      }
    });
  }

  /**
   * Получить пользователя по email
   */
  static async getUserByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        profile: true
      }
    });
  }

  /**
   * Создать нового пользователя
   */
  static async createUser(userData) {
    const { email, password, name, profile } = userData;

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        profile: profile ? {
          create: profile
        } : undefined
      },
      include: {
        profile: true
      }
    });
  }

  /**
   * Обновить пользователя
   */
  static async updateUser(id, userData) {
    const { password, ...updateData } = userData;

    // Если обновляется пароль, хешируем его
    const data = password 
      ? { ...updateData, password: await bcrypt.hash(password, 10) }
      : updateData;

    return prisma.user.update({
      where: { id: parseInt(id, 10) },
      data,
      include: {
        profile: true,
        userGames: {
          include: {
            game: true
          }
        }
      }
    });
  }

  /**
   * Удалить пользователя
   */
  static async deleteUser(id) {
    return prisma.user.delete({
      where: { id: parseInt(id, 10) }
    });
  }

  /**
   * Проверить пароль
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Поиск пользователей по играм
   */
  static async findUsersByGames(gameIds, userId) {
    return prisma.user.findMany({
      where: {
        userGames: {
          some: {
            gameId: {
              in: gameIds.map(id => parseInt(id, 10))
            }
          }
        },
        id: {
          not: parseInt(userId, 10) // Исключаем текущего пользователя
        },
        isActive: true
      },
      include: {
        profile: true,
        userGames: {
          where: {
            gameId: {
              in: gameIds.map(id => parseInt(id, 10))
            }
          },
          include: {
            game: true
          }
        }
      }
    });
  }
}

