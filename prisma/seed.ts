import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Veritabanına seed verileri ekleniyor...')

  // Hero Section
  await prisma.heroSection.deleteMany()
  const hero = await prisma.heroSection.create({
    data: {
      baslik: "Diyarbakır'ın Suyuna",
      altBaslik: 'Mızrak Su Arıtma Sistemleri ile evinizde güvenle su için',
      butonMetni: 'Hemen Keşif İsteyin',
      videoURL: '/3958714-hd_1920_1080_30fps.mp4',
    },
  })
  console.log('✅ Hero section oluşturuldu')

  // Brands
  await prisma.brand.deleteMany()
  const brands = [
    { isim: 'CONAX', logoURL: 'https://www.conax.com.tr/Public/img/logo.webp', sira: 1 },
    { isim: 'PENTAIR', logoURL: 'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/112015/untitled-1_213.png?itok=2fDtx3ht', sira: 2 },
    { isim: 'AQUA GERMAN', logoURL: 'https://aquagerman.com/wp-content/uploads/2019/11/indir.png', sira: 3 },
    { isim: 'WATTS', logoURL: 'https://www.mekaniktesisatmarket.com/Data/Markalar/46.jpg', sira: 4 },
    { isim: 'DVC WATER', logoURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAo9KoMS7Al1sJgrYJxqt_nCZfrTIIW8X06A&s', sira: 5 },
    { isim: 'DOW FILMTEC', logoURL: 'https://www.thewaterguy.ca/images/products/thumb_manufacturer_dow_filmtech_logo.png', sira: 6 },
  ]
  for (const brand of brands) {
    await prisma.brand.create({ data: brand })
  }
  console.log('✅ Markalar oluşturuldu')

  // Services
  await prisma.service.deleteMany()
  const services = [
    {
      baslik: 'Konutlar için filtreleme',
      aciklama: 'Eviniz için bakterileri temizleyen, tadını iyileştiren ve ailenizin sağlığını koruyan kapsamlı su arıtma sistemleri.',
      ikon: 'fa-home',
      sira: 1,
    },
    {
      baslik: 'Su yumuşatma',
      aciklama: 'Sert su sorunlarına etkili çözümler. Kireç oluşumunu bitirin, cihaz ömrünü uzatın. Daha yumuşak bir cilt ve saçın keyfini çıkarın.',
      ikon: 'fa-tint',
      sira: 2,
    },
    {
      baslik: 'Aradığınız arıtma sistemleri',
      aciklama: "Bakterilerin %99'una kadar gideren, kristal berraklığında içme suyu sağlayan gelişmiş arıtma teknolojisi.",
      ikon: 'fa-flask',
      sira: 3,
    },
    {
      baslik: 'Endüstriyel Çözümler',
      aciklama: 'Yüksek su ihtiyacı olan üretim, tarım ve ticari tesisler için özelleştirilmiş su arıtma sistemleri.',
      ikon: 'fa-industry',
      sira: 4,
    },
    {
      baslik: 'Suyunuz test edelim',
      aciklama: 'Bakterileri belirlemek ve uygun arıtma çözümlerini önermek için kapsamlı su kalitesi analizi.',
      ikon: 'fa-vial',
      sira: 5,
    },
    {
      baslik: 'Bakım & Servis',
      aciklama: 'Su arıtma sistemlerinizin en yüksek verimlilikte çalışmaya devam etmesini sağlamak için periyodik bakım programları.',
      ikon: 'fa-cogs',
      sira: 6,
    },
  ]
  for (const service of services) {
    await prisma.service.create({ data: service })
  }
  console.log('✅ Hizmetler oluşturuldu')

  // Products
  await prisma.product.deleteMany()
  const products = [
    {
      baslik: 'Premium Arıtma Sistemi',
      aciklama: '7 aşamalı filtreleme teknolojisi',
      resimURL: 'https://readdy.ai/api/search-image?query=modern%20water%20filtration%20system%20with%20sleek%20white%20cabinet%20design%2C%20professional%20product%20photography%2C%20clean%20white%20background%2C%20high-tech%20water%20purifier%20with%20digital%20display&width=400&height=300&seq=product001&orientation=landscape',
      sira: 1,
    },
    {
      baslik: 'Kompakt Arıtma Sistemi',
      aciklama: 'Küçük mutfaklar için ideal çözüm',
      resimURL: 'https://readdy.ai/api/search-image?query=compact%20water%20filtration%20unit%20with%20modern%20design%2C%20professional%20product%20shot%2C%20clean%20white%20background%2C%20under-sink%20water%20purifier%20system%20with%20chrome%20faucet&width=400&height=300&seq=product002&orientation=landscape',
      sira: 2,
    },
    {
      baslik: 'Endüstriyel Arıtma Sistemi',
      aciklama: 'Yüksek kapasiteli işletmeler için',
      resimURL: 'https://readdy.ai/api/search-image?query=industrial%20grade%20water%20filtration%20system%2C%20stainless%20steel%20design%2C%20professional%20commercial%20water%20purifier%2C%20clean%20white%20background%2C%20high-capacity%20water%20treatment%20unit&width=400&height=300&seq=product003&orientation=landscape',
      sira: 3,
    },
  ]
  for (const product of products) {
    await prisma.product.create({ data: product })
  }
  console.log('✅ Ürünler oluşturuldu')

  // About Section
  await prisma.aboutSection.deleteMany()
  const about = await prisma.aboutSection.create({
    data: {
      baslik: 'Neden Biz?',
      paragraflar: [
        "Hamdi Usta Güvencesiyle Diyarbakır'da 15 yılı aşkın tecrübemizle su arıtma sistemleri konusunda güvenilir çözümler sunuyoruz. Yerel bir işletme olarak müşterilerimize 7/24 ulaşılabilir hizmet veriyoruz.",
        "Sadece ürün satmakla kalmıyor, satış sonrası destek ve bakım hizmetleriyle uzun vadeli çözümler sunuyoruz. Diyarbakır'ın her noktasına hızlı servis imkanımız bulunmaktadır."
      ],
    },
  })
  console.log('✅ Hakkımızda section oluşturuldu')

  // Reviews
  await prisma.review.deleteMany()
  const reviews = [
    {
      isim: 'Mehmet Yılmaz',
      konum: 'Bağlar, Diyarbakır',
      yorum: "Hamdi Usta'nın hizmeti gerçekten mükemmel. Sistemi kurduktan sonra suyumuzun tadı bambaşka oldu. Kesinlikle tavsiye ederim.",
      sira: 1,
      satir: 0,
    },
    {
      isim: 'Fatma Demir',
      konum: 'Yenişehir, Diyarbakır',
      yorum: 'Arıza olduğunda hemen gelip çözdüler. 7/24 hizmet gerçekten var. Çok memnunuz, teşekkürler.',
      sira: 2,
      satir: 0,
    },
    {
      isim: 'Ali Özkan',
      konum: 'Kayapınar, Diyarbakır',
      yorum: "Fiyatları uygun, hizmetleri kaliteli. Diyarbakır'da bu işi en iyi yapan firma. Herkese öneririm.",
      sira: 3,
      satir: 0,
    },
    {
      isim: 'Zeynep Kaya',
      konum: 'Sur, Diyarbakır',
      yorum: 'Kurulumdan bakıma kadar her adımda yanımızda oldular. Artık suyumuz tam istediğimiz gibi.',
      sira: 1,
      satir: 1,
    },
    {
      isim: 'Ahmet Kaplan',
      konum: 'Ergani, Diyarbakır',
      yorum: 'İşletmemiz için özel çözümler sundular. Profesyonel ve güvenilir bir ekip.',
      sira: 2,
      satir: 1,
    },
    {
      isim: 'Emine Çelik',
      konum: 'Çermik, Diyarbakır',
      yorum: 'Bakım anlaşması sayesinde cihazımız hep ilk günkü performansında. Tavsiye ederim.',
      sira: 3,
      satir: 1,
    },
  ]
  for (const review of reviews) {
    await prisma.review.create({ data: review })
  }
  console.log('✅ Yorumlar oluşturuldu')

  // Contact Info
  await prisma.contactInfo.deleteMany()
  const contact = await prisma.contactInfo.create({
    data: {
      telefon: '+90 536 236 31 68 (Hamdi USTA)',
      telefonlar: ['+90 530 391 77 21'],
      adres: 'Ahmet Kaya Cd., Bağcılar, 21090 Bağlar/Diyarbakır',
      calismaSaatleri: '7/24 Acil Servis',
      haritaURL: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3147.8008836341255!2d40.12970657569962!3d37.911716571951175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40751ed5780d5ab1%3A0xb42f0cdc28edc28c!2zQmHEn2PEsWxhciwgQWhtZXQgS2F5YSBDZC4sIDIxMDkwIEJhxJ9sYXIvRGl5YXJiYWvEsXI!5e0!3m2!1str!2str!4v1762612111699!5m2!1str!2str',
    },
  })
  console.log('✅ İletişim bilgileri oluşturuldu')

  // Footer
  await prisma.footer.deleteMany()
  const footer = await prisma.footer.create({
    data: {
      metin: "Diyarbakır'ın güvenilir su arıtma çözüm ortağı",
      linkler: [
        { baslik: 'Bakım Onarım', url: '#' },
        { baslik: 'Filtre Değişimi', url: '#' },
        { baslik: 'Arıza Tespit', url: '#' },
        { baslik: 'Servis ve Montaj', url: '#' }
      ],
    },
  })
  console.log('✅ Footer oluşturuldu')

  console.log('🎉 Seed işlemi başarıyla tamamlandı!')
}

main()
  .catch((e) => {
    console.error('❌ Seed hatası:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

