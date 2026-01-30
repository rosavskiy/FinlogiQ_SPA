# Деплой FinLogiQ на VPS

## Требования к серверу

- Ubuntu 20.04+ / Debian 11+
- Минимум 1GB RAM
- Минимум 10GB диска
- Доменное имя, направленное на IP сервера

## Быстрый деплой

### 1. Подключитесь к серверу

```bash
ssh root@your-server-ip
```

### 2. Скачайте и запустите скрипт деплоя

```bash
# Скачайте проект
git clone https://github.com/rosavskiy/FinlogiQ_SPA.git /opt/finlogiq
cd /opt/finlogiq

# Сделайте скрипт исполняемым
chmod +x deploy.sh

# Запустите деплой
./deploy.sh
```

### 3. Настройте переменные окружения

```bash
nano /opt/finlogiq/.env
```

Заполните:
- `TELEGRAM_BOT_TOKEN` - токен от @BotFather
- Остальные переменные генерируются автоматически

### 4. Перезапустите приложение

```bash
cd /opt/finlogiq
docker-compose down
docker-compose up -d
```

---

## Ручной деплой (пошагово)

### 1. Установка Docker

```bash
# Обновление системы
apt update && apt upgrade -y

# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Установка Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### 2. Клонирование проекта

```bash
mkdir -p /opt/finlogiq
cd /opt/finlogiq
git clone https://github.com/rosavskiy/FinlogiQ_SPA.git .
```

### 3. Настройка переменных окружения

```bash
cp .env.example .env
nano .env
```

Заполните все переменные:

```env
MONGO_USERNAME=admin
MONGO_PASSWORD=сгенерируйте_сложный_пароль

JWT_SECRET=сгенерируйте_длинный_секрет

CLIENT_URL=https://вашдомен.ru

TELEGRAM_BOT_TOKEN=токен_от_botfather

VITE_API_URL=/api
```

### 4. Настройка SSL (Let's Encrypt)

```bash
# Замените finlogiq.ru на ваш домен в nginx/nginx.conf
nano nginx/nginx.conf

# Первоначальное получение сертификата
docker-compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  -d вашдомен.ru \
  -d www.вашдомен.ru \
  --email admin@вашдомен.ru \
  --agree-tos
```

### 5. Запуск приложения

```bash
docker-compose up -d --build
```

### 6. Проверка

```bash
# Статус контейнеров
docker-compose ps

# Логи
docker-compose logs -f

# Проверка сайта
curl -I https://вашдомен.ru
```

---

## Команды управления

```bash
# Просмотр логов
docker-compose logs -f
docker-compose logs -f server  # только сервер
docker-compose logs -f client  # только клиент

# Перезапуск
docker-compose restart

# Остановка
docker-compose down

# Обновление приложения
git pull
docker-compose up -d --build

# Вход в контейнер MongoDB
docker-compose exec mongodb mongosh -u admin -p

# Backup базы данных
docker-compose exec mongodb mongodump --out /data/backup
docker cp finlogiq-mongodb:/data/backup ./backup
```

---

## Настройка DNS

Добавьте A-записи у вашего регистратора домена:

| Тип | Имя | Значение |
|-----|-----|----------|
| A | @ | IP_вашего_сервера |
| A | www | IP_вашего_сервера |

---

## Настройка Telegram Web App

1. Создайте бота через @BotFather
2. Отправьте команду `/newapp`
3. Выберите вашего бота
4. Укажите URL: `https://вашдомен.ru`
5. Добавьте токен бота в `.env`

---

## Настройка Firewall

```bash
# Разрешить SSH, HTTP, HTTPS
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
```

---

## Мониторинг

### Настройка логирования

```bash
# Ротация логов Docker
cat > /etc/docker/daemon.json << EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

systemctl restart docker
```

### Health check

```bash
# Добавьте в crontab
crontab -e

# Проверка каждые 5 минут
*/5 * * * * curl -sf https://вашдомен.ru/api/health || docker-compose restart
```

---

## Troubleshooting

### Сайт не открывается

```bash
# Проверьте статус контейнеров
docker-compose ps

# Проверьте логи
docker-compose logs

# Проверьте порты
netstat -tlnp | grep -E '80|443'
```

### Ошибка SSL

```bash
# Пересоздайте сертификаты
docker-compose run --rm certbot delete --cert-name вашдомен.ru
docker-compose run --rm certbot certonly --webroot -w /var/www/certbot -d вашдомен.ru
docker-compose restart client
```

### MongoDB не подключается

```bash
# Проверьте логи MongoDB
docker-compose logs mongodb

# Проверьте переменные окружения
docker-compose exec server env | grep MONGO
```
---

## Настройка поддомена capital.finlogiq.ru

### 1. DNS-запись

Добавьте A-запись для поддомена в DNS:
```
capital.finlogiq.ru -> IP вашего сервера
```

### 2. Обновление SSL сертификата

Если сертификат ещё не включает поддомен, обновите его:

```bash
# Обновите сертификат с поддоменом
docker-compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  -d finlogiq.ru \
  -d www.finlogiq.ru \
  -d capital.finlogiq.ru \
  --email admin@finlogiq.ru \
  --agree-tos \
  --expand
```

### 3. Перезапуск nginx

```bash
docker-compose restart client
```

### 4. Редактирование лендинга

Файлы лендинга capital.finlogiq.ru находятся в директории `/opt/finlogiq/capital/`:
- `index.html` — основная страница
- `logo-capital.svg` — логотип
- `favicon.svg` — иконка сайта

После изменений перезапуск не требуется (директория монтируется напрямую).