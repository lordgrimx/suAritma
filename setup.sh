#!/bin/bash

# Mızrak Su Arıtma Sistemleri - VDS Kurulum Scripti
# Bu script Ubuntu 20.04/22.04 ve Debian 10/11 için optimize edilmiştir

set -e

echo "🚀 Mızrak Su Arıtma Sistemleri VDS Kurulumuna Başlanıyor..."

# Renkli çıktı için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Sistem güncellemeleri
echo "📦 Sistem güncellemeleri yapılıyor..."
sudo apt update && sudo apt upgrade -y

# Gerekli paketler
echo "📦 Gerekli paketler kuruluyor..."
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release build-essential

# Node.js 20.x kurulumu
echo "🟢 Node.js 20.x kuruluyor..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Yarn kurulumu (opsiyonel ama önerilir)
echo "📦 Yarn kuruluyor..."
npm install -g yarn

# PM2 kurulumu
echo "🔧 PM2 kuruluyor..."
npm install -g pm2

# Nginx kurulumu
echo "🌐 Nginx kuruluyor..."
sudo apt install -y nginx

# PostgreSQL kurulumu
echo "🗄️  PostgreSQL kuruluyor..."
sudo apt install -y postgresql postgresql-contrib

# PostgreSQL servis başlatma ve enable etme
sudo systemctl start postgresql
sudo systemctl enable postgresql

# PostgreSQL kullanıcı ve veritabanı oluşturma
echo "🗄️  PostgreSQL veritabanı oluşturuluyor..."
sudo -u postgres psql -c "CREATE USER mizraksu WITH PASSWORD 'mizraksu123';"
sudo -u postgres psql -c "CREATE DATABASE mizraksu OWNER mizraksu;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE mizraksu TO mizraksu;"

# Proje dizini oluşturma
echo "📁 Proje dizini oluşturuluyor..."
sudo mkdir -p /var/www/mizraksu
sudo chown -R $USER:$USER /var/www/mizraksu
cd /var/www/mizraksu

# GitHub'dan projeyi çekme
echo "📥 Proje GitHub'dan çekiliyor..."
git clone https://github.com/lordgrimx/suAritma.git temp_repo
echo "📦 Proje dosyaları taşınıyor..."
mv temp_repo/* temp_repo/.* . 2>/dev/null || true
rm -rf temp_repo
print_success "Proje dosyaları başarıyla yüklendi!"

# Environment dosyası oluşturma
echo "⚙️  Environment dosyası oluşturuluyor..."
cat > .env << 'EOF'
# Database
DATABASE_URL="postgresql://mizraksu:mizraksu123@localhost:5432/mizraksu"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
NEXTAUTH_URL="http://mizraksuaritma.com.tr"

# Admin kullanıcıları (virgülle ayrılmış e-posta adresleri)
ADMIN_EMAILS="admin@mizraksu.com"

# Diğer ayarlar
NODE_ENV="production"
PORT=3000
EOF

print_success "Environment dosyası oluşturuldu!"
print_info "NEXTAUTH_SECRET değerini production ortamında mutlaka değiştirin!"

# Bağımlılıkları yükleme
echo "📦 Bağımlılıklar yükleniyor..."
yarn install
# veya npm install

# Prisma setup
echo "🗄️  Prisma setup yapılıyor..."
npx prisma generate
npx prisma db push

# Build işlemi
echo "🔨 Proje build ediliyor..."
yarn build
# veya npm run build

# PM2 konfigürasyonu
echo "🔧 PM2 konfigürasyonu yapılıyor..."
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'mizraksu-web',
    script: 'yarn',
    args: 'start',
    cwd: '/var/www/mizraksu',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/mizraksu-error.log',
    out_file: '/var/log/pm2/mizraksu-out.log',
    log_file: '/var/log/pm2/mizraksu-combined.log',
    time: true
  }]
};
EOF

# PM2 log dizini
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

# PM2 başlatma
echo "🚀 PM2 ile uygulama başlatılıyor..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Nginx konfigürasyonu
echo "🌐 Nginx konfigürasyonu yapılıyor..."
sudo cat > /etc/nginx/sites-available/mizraksu << 'EOF'
server {
    listen 80;
    server_name mizraksuaritma.com.tr www.mizraksuaritma.com.tr;  # Domain güncellendi

    # HTTP'den HTTPS'e yönlendirme (SSL kurduktan sonra)
    # return 301 https://$server_name$request_uri;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Statik dosyalar için cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Site enable etme
sudo ln -sf /etc/nginx/sites-available/mizraksu /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Nginx test ve restart
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

# Firewall ayarları
echo "🔥 Firewall ayarları yapılıyor..."
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# SSL (Let's Encrypt) kurulumu - opsiyonel
echo "🔒 SSL kurulumu için certbot kuruluyor..."
sudo apt install -y certbot python3-certbot-nginx

print_success "Kurulum tamamlandı!"
print_info "SSL sertifikası almak için: sudo certbot --nginx -d mizraksuaritma.com.tr -d www.mizraksuaritma.com.tr"

echo ""
echo "🎉 Mızrak Su Arıtma Sistemleri başarıyla kuruldu!"
echo ""
echo "📋 Önemli Bilgiler:"
echo "   • Proje dizini: /var/www/mizraksu"
echo "   • Veritabanı: PostgreSQL (mizraksu/mizraksu123)"
echo "   • Uygulama port: 3000 (PM2 ile çalışıyor)"
echo "   • Web server: Nginx (port 80/443)"
echo "   • PM2 durum: pm2 status"
echo "   • PM2 log: pm2 logs"
echo ""
echo "⚠️  Yapmanız gerekenler:"
echo "   1. Domain adresinizi Nginx konfigürasyonunda güncelleyin"
echo "   2. SSL sertifikası alın (sudo certbot --nginx -d mizraksuaritma.com.tr -d www.mizraksuaritma.com.tr)"
echo "   3. .env dosyasında NEXTAUTH_SECRET'i değiştirin"
echo "   4. Admin e-posta adreslerini güncelleyin"
echo "   5. Proje dosyalarını /var/www/mizraksu dizinine kopyalayın"
echo "   6. 'yarn install && yarn build && pm2 restart mizraksu-web' komutlarını çalıştırın"
echo ""
echo "🔧 Yönetim komutları:"
echo "   • PM2 restart: pm2 restart mizraksu-web"
echo "   • PM2 stop: pm2 stop mizraksu-web"
echo "   • PM2 logs: pm2 logs mizraksu-web"
echo "   • Nginx restart: sudo systemctl restart nginx"
echo "   • Veritabanı bağlantı: psql -h localhost -U mizraksu -d mizraksu"