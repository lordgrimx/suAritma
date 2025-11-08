"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TEXTS = [
  'Sağlık Katıyoruz',
  'Hizmet Getiriyoruz',
  'Güven Veriyoruz'
];

interface HomePageProps {
  hero: any
  brands: any[]
  services: any[]
  products: any[]
  about: any
  reviews: any[]
  contact: any
}

export default function HomePage({ hero, brands, services, products, about, reviews, contact }: HomePageProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const brandsRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const serviceCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const productsRef = useRef<HTMLDivElement>(null);
  const productCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const aboutRef = useRef<HTMLDivElement>(null);
  const reviewRowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const heroSectionRef = useRef<HTMLElement>(null);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  // Video rotation effect
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const videos = [
      '/3958714-hd_1920_1080_30fps.mp4',
      '/856003-hd_1920_1080_24fps.mp4',
      '/3969501-uhd_3840_2160_25fps.mp4'
    ];
    let currentVideoIndex = 0;

    const handleVideoEnd = () => {
      currentVideoIndex = (currentVideoIndex + 1) % videos.length;
      video.src = videos[currentVideoIndex];
      video.play().catch(console.error);
    };

    video.addEventListener('ended', handleVideoEnd);
    return () => video.removeEventListener('ended', handleVideoEnd);
  }, []);

  // Text animation effect
  useEffect(() => {
    const currentText = TEXTS[currentTextIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayText.length < currentText.length) {
      timeout = setTimeout(() => {
        setDisplayText(currentText.slice(0, displayText.length + 1));
      }, 100);
    } else if (!isDeleting && displayText.length === currentText.length) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
    } else if (isDeleting && displayText.length > 0) {
      timeout = setTimeout(() => {
        setDisplayText(displayText.slice(0, -1));
      }, 50);
    } else if (isDeleting && displayText.length === 0) {
      setIsDeleting(false);
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % TEXTS.length);
    }

    return () => clearTimeout(timeout);
  }, [displayText, currentTextIndex, isDeleting]);

  // GSAP Brands scroll animation
  useEffect(() => {
    const brandsContainer = brandsRef.current;
    if (!brandsContainer) return;

    let animation: gsap.core.Timeline | null = null;

    const initAnimation = () => {
      const brandItems = brandsContainer.querySelectorAll('.brand-item');
      if (brandItems.length === 0) return;

      let halfWidth = 0;
      const halfCount = Math.floor(brandItems.length / 2);
      for (let i = 0; i < halfCount; i++) {
        halfWidth += (brandItems[i] as HTMLElement).offsetWidth + 64;
      }

      animation = gsap.timeline({
        repeat: -1,
        defaults: { ease: "none" }
      });

      animation.to(brandsContainer, {
        x: -halfWidth,
        duration: 30,
        ease: "none",
      });
    };

    const timeout = setTimeout(initAnimation, 500);

    return () => {
      clearTimeout(timeout);
      if (animation) {
        animation.kill();
      }
      gsap.killTweensOf(brandsContainer);
    };
  }, [brands]);

  // GSAP Services scroll animations
  useEffect(() => {
    if (!servicesRef.current) return;

    serviceCardsRef.current.forEach((card, index) => {
      if (!card) return;

      gsap.fromTo(
        card,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: index * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [services]);

  // GSAP Products scroll animations
  useEffect(() => {
    if (!productsRef.current) return;

    productCardsRef.current.forEach((card, index) => {
      if (!card) return;

      gsap.fromTo(
        card,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          delay: index * 0.15,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        const triggerElement = trigger.vars?.trigger;
        if (triggerElement && productCardsRef.current.includes(triggerElement as HTMLDivElement)) {
          trigger.kill();
        }
      });
    };
  }, [products]);

  // GSAP About Us scroll animations
  useEffect(() => {
    if (!aboutRef.current) return;

    const title = aboutRef.current.querySelector('h2');
    const paragraphs = aboutRef.current.querySelectorAll('p');
    const icons = aboutRef.current.querySelectorAll('.about-icon');

    if (title) {
      gsap.fromTo(
        title,
        { opacity: 0, y: -30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: title,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    paragraphs.forEach((paragraph, index) => {
      gsap.fromTo(
        paragraph,
        { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          delay: 0.2 + index * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: paragraph,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    icons.forEach((icon, index) => {
      gsap.fromTo(
        icon,
        { opacity: 0, scale: 0, rotation: -180 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.8,
          delay: 0.4 + index * 0.15,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: icon,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        const triggerElement = trigger.vars?.trigger;
        if (triggerElement && aboutRef.current?.contains(triggerElement as Node)) {
          trigger.kill();
        }
      });
    };
  }, [about]);

  // Reviews marquee animations
  useEffect(() => {
    const timeouts: number[] = [];
    const timelines: gsap.core.Timeline[] = [];

    reviewRowsRef.current.forEach((row, index) => {
      if (!row) return;

      const timeout = window.setTimeout(() => {
        const halfWidth = row.scrollWidth / 2;
        if (!halfWidth) return;

        const direction = index === 0 ? 1 : -1;
        const startX = direction === 1 ? -halfWidth : 0;
        const endX = direction === 1 ? 0 : -halfWidth;

        gsap.set(row, { x: startX });

        const timeline = gsap.timeline({ repeat: -1, defaults: { ease: "none" } });
        timeline.to(row, { x: endX, duration: 30, ease: "none" });

        timelines.push(timeline);
      }, 100);

      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach((id) => window.clearTimeout(id));
      timelines.forEach((tl) => tl.kill());
    };
  }, [reviews]);

  // Scroll buttons visibility
  useEffect(() => {
    const handleScroll = () => {
      if (!heroSectionRef.current) return;
      
      const heroBottom = heroSectionRef.current.offsetTop + heroSectionRef.current.offsetHeight;
      const scrollY = window.scrollY || window.pageYOffset;
      
      setShowScrollButtons(scrollY > heroBottom);
      
      // Hide scroll indicator when scrolled to half of hero section
      const heroHeight = heroSectionRef.current.offsetHeight;
      setShowScrollIndicator(scrollY < heroHeight / 2);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCall = () => {
    window.location.href = `tel:${contact?.telefon?.replace(/\s/g, '')}`;
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleWhatsApp = () => {
    const phoneNumber = '905362363168';
    const message = encodeURIComponent('Merhaba, su arıtma sistemleri hakkında bilgi almak istiyorum.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleScrollDown = () => {
    const heroHeight = heroSectionRef.current?.offsetHeight || 0;
    window.scrollTo({
      top: heroHeight,
      behavior: 'smooth',
    });
  };

  // Separate reviews by row
  const reviewRows = [
    reviews.filter(r => r.satir === 0),
    reviews.filter(r => r.satir === 1)
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section ref={heroSectionRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
          >
            <source src={hero?.videoURL || '/3958714-hd_1920_1080_30fps.mp4'} type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-8 flex items-center w-full">
          <div className="text-white max-w-2xl ml-0">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {hero?.baslik || "Diyarbakır'ın Suyuna"} <br />
              <span className="text-cyan-300 inline-block">
                {displayText}
                <span className="animate-pulse ml-1">|</span>
              </span>
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              {hero?.altBaslik || 'Mızrak Su Arıtma Sistemleri ile evinizde güvenle su için'}
            </p>
            <Button
              onClick={handleCall}
              className="bg-cyan-400 hover:bg-cyan-500 text-white px-8 py-4 text-lg rounded-button whitespace-nowrap cursor-pointer"
            >
              <i className="fas fa-phone mr-2"></i>
              {hero?.butonMetni || 'Hemen Keşif İsteyin'}
            </Button>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div 
          className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 transition-all duration-500 ${
            showScrollIndicator ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
          }`}
        >
          <div 
            onClick={handleScrollDown}
            className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform"
          >
            <div className="text-white text-xs font-semibold mb-2 tracking-wide drop-shadow-lg opacity-90">
              Aşağı Kaydır
            </div>
            <div className="relative">
              <div className="w-5 h-9 border-2 border-white/70 rounded-full flex items-start justify-center p-1.5 backdrop-blur-sm bg-white/5">
                <div className="w-1 h-2 bg-white rounded-full animate-bounce"></div>
              </div>
            </div>
            <div className="mt-1.5 animate-bounce">
              <i className="fas fa-chevron-down text-white text-base drop-shadow-lg opacity-90"></i>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Band - Partner Brands */}
      {brands.length > 0 && (
        <section className="py-16 bg-white overflow-hidden">
          <div className="max-w-6xl mx-auto px-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-12">
              Anlaşmalı Olduğumuz Dev Markalar
            </h2>
            <div className="relative w-full overflow-hidden">
              <div 
                ref={brandsRef}
                className="flex items-center space-x-16 will-change-transform"
                style={{ width: 'fit-content' }}
              >
                {/* First set */}
                {brands.map((brand) => (
                  <div key={`first-${brand.id}`} className="brand-item flex flex-col items-center justify-center flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <Image
                        src={brand.logoURL}
                        alt={brand.isim}
                        width={128}
                        height={128}
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <p className="text-lg mt-2 text-gray-600 font-semibold">{brand.isim}</p>
                  </div>
                ))}
                
                {/* Second set for seamless loop */}
                {brands.map((brand) => (
                  <div key={`second-${brand.id}`} className="brand-item flex flex-col items-center justify-center flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <Image
                        src={brand.logoURL}
                        alt={brand.isim}
                        width={128}
                        height={128}
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <p className="text-lg mt-2 text-gray-600 font-semibold">{brand.isim}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      {services.length > 0 && (
        <section ref={servicesRef} className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-blue-900 mb-4 relative inline-block">
                Su Arıtma Hizmetlerimiz
                <span className="absolute bottom-0 left-0 w-full h-1 bg-cyan-400"></span>
              </h2>
              <p className="text-lg text-gray-700 mt-6 max-w-3xl mx-auto">
                Diyarbakır'da 15 yılı aşkın süredir profesyonel su arıtma sistemleri sağlıyoruz. 
                Mızrak Su Arıtma, sağlıklı ve temiz su için en iyi çözümleri sunar.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <Card
                  key={service.id}
                  ref={(el) => { serviceCardsRef.current[index] = el; }}
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <CardContent className="p-8 h-full flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-cyan-400 transition-colors">
                      <i className={`fas ${service.ikon} text-white text-2xl`}></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      {service.baslik}
                    </h3>
                    <p className="text-gray-600 mb-6 flex-grow">
                      {service.aciklama}
                    </p>
                    <a href="#" className="text-blue-600 font-semibold hover:text-cyan-400 transition-colors">
                      Daha fazla bilgi edinin →
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button 
                onClick={handleCall}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-button"
              >
                Size özel arıtma cihazı edinin →
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Products Section */}
      {products.length > 0 && (
        <section ref={productsRef} className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-8">
            <h2 className="text-4xl font-bold text-center text-blue-900 mb-16">
              Öne Çıkan Ürünlerimiz
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <Card
                  key={product.id}
                  ref={(el) => { productCardsRef.current[index] = el; }}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="h-64 overflow-hidden relative">
                    <Image
                      src={product.resimURL}
                      alt={product.baslik}
                      fill
                      className="object-cover object-top"
                      unoptimized
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {product.baslik}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {product.aciklama}
                    </p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-button whitespace-nowrap cursor-pointer">
                      Detayları İncele
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Us Section */}
      {about && (
        <section ref={aboutRef} className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-8 text-center">
            <h2 className="text-4xl font-bold text-blue-900 mb-8">
              {about.baslik}
            </h2>
            <div className="text-lg text-gray-700 leading-relaxed">
              {about.paragraflar && Array.isArray(about.paragraflar) && about.paragraflar.map((paragraph: string, index: number) => (
                <p key={index} className="mb-6">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="flex justify-center space-x-8 mt-8">
              <div className="text-center">
                <div className="text-3xl text-cyan-400 mb-2 about-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <p className="font-bold text-gray-900 text-lg">7/24 Servis</p>
              </div>
              <div className="text-center">
                <div className="text-3xl text-cyan-400 mb-2 about-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <p className="font-bold text-gray-900 text-lg">Güvence</p>
              </div>
              <div className="text-center">
                <div className="text-3xl text-cyan-400 mb-2 about-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <p className="font-bold text-gray-900 text-lg">Yerel Hizmet</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Customer Reviews */}
      {reviews.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-8">
            <h2 className="text-4xl font-bold text-center text-blue-900 mb-16">
              Müşterilerimiz Ne Diyor?
            </h2>
            <div className="space-y-8">
              {reviewRows.map((row, rowIndex) => (
                row.length > 0 && (
                  <div key={rowIndex} className="overflow-hidden">
                    <div
                      ref={(el) => { reviewRowsRef.current[rowIndex] = el; }}
                      className="flex gap-6"
                    >
                      {row.concat(row).map((review, idx) => (
                        <div
                          key={`${rowIndex}-${idx}-${review.id}`}
                          className="review-card min-w-[280px] max-w-xs rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-sm shadow-blue-100/40 backdrop-blur-sm"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
                              <i className="fas fa-quote-left"></i>
                            </div>
                            <div className="text-left">
                              <p className="font-semibold text-gray-800">{review.isim}</p>
                              <p className="text-sm text-gray-500">{review.konum}</p>
                            </div>
                          </div>
                          <p className="text-gray-700 italic leading-relaxed mb-4">
                            "{review.yorum}"
                          </p>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, starIdx) => (
                              <i key={starIdx} className={`fas fa-star text-sm ${starIdx < (review.rating || 5) ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact and Map Section */}
      {contact && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-blue-900 mb-8">
                  İletişim Bilgileri
                </h2>
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="text-2xl text-cyan-400 mr-4">
                      <i className="fas fa-user"></i>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Hamdi Usta</p>
                      <p className="text-gray-600">Su Arıtma Uzmanı</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-2xl text-cyan-400 mr-4 mt-1">
                      <i className="fas fa-phone"></i>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{contact.telefon}</p>
                      {contact.telefonlar && Array.isArray(contact.telefonlar) && contact.telefonlar.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {contact.telefonlar.map((tel: string, index: number) => (
                            <p key={index} className="font-semibold text-gray-800">{tel}</p>
                          ))}
                        </div>
                      )}
                      <p className="text-gray-600 mt-1">7/24 Arayabilirsiniz</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-2xl text-cyan-400 mr-4">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{contact.adres}</p>
                      <p className="text-gray-600">Tüm ilçelere hizmet veriyoruz</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-2xl text-cyan-400 mr-4">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Çalışma Saatleri</p>
                      <p className="text-gray-600">{contact.calismaSaatleri}</p>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={handleCall}
                  className="mt-8 bg-cyan-400 hover:bg-cyan-500 text-white px-8 py-4 text-lg rounded-button whitespace-nowrap cursor-pointer"
                >
                  <i className="fas fa-phone mr-2"></i>
                  Hemen Ara
                </Button>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                  Konum
                </h3>
                <div className="h-96 bg-gray-300 rounded-lg overflow-hidden">
                  <iframe
                    src={contact.haritaURL}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Diyarbakır Konum"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-white">Mızrak Su Arıtma</h3>
              <p className="text-gray-300">
                Diyarbakır'ın güvenilir su arıtma çözüm ortağı
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Hizmetlerimiz</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Bakım Onarım</li>
                <li>Filtre Değişimi</li>
                <li>Arıza Tespit</li>
                <li>Servis ve Montaj</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">İletişim</h4>
              <p className="text-gray-300">
                Hamdi Usta: {contact?.telefon}<br />
                Diyarbakır, Türkiye
              </p>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Mızrak Su Arıtma Sistemleri. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>

      {/* Fixed Scroll Buttons */}
      <div
        className={`fixed bottom-24 left-4 md:bottom-6 md:left-6 z-50 transition-all duration-300 ${
          showScrollButtons
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <button
          onClick={handleScrollToTop}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-blue-600 hover:bg-cyan-400 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
          aria-label="Yukarı çık"
        >
          <i className="fas fa-arrow-up text-lg md:text-xl group-hover:scale-110 transition-transform"></i>
        </button>
      </div>

      <div
        className={`fixed bottom-24 right-4 md:bottom-6 md:right-6 z-50 transition-all duration-300 ${
          showScrollButtons
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <button
          onClick={handleWhatsApp}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
          aria-label="WhatsApp ile iletişime geç"
        >
          <i className="fab fa-whatsapp text-xl md:text-2xl group-hover:scale-110 transition-transform"></i>
        </button>
      </div>

      {/* Fixed Mobile CTA */}
      <div className="fixed bottom-4 left-4 right-4 md:hidden z-40">
        <Button 
          onClick={handleCall}
          className="w-full bg-cyan-400 hover:bg-cyan-500 text-white py-4 text-lg rounded-button whitespace-nowrap cursor-pointer shadow-lg"
        >
          <i className="fas fa-phone mr-2"></i>
          Hemen Ara: {contact?.telefon}
        </Button>
      </div>
    </div>
  );
}

