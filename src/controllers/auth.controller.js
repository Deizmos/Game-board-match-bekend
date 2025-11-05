import { AuthService } from '../services/auth.service.js';

/**
 * Регистрация пользователя
 */
export const register = async (req, res, next) => {
  try {
    const userData = req.body;
    const result = await AuthService.register(userData);

    // Устанавливаем refresh token в httpOnly cookie (опционально)
    // res.cookie('refreshToken', result.refreshToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict',
    //   maxAge: 7 * 24 * 60 * 60 * 1000 // 7 дней
    // });

    res.status(201).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken
      },
      message: 'Регистрация прошла успешно'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Вход пользователя
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Необходимо указать email и пароль' }
      });
    }

    const result = await AuthService.login(email, password);

    // Устанавливаем refresh token в httpOnly cookie (опционально)
    // res.cookie('refreshToken', result.refreshToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict',
    //   maxAge: 7 * 24 * 60 * 60 * 1000 // 7 дней
    // });

    res.json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken
      },
      message: 'Вход выполнен успешно'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Обновление токенов
 */
export const refresh = async (req, res, next) => {
  try {
    // Получаем refresh token из body или cookie
    const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: { message: 'Refresh токен не предоставлен' }
      });
    }

    const result = await AuthService.refresh(refreshToken);

    res.json({
      success: true,
      data: result,
      message: 'Токены обновлены'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Выход пользователя
 */
export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;

    if (refreshToken) {
      await AuthService.logout(refreshToken);
    }

    // Очищаем cookie (если используется)
    // res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Выход выполнен успешно'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Получить текущего пользователя
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    // req.user устанавливается в auth middleware
    const user = req.user;

    // Убираем пароль из ответа
    const { password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};

