import jwt from 'jsonwebtoken';
import { UserService } from './user.service.js';
import prisma from '../db/prisma.js';

/**
 * Сервис для работы с аутентификацией
 */
export class AuthService {
  /**
   * Генерация JWT токенов
   */
  static generateTokens(userId) {
    const accessToken = jwt.sign(
      { userId, type: 'access' },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
    );

    const refreshToken = jwt.sign(
      { userId, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production',
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    return { accessToken, refreshToken };
  }

  /**
   * Верификация access token
   */
  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    } catch (error) {
      throw new Error('Недействительный токен');
    }
  }

  /**
   * Верификация refresh token
   */
  static verifyRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production');
    } catch (error) {
      throw new Error('Недействительный refresh токен');
    }
  }

  /**
   * Регистрация пользователя
   */
  static async register(userData) {
    const { email, password, name, profile } = userData;

    // Проверяем, не существует ли пользователь с таким email
    const existingUser = await UserService.getUserByEmail(email);
    if (existingUser) {
      throw new Error('Пользователь с таким email уже существует');
    }

    // Создаем пользователя
    const newUser = await UserService.createUser({ email, password, name, profile });

    // Генерируем токены
    const { accessToken, refreshToken } = this.generateTokens(newUser.id);

    // Сохраняем refresh token в базе (опционально, для возможности отзыва токенов)
    await this.saveRefreshToken(newUser.id, refreshToken);

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        profile: newUser.profile
      },
      accessToken,
      refreshToken
    };
  }

  /**
   * Вход пользователя
   */
  static async login(email, password) {
    // Находим пользователя по email
    const user = await UserService.getUserByEmail(email);
    if (!user) {
      throw new Error('Неверный email или пароль');
    }

    // Проверяем пароль
    const isPasswordValid = await UserService.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Неверный email или пароль');
    }

    // Проверяем, активен ли пользователь
    if (!user.isActive) {
      throw new Error('Аккаунт деактивирован');
    }

    // Генерируем токены
    const { accessToken, refreshToken } = this.generateTokens(user.id);

    // Сохраняем refresh token
    await this.saveRefreshToken(user.id, refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profile: user.profile
      },
      accessToken,
      refreshToken
    };
  }

  /**
   * Обновление токенов
   */
  static async refresh(refreshToken) {
    // Верифицируем refresh token
    const decoded = this.verifyRefreshToken(refreshToken);

    // Проверяем, что токен сохранен в базе (опционально)
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken }
    });

    if (!tokenRecord || !tokenRecord.isActive) {
      throw new Error('Недействительный refresh токен');
    }

    // Проверяем пользователя
    const user = await UserService.getUserById(decoded.userId);
    if (!user || !user.isActive) {
      throw new Error('Пользователь не найден или неактивен');
    }

    // Генерируем новые токены
    const { accessToken, refreshToken: newRefreshToken } = this.generateTokens(user.id);

    // Обновляем refresh token в базе
    await this.updateRefreshToken(refreshToken, newRefreshToken, user.id);

    return {
      accessToken,
      refreshToken: newRefreshToken
    };
  }

  /**
   * Выход пользователя
   */
  static async logout(refreshToken) {
    // Деактивируем refresh token
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { isActive: false }
    });
  }

  /**
   * Сохранение refresh token в базе
   */
  static async saveRefreshToken(userId, token) {
    // Удаляем старые токены пользователя (опционально, для безопасности)
    // await prisma.refreshToken.deleteMany({ where: { userId } });

    // Сохраняем новый токен
    await prisma.refreshToken.create({
      data: {
        userId,
        token,
        isActive: true,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 дней
      }
    });
  }

  /**
   * Обновление refresh token
   */
  static async updateRefreshToken(oldToken, newToken, userId) {
    // Деактивируем старый токен
    await prisma.refreshToken.updateMany({
      where: { token: oldToken },
      data: { isActive: false }
    });

    // Сохраняем новый токен
    await this.saveRefreshToken(userId, newToken);
  }

  /**
   * Получить пользователя из токена
   */
  static async getUserFromToken(accessToken) {
    const decoded = this.verifyAccessToken(accessToken);
    const user = await UserService.getUserById(decoded.userId);
    
    if (!user || !user.isActive) {
      throw new Error('Пользователь не найден или неактивен');
    }

    return user;
  }
}

