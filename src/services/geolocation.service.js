import prisma from '../db/prisma.js';

/**
 * Сервис для работы с геолокацией
 */
export class GeolocationService {
  /**
   * Обновить геолокацию пользователя
   */
  static async updateLocation(userId, latitude, longitude) {
    // Проверяем валидность координат
    if (!this.isValidCoordinates(latitude, longitude)) {
      throw new Error('Некорректные координаты');
    }

    // Обновляем или создаем профиль с геолокацией
    const profile = await prisma.profile.upsert({
      where: { userId: parseInt(userId, 10) },
      update: {
        latitude,
        longitude
      },
      create: {
        userId: parseInt(userId, 10),
        latitude,
        longitude
      }
    });

    return profile;
  }

  /**
   * Получить геолокацию пользователя
   */
  static async getUserLocation(userId) {
    const profile = await prisma.profile.findUnique({
      where: { userId: parseInt(userId, 10) },
      select: {
        latitude: true,
        longitude: true,
        city: true
      }
    });

    return profile;
  }

  /**
   * Найти пользователей в радиусе (в километрах)
   */
  static async findUsersInRadius(userId, radiusKm, options = {}) {
    const userProfile = await prisma.profile.findUnique({
      where: { userId: parseInt(userId, 10) },
      select: {
        latitude: true,
        longitude: true
      }
    });

    if (!userProfile || userProfile.latitude === null || userProfile.longitude === null) {
      throw new Error('Геолокация пользователя не установлена');
    }

    const { latitude: userLat, longitude: userLon } = userProfile;

    // Получаем всех пользователей с геолокацией
    const allUsers = await prisma.profile.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
        userId: { not: parseInt(userId, 10) }, // Исключаем текущего пользователя
        user: {
          isActive: true
        }
      },
      include: {
        user: {
          include: {
            userGames: {
              include: {
                game: true
              }
            }
          }
        }
      }
    });

    // Рассчитываем расстояние для каждого пользователя
    const usersWithDistance = allUsers
      .map(profile => {
        const distance = this.calculateDistance(
          userLat,
          userLon,
          profile.latitude,
          profile.longitude
        );

        return {
          ...profile,
          distance: Math.round(distance * 100) / 100 // Округляем до 2 знаков
        };
      })
      .filter(profile => profile.distance <= radiusKm) // Фильтруем по радиусу
      .sort((a, b) => a.distance - b.distance); // Сортируем по расстоянию

    // Применяем дополнительные фильтры
    let filteredUsers = usersWithDistance;

    if (options.gameIds && options.gameIds.length > 0) {
      const gameIdsArray = Array.isArray(options.gameIds)
        ? options.gameIds
        : options.gameIds.split(',').map(id => parseInt(id.trim(), 10));

      filteredUsers = filteredUsers.filter(profile => {
        const userGameIds = profile.user.userGames.map(ug => ug.gameId);
        return gameIdsArray.some(gameId => userGameIds.includes(gameId));
      });
    }

    if (options.maxResults) {
      filteredUsers = filteredUsers.slice(0, parseInt(options.maxResults, 10));
    }

    return filteredUsers;
  }

  /**
   * Найти пользователей по расстоянию (ближайшие N пользователей)
   */
  static async findNearestUsers(userId, limit = 10, options = {}) {
    const userProfile = await prisma.profile.findUnique({
      where: { userId: parseInt(userId, 10) },
      select: {
        latitude: true,
        longitude: true
      }
    });

    if (!userProfile || userProfile.latitude === null || userProfile.longitude === null) {
      throw new Error('Геолокация пользователя не установлена');
    }

    const { latitude: userLat, longitude: userLon } = userProfile;

    // Получаем всех пользователей с геолокацией
    const allUsers = await prisma.profile.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
        userId: { not: parseInt(userId, 10) },
        user: {
          isActive: true
        }
      },
      include: {
        user: {
          include: {
            userGames: {
              include: {
                game: true
              }
            }
          }
        }
      }
    });

    // Рассчитываем расстояние и сортируем
    const usersWithDistance = allUsers
      .map(profile => {
        const distance = this.calculateDistance(
          userLat,
          userLon,
          profile.latitude,
          profile.longitude
        );

        return {
          ...profile,
          distance: Math.round(distance * 100) / 100
        };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, parseInt(limit, 10));

    // Применяем фильтры по играм если нужно
    if (options.gameIds && options.gameIds.length > 0) {
      const gameIdsArray = Array.isArray(options.gameIds)
        ? options.gameIds
        : options.gameIds.split(',').map(id => parseInt(id.trim(), 10));

      return usersWithDistance.filter(profile => {
        const userGameIds = profile.user.userGames.map(ug => ug.gameId);
        return gameIdsArray.some(gameId => userGameIds.includes(gameId));
      });
    }

    return usersWithDistance;
  }

  /**
   * Рассчитать расстояние между двумя точками по формуле Haversine
   * Возвращает расстояние в километрах
   */
  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Радиус Земли в километрах
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  }

  /**
   * Преобразовать градусы в радианы
   */
  static toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Проверить валидность координат
   */
  static isValidCoordinates(latitude, longitude) {
    if (latitude === null || longitude === null) {
      return false;
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      return false;
    }

    // Широта должна быть от -90 до 90
    if (lat < -90 || lat > 90) {
      return false;
    }

    // Долгота должна быть от -180 до 180
    if (lon < -180 || lon > 180) {
      return false;
    }

    return true;
  }

  /**
   * Получить расстояние между двумя пользователями
   */
  static async getDistanceBetweenUsers(userId1, userId2) {
    const [profile1, profile2] = await Promise.all([
      prisma.profile.findUnique({
        where: { userId: parseInt(userId1, 10) },
        select: { latitude: true, longitude: true }
      }),
      prisma.profile.findUnique({
        where: { userId: parseInt(userId2, 10) },
        select: { latitude: true, longitude: true }
      })
    ]);

    if (!profile1 || !profile2) {
      throw new Error('Один или оба пользователя не найдены');
    }

    if (
      profile1.latitude === null ||
      profile1.longitude === null ||
      profile2.latitude === null ||
      profile2.longitude === null
    ) {
      throw new Error('Геолокация одного или обоих пользователей не установлена');
    }

    const distance = this.calculateDistance(
      profile1.latitude,
      profile1.longitude,
      profile2.latitude,
      profile2.longitude
    );

    return Math.round(distance * 100) / 100;
  }
}

