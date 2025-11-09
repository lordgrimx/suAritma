# Mızrak Su Arıtma Sistemleri - VDS Deployment Rehberi

Bu rehber, Mızrak Su Arıtma Sistemleri web uygulamasının bir VDS (Virtual Dedicated Server) üzerinde nasıl hızlıca kurulacağını adım adım anlatmaktadır.

## 📋 Gereksinimler

- Ubuntu 20.04/22.04 veya Debian 10/11 işletim sistemi
- En az 2GB RAM ve 1 CPU core
- 20GB+ disk alanı
- SSH erişimi
- Alan adı (opsiyonel ama önerilir)

## 🚀 Hızlı Kurulum (1 Komut)

Aşağıdaki komutu VDS'nizde çalıştırarak otomatik kurulumu başlatabilirsiniz:

```bash
curl -fsSL https://raw.githubusercontent.com/kullanici-adiniz/mizraksu-web/main/setup.sh | bash
```

veya

```bash
wget -qO- https://raw.githubusercontent.com/kullanici-adiniz/mizraksu-web/main/setup.sh | bash
```

## 📝 Adım Adım Manuel Kurulum

### 1. VDS'e Bağlanma

```bash
ssh root@your-server-ip
```

### 2. Setup Script'ini İndirme ve Çalıştırma

```bash
# Setup script'ini indir
curl -fsSL https://raw.githubusercontent.com/kullanici-adiniz/mizraksu-web/main/setup.sh -o setup.sh

# Çalıştırma izni ver
chmod +x setup.sh

# Script'i çalıştır
./setup.sh
```

### 3. Kurulum Sonrası Yapılacaklar

Kurulum tamamlandıktan sonra aşağıdaki adımları takip edin:

#### 3.1. Proje Dosyalarını Yükleme

```bash
# Proje dizinine git
cd /var/www/mizraksu

# Proje dosyalarınızı buraya kopyalayın
# Seçenek 1: Git ile
git clone https://github.com/kullanici-adiniz/mizraksu-web.git .

# Seçenek 2: SCP ile
# scp -r /local/path/to/project/* root@your-server-ip:/var/www/mizraksu/

# Seçenek 3: FileZilla/SFTP ile dosyaları manuel yükleyin
```

#### 3.2. Bağımlılıkları Yükleme ve Build

```bash
cd /var/www/mizraksu

# Bağımlılıkları yükle
yarn install
# veya
npm install

# Proje build et
yarn build
# veya
npm run build
```

#### 3.3. Veritabanı Setup

```bash
# Prisma generate
npx prisma generate

# Veritabanı tablolarını oluştur
npx prisma db push

# (Opsiyonel) İlk verileri ekle
npx prisma db seed
```

#### 3.4. PM2 ile Uygulamayı Başlatma

```bash
# PM2 konfigürasyonu ile başlat
pm2 start ecosystem.config.js

# PM2'yi sistem açılışında otomatik başlat
pm2 save
pm2 startup

# Uygulamanın durumunu kontrol et
pm2 status
pm2 logs mizraksu-web
```

#### 3.5. Alan Adı ve SSL Ayarları

```bash
# Nginx konfigürasyonunu düzenle
sudo nano /etc/nginx/sites-available/mizraksu

# Domain adresinizi güncelleyin
server_name your-domain.com www.your-domain.com;

# Nginx'i test et ve yeniden başlat
sudo nginx -t
sudo systemctl restart nginx

# SSL sertifikası al (Let's Encrypt)
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## ⚙️ Konfigürasyon Dosyaları

### Environment Variables (.env)

```bash
# /var/www/mizraksu/.env dosyasını düzenleyin
nano .env
```

Önemli ayarlar:

```env
DATABASE_URL="postgresql://mizraksu:mizraksu123@localhost:5432/mizraksu"
NEXTAUTH_SECRET="buraya-guvenli-bir-secret-yazin"
NEXTAUTH_URL="https://your-domain.com"
ADMIN_EMAILS="admin@your-domain.com,yönetici@your-domain.com"
```

### Nginx Konfigürasyonu

Dosya: `/etc/nginx/sites-available/mizraksu`

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

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
}
```

### PM2 Konfigürasyonu

Dosya: `/var/www/mizraksu/ecosystem.config.js`

```javascript
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
```

## 🔧 Yönetim Komutları

### PM2 Komutları

