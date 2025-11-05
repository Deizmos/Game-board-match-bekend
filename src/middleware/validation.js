import { body, param, validationResult } from 'express-validator';

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
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Название должно быть от 1 до 200 символов'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Описание не должно превышать 1000 символов'),
  body('status')
    .optional()
    .isIn(['pending', 'active', 'completed', 'cancelled'])
    .withMessage('Недопустимый статус игры'),
  handleValidationErrors
];

