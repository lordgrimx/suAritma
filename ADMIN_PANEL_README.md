# Admin Panel Kurulum ve Kullanım Rehberi

## 🎉 Admin Panel Başarıyla Oluşturuldu!

Mızrak Su Arıtma sitesi artık PostgreSQL veritabanı ve NextAuth.js kimlik doğrulama ile tam özellikli bir admin paneline sahip.

## 📋 Kurulum Adımları

### 1. Veritabanı Kurulumu

Öncelikle bir PostgreSQL veritabanı oluşturun ve bağlantı bilgilerini `.env` dosyasına ekleyin:

```bash
# .env dosyası oluşturun (my-app klasöründe)
DATABASE_URL="postgresql://kullanici:sifre@localhost:5432/mizrak_db"
NEXTAUTH_SECRET="rastgele-uzun-bir-secret-anahtar-buraya"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="guvenli-sifre-buraya"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 2. Prisma Client Oluşturma ve Migration

```bash
cd my-app
npm run prisma:generate
npm run prisma:migrate
```

Migration adı sorulduğunda (örneğin): `initial_setup`

### 3. Seed Verilerini Yükleme

Mevcut hardcoded verileri veritabanına aktarmak için:

```bash
npm run prisma:seed
```

### 4. Geliştirme Sunucusunu Başlatma

```bash
npm run dev
```

Site: http://localhost:3000
Admin Panel: http://localhost:3000/admin/login

## 🔐 Giriş Bilgileri

Admin paneline giriş için `.env` dosyasında belirlediğiniz kullanıcı adı ve şifreyi kullanın:

- **Kullanıcı Adı**: `.env` dosyasındaki `ADMIN_USERNAME` (varsayılan: admin)
- **Şifre**: `.env` dosyasındaki `ADMIN_PASSWORD`

## 📱 Admin Panel Özellikleri

### Dashboard
- Tüm section'lara hızlı erişim
- Sezgisel kart tabanlı navigasyon

### Düzenlenebilir Section'lar

1. **Hero Section** (`/admin/hero`)
   - Başlık, alt başlık, buton metni
   - Video URL düzenleme

2. **Markalar** (`/admin/brands`)
   - Marka ekleme/silme/düzenleme
   - Logo URL yönetimi
   - Sıralama

3. **Hizmetler** (`/admin/services`)
   - Hizmet kartları yönetimi
   - İkon seçici
   - Açıklama düzenleme

4. **Ürünler** (`/admin/products`)
   - Ürün katalogu yönetimi
   - Resim URL düzenleme
   - Sıralama

5. **Hakkımızda** (`/admin/about`)
   - Başlık düzenleme
   - Paragraf ekleme/silme/düzenleme

6. **Yorumlar** (`/admin/reviews`)
   - Müşteri yorumları yönetimi
   - 2 satırlı düzen (marquee efekti için)
   - Yorum ekleme/silme/düzenleme

7. **İletişim** (`/admin/contact`)
   - Telefon, adres, çalışma saatleri
   - Google Maps embed URL

## 🛠️ Teknik Detaylar

### Teknoloji Stack
- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js (Credentials Provider)
- **Animations**: GSAP

### Dosya Yapısı

```
my-app/
├── app/
│   ├── admin/              # Admin panel sayfaları
│   │   ├── layout.tsx      # Admin layout (korumalı)
│   │   ├── page.tsx        # Dashboard
│   │   ├── login/          # Login sayfası
│   │   ├── hero/           # Hero düzenleme
│   │   ├── brands/         # Marka yönetimi
│   │   ├── services/       # Hizmet yönetimi
│   │   ├── products/       # Ürün yönetimi
│   │   ├── about/          # Hakkımızda
│   │   ├── reviews/        # Yorum yönetimi
│   │   └── contact/        # İletişim
│   ├── api/
│   │   ├── auth/           # NextAuth endpoint
│   │   └── sections/       # CRUD API routes
│   ├── page.tsx            # Ana sayfa (Server Component)
│   └── layout.tsx          # Root layout + metadata
├── components/
│   ├── admin/              # Admin component'leri
│   │   ├── ImageUploader.tsx
│   │   ├── TextEditor.tsx
│   │   └── IconSelector.tsx
│   └── HomePage.tsx        # Ana sayfa Client Component
├── lib/
│   ├── prisma.ts           # Prisma client
│   └── auth.ts             # NextAuth config
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed script
├── middleware.ts           # Admin route koruması
└── .env                    # Environment variables
```

## 🚀 Production Deployment

### Veritabanı
1. Production PostgreSQL veritabanı oluşturun (Railway, Supabase, Neon, vb.)
2. `.env` dosyasındaki `DATABASE_URL`'i production URL ile değiştirin
3. `NEXTAUTH_SECRET`'i güvenli bir değer ile değiştirin
4. `NEXTAUTH_URL`'i production URL ile değiştirin

### Migration ve Seed
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### Build ve Deploy
```bash
npm run build
npm start
```

## 🔒 Güvenlik Notları

1. **Environment Variables**: `.env` dosyasını asla commit etmeyin
2. **Admin Şifresi**: Güçlü bir şifre kullanın
3. **NEXTAUTH_SECRET**: Production'da güvenli, rastgele bir değer kullanın
4. **Database**: Production veritabanı için SSL kullanın

## 📝 Kullanım Önerileri

### Resim URL'leri
- Resimler için CDN kullanın (Cloudinary, ImageKit, vb.)
- Veya Next.js'in public klasörüne yükleyin (`/resim.jpg`)

### Performans
- Veritabanı query'lerini optimize edin
- İhtiyaç halinde caching ekleyin

### Backup
- Düzenli veritabanı backup'ları alın
- Önemli değişikliklerden önce backup oluşturun

## 🆘 Sorun Giderme

### Prisma Client Hatası
```bash
npm run prisma:generate
```

### Migration Hatası
```bash
# Migration'ları sıfırla (dikkatli!)
npx prisma migrate reset
npm run prisma:seed
```

### Login Sorunu
- `.env` dosyasındaki `ADMIN_USERNAME` ve `ADMIN_PASSWORD` değerlerini kontrol edin
- Browser cache'i temizleyin

## 📞 Destek

Herhangi bir sorun yaşarsanız veya özellik eklemek isterseniz, lütfen bize bildirin!

---

**Not**: Bu admin panel geliştirme ortamında test edilmiştir. Production'a geçmeden önce kapsamlı test yapmanız önerilir.

