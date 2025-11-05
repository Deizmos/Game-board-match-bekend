import { GeolocationService } from '../services/geolocation.service.js';

/**
 * Обновить геолокацию пользователя
 */
export const updateLocation = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        error: { message: 'Необходимо указать latitude и longitude' }
      });
    }

    const profile = await GeolocationService.updateLocation(userId, latitude, longitude);

    res.json({
      success: true,
      data: {
        userId: parseInt(userId, 10),
        latitude: profile.latitude,
        longitude: profile.longitude
      },
      message: 'Геолокация успешно обновлена'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Получить геолокацию пользователя
 */
export const getUserLocation = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const location = await GeolocationService.getUserLocation(userId);

    if (!location || location.latitude === null) {
      return res.status(404).json({
        success: false,
        error: { message: 'Геолокация пользователя не установлена' }
      });
    }

    res.json({
      success: true,
      data: location
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Найти пользователей в радиусе
 */
export const findUsersInRadius = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { radius, gameIds, maxResults } = req.query;

    if (!radius) {
      return res.status(400).json({
        success: false,
        error: { message: 'Необходимо указать радиус (radius) в километрах' }
      });
    }

    const radiusKm = parseFloat(radius);
    if (isNaN(radiusKm) || radiusKm <= 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Радиус должен быть положительным числом' }
      });
    }

    const options = {
      gameIds: gameIds ? (Array.isArray(gameIds) ? gameIds : gameIds.split(',')) : null,
      maxResults: maxResults ? parseInt(maxResults, 10) : null
    };

    const users = await GeolocationService.findUsersInRadius(userId, radiusKm, options);

    res.json({
      success: true,
      data: users,
      count: users.length,
      radius: radiusKm
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Найти ближайших пользователей
 */
export const findNearestUsers = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { limit = 10, gameIds } = req.query;

    const options = {
      gameIds: gameIds ? (Array.isArray(gameIds) ? gameIds : gameIds.split(',')) : null
    };

    const users = await GeolocationService.findNearestUsers(userId, limit, options);

    res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Получить расстояние между двумя пользователями
 */
export const getDistanceBetweenUsers = async (req, res, next) => {
  try {
    const { userId1, userId2 } = req.params;

    const distance = await GeolocationService.getDistanceBetweenUsers(userId1, userId2);

    res.json({
      success: true,
      data: {
        userId1: parseInt(userId1, 10),
        userId2: parseInt(userId2, 10),
        distance: distance,
        unit: 'km'
      }
    });
  } catch (error) {
    next(error);
  }
};

