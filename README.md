# FinLogiQ

Полнофункциональное веб-приложение, работающее как:
- 🌐 Веб-сайт
- 📱 Progressive Web App (PWA)
- 💬 Telegram Web App (TWA)

## Технологии

### Frontend
- React 18 + TypeScript
- Vite (сборка)
- Tailwind CSS (стилизация)
- React Router (маршрутизация)
- TanStack Query (серверное состояние)
- Zustand (клиентское состояние)
- vite-plugin-pwa (PWA)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT авторизация
- Telegram Web App SDK интеграция

## Установка

### Требования
- Node.js 18+
- MongoDB (локально или MongoDB Atlas)
- npm или yarn

### Шаги установки

1. **Клонируйте репозиторий**
```bash
git clone <repo-url>
cd FinLogiQ
```

2. **Установите зависимости**
```bash
npm run install:all
```

3. **Настройте переменные окружения**

Создайте файл `server/.env`:
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/finlogiq
JWT_SECRET=your-super-secret-key
CLIENT_URL=http://localhost:5173
TELEGRAM_BOT_TOKEN=your-bot-token
```

4. **Запустите MongoDB**
```bash
# Если используете локальный MongoDB
mongod
```

5. **Запустите проект**
```bash
npm run dev
```

Приложение будет доступно:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Структура проекта

```
FinLogiQ/
├── client/                 # Frontend (React + Vite)
│   ├── public/            # Статические файлы
│   ├── src/
│   │   ├── components/    # React компоненты
│   │   ├── context/       # React контексты (Telegram)
│   │   ├── pages/         # Страницы приложения
│   │   ├── store/         # Zustand хранилища
│   │   ├── App.tsx        # Главный компонент
│   │   └── main.tsx       # Точка входа
│   └── vite.config.ts     # Конфигурация Vite
├── server/                 # Backend (Node.js + Express)
│   ├── src/
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Mongoose модели
│   │   ├── routes/        # API маршруты
│   │   ├── utils/         # Утилиты
│   │   └── index.ts       # Точка входа сервера
│   └── tsconfig.json
└── package.json           # Корневой package.json
```

## API Endpoints

### Авторизация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `POST /api/auth/telegram` - Вход через Telegram
- `GET /api/auth/me` - Текущий пользователь

### Пользователи
- `GET /api/users` - Список пользователей (admin)
- `GET /api/users/:id` - Пользователь по ID
- `PUT /api/users/:id` - Обновить пользователя
- `DELETE /api/users/:id` - Удалить пользователя (admin)

### Проекты
- `GET /api/projects` - Список проектов
- `GET /api/projects/:id` - Проект по ID
- `POST /api/projects` - Создать проект (admin)
- `PUT /api/projects/:id` - Обновить проект (admin)
- `DELETE /api/projects/:id` - Удалить проект (admin)

### Статьи
- `GET /api/articles` - Список статей
- `GET /api/articles/:id` - Статья по ID
- `POST /api/articles` - Создать статью (admin)
- `PUT /api/articles/:id` - Обновить статью (admin)
- `DELETE /api/articles/:id` - Удалить статью (admin)

### Контакты
- `POST /api/contact` - Отправить сообщение
- `GET /api/contact` - Список сообщений (admin)
- `GET /api/contact/:id` - Сообщение по ID (admin)

## PWA

Приложение автоматически регистрирует Service Worker и поддерживает:
- Офлайн режим
- Установка на устройство
- Push-уведомления (требуется настройка)

## Telegram Web App

Для использования как TWA:

1. Создайте бота через @BotFather
2. Добавьте Web App URL в настройках бота
3. Добавьте токен бота в `TELEGRAM_BOT_TOKEN`

Приложение автоматически:
- Определяет запуск из Telegram
- Использует тему Telegram
- Интегрирует кнопки Telegram (Back, Main Button)
- Использует haptic feedback

## Разработка

```bash
# Запуск в режиме разработки
npm run dev

# Только клиент
npm run dev:client

# Только сервер
npm run dev:server

# Сборка
cd client && npm run build
cd server && npm run build
```

## Лицензия

MIT