```bash
# Uygulama durumunu gör
pm2 status

# Logları görüntüle
pm2 logs mizraksu-web

# Uygulamayı yeniden başlat
pm2 restart mizraksu-web

# Uygulamayı durdur
pm2 stop mizraksu-web

# Uygulamayı sil
pm2 delete mizraksu-web

# PM2 monitor
pm2 monit
```

### Nginx Komutları

```bash
# Nginx durumunu kontrol et
sudo systemctl status nginx

# Konfigürasyon test et
sudo nginx -t

# Nginx'i yeniden başlat
sudo systemctl restart nginx

# Nginx'i yeniden yükle
sudo systemctl reload nginx
```

### Veritabanı Komutları

```bash
# Veritabanına bağlan
psql -h localhost -U mizraksu -d mizraksu

# Veritabanı yedeği al
pg_dump -h localhost -U mizraksu mizraksu > backup.sql

# Yedeği geri yükle
psql -h localhost -U mizraksu mizraksu < backup.sql

# Prisma migration
npx prisma migrate dev
npx prisma db push
```

## 📊 Monitor ve Bakım

### Logların İzlenmesi

```bash
# PM2 logları
pm2 logs

# Nginx logları
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Sistem logları
sudo journalctl -f -u nginx
```

### Performans Monitor

```bash
# Sistem kaynakları
htop
df -h
free -h

# Node.js process monitor
pm2 monit
```

### Otomatik Yedekleme

```bash
# Yedekleme script'i oluştur
cat > /home/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U mizraksu mizraksu > /home/backups/mizraksu_$DATE.sql
find /home/backups/ -name "*.sql" -mtime +7 -delete
EOF

# Yedekleme dizini oluştur
mkdir -p /home/backups
chmod +x /home/backup.sh

# Cron'a ekle (her gün saat 03:00'da)
echo "0 3 * * * /home/backup.sh" | crontab -
```

## 🔒 Güvenlik Önlemleri

### Firewall

```bash
# Firewall durumu
sudo ufw status

# Port aç/kapa
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw deny 3000  # Direct Node.js access'i engelle
```

### SSH Güvenliği

```bash
# SSH konfigürasyonu
sudo nano /etc/ssh/sshd_config

# Önerilen ayarlar:
# Port 22 (değiştirebilirsiniz)
# PermitRootLogin no
# PasswordAuthentication no (SSH key kullanın)
```

### Güncellemeler

```bash
# Sistem güncellemeleri
sudo apt update && sudo apt upgrade -y

# Node.js modüllerini güncelle
cd /var/www/mizraksu
npm update
# veya
yarn upgrade

# Yeniden build et ve PM2'yi restart et
yarn build
pm2 restart mizraksu-web
```

## 🚨 Troubleshooting

### Yaygın Sorunlar ve Çözümleri

#### 1. Uygulama Başlamıyor

```bash
# PM2 loglarını kontrol et
pm2 logs mizraksu-web

# Port kullanımda mı kontrol et
sudo netstat -tlnp | grep :3000

# Process'i öldür ve yeniden başlat
sudo pkill -f "node.*next"
pm2 restart mizraksu-web
```

#### 2. Veritabanı Bağlantı Hatası

```bash
# PostgreSQL servis durumu
sudo systemctl status postgresql

# Veritabanına manuel bağlanmayı dene
psql -h localhost -U mizraksu -d mizraksu

# .env dosyasını kontrol et
cat .env | grep DATABASE_URL
```

#### 3. Nginx 502 Bad Gateway

```bash
# Nginx loglarını kontrol et
sudo tail -f /var/log/nginx/error.log

# Node.js uygulaması çalışıyor mu kontrol et
curl http://localhost:3000

# PM2 durumunu kontrol et
pm2 status
```

#### 4. SSL Sorunları

```bash
# SSL sertifikası durumu
sudo certbot certificates

# SSL yenileme
sudo certbot renew

# Nginx konfigürasyonunu kontrol et
sudo nginx -t
```

## 📞 Destek

Sorun yaşamanız durumunda:

1. Logları kontrol edin (`pm2 logs`, `sudo journalctl -f`)
2. Servislerin durumunu kontrol edin (`pm2 status`, `sudo systemctl status`)
3. Bu rehberdeki troubleshooting bölümünü inceleyin
4. Proje GitHub repository'sindeki issues bölümünü kontrol edin

---

**Not:** Bu rehber production ortamı için hazırlanmıştır. Geliştirme ortamı için farklı konfigürasyonlar gerekebilir.