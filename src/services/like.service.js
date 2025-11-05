import prisma from '../db/prisma.js';

/**
 * Сервис для работы с лайками (симпатиями)
 */
export class LikeService {
  /**
   * Поставить лайк/дизлайк
   */
  static async createLike(senderId, receiverId, status = 'LIKE') {
    // Проверяем, не существует ли уже лайк
    const existingLike = await prisma.like.findUnique({
      where: {
        senderId_receiverId: {
          senderId: parseInt(senderId, 10),
          receiverId: parseInt(receiverId, 10)
        }
      }
    });

    if (existingLike) {
      // Обновляем существующий лайк
      return prisma.like.update({
        where: {
          senderId_receiverId: {
            senderId: parseInt(senderId, 10),
            receiverId: parseInt(receiverId, 10)
          }
        },
        data: {
          status
        }
      });
    }

    return prisma.like.create({
      data: {
        senderId: parseInt(senderId, 10),
        receiverId: parseInt(receiverId, 10),
        status
      }
    });
  }

  /**
   * Получить лайки пользователя (кому он понравился)
   */
  static async getUserLikes(userId) {
    return prisma.like.findMany({
      where: {
        receiverId: parseInt(userId, 10),
        status: 'LIKE'
      },
      include: {
        sender: {
          include: {
            profile: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * Проверить взаимную симпатию (оба лайкнули друг друга)
   */
  static async checkMutualLike(userId1, userId2) {
    const like1 = await prisma.like.findUnique({
      where: {
        senderId_receiverId: {
          senderId: parseInt(userId1, 10),
          receiverId: parseInt(userId2, 10)
        }
      }
    });

    const like2 = await prisma.like.findUnique({
      where: {
        senderId_receiverId: {
          senderId: parseInt(userId2, 10),
          receiverId: parseInt(userId1, 10)
        }
      }
    });

    return like1?.status === 'LIKE' && like2?.status === 'LIKE';
  }

  /**
   * Удалить лайк
   */
  static async removeLike(senderId, receiverId) {
    return prisma.like.delete({
      where: {
        senderId_receiverId: {
          senderId: parseInt(senderId, 10),
          receiverId: parseInt(receiverId, 10)
        }
      }
    });
  }
}

