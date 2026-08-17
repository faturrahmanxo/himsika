import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// framer motion
import { motion } from "motion/react";

// lucide React
import { ArrowRight } from "lucide-react";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const fadeUpContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

// Import Gambar Hero Section
import Image1 from "../assets/images/1.webp";
import Image2 from "../assets/images/2.webp";
import Image3 from "../assets/images/3.webp";

// Import Data
import artikelData from "../data/artikel";
import allEvents from "../data/allEvents";
import divisi from "../data/divisi";
import kalenderTahunan from "../data/kalenderTahunan";

// Komponen Counter Statistik (Fix: Mengikuti aturan "Hanya saat scroll ke bawah")
const AnimatedCounter = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startTime = null;
          const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easeOutProgress = progress * (2 - progress);
            setCount(Math.floor(easeOutProgress * end));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
        } else {
          setCount(0);
        }
      },
      // Menggunakan trik rootMargin agar tidak reset saat scroll ke atas
      { threshold: 0, rootMargin: "10000px 0px -50px 0px" },
    );
    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={nodeRef}>{count}</span>;
};

export default function Beranda() {
  const artikelBerita = artikelData.slice(0, 3);
  const featuredBerita = artikelBerita[0];
  const listBerita = artikelBerita.slice(1);

  const heroSlides = [
    { id: 1, image: Image1, alt: "Kegiatan HIMSIKA 1" },
    { id: 2, image: Image2, alt: "Kegiatan HIMSIKA 2" },
    { id: 3, image: Image3, alt: "Kegiatan HIMSIKA 3" },
  ];

  const upcomingEvents = allEvents.slice(0, 4);
  const kegiatanLainnya = allEvents;

  const [showAll, setShowAll] = useState(false);
  const displayedPrograms = showAll
    ? kegiatanLainnya
    : kegiatanLainnya.slice(0, 6);

  // TRIK UTAMA: Top margin diubah jadi 10000px agar tidak beranimasi saat scroll ke atas
  const scrollSettings = { once: false, margin: "10000px 0px -50px 0px" };

  return (
    <div className="min-h-screen font-primary selection:bg-primary overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[100dvh] flex items-center overflow-hidden py-24 sm:py-0">
        <div className="absolute lg:fixed top-0 left-0 w-full h-screen z-0 lg:-z-10 pointer-events-none">
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect={"fade"}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            loop={true}
            allowTouchMove={false}
            className="h-full w-full absolute inset-0 z-0"
          >
            {heroSlides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="w-full h-full object-cover transform scale-105 sm:animate-[kenburns_20s_ease-in-out_infinite_alternate]"
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-[#022038]/80 to-primary/40 z-10"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start text-left mt-10 sm:mt-22 pb-8">
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="hidden sm:block absolute top-12 right-16">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 200 200"
                width="60"
                height="60"
                className="coolshapes wheel-4 animate-[spin_15s_linear_infinite]"
              >
                <g clipPath="url(#cs_clip_1_wheel-4)">
                  <mask
                    id="cs_mask_1_wheel-4"
                    style={{ maskType: "alpha" }}
                    width="200"
                    height="200"
                    x="0"
                    y="0"
                    maskUnits="userSpaceOnUse"
                  >
                    <path
                      fill="#FFC300"
                      fillRule="evenodd"
                      d="M120 0H80v51.716L43.431 15.147 15.148 43.431 51.716 80H0v40h51.716l-36.569 36.568 28.285 28.285L80 148.284V200h40v-51.716l36.569 36.569 28.284-28.284L148.284 120H200V80h-51.716l36.569-36.569-28.284-28.284L120 51.716V0z"
                      clipRule="evenodd"
                    ></path>
                  </mask>
                  <g mask="url(#cs_mask_1_wheel-4)">
                    <path fill="#fff" d="M200 0H0v200h200V0z"></path>
                    <path
                      fill="#FFC300"
                      fillOpacity="0.5"
                      d="M200 0H0v200h200V0z"
                    ></path>
                    <g filter="url(#filter0_f_748_wheel-4)">
                      <path
                        fill="#FFC300"
                        d="M125.125 32.625H14.375v133.25h110.75V32.625z"
                      ></path>
                      <path
                        fill="#FFC300"
                        d="M182.75 18.25H54.25v140h128.5v-140z"
                      ></path>
                    </g>
                  </g>
                </g>
                <defs>
                  <filter
                    id="filter0_f_748_wheel-4"
                    width="293.375"
                    height="272.625"
                    x="-48.125"
                    y="-44.25"
                    colorInterpolationFilters="sRGB"
                    filterUnits="userSpaceOnUse"
                  >
                    <feFlood
                      floodOpacity="0"
                      result="BackgroundImageFix"
                    ></feFlood>
                    <feBlend
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    ></feBlend>
                    <feGaussianBlur
                      result="effect1_foregroundBlur_748_wheel-4"
                      stdDeviation="31.25"
                    ></feGaussianBlur>
                  </filter>
                  <clipPath id="cs_clip_1_wheel-4">
                    <path fill="#fff" d="M0 0H200V200H0z"></path>
                  </clipPath>
                </defs>
              </svg>
            </div>

            <div className="hidden md:block absolute bottom-14 right-[15%] lg:right-[25%] opacity-70">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 200 200"
                width="50"
                height="50"
                className="coolshapes wheel-4 animate-[spin_15s_linear_infinite]"
              >
                <g clipPath="url(#cs_clip_1_wheel-4_2)">
                  <mask
                    id="cs_mask_1_wheel-4_2"
                    style={{ maskType: "alpha" }}
                    width="200"
                    height="200"
                    x="0"
                    y="0"
                    maskUnits="userSpaceOnUse"
                  >
                    <path
                      fill="#FFC300"
                      fillRule="evenodd"
                      d="M120 0H80v51.716L43.431 15.147 15.148 43.431 51.716 80H0v40h51.716l-36.569 36.568 28.285 28.285L80 148.284V200h40v-51.716l36.569 36.569 28.284-28.284L148.284 120H200V80h-51.716l36.569-36.569-28.284-28.284L120 51.716V0z"
                      clipRule="evenodd"
                    ></path>
                  </mask>
                  <g mask="url(#cs_mask_1_wheel-4_2)">
                    <path fill="#fff" d="M200 0H0v200h200V0z"></path>
                    <path
                      fill="#FFC300"
                      fillOpacity="0.5"
                      d="M200 0H0v200h200V0z"
                    ></path>
                    <g filter="url(#filter0_f_748_wheel-4_2)">
                      <path
                        fill="#FFC300"
                        d="M125.125 32.625H14.375v133.25h110.75V32.625z"
                      ></path>
                      <path
                        fill="#FFC300"
                        d="M182.75 18.25H54.25v140h128.5v-140z"
                      ></path>
                    </g>
                  </g>
                </g>
                <defs>
                  <filter
                    id="filter0_f_748_wheel-4_2"
                    width="293.375"
                    height="272.625"
                    x="-48.125"
                    y="-44.25"
                    colorInterpolationFilters="sRGB"
                    filterUnits="userSpaceOnUse"
                  >
                    <feFlood
                      floodOpacity="0"
                      result="BackgroundImageFix"
                    ></feFlood>
                    <feBlend
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    ></feBlend>
                    <feGaussianBlur
                      result="effect1_foregroundBlur_748_wheel-4_2"
                      stdDeviation="31.25"
                    ></feGaussianBlur>
                  </filter>
                  <clipPath id="cs_clip_1_wheel-4_2">
                    <path fill="#fff" d="M0 0H200V200H0z"></path>
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={scrollSettings}
            className="w-full"
          >
            <motion.div variants={item} className="mb-6 relative z-10">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-primary/50 border border-white/20 backdrop-blur-md shadow-[0_0_20px_rgba(255,195,0,0.15)]">
                <div className="relative flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping absolute"></span>
                  <span className="w-2 h-2 rounded-full bg-accent relative"></span>
                </div>
                <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-accent uppercase">
                  Welcome To HIMSIKA
                </span>
              </div>
            </motion.div>

            <div className="flex flex-col items-start relative z-10">
              <motion.h1
                variants={item}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight"
              >
                Himpunan Mahasiswa
              </motion.h1>
              <motion.h1
                variants={item}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-accent leading-tight pb-2 drop-shadow-lg"
              >
                Sistem Informasi
              </motion.h1>
              <motion.p
                variants={item}
                className="mt-4 sm:mt-6 text-base sm:text-lg text-white/90 font-medium tracking-wide max-w-xl leading-relaxed drop-shadow-md"
              >
                Kembangkan potensi, ciptakan prestasi. Wadah sinergi dan inovasi
                untuk menciptakan karya nyata yang berdampak pada teknologi.
              </motion.p>
            </div>

            <motion.div
              variants={item}
              className="mt-10 sm:mt-12 flex flex-wrap gap-6 relative z-10"
            >
              <Link
                to="/struktur-organisasi"
                className="group inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-accent text-primary font-bold text-sm sm:text-base rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,195,0,0.5)] shadow-xl"
              >
                Kenalan Yuk
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </Link>
              <Link
                to="/sejarah-himsika"
                className="group inline-flex items-center justify-center px-8 py-3.5 bg-primary/20 hover:bg-primary/90 backdrop-blur-md border border-info text-text font-bold text-sm sm:text-base rounded-full transition-all duration-300"
              >
                Learn More
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. KABINET & STRUKTUR */}
      <section className="relative z-20 bg-linear-to-br from-[#043761] via-primary to-[#043761]">
        <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 pointer-events-none z-0">
              <div
                className="absolute w-[30rem] h-[30rem] rounded-full blur-[120px] bg-accent/20 -top-20 -left-20 animate-pulse"
                style={{ animationDuration: "6s" }}
              />
              <div
                className="absolute w-[25rem] h-[25rem] rounded-full blur-[120px] bg-info/20 top-40 -right-10 animate-pulse"
                style={{ animationDuration: "8s", animationDelay: "2s" }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
            </div>

            <motion.div
              variants={fadeUpContainer}
              initial="hidden"
              whileInView="show"
              viewport={scrollSettings}
              className="mb-16 flex flex-col items-center text-center relative z-10"
            >
              <motion.div
                variants={fadeUpItem}
                className="flex items-center gap-4 mb-4"
              >
                <span className="w-8 sm:w-12 h-0.5 bg-accent rounded-full"></span>
                <span className="text-accent font-bold text-sm uppercase tracking-widest">
                  About Us
                </span>
                <span className="w-8 sm:w-12 h-0.5 bg-accent rounded-full"></span>
              </motion.div>
              <motion.h2
                variants={fadeUpItem}
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6 relative"
              >
                Tentang{" "}
                <span className="text-accent drop-shadow-[0_0_20px_rgba(255,195,0,0.4)]">
                  HIMSIKA
                </span>
              </motion.h2>
              <motion.p
                variants={fadeUpItem}
                className="text-base sm:text-lg max-w-2xl leading-relaxed text-foreground/90 drop-shadow-md"
              >
                Himpunan Mahasiswa Informatika adalah sebuah Organisasi
                Kemahasiswaan khusus Jurusan Teknik Informatika yang bergerak
                dalam bidang Akademik maupun Non-Akademik di Universitas
                Sriwijaya.
              </motion.p>
            </motion.div>

            <motion.div
              variants={fadeUpContainer}
              initial="hidden"
              whileInView="show"
              viewport={scrollSettings}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
            >
              {divisi.map((divisi) => (
                <motion.div
                  variants={fadeUpItem}
                  key={divisi.id}
                  className="h-full"
                >
                  <div className="group relative h-full bg-card shadow-lg rounded-3xl border border-accent/20 hover:border-accent hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-accent opacity-70 group-hover:opacity-100 transition-opacity" />
                    <div className="p-6 sm:p-8 flex flex-col flex-grow">
                      <div className="w-14 h-14 bg-foreground/10 rounded-2xl flex items-center justify-center shadow-inner shrink-0 mb-6 group-hover:scale-110 transition-all duration-300">
                        <img
                          src={divisi.image}
                          alt={divisi.name}
                          className="w-8 h-8 object-contain drop-shadow-sm"
                        />
                      </div>
                      <h3 className="text-xl font-bold text-text mb-3">
                        {divisi.name}
                      </h3>
                      <p className="text-sm line-clamp-3 mb-8 text-text/80 leading-relaxed">
                        {divisi.desc}
                      </p>
                      <div className="mt-auto pt-5 border-t border-accent/10">
                        <span className="text-accent text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em]">
                          {divisi.dept}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              variants={fadeUpContainer}
              initial="hidden"
              whileInView="show"
              viewport={scrollSettings}
              className="bg-accent backdrop-blur-sm mx-auto max-w-5xl rounded-3xl p-8 sm:p-10 border border-card/20 mt-16 shadow-xl relative overflow-hidden z-10"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-card blur-[20px] opacity-50"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-card/20">
                {[
                  { num: 38, suffix: "", label: "Pengurus Aktif" },
                  { num: 4, suffix: "", label: "Divisi Utama" },
                  { num: 8, suffix: "", label: "Departemen" },
                  { num: 14, suffix: "", label: "Program Kerja" },
                ].map((stat, i) => (
                  <motion.div
                    variants={fadeUpItem}
                    key={i}
                    className="text-center group flex flex-col items-center justify-center"
                  >
                    <h3 className="text-3xl sm:text-4xl font-black text-card mb-2 transition-colors duration-300">
                      <AnimatedCounter end={stat.num} />
                      <span className="text-card">{stat.suffix}</span>
                    </h3>
                    <p className="text-[10px] sm:text-xs font-bold text-muted/60 uppercase tracking-[0.15em]">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. VIDEO COMPANY PROFILE */}
      <section className="relative overflow-hidden py-24 bg-[#043761]">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          <div className="absolute w-[20rem] h-80 rounded-full blur-[100px] bg-accent/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
          <motion.div
            variants={fadeUpContainer}
            initial="hidden"
            whileInView="show"
            viewport={scrollSettings}
          >
            <div className="mb-16 flex flex-col items-center text-center">
              <motion.div
                variants={fadeUpItem}
                className="flex items-center gap-4 mb-4"
              >
                <span className="w-8 sm:w-12 h-0.5 bg-accent rounded-full"></span>
                <span className="text-accent font-bold text-sm uppercase tracking-widest">
                  Our Profile
                </span>
                <span className="w-8 sm:w-12 h-0.5 bg-accent rounded-full"></span>
              </motion.div>
              <motion.h2
                variants={fadeUpItem}
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6 relative"
              >
                Company{" "}
                <span className="text-accent drop-shadow-[0_0_15px_rgba(255,195,0,0.3)]">
                  HIMSIKA
                </span>
              </motion.h2>
              <motion.p
                variants={fadeUpItem}
                className="text-base sm:text-lg max-w-2xl leading-relaxed text-white/80"
              >
                Saksikan jejak langkah, pencapaian, dan gambaran utuh keluarga
                besar Himpunan Mahasiswa Sistem Informasi.
              </motion.p>
            </div>

            <motion.div
              variants={fadeUpItem}
              className="relative w-full max-w-5xl mx-auto aspect-video bg-white/5 rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.3)] border border-white/10 group cursor-pointer backdrop-blur-sm p-1.5 sm:p-4"
            >
              <a
                href="https://youtu.be/Y7U_J358rDA?si=XggiJgyLPMte8zzx"
                target="_blank"
                rel="noopener noreferrer"
                className="relative block w-full h-full rounded-[1rem] sm:rounded-[2rem] overflow-hidden z-20"
              >
                <img
                  src={Image3}
                  alt="Thumbnail CP"
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-[#043761]/40 group-hover:bg-[#043761]/20 transition-all duration-300"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 bg-accent/40 rounded-full animate-ping"></div>
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 bg-accent/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,195,0,0.4)] group-hover:scale-110 group-hover:bg-accent transition-all duration-300">
                      <svg
                        className="w-5 h-5 sm:w-7 sm:h-7 md:w-10 md:h-10 text-slate-900 translate-x-[2px]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <span className="mt-3 sm:mt-4 md:mt-6 text-white font-bold tracking-widest uppercase text-[10px] sm:text-xs md:text-sm drop-shadow-md">
                    Putar Video
                  </span>
                </div>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 4. UPCOMING EVENTS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-full mx-auto bg-linear-to-b from-[#043761] to-primary relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          <div className="absolute w-100 h-100 rounded-full blur-[120px] bg-accent/20 top-20 -left-30 animate-pulse"></div>
          <div className="absolute w-100 h-100 rounded-full blur-[120px] bg-accent/20 bottom-20 -right-30 animate-pulse"></div>
        </div>

        <motion.div
          variants={fadeUpContainer}
          initial="hidden"
          whileInView="show"
          viewport={scrollSettings}
          className="max-w-7xl mx-auto relative z-10"
        >
          <div className="mb-16 flex flex-col items-center text-center">
            <motion.div
              variants={fadeUpItem}
              className="flex items-center gap-4 mb-4"
            >
              <span className="w-8 sm:w-12 h-0.5 bg-accent rounded-full"></span>
              <span className="text-accent font-bold text-sm uppercase tracking-widest">
                What's Next
              </span>
              <span className="w-8 sm:w-12 h-0.5 bg-accent rounded-full"></span>
            </motion.div>
            <motion.h2
              variants={fadeUpItem}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6 relative"
            >
              Agenda <span className="text-accent">Mendatang</span>
            </motion.h2>
            <motion.p
              variants={fadeUpItem}
              className="text-base sm:text-lg max-w-2xl leading-relaxed text-white/80"
            >
              Persiapkan dirimu untuk agenda besar HIMSIKA.
            </motion.p>
          </div>

          <motion.div variants={fadeUpItem} className="relative">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              autoplay={{ delay: 4000, disableOnInteraction: true }}
              pagination={{ clickable: true, dynamicBullets: true }}
              breakpoints={{ 1024: { slidesPerView: 2 } }}
              className="pb-16 pt-4 px-2"
            >
              {upcomingEvents.map((event) => (
                <SwiperSlide key={event.id} className="h-auto">
                  <Link
                    to={event.link}
                    className="flex flex-col sm:flex-row items-center sm:items-start h-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-[2rem] p-8 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(255,195,0,0.15)] hover:border-accent/50 transition-all duration-300 group"
                  >
                    <div className="w-20 h-20 shrink-0 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center p-3 mb-6 sm:mb-0 sm:mr-6 group-hover:scale-105 transition-transform shadow-inner overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-center sm:text-left w-full flex flex-col justify-center">
                      <div className="mb-3">
                        <span className="inline-block px-4 py-1.5 bg-accent/20 border border-accent/30 text-accent text-[10px] font-bold rounded-full uppercase tracking-widest backdrop-blur-sm">
                          {event.date}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed line-clamp-4">
                        {event.desc}
                      </p>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </motion.div>
      </section>

      {/* 7. KEGIATAN LAINNYA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-full mx-auto bg-primary relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          <div
            className="absolute w-[35rem] h-[35rem] rounded-full blur-[140px] bg-info/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            variants={fadeUpContainer}
            initial="hidden"
            whileInView="show"
            viewport={scrollSettings}
            className="mb-16 flex flex-col items-center text-center"
          >
            <motion.div
              variants={fadeUpItem}
              className="flex items-center gap-4 mb-4"
            >
              <span className="w-8 sm:w-12 h-[2px] bg-accent rounded-full"></span>
              <span className="text-accent font-bold text-sm uppercase tracking-widest">
                Explore
              </span>
              <span className="w-8 sm:w-12 h-[2px] bg-accent rounded-full"></span>
            </motion.div>
            <motion.h2
              variants={fadeUpItem}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6 relative"
            >
              Program <span className="text-accent">Lainnya</span>
            </motion.h2>
            <motion.p
              variants={fadeUpItem}
              className="text-base sm:text-lg max-w-2xl leading-relaxed text-white/80"
            >
              Beragam inisiatif dan kegiatan seru untuk mengembangkan potensi
              mahasiswa secara maksimal.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedPrograms.map((prog, index) => (
              <motion.div
                key={prog.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={scrollSettings}
                transition={{ duration: 0.5, delay: (index % 6) * 0.1 }}
                className="h-full"
              >
                <Link
                  to={prog.link}
                  className="block h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(255,195,0,0.15)] hover:border-accent/50 transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-16 h-16 shrink-0 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center p-3 mb-6 group-hover:scale-105 transition-transform shadow-inner overflow-hidden">
                    <img
                      src={prog.image}
                      alt={prog.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors">
                    {prog.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed line-clamp-3">
                    {prog.desc}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>

          {kegiatanLainnya.length > 6 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={scrollSettings}
              className="mt-14 flex justify-center"
            >
              <button
                onClick={() => setShowAll(!showAll)}
                className="group inline-flex items-center justify-center gap-3 px-6 py-2.5 bg-primary hover:bg-accent/20 border border-accent/50 text-accent font-bold text-sm sm:text-base rounded-full transition-all duration-300 hover:scale-105 shadow-lg cursor-pointer"
              >
                {showAll ? "Tampilkan Lebih Sedikit" : "Muat Lebih Banyak"}
                <div className="bg-accent/20 rounded-full w-6 h-6 flex items-center justify-center">
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${showAll ? "rotate-180" : "group-hover:rotate-180"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* 8. ARTIKEL & BERITA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-primary to-[#043761] border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          <div
            className="absolute w-[35rem] h-[35rem] rounded-full blur-[140px] bg-info/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <motion.div
          variants={fadeUpContainer}
          initial="hidden"
          whileInView="show"
          viewport={scrollSettings}
          className="max-w-7xl mx-auto relative z-10"
        >
          <div className="mb-16 flex flex-col items-center text-center">
            <motion.div
              variants={fadeUpItem}
              className="flex items-center gap-4 mb-4"
            >
              <span className="w-8 sm:w-12 h-0.5 bg-accent rounded-full"></span>
              <span className="text-accent font-bold text-sm uppercase tracking-widest">
                Update
              </span>
              <span className="w-8 sm:w-12 h-0.5 bg-accent rounded-full"></span>
            </motion.div>
            <motion.h2
              variants={fadeUpItem}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6 relative"
            >
              Kabar <span className="text-accent">HIMSIKA</span>
            </motion.h2>
            <motion.p
              variants={fadeUpItem}
              className="text-base sm:text-lg max-w-2xl leading-relaxed text-white/80"
            >
              Beragam inisiatif dan kegiatan seru untuk mengembangkan potensi
              mahasiswa secara maksimal.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {featuredBerita && (
              <motion.div variants={fadeUpItem} className="lg:col-span-7">
                <Link
                  to={`/artikel/${featuredBerita.id}`}
                  className="group flex flex-col bg-white/5 p-4 rounded-[2.5rem] border border-white/10 hover:border-accent/30 transition-all h-full"
                >
                  <div className="aspect-[16/10] w-full rounded-[2rem] overflow-hidden relative mb-6">
                    <img
                      src={featuredBerita.image}
                      alt={featuredBerita.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-accent/90 text-slate-900 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {featuredBerita.category}
                    </div>
                  </div>
                  <div className="px-2 pb-2">
                    <span className="text-accent text-xs font-bold mb-3 block">
                      {featuredBerita.date}
                    </span>
                    <h3 className="text-2xl font-extrabold text-white leading-tight line-clamp-3 mb-3 group-hover:text-accent transition-colors">
                      {featuredBerita.title}
                    </h3>
                    <p className="text-white/70 line-clamp-2">
                      {featuredBerita.excerpt}
                    </p>
                  </div>
                </Link>
              </motion.div>
            )}

            <div className="lg:col-span-5 flex flex-col gap-6 sm:gap-8">
              {listBerita.map((berita) => (
                <motion.div variants={fadeUpItem} key={berita.id}>
                  <Link
                    to={`/artikel/${berita.id}`}
                    className="group flex gap-6 items-center bg-white/5 p-3 rounded-[2rem] border border-white/10 hover:border-accent/30 transition-all h-full"
                  >
                    <div className="w-28 sm:w-36 aspect-square shrink-0 rounded-[1.5rem] overflow-hidden relative">
                      <img
                        src={berita.image}
                        alt={berita.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col pr-2 sm:pr-4">
                      <span className="text-accent text-[10px] font-bold uppercase tracking-widest mb-2 truncate">
                        {berita.category}
                      </span>
                      <h3 className="text-lg font-bold text-white leading-snug group-hover:text-accent transition-colors mb-2 line-clamp-2">
                        {berita.title}
                      </h3>
                      <span className="text-white/50 text-xs font-medium">
                        {berita.date}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            variants={fadeUpItem}
            className="mt-16 flex justify-center"
          >
            <Link
              to="/artikel"
              className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white/5 border border-white/20 text-white font-bold text-sm sm:text-[12px] uppercase tracking-widest hover:bg-accent hover:text-slate-900 transition-all"
            >
              Lihat Semua Kabar
              <ArrowRight className="w-4 h-4 group-hover:-rotate-45 transition-all duration-300" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 9. KALENDER TAHUNAN */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-full mx-auto bg-[#043761] relative overflow-hidden pb-32">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
          <div
            className="absolute w-[20rem] h-[20rem] rounded-full blur-[100px] bg-info/15 bottom-0 left-1/2 -translate-x-1/2 animate-pulse"
            style={{ animationDuration: "8s" }}
          ></div>
        </div>

        <motion.div
          variants={fadeUpContainer}
          initial="hidden"
          whileInView="show"
          viewport={scrollSettings}
          className="max-w-3xl mx-auto relative z-10"
        >
          <div className="text-center mb-16 relative">
            <motion.h2
              variants={fadeUpItem}
              className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4 inline-block relative"
            >
              Timeline <span className="text-accent">Akademik</span>
            </motion.h2>
            <motion.p variants={fadeUpItem} className="text-white/80">
              Jadwal pelaksanaan program tahunan Himpunan Mahasiswa.
            </motion.p>
          </div>

          <div className="relative border-l-2 border-white/10 ml-4 sm:ml-0">
            {kalenderTahunan.map((item, index) => (
              <motion.div
                variants={fadeUpItem}
                key={index}
                className="mb-12 ml-8 sm:ml-12 relative group"
              >
                <span className="absolute -left-[39px] sm:-left-[55px] top-1.5 w-4 h-4 bg-[#043761] border-2 border-accent rounded-full group-hover:bg-accent group-hover:shadow-[0_0_15px_rgba(255,195,0,0.6)] group-hover:scale-125 transition-all duration-300"></span>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 group-hover:border-accent/50 group-hover:bg-white/10 transition-all duration-300 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-accent font-bold text-xs uppercase tracking-[0.15em] block mb-2">
                    {item.month}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-accent transition-colors">
                    {item.events}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
