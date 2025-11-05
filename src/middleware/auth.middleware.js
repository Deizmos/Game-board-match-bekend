import { AuthService } from '../services/auth.service.js';

/**
 * Middleware для проверки аутентификации
 */
export const authenticate = async (req, res, next) => {
  try {
    // Получаем токен из заголовка Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: { message: 'Токен не предоставлен' }
      });
    }

    // Извлекаем токен
    const token = authHeader.substring(7); // Убираем "Bearer "

    // Верифицируем токен и получаем пользователя
    const user = await AuthService.getUserFromToken(token);

    // Добавляем пользователя в request
    req.user = user;
    req.userId = user.id;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { message: error.message || 'Недействительный токен' }
    });
  }
};

/**
 * Опциональная аутентификация (если токен есть - проверяем, если нет - пропускаем)
 */
export const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const user = await AuthService.getUserFromToken(token);
      req.user = user;
      req.userId = user.id;
    }

    next();
  } catch (error) {
    // Если ошибка - просто продолжаем без пользователя
    next();
  }
};

