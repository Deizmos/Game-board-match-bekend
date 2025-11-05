import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📦 Режим: ${NODE_ENV}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
});

