/**
 * Обработчик ошибок 404 - маршрут не найден
 */
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Маршрут не найден: ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

/**
 * Глобальный обработчик ошибок
 */
export const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Внутренняя ошибка сервера';

  const errorResponse = {
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  };

  // Логирование ошибки
  console.error(`❌ Ошибка ${status}: ${message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  res.status(status).json(errorResponse);
};

