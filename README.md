# Game Board Match Backend

Backend приложение для поиска друзей в настольных играх (аналог сайта знакомств) на Node.js с использованием Express и PostgreSQL.

## 🚀 Технологии

- **Node.js** >= 20.0.0
- **Express.js** - веб-фреймворк
- **PostgreSQL** - реляционная база данных
- **Prisma ORM** - современный ORM для работы с БД
- **ES6+ модули** - современный синтаксис JavaScript
- **Helmet** - безопасность HTTP заголовков
- **CORS** - настройка Cross-Origin Resource Sharing
- **Morgan** - логирование HTTP запросов
- **Express Validator** - валидация данных
- **Bcryptjs** - хеширование паролей
- **Dotenv** - управление переменными окружения

## 📦 Установка

1. Установите зависимости:
```bash
npm install
```

2. Настройте PostgreSQL базу данных и создайте файл `.env`:
```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/game_board_match?schema=public"
```

3. Сгенерируйте Prisma Client:
```bash
npm run prisma:generate
```

4. Выполните миграции базы данных:
```bash
npm run prisma:migrate
```

5. (Опционально) Заполните базу тестовыми данными:
```bash
npm run prisma:seed
```

## 🏃 Запуск

### Режим разработки (с автоперезагрузкой)
```bash
npm run dev
```

### Режим production
```bash
npm start
```

Сервер запустится на `http://localhost:3000` (или порт указанный в `.env`)

## 📡 API Endpoints

### Health Check
- `GET /health` - Проверка состояния сервера и подключения к БД

### API Info
- `GET /api` - Информация об API и доступных эндпоинтах

### Users (Пользователи)
- `GET /api/users` - Получить всех пользователей (с пагинацией)
- `GET /api/users/:id` - Получить пользователя по ID
- `POST /api/users` - Создать нового пользователя
- `PUT /api/users/:id` - Обновить пользователя
- `DELETE /api/users/:id` - Удалить пользователя
- `GET /api/users/:id/games` - Получить игры пользователя
- `POST /api/users/:id/games` - Добавить игру пользователю
- `DELETE /api/users/:id/games/:gameId` - Удалить игру у пользователя
- `GET /api/users/search/by-games?gameIds=1,2,3&userId=1` - Поиск пользователей по играм

### Games (Настольные игры)
- `GET /api/games` - Получить все игры
- `GET /api/games/:id` - Получить игру по ID
- `GET /api/games/search?query=монополия&category=Стратегия` - Поиск игр
- `POST /api/games` - Создать новую игру
- `PUT /api/games/:id` - Обновить игру
- `DELETE /api/games/:id` - Удалить игру

### Matches (Матчи/Встречи)
- `GET /api/matches?userId=1` - Получить все матчи пользователя
- `GET /api/matches/accepted?userId=1` - Получить принятые матчи
- `POST /api/matches` - Создать матч (отправить запрос на встречу)
- `PUT /api/matches/:senderId/:receiverId` - Обновить статус матча (ACCEPTED, REJECTED, BLOCKED)

### Likes (Симпатии)
- `GET /api/likes?userId=1` - Получить лайки пользователя
- `GET /api/likes/mutual?userId1=1&userId2=2` - Проверить взаимную симпатию
- `POST /api/likes` - Поставить лайк/дизлайк
- `DELETE /api/likes/:senderId/:receiverId` - Удалить лайк

### Messages (Сообщения)
- `GET /api/messages/conversations?userId=1` - Получить все диалоги пользователя
- `GET /api/messages/conversation?userId1=1&userId2=2` - Получить переписку
- `GET /api/messages/unread?userId=1` - Получить непрочитанные сообщения
- `POST /api/messages` - Отправить сообщение
- `PUT /api/messages/read` - Отметить сообщения как прочитанные

### Geolocation (Геолокация)
- `PUT /api/geolocation/:userId` - Обновить геолокацию пользователя
- `GET /api/geolocation/:userId` - Получить геолокацию пользователя
- `GET /api/geolocation/:userId/radius?radius=10&gameIds=1,2` - Найти пользователей в радиусе (км)
- `GET /api/geolocation/:userId/nearest?limit=10&gameIds=1,2` - Найти ближайших пользователей
- `GET /api/geolocation/distance/:userId1/:userId2` - Получить расстояние между пользователями

