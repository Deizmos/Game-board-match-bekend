import prisma from '../db/prisma.js';

/**
 * Сервис для работы с матчами (встречами между пользователями)
 */
export class MatchService {
  /**
   * Получить все матчи пользователя
   */
  static async getUserMatches(userId) {
    return prisma.match.findMany({
      where: {
        OR: [
          { senderId: parseInt(userId, 10) },
          { receiverId: parseInt(userId, 10) }
        ]
      },
      include: {
        sender: {
          include: {
            profile: true
          }
        },
        receiver: {
          include: {
            profile: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
  }

  /**
   * Создать матч (отправить запрос на встречу)
   */
  static async createMatch(senderId, receiverId, message) {
    // Проверяем, не существует ли уже матч
    const existingMatch = await prisma.match.findUnique({
      where: {
        senderId_receiverId: {
          senderId: parseInt(senderId, 10),
          receiverId: parseInt(receiverId, 10)
        }
      }
    });

    if (existingMatch) {
      throw new Error('Матч уже существует');
    }

    return prisma.match.create({
      data: {
        senderId: parseInt(senderId, 10),
        receiverId: parseInt(receiverId, 10),
        message,
        status: 'PENDING'
      },
      include: {
        sender: {
          include: {
            profile: true
          }
        },
        receiver: {
          include: {
            profile: true
          }
        }
      }
    });
  }

  /**
   * Обновить статус матча
   */
  static async updateMatchStatus(senderId, receiverId, status) {
    return prisma.match.update({
      where: {
        senderId_receiverId: {
          senderId: parseInt(senderId, 10),
          receiverId: parseInt(receiverId, 10)
        }
      },
      data: {
        status
      },
      include: {
        sender: {
          include: {
            profile: true
          }
        },
        receiver: {
          include: {
            profile: true
          }
        }
      }
    });
  }

  /**
   * Получить взаимные матчи (принятые)
   */
  static async getAcceptedMatches(userId) {
    return prisma.match.findMany({
      where: {
        OR: [
          { senderId: parseInt(userId, 10) },
          { receiverId: parseInt(userId, 10) }
        ],
        status: 'ACCEPTED'
      },
      include: {
        sender: {
          include: {
            profile: true
          }
        },
        receiver: {
          include: {
            profile: true
          }
        }
      }
    });
  }
}

