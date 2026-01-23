#!/bin/bash
# FinLogiQ - One-line installer
# Usage: curl -fsSL https://raw.githubusercontent.com/rosavskiy/FinlogiQ_SPA/main/install.sh | bash

set -e

DOMAIN="finlogiq.ru"
APP_DIR="/opt/finlogiq"
REPO_URL="https://github.com/rosavskiy/FinlogiQ_SPA.git"

echo "🚀 FinLogiQ Installer"
echo "====================="

# Check root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Run as root: sudo bash"
    exit 1
fi

# Update system
echo "📦 Updating system..."
apt update && apt upgrade -y
apt install -y curl git openssl

# Install Docker
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
fi

# Install Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "🐳 Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Clone project
echo "📥 Cloning project..."
rm -rf $APP_DIR
git clone $REPO_URL $APP_DIR
cd $APP_DIR

# Create .env
echo "⚙️ Creating .env..."
cp .env.example .env
JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')
MONGO_PASS=$(openssl rand -base64 32 | tr -d '\n')
sed -i "s|your-super-secret-jwt-key-change-in-production|$JWT_SECRET|g" .env
sed -i "s|your-secure-password-here|$MONGO_PASS|g" .env

# Create directories
mkdir -p nginx/ssl

# Build and start
echo "🏗️ Building containers..."
docker-compose up -d --build

# Wait for services
echo "⏳ Waiting for services..."
sleep 10

# Setup SSL with certbot
echo "🔐 Setting up SSL..."
docker-compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot \
    -d $DOMAIN -d www.$DOMAIN \
    --email admin@$DOMAIN --agree-tos --no-eff-email || true

# Restart to apply SSL
docker-compose restart client

# Setup auto-renewal
(crontab -l 2>/dev/null | grep -v "certbot"; echo "0 3 * * * cd $APP_DIR && docker-compose run --rm certbot renew --quiet && docker-compose restart client") | crontab -

# Firewall
echo "🔥 Configuring firewall..."
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

echo ""
echo "✅ Installation complete!"
echo "========================="
echo "🌐 https://$DOMAIN"
echo ""
echo "📝 To add Telegram bot token:"
echo "   nano $APP_DIR/.env"
echo "   docker-compose restart server"
echo ""
docker-compose ps
