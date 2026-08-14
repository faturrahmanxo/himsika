import React, { useState } from "react";
// Import Swiper React components & Modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

// Import gambar mockup (Sesuaikan dengan path aslimu)
import Image1 from "../assets/images/businessCompany/jahim.png";
import Image2 from "../assets/images/businessCompany/gelang&keychain.png";
import Image3 from "../assets/images/businessCompany/kaos&lanyard.png";

export default function BusinessCompany() {
  // State untuk Tab Kategori
  const [activeCategory, setActiveCategory] = useState("merchandise");

  // Mockup Data Banner / Swipe
  const heroSlides = [
    {
      id: 1,
      image: Image1,
      title: "Official Merchandise HIMSIKA",
      desc: "Koleksi eksklusif untuk menunjang gaya mahasiswa Sistem Informasi.",
    },
    {
      id: 2,
      image: Image2,
      title: "Layanan Jasa Kreatif & IT",
      desc: "Solusi digital terbaik dari talenta-talenta unggulan kami.",
    },
  ];

  // Mockup Data Merchandise
  const merchandiseData = [
    {
      id: 1,
      image: Image1,
      name: "T-Shirt HIMSIKA Eksklusif (Lengan Pendek)",
      price: "Rp 85.000",
    },
    {
      id: 2,
      image: Image2,
      name: "Gelang & Keychain HIMSIKA (Set)",
      price: "Rp 25.000",
    },
    {
      id: 3,
      image: Image3,
      name: "Sticker Pack Vol. 1 (Isi 10 Pcs)",
      price: "Rp 15.000",
    },
    {
      id: 4,
      image: Image1,
      name: "Totebag Kanvas HIMSIKA",
      price: "Rp 45.000",
    },
  ];

  // Mockup Data Jasa
  const jasaData = [
    {
      id: 1,
      image: Image2,
      name: "Jasa Pembuatan Website (Company Profile, Undangan Web)",
    },
    {
      id: 2,
      image: Image3,
      name: "Jasa Desain Grafis (Poster, Banner, Feed Instagram)",
    },
    {
      id: 3,
      image: Image1,
      name: "Jasa Instalasi Ulang Windows & Software Design",
    },
  ];

  // Fungsi untuk mengarahkan order ke WhatsApp
  const handleOrder = (productName) => {
    const message = encodeURIComponent(
      `Halo, saya tertarik untuk memesan/menggunakan layanan: ${productName}. Bisa minta informasi lebih lanjut?`,
    );
    window.open(`https://wa.me/6281234567890?text=${message}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-[#043761] via-primary to-[#043761] font-primary pt-24 pb-20 selection:bg-accent selection:text-slate-900 relative overflow-hidden">
      {/* Background Dekorasi Tech/Glassmorphism */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="absolute w-[30rem] h-[30rem] rounded-full blur-[120px] bg-accent/20 top-0 right-0 -translate-y-1/2 animate-pulse"></div>
        <div
          className="absolute w-[25rem] h-[25rem] rounded-full blur-[120px] bg-info/20 bottom-0 left-0 -translate-x-1/2 translate-y-1/3 animate-pulse"
          style={{ animationDuration: "7s" }}
        ></div>

        {/* Ornamen Floating */}
        <div
          className="absolute top-1/4 left-10 sm:left-24 animate-bounce text-accent/30"
          style={{ animationDuration: "5s" }}
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="4"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 4"
            ></rect>
          </svg>
        </div>
        <div
          className="absolute bottom-1/4 right-10 sm:right-20 animate-pulse text-info/30"
          style={{ animationDuration: "4s" }}
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="3"
              stroke="currentColor"
              strokeWidth="2"
            ></circle>
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            ></circle>
          </svg>
        </div>
      </div>

      {/* 1. HERO SECTION (SWIPE BANNER) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 pt-4 relative z-10">
        <div className="w-full aspect-[16/9] md:aspect-[21/9] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 relative group bg-white/5 backdrop-blur-sm">
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            effect={"fade"}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            loop={true}
            className="h-full w-full custom-swiper-pagination"
          >
            {heroSlides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="relative h-full w-full">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    loading="lazy"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-in-out opacity-90"
                  />
                  {/* Cinematic Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#043761]/95 via-[#043761]/50 to-transparent flex flex-col justify-end p-8 sm:p-12 lg:p-16 text-left">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3 sm:mb-4 drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                      {slide.title}
                    </h1>
                    <p className="text-white/90 text-sm sm:text-lg max-w-2xl drop-shadow-md">
                      {slide.desc}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* 2. CATALOG SECTION (KATEGORI & GRID PRODUK) */}
      <section
        id="katalog"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 relative z-10"
      >
        {/* Judul & Filter Kategori */}
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-8 relative inline-block">
            Katalog{" "}
            <span className="text-accent drop-shadow-[0_0_15px_rgba(255,195,0,0.4)]">
              Business
            </span>
            {/* Bintang Sparkle */}
            <svg
              className="absolute -top-5 -right-8 w-6 h-6 text-accent/60 hidden sm:block animate-[spin_10s_linear_infinite]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </h2>

          <div className="flex p-1.5 bg-white/5 border border-white/10 rounded-full shadow-lg backdrop-blur-md">
            <button
              onClick={() => setActiveCategory("merchandise")}
              className={`px-6 sm:px-10 py-3 rounded-full text-sm sm:text-base font-bold transition-all duration-300 ${
                activeCategory === "merchandise"
                  ? "bg-accent text-slate-900 shadow-[0_0_15px_rgba(255,195,0,0.4)]"
                  : "bg-transparent text-white/70 hover:text-accent hover:bg-white/10"
              }`}
            >
              Merchandise
            </button>
            <button
              onClick={() => setActiveCategory("jasa")}
              className={`px-6 sm:px-10 py-3 rounded-full text-sm sm:text-base font-bold transition-all duration-300 ${
                activeCategory === "jasa"
                  ? "bg-accent text-slate-900 shadow-[0_0_15px_rgba(255,195,0,0.4)]"
                  : "bg-transparent text-white/70 hover:text-accent hover:bg-white/10"
              }`}
            >
              Layanan Jasa
            </button>
          </div>
        </div>

        {/* ========================================= */}
        {/* TAMPILAN MERCHANDISE */}
        {/* ========================================= */}
        {activeCategory === "merchandise" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {merchandiseData.map((item) => (
              <article
                key={item.id}
                className="bg-white/5 backdrop-blur-md rounded-[1.5rem] overflow-hidden border border-white/10 hover:border-accent/50 shadow-sm hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:-translate-y-2 transition-all duration-300 group flex flex-col relative"
              >
                {/* Efek Garis Hover Atas */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-accent opacity-0 group-hover:opacity-100 transition-opacity z-20" />

                {/* Gambar */}
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-[#043761]/20 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none"></div>
                  {/* Badge */}
                  <div className="absolute top-4 left-4 bg-accent/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-slate-900 uppercase tracking-widest shadow-sm z-20">
                    Merch
                  </div>
                </div>

                {/* Konten */}
                <div className="p-6 flex flex-col flex-grow relative z-10">
                  <h3 className="text-lg font-bold text-white leading-snug mb-2 group-hover:text-accent transition-colors line-clamp-2">
                    {item.name}
                  </h3>

                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/10">
                    <span className="text-lg font-black text-accent drop-shadow-md">
                      {item.price}
                    </span>
                    <button
                      onClick={() => handleOrder(item.name)}
                      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center group-hover:bg-accent group-hover:text-slate-900 group-hover:border-accent group-hover:shadow-[0_0_15px_rgba(255,195,0,0.5)] transition-all duration-300"
                      aria-label={`Pesan ${item.name}`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* ========================================= */}
        {/* TAMPILAN JASA */}
        {/* ========================================= */}
        {activeCategory === "jasa" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            {jasaData.map((item) => (
              <article
                key={item.id}
                className="bg-white/5 backdrop-blur-md rounded-[1.5rem] overflow-hidden border border-white/10 hover:border-accent/50 shadow-sm hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:-translate-y-2 transition-all duration-300 group flex flex-col relative"
              >
                {/* Efek Garis Hover Atas */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-accent opacity-0 group-hover:opacity-100 transition-opacity z-20" />

                {/* Gambar */}
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-[#043761]/20 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none"></div>
                  {/* Badge */}
                  <div className="absolute top-4 left-4 bg-accent/90 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md z-20">
                    Layanan Jasa
                  </div>
                </div>

                {/* Konten */}
                <div className="p-6 flex flex-col flex-grow relative z-10">
                  <h3 className="text-xl font-bold text-white leading-snug mb-6 group-hover:text-accent transition-colors flex-grow">
                    {item.name}
                  </h3>

                  {/* Tombol Order Jasa (Lebar penuh tanpa harga) */}
                  <button
                    onClick={() => handleOrder(item.name)}
                    className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center gap-2 group-hover:bg-accent group-hover:text-slate-900 group-hover:border-accent group-hover:shadow-[0_0_15px_rgba(255,195,0,0.5)] transition-all duration-300 backdrop-blur-sm"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                    </svg>
                    Konsultasi & Order
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Tambahan Animasi Fade-in di CSS (Opsional) */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.4s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
