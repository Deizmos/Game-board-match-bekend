import prisma from '../db/prisma.js';

/**
 * Сервис для работы с сообщениями
 */
export class MessageService {
  /**
   * Получить все сообщения между двумя пользователями
   */
  static async getConversation(userId1, userId2) {
    return prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: parseInt(userId1, 10),
            receiverId: parseInt(userId2, 10)
          },
          {
            senderId: parseInt(userId2, 10),
            receiverId: parseInt(userId1, 10)
          }
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
        createdAt: 'asc'
      }
    });
  }

  /**
   * Получить все диалоги пользователя
   */
  static async getUserConversations(userId) {
    const messages = await prisma.message.findMany({
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
        createdAt: 'desc'
      }
    });

    // Группируем по собеседникам
    const conversations = new Map();
    
    messages.forEach(message => {
      const otherUser = message.senderId === parseInt(userId, 10) 
        ? message.receiver 
        : message.sender;
      
      if (!conversations.has(otherUser.id)) {
        conversations.set(otherUser.id, {
          user: otherUser,
          lastMessage: message,
          unreadCount: 0
        });
      }

      if (!message.isRead && message.receiverId === parseInt(userId, 10)) {
        const conv = conversations.get(otherUser.id);
        conv.unreadCount++;
      }
    });

    return Array.from(conversations.values());
  }

  /**
   * Отправить сообщение
   */
  static async sendMessage(senderId, receiverId, content) {
    return prisma.message.create({
      data: {
        senderId: parseInt(senderId, 10),
        receiverId: parseInt(receiverId, 10),
        content,
        isRead: false
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
   * Отметить сообщения как прочитанные
   */
  static async markAsRead(senderId, receiverId) {
    return prisma.message.updateMany({
      where: {
        senderId: parseInt(senderId, 10),
        receiverId: parseInt(receiverId, 10),
        isRead: false
      },
      data: {
        isRead: true
      }
    });
  }

  /**
   * Получить непрочитанные сообщения пользователя
   */
  static async getUnreadMessages(userId) {
    return prisma.message.findMany({
      where: {
        receiverId: parseInt(userId, 10),
        isRead: false
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
}

