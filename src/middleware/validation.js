import { body, param, query, validationResult } from 'express-validator';

/**
 * Middleware для обработки результатов валидации
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Ошибка валидации',
        details: errors.array()
      }
    });
  }
  next();
};

/**
 * Валидация ID
 */
export const validateUserId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID должен быть положительным числом'),
  handleValidationErrors
];

/**
 * Валидация ID игры
 */
export const validateGameId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID должен быть положительным числом'),
  handleValidationErrors
];

/**
 * Валидация данных игры
 */
export const validateGame = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Название должно быть от 1 до 255 символов'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Описание не должно превышать 5000 символов'),
  body('minPlayers')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Минимальное количество игроков должно быть положительным числом'),
  body('maxPlayers')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Максимальное количество игроков должно быть положительным числом'),
  body('duration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Длительность должна быть положительным числом'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Категория не должна превышать 100 символов'),
  handleValidationErrors
];

/**
 * Валидация пользователя
 */
export const validateUser = [
  body('email')
    .isEmail()
    .withMessage('Некорректный email адрес')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Пароль должен быть не менее 6 символов'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Имя должно быть от 1 до 255 символов'),
  body('profile.bio')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Биография не должна превышать 1000 символов'),
  body('profile.age')
    .optional()
    .isInt({ min: 18, max: 120 })
    .withMessage('Возраст должен быть от 18 до 120 лет'),
  body('profile.city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Город не должен превышать 100 символов'),
  handleValidationErrors
];

/**
 * Валидация пагинации
 */
export const validatePagination = [
  query('skip')
    .optional()
    .isInt({ min: 0 })
    .withMessage('skip должен быть неотрицательным числом'),
  query('take')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('take должен быть от 1 до 100'),
  handleValidationErrors
];

/**
 * Валидация матча
 */
export const validateMatch = [
  body('senderId')
    .isInt({ min: 1 })
    .withMessage('senderId должен быть положительным числом'),
  body('receiverId')
    .isInt({ min: 1 })
    .withMessage('receiverId должен быть положительным числом'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Сообщение не должно превышать 1000 символов'),
  handleValidationErrors
];

/**
 * Валидация статуса матча
 */
export const validateMatchStatus = [
  param('senderId')
    .isInt({ min: 1 })
    .withMessage('senderId должен быть положительным числом'),
  param('receiverId')
    .isInt({ min: 1 })
    .withMessage('receiverId должен быть положительным числом'),
  body('status')
    .isIn(['PENDING', 'ACCEPTED', 'REJECTED', 'BLOCKED'])
    .withMessage('Недопустимый статус матча'),
  handleValidationErrors
];

/**
 * Валидация лайка
 */
export const validateLike = [
  body('senderId')
    .isInt({ min: 1 })
    .withMessage('senderId должен быть положительным числом'),
  body('receiverId')
    .isInt({ min: 1 })
    .withMessage('receiverId должен быть положительным числом'),
  body('status')
    .optional()
    .isIn(['LIKE', 'DISLIKE'])
    .withMessage('Недопустимый статус лайка'),
  handleValidationErrors
];

/**
 * Валидация сообщения
 */
export const validateMessage = [
  body('senderId')
    .isInt({ min: 1 })
    .withMessage('senderId должен быть положительным числом'),
  body('receiverId')
    .isInt({ min: 1 })
    .withMessage('receiverId должен быть положительным числом'),
  body('content')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Содержимое сообщения должно быть от 1 до 5000 символов'),
  handleValidationErrors
];

/**
 * Валидация геолокации
 */
export const validateGeolocation = [
  body('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Широта должна быть числом от -90 до 90'),
  body('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Долгота должна быть числом от -180 до 180'),
  handleValidationErrors
];