## 📝 Примеры запросов

### Создать пользователя
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "Иван",
    "profile": {
      "bio": "Люблю настольные игры",
      "age": 25,
      "city": "Москва"
    }
  }'
```

### Создать игру
```bash
curl -X POST http://localhost:3000/api/games \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Монополия",
    "description": "Классическая настольная игра",
    "minPlayers": 2,
    "maxPlayers": 6,
    "duration": 120,
    "category": "Стратегия"
  }'
```

### Добавить игру пользователю
```bash
curl -X POST http://localhost:3000/api/users/1/games \
  -H "Content-Type: application/json" \
  -d '{
    "gameId": 1,
    "skillLevel": "advanced",
    "isFavorite": true
  }'
```

### Поиск пользователей по играм
```bash
curl "http://localhost:3000/api/users/search/by-games?gameIds=1,2&userId=1"
```

### Создать матч (отправить запрос на встречу)
```bash
curl -X POST http://localhost:3000/api/matches \
  -H "Content-Type: application/json" \
  -d '{
    "senderId": 1,
    "receiverId": 2,
    "message": "Давай сыграем в Монополию!"
  }'
```

### Поставить лайк
```bash
curl -X POST http://localhost:3000/api/likes \
  -H "Content-Type: application/json" \
  -d '{
    "senderId": 1,
    "receiverId": 2,
    "status": "LIKE"
  }'
```

### Отправить сообщение
```bash
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{
    "senderId": 1,
    "receiverId": 2,
    "content": "Привет! Хочешь сыграть?"
  }'
```

### Обновить геолокацию пользователя
```bash
curl -X PUT http://localhost:3000/api/geolocation/1 \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 55.7558,
    "longitude": 37.6173
  }'
```

### Найти пользователей в радиусе (10 км)
```bash
curl "http://localhost:3000/api/geolocation/1/radius?radius=10&gameIds=1,2"
```

### Найти ближайших пользователей
```bash
curl "http://localhost:3000/api/geolocation/1/nearest?limit=5"
```

### Получить расстояние между пользователями
```bash
curl "http://localhost:3000/api/geolocation/distance/1/2"
```

## 🏗️ Структура проекта

```
src/
├── app.js                    # Основной файл приложения Express
├── server.js                 # Точка входа сервера
├── db/
│   └── prisma.js             # Prisma Client настройка
├── controllers/              # Контроллеры (обработчики запросов)
│   ├── game.controller.js
│   ├── user.controller.js
│   ├── match.controller.js
│   ├── like.controller.js
│   └── message.controller.js
├── services/                 # Бизнес-логика
│   ├── game.service.js
│   ├── user.service.js
│   ├── match.service.js
│   ├── like.service.js
│   └── message.service.js
├── routes/                   # Маршруты API
│   ├── index.js
│   ├── game.routes.js
│   ├── user.routes.js
│   ├── match.routes.js
│   ├── like.routes.js
│   └── message.routes.js
└── middleware/               # Middleware функции
    ├── errorHandler.js
    └── validation.js
prisma/
├── schema.prisma             # Prisma схема базы данных
└── seed.js                   # Seed данные для тестирования
```

## 🗄️ База данных

Проект использует PostgreSQL с Prisma ORM. Схема базы данных включает:

- **User** - пользователи системы
- **Profile** - профили пользователей (био, возраст, город, фото)
- **Game** - настольные игры
- **UserGame** - связь пользователей с играми (какие игры они любят/играют)
- **Match** - матчи/встречи между пользователями (PENDING, ACCEPTED, REJECTED, BLOCKED)
- **Like** - симпатии между пользователями
- **Message** - сообщения между пользователями

## 🔧 Разработка

### Prisma команды

```bash
# Генерация Prisma Client
npm run prisma:generate

# Создание и применение миграций
npm run prisma:migrate

# Открыть Prisma Studio (GUI для БД)
npm run prisma:studio

# Заполнить базу тестовыми данными
npm run prisma:seed
```

### ES6+ модули

Проект использует ES6+ модули (`"type": "module"` в `package.json`), что позволяет использовать:
- `import/export` синтаксис
- Top-level await
- Современные возможности JavaScript

## 📄 Лицензия

ISC

