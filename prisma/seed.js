import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Начинаем заполнение базы данных...');

  // Создаем игры
  const games = await Promise.all([
    prisma.game.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'Монополия',
        description: 'Классическая настольная игра о недвижимости',
        minPlayers: 2,
        maxPlayers: 6,
        duration: 120,
        category: 'Стратегия'
      }
    }),
    prisma.game.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: 'Каркассон',
        description: 'Стратегическая игра с тайлами',
        minPlayers: 2,
        maxPlayers: 5,
        duration: 60,
        category: 'Стратегия'
      }
    }),
    prisma.game.upsert({
      where: { id: 3 },
      update: {},
      create: {
        name: 'Уно',
        description: 'Быстрая карточная игра',
        minPlayers: 2,
        maxPlayers: 10,
        duration: 30,
        category: 'Карточная'
      }
    }),
    prisma.game.upsert({
      where: { id: 4 },
      update: {},
      create: {
        name: 'Таймлайн',
        description: 'Игра на знание исторических дат',
        minPlayers: 2,
        maxPlayers: 8,
        duration: 30,
        category: 'Викторина'
      }
    }),
    prisma.game.upsert({
      where: { id: 5 },
      update: {},
      create: {
        name: 'Мафия',
        description: 'Социальная игра на дедукцию',
        minPlayers: 6,
        maxPlayers: 20,
        duration: 45,
        category: 'Социальная'
      }
    })
  ]);

  console.log(`✅ Создано ${games.length} игр`);

  // Создаем тестовых пользователей
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Создаем пользователей с геолокацией
  // Координаты: Москва (55.7558, 37.6173), Санкт-Петербург (59.9343, 30.3351)
  const user1 = await prisma.user.upsert({
    where: { email: 'alex@example.com' },
    update: {},
    create: {
      email: 'alex@example.com',
      password: hashedPassword,
      name: 'Алексей',
      profile: {
        create: {
          bio: 'Люблю стратегические игры и карточные игры',
          age: 28,
          city: 'Москва',
          latitude: 55.7558,  // Координаты центра Москвы
          longitude: 37.6173
        }
      }
    }
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'maria@example.com' },
    update: {},
    create: {
      email: 'maria@example.com',
      password: hashedPassword,
      name: 'Мария',
      profile: {
        create: {
          bio: 'Обожаю настольные игры, особенно социальные',
          age: 25,
          city: 'Санкт-Петербург',
          latitude: 59.9343,  // Координаты центра Санкт-Петербурга
          longitude: 30.3351
        }
      }
    }
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'dmitry@example.com' },
    update: {},
    create: {
      email: 'dmitry@example.com',
      password: hashedPassword,
      name: 'Дмитрий',
      profile: {
        create: {
          bio: 'Новичок в настольных играх, ищу компанию',
          age: 30,
          city: 'Москва',
          latitude: 55.7520,  // Координаты другой части Москвы (для теста расстояния)
          longitude: 37.6156
        }
      }
    }
  });

  // Теперь добавляем игры пользователям
  await prisma.userGame.upsert({
    where: { userId_gameId: { userId: user1.id, gameId: 1 } },
    update: {},
    create: { userId: user1.id, gameId: 1, skillLevel: 'advanced', isFavorite: true }
  });

  await prisma.userGame.upsert({
    where: { userId_gameId: { userId: user1.id, gameId: 2 } },
    update: {},
    create: { userId: user1.id, gameId: 2, skillLevel: 'intermediate', isFavorite: false }
  });

  await prisma.userGame.upsert({
    where: { userId_gameId: { userId: user2.id, gameId: 3 } },
    update: {},
    create: { userId: user2.id, gameId: 3, skillLevel: 'expert', isFavorite: true }
  });

  await prisma.userGame.upsert({
    where: { userId_gameId: { userId: user2.id, gameId: 5 } },
    update: {},
    create: { userId: user2.id, gameId: 5, skillLevel: 'advanced', isFavorite: true }
  });

  await prisma.userGame.upsert({
    where: { userId_gameId: { userId: user3.id, gameId: 1 } },
    update: {},
    create: { userId: user3.id, gameId: 1, skillLevel: 'beginner', isFavorite: false }
  });

  await prisma.userGame.upsert({
    where: { userId_gameId: { userId: user3.id, gameId: 4 } },
    update: {},
    create: { userId: user3.id, gameId: 4, skillLevel: 'intermediate', isFavorite: true }
  });

  const users = [user1, user2, user3];

  console.log(`✅ Создано ${users.length} пользователей`);

  console.log('🎉 База данных успешно заполнена!');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при заполнении базы данных:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

