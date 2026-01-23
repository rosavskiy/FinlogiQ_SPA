#!/bin/bash

# FinLogiQ Deployment Script
# Запускать на VPS сервере

set -e

echo "🚀 Starting FinLogiQ deployment..."

# Переменные
DOMAIN="finlogiq.ru"
APP_DIR="/opt/finlogiq"
REPO_URL="https://github.com/rosavskiy/FinlogiQ_SPA.git"

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Проверка root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root (sudo ./deploy.sh)"
    exit 1
fi

# 1. Обновление системы
print_status "Updating system packages..."
apt update && apt upgrade -y

# 2. Установка Docker
if ! command -v docker &> /dev/null; then
    print_status "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    systemctl enable docker
    systemctl start docker
else
    print_status "Docker already installed"
fi

# 3. Установка Docker Compose
if ! command -v docker-compose &> /dev/null; then
    print_status "Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
else
    print_status "Docker Compose already installed"
fi

# 4. Создание директории приложения
print_status "Creating application directory..."
mkdir -p $APP_DIR
cd $APP_DIR

# 5. Клонирование или обновление репозитория
if [ -d ".git" ]; then
    print_status "Updating repository..."
    git pull origin main
else
    print_status "Cloning repository..."
    git clone $REPO_URL .
fi

# 6. Создание .env файла если не существует
if [ ! -f ".env" ]; then
    print_warning "Creating .env file from example..."
    cp .env.example .env
    
    # Генерация JWT секрета
    JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')
    sed -i "s|your-super-secret-jwt-key-change-in-production|$JWT_SECRET|g" .env
    
    # Генерация пароля MongoDB
    MONGO_PASS=$(openssl rand -base64 32 | tr -d '\n')
    sed -i "s|your-secure-password-here|$MONGO_PASS|g" .env
    
    print_warning "Please edit .env file and add your TELEGRAM_BOT_TOKEN"
    print_warning "nano $APP_DIR/.env"
fi

# 7. Создание директорий для SSL
mkdir -p nginx/ssl

# 8. Получение SSL сертификатов (первый раз)
if [ ! -d "/etc/letsencrypt/live/$DOMAIN" ]; then
    print_status "Obtaining SSL certificates..."
    
    # Временный запуск nginx для получения сертификата
    docker run -d --name temp-nginx \
        -v $APP_DIR/nginx/ssl:/etc/nginx/ssl \
        -v certbot_data:/var/www/certbot \
        -p 80:80 \
        nginx:alpine
    
    # Получение сертификата
    docker run --rm \
        -v certbot_data:/var/www/certbot \
        -v certbot_certs:/etc/letsencrypt \
        certbot/certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        -d $DOMAIN \
        -d www.$DOMAIN \
        --email admin@$DOMAIN \
        --agree-tos \
        --no-eff-email
    
    # Остановка временного nginx
    docker stop temp-nginx
    docker rm temp-nginx
else
    print_status "SSL certificates already exist"
fi

# 9. Сборка и запуск контейнеров
print_status "Building and starting containers..."
docker-compose down 2>/dev/null || true
docker-compose build --no-cache
docker-compose up -d

# 10. Проверка статуса
print_status "Checking container status..."
sleep 5
docker-compose ps

# 11. Настройка автообновления SSL
print_status "Setting up SSL auto-renewal..."
(crontab -l 2>/dev/null | grep -v "certbot"; echo "0 0 * * * cd $APP_DIR && docker-compose run --rm certbot renew && docker-compose exec client nginx -s reload") | crontab -

echo ""
echo "=================================================="
print_status "Deployment completed!"
echo "=================================================="
echo ""
echo "🌐 Website: https://$DOMAIN"
echo "📁 App directory: $APP_DIR"
echo ""
echo "Useful commands:"
echo "  View logs:     docker-compose logs -f"
echo "  Restart:       docker-compose restart"
echo "  Stop:          docker-compose down"
echo "  Update:        git pull && docker-compose up -d --build"
echo ""
