import React, { useState, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Award,
  Users,
  BookMarked,
  MessageCircle,
  ArrowRight,
  Menu,
  X,
  FileText,
  Sparkles,
  Clock,
} from "lucide-react";

import LogoAAS from "../../assets/logo/proker/AAS.png";

const COMING_SOON_FEATURES = [
  {
    key: "prestasi",
    icon: Trophy,
    title: "Prestasi Mahasiswa",
    desc: "Database pendataan dan rekam jejak apresiasi penghargaan mahasiswa berprestasi Sistem Informasi.",
  },
  {
    key: "sharing",
    icon: Users,
    title: "Sharing Session",
    desc: "Kegiatan diskusi keilmuan, bedah materi perkuliahan, dan sesi mentoring bersama rekan sejawat.",
  },
  {
    key: "arsip",
    icon: BookMarked,
    title: "Arsip Materi",
    desc: "Kumpulan bank soal latihan ujian, rangkuman materi, dan modul perkuliahan terpusat.",
  },
];

const SITE_URL = "https://himsika.unsika.ac.id";

export default function AASPage() {
  const [activePage, setActivePage] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // SEO & Metadata yang dinamis antar-tab (Home / About)
  useLayoutEffect(() => {
    const isAbout = activePage === "about";
    const description = isAbout
      ? "Kenali Academic Achievement Support (AAS), program kerja Divisi Akademik HIMSIKA Universitas Singaperbangsa Karawang yang mendukung prestasi mahasiswa Sistem Informasi."
      : "Portal Academic Achievement Support (AAS) HIMSIKA: info lomba & beasiswa, prestasi mahasiswa, sharing session, dan arsip materi kuliah Sistem Informasi Unsika.";
    const path = isAbout ? "/aas/tentang" : "/aas";
    const canonicalUrl = `${SITE_URL}${path}`;

    const setMeta = (attr, key, content) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("name", "description", description);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:image", LogoAAS);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", LogoAAS);

    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [activePage]);

  // SEO: structured data (JSON-LD)
  useLayoutEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      name: "Academic Achievement Support (AAS) HIMSIKA",
      alternateName: "AAS HIMSIKA",
      url: `${SITE_URL}/aas`,
      logo: LogoAAS,
      description:
        "Divisi Akademik HIMSIKA, Universitas Singaperbangsa Karawang — mendukung prestasi, lomba, beasiswa, dan arsip materi mahasiswa Sistem Informasi.",
      parentOrganization: {
        "@type": "CollegeOrUniversity",
        name: "Universitas Singaperbangsa Karawang",
      },
    });
    document.head.appendChild(script);
    return () => document.head.removeChild(script);
  }, []);

  useLayoutEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#043761] via-primary to-[#043761] font-primary relative overflow-hidden flex flex-col text-white selection:bg-accent selection:text-slate-950">
      {/* BACKGROUND DEKORASI */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="absolute w-[20rem] sm:w-[30rem] h-[20rem] sm:h-[30rem] rounded-full blur-[100px] sm:blur-[120px] bg-accent/15 top-0 right-0 -translate-y-1/2 animate-pulse"></div>
        <div
          className="absolute w-[18rem] sm:w-[25rem] h-[18rem] sm:h-[25rem] rounded-full blur-[100px] sm:blur-[120px] bg-info/15 bottom-0 left-0 -translate-x-1/2 translate-y-1/3 animate-pulse"
          style={{ animationDuration: "7s" }}
        ></div>

        <div className="absolute top-24 left-6 hidden sm:block animate-[spin_8s_linear_infinite] text-accent/40">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C12 6.62742 6.62742 12 0 12C6.62742 12 12 17.3726 12 24C12 17.3726 17.3726 12 24 12C17.3726 12 12 6.62742 12 0Z" />
          </svg>
        </div>
        <Trophy
          className="absolute top-[42%] right-[6%] w-10 h-10 text-white/[0.04] hidden sm:block"
          style={{ animation: "spin 26s linear infinite" }}
        />
        <BookMarked className="absolute bottom-[18%] left-[8%] w-8 h-8 text-white/[0.04] rotate-12 hidden sm:block" />
      </div>

      {/* NAVBAR AAS */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          isScrolled
            ? "bg-[#043761]/90 backdrop-blur-xl border-white/10 py-3 shadow-2xl"
            : "bg-transparent border-transparent py-4 sm:py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <div
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
            onClick={() => setActivePage("home")}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full p-1 shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
              <img
                src={LogoAAS}
                alt="Logo Academic Achievement Support HIMSIKA"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <span className="block font-extrabold text-base sm:text-lg leading-tight tracking-wide text-white">
                AAS
              </span>
              <span className="block text-[9px] sm:text-[10px] text-accent uppercase tracking-widest font-bold">
                HIMSIKA
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8" role="tablist">
            <button
              role="tab"
              id="tab-home"
              aria-selected={activePage === "home"}
              onClick={() => setActivePage("home")}
              className={`text-sm font-bold transition-colors cursor-pointer pb-1 relative ${
                activePage === "home"
                  ? "text-accent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-accent"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Menu Utama
            </button>
            <button
              role="tab"
              id="tab-about"
              aria-selected={activePage === "about"}
              onClick={() => setActivePage("about")}
              className={`text-sm font-bold transition-colors cursor-pointer pb-1 relative ${
                activePage === "about"
                  ? "text-accent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-accent"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Tentang AAS
            </button>
          </nav>

          <button
            className="md:hidden text-white p-2 bg-white/10 rounded-xl border border-white/10 active:scale-95 transition-transform"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Buka atau tutup menu navigasi"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-accent" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute top-full left-4 right-4 mt-2 bg-[#043761]/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-3 shadow-2xl flex flex-col gap-2 z-50"
            >
              <button
                onClick={() => {
                  setActivePage("home");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left font-bold py-3 px-4 rounded-xl transition-all text-sm flex items-center justify-between ${
                  activePage === "home"
                    ? "bg-accent text-slate-950 shadow-md font-extrabold"
                    : "text-white/80 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>Menu Utama</span>
                {activePage === "home" && <Sparkles className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  setActivePage("about");
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left font-bold py-3 px-4 rounded-xl transition-all text-sm flex items-center justify-between ${
                  activePage === "about"
                    ? "bg-accent text-slate-950 shadow-md font-extrabold"
                    : "text-white/80 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>Tentang AAS</span>
                {activePage === "about" && <Sparkles className="w-4 h-4" />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* KONTEN UTAMA */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 sm:pb-20 relative z-10 flex flex-col">
        <AnimatePresence mode="wait">
          {activePage === "home" && (
            <motion.div
              key="home"
              id="panel-home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full flex flex-col"
            >
              <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 mt-2 sm:mt-4">
                <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-black text-slate-950 tracking-widest uppercase bg-accent px-4 py-1.5 rounded-full mb-4 sm:mb-6 shadow-[0_0_20px_rgba(255,195,0,0.3)]">
                  <Sparkles className="w-3.5 h-3.5" /> Program Kerja HIMSIKA
                </span>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6 leading-tight text-white">
                  Academic Achievement <br className="hidden sm:block" />
                  <span className="text-accent drop-shadow-[0_0_15px_rgba(255,195,0,0.3)]">
                    Support
                  </span>
                </h1>
                <p className="text-white/80 text-sm sm:text-lg font-normal leading-relaxed max-w-2xl mx-auto px-2">
                  Portal informasi dan layanan akademik terpadu khusus mahasiswa
                  Sistem Informasi Universitas Singaperbangsa Karawang.
                </p>
              </div>

              <h2 className="text-center text-xs font-bold uppercase tracking-widest text-accent/80 mb-5 sm:mb-6">
                Jelajahi Layanan AAS
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto w-full mb-8 sm:mb-12">
                <Link
                  to="/aas/lomba-beasiswa"
                  className="bg-white/5 backdrop-blur-md rounded-[1.75rem] sm:rounded-[2rem] overflow-hidden border border-white/10 hover:border-accent/50 shadow-md hover:shadow-[0_0_30px_rgba(255,195,0,0.15)] transition-all duration-300 group flex flex-col relative p-6 sm:p-8"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-accent opacity-0 group-hover:opacity-100 transition-opacity z-20" />
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:bg-accent group-hover:text-slate-950 transition-all duration-300">
                    <Award className="w-6 h-6 sm:w-7 sm:h-7 text-accent group-hover:text-slate-950" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors">
                    Lomba & Beasiswa
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 mb-6 leading-relaxed flex-grow">
                    Informasi terbaru seputar perlombaan akademik bergengsi
                    serta panduan pendaftaran beasiswa.
                  </p>
                  <div className="flex items-center text-xs font-extrabold text-accent tracking-widest uppercase pt-4 border-t border-white/10">
                    <span>Eksplorasi</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </Link>

                {COMING_SOON_FEATURES.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.key}
                      className="bg-white/5 backdrop-blur-md rounded-[1.75rem] sm:rounded-[2rem] overflow-hidden border border-white/10 shadow-md transition-all duration-300 flex flex-col relative p-6 sm:p-8"
                    >
                      <span className="absolute top-4 right-4 sm:top-5 sm:right-5 flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white/50 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                        <Clock className="w-3 h-3" /> Segera
                      </span>
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                        <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-accent/70" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white/90 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-white/60 mb-6 leading-relaxed flex-grow">
                        {feature.desc}
                      </p>
                      <div className="flex items-center text-xs font-extrabold text-white/40 tracking-widest uppercase pt-4 border-t border-white/10">
                        <span>Segera Hadir</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activePage === "about" && (
            <motion.div
              key="about"
              id="panel-about"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full max-w-4xl mx-auto mt-2 sm:mt-4 flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full p-2 mb-6 sm:mb-8 shadow-xl relative">
                <div className="absolute inset-0 rounded-full border border-accent/40 scale-110 animate-pulse"></div>
                <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-[#02182b]">
                  <img
                    src={LogoAAS}
                    alt="Logo Academic Achievement Support HIMSIKA"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <span className="text-[11px] sm:text-xs font-bold text-slate-950 bg-accent px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 shadow-md">
                Tentang AAS HIMSIKA
              </span>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 sm:mb-6 leading-tight">
                Membangun Ekosistem Akademik <br className="hidden sm:block" />
                <span className="text-accent drop-shadow-[0_0_15px_rgba(255,195,0,0.3)]">
                  yang Prestatif
                </span>
              </h1>

              <div className="w-full relative mb-8 sm:mb-12 py-6 sm:py-8 px-4 sm:px-6 border-y border-white/10 bg-white/5 backdrop-blur-md rounded-2xl shadow-lg">
                <p className="text-lg sm:text-2xl font-bold italic text-accent tracking-wide">
                  "Beyond boundaries, unlimited possibilities."
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 text-left max-w-3xl w-full mb-8 sm:mb-12">
                <div className="bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-[1.75rem] sm:rounded-[2rem] border border-white/10 shadow-lg">
                  <h2 className="text-accent font-bold text-base sm:text-lg mb-3 flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-accent" /> Tujuan Utama
                  </h2>
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                    Academic Achievement Support (AAS) berperan sebagai wadah
                    pendukung bagi mahasiswa Sistem Informasi yang memiliki
                    potensi dan semangat tinggi dalam bidang akademis maupun
                    kompetisi.
                  </p>
                </div>
                <div className="bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-[1.75rem] sm:rounded-[2rem] border border-white/10 shadow-lg">
                  <h2 className="text-accent font-bold text-base sm:text-lg mb-3 flex items-center gap-2.5">
                    <Sparkles className="w-5 h-5 text-accent" /> Sistem
                    Pelaksanaan
                  </h2>
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                    AAS adalah program kerja kondisional yang selaras dengan
                    kalender akademik serta jadwal perlombaan nasional maupun
                    internasional secara fleksibel dan berbasis online.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER AAS */}
      <footer className="w-full bg-[#043761]/95 backdrop-blur-xl border-t border-white/10 py-10 sm:py-12 relative z-20 mt-auto shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 bg-white rounded-full p-0.5 flex-shrink-0">
                <img
                  src={LogoAAS}
                  alt="Logo Academic Achievement Support HIMSIKA"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                AAS HIMSIKA
              </h3>
            </div>
            <address className="text-white/60 text-xs max-w-xs leading-relaxed not-italic">
              Academic Achievement Support. <br />
              Divisi Akademik HIMSIKA <br />
              Universitas Singaperbangsa Karawang.
            </address>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3 sm:gap-4 w-full md:w-auto">
            <h3 className="text-xs font-bold text-white/50 tracking-widest uppercase">
              Hubungi Kami (WhatsApp)
            </h3>
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full sm:w-auto">
              <a
                href="https://wa.me/6285133052875"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-[#043761] px-4 py-2.5 rounded-full border border-[#25D366]/20 transition-all font-bold text-xs shadow-md"
              >
                <MessageCircle className="w-4 h-4" /> Auzilia Chantika
              </a>
              <a
                href="https://wa.me/6289668484467"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-[#043761] px-4 py-2.5 rounded-full border border-[#25D366]/20 transition-all font-bold text-xs shadow-md"
              >
                <MessageCircle className="w-4 h-4" /> Meyta Sabrina
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10 sm:mt-12 pt-6 border-t border-white/5 text-center flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} Academic Achievement Support. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
