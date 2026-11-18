import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import {
  Gamepad2,
  Calendar,
  Trophy,
  Swords,
  Target,
  Users,
  Medal,
  ExternalLink,
  CheckCircle2,
  Clock,
  Image as ImageIcon,
  Rocket,
  X,
  Briefcase,
  BookOpen,
  MessageSquare,
  Brain,
  Compass,
  HeartHandshake,
  Network,
  ZoomIn,
} from "lucide-react";

// --- SILAKAN IMPORT GAMBAR ASLI KAMU DI SINI ---
import EventGalleryModal from "../../components/EventGalleryModal.jsx";
import Velove from "../../assets/images/pengurus/divisiInternal/Velove.webp";

// Import Foto Galeri Kegiatan (Baris 1)
import FotoKegiatan1 from "../../assets/images/events/ISCT/galeri1.webp";
import FotoKegiatan2 from "../../assets/images/events/ISCT/galeri2.webp";
import FotoKegiatan3 from "../../assets/images/events/ISCT/galeri3.webp";
import FotoKegiatan4 from "../../assets/images/events/ISCT/galeri4.webp";
import FotoKegiatan5 from "../../assets/images/events/ISCT/galeri5.webp";

// Import Foto Galeri Kegiatan (Baris 2)
import FotoKegiatan6 from "../../assets/images/events/ISCT/galeri6.webp";
import FotoKegiatan7 from "../../assets/images/events/ISCT/galeri7.webp";
import FotoKegiatan8 from "../../assets/images/events/ISCT/galeri8.webp";
import FotoKegiatan9 from "../../assets/images/events/ISCT/galeri9.webp";
import FotoKegiatan10 from "../../assets/images/events/ISCT/galeri10.webp";

// Array Data Foto untuk Baris 1 & Baris 2
const galeriBaris1 = [
  FotoKegiatan1,
  FotoKegiatan2,
  FotoKegiatan3,
  FotoKegiatan4,
  FotoKegiatan5,
];

const galeriBaris2 = [
  FotoKegiatan6,
  FotoKegiatan7,
  FotoKegiatan8,
  FotoKegiatan9,
  FotoKegiatan10,
];

const allGallery = [...galeriBaris1, ...galeriBaris2];

// Data Timeline LKMM Pra-Dasar 2026 Sesuai Web HIMSIKA
const timelineData = [
  {
    date: "10 Agustus 2026",
    title: "Sosialisasi LKMMPD 2026",
    desc: "Sosialisasi dan pengenalan alur kegiatan pelatihan manajemen mahasiswa tingkat awal kepada mahasiswa baru.",
    status: "Done",
  },
  {
    date: "18 Agustus 2026",
    title: "Technical Meeting & Briefing Peserta",
    desc: "Pemberian instruksi perlengkapan, tata tertib, dan pemaparan kurikulum dasar kaderisasi.",
    status: "Done",
  },
  {
    date: "24 - 29 Agustus 2026",
    title: "Pelaksanaan LKMMPD 2026",
    desc: "Pelatihan manajemen diri, kepemimpinan organisasi, critical thinking, dan penyelesaian studi kasus kemahasiswaan.",
    status: "Active",
  },
  {
    date: "02 September 2026",
    title: "Evaluasi & Pengukuhan Kelulusan",
    desc: "Rapat evaluasi kelulusan peserta serta persiapan menuju tahapan kaderisasi LKMM selanjutnya.",
    status: "Upcoming",
  },
];

// Data Capaian Kegiatan LKMM Pra-Dasar 2026 Sesuai Web HIMSIKA
const achievementsData = [
  {
    id: 1,
    icon: Network,
    title: "Jiwa Kepemimpinan Terbentuk",
    desc: "Membekali mahasiswa baru dengan pemahaman kepemimpinan mandiri dan kesiapan memposisikan diri secara efektif dalam organisasi kemahasiswaan.",
    tag: "Leadership",
  },
  {
    id: 2,
    icon: BookOpen,
    title: "Keterampilan Manajemen Terencana",
    desc: "Peserta mampu menyelenggarakan dan merencanakan kegiatan kemahasiswaan dengan sistematika yang baik sesuai kurikulum minimal.",
    tag: "Manajemen",
  },
  {
    id: 3,
    icon: MessageSquare,
    title: "Kemampuan Komunikasi & Sifat Kritis",
    desc: "Mengembangkan sifat kritis, kemampuan berargumentasi secara konstruktif, dan komunikasi publik yang efektif.",
    tag: "Komunikasi",
  },
  {
    id: 4,
    icon: Brain,
    title: "Penguatan Karakter & Problem Solving",
    desc: "Membentuk kepribadian tanggap, solutif, serta berintegritas tinggi dalam menyelesaikan dinamika kelompok.",
    tag: "Karakter",
  },
  {
    id: 5,
    icon: Compass,
    title: "Pemahaman Alur Organisasi",
    desc: "Memberikan wawasan utuh mengenai peran fungsionaris, etika keorganisasian, serta visi misi kemahasiswaan Sistem Informasi.",
    tag: "Organisasi",
  },
  {
    id: 6,
    icon: HeartHandshake,
    title: "Solidaritas Mahasiswa Baru",
    desc: "Membangun rasa kebersamaan, saling tolong-menolong, dan ikatan persaudaraan yang kokoh di antara sesama mahasiswa baru.",
    tag: "Kekeluargaan",
  },
  {
    id: 7,
    icon: Rocket,
    title: "Kesiapan Kaderisasi Lanjutan",
    desc: "Menjadi prasyarat mutlak yang membekali peserta untuk melangkah mantap menuju jenjang LKMM Tingkat Dasar.",
    tag: "Masa Depan",
  },
];

export default function LKMMPDPage() {
  // State untuk menyimpan gambar yang diklik (Lightbox)
  const [selectedIndex, setSelectedIndex] = useState(null);

  return (
    <div className="min-h-screen bg-linear-to-b from-[#043761] via-primary to-[#043761] font-primary pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-accent selection:text-slate-900">
      {/* ================= BACKGROUND DEKORASI ================= */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="absolute w-[40rem] h-[40rem] rounded-full blur-[150px] bg-accent/15 top-0 left-0 -translate-x-1/4 -translate-y-1/4 animate-pulse"></div>
        <div
          className="absolute w-[30rem] h-[30rem] rounded-full blur-[120px] bg-blue-500/10 bottom-0 right-0 translate-x-1/3 translate-y-1/3 animate-pulse"
          style={{ animationDuration: "7s" }}
        ></div>

                {/* Ornamen SVG Tambahan Modern */}
        {/* 1. Sparkle Bintang 4 Sisi */}
        <div className="absolute top-24 left-10 sm:left-20 animate-[spin_8s_linear_infinite] text-accent/30 pointer-events-none">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C12 6.62742 6.62742 12 0 12C6.62742 12 12 17.3726 12 24C12 17.3726 17.3726 12 24 12C17.3726 12 12 6.62742 12 0Z" />
          </svg>
        </div>

        {/* 2. Dot Matrix Pattern */}
        <div className="absolute top-1/4 right-8 lg:right-24 opacity-25 pointer-events-none text-accent">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="currentColor">
            <circle cx="6" cy="6" r="1.5" /><circle cx="22" cy="6" r="1.5" /><circle cx="38" cy="6" r="1.5" /><circle cx="54" cy="6" r="1.5" />
            <circle cx="6" cy="22" r="1.5" /><circle cx="22" cy="22" r="1.5" /><circle cx="38" cy="22" r="1.5" /><circle cx="54" cy="22" r="1.5" />
            <circle cx="6" cy="38" r="1.5" /><circle cx="22" cy="38" r="1.5" /><circle cx="38" cy="38" r="1.5" /><circle cx="54" cy="38" r="1.5" />
            <circle cx="6" cy="54" r="1.5" /><circle cx="22" cy="54" r="1.5" /><circle cx="38" cy="54" r="1.5" /><circle cx="54" cy="54" r="1.5" />
          </svg>
        </div>

        {/* 3. Lingkaran Tech Ring */}
        <div
          className="absolute top-1/3 right-10 sm:right-24 animate-bounce text-white/10 pointer-events-none"
          style={{ animationDuration: "6s" }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="8" />
            <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.4" />
          </svg>
        </div>

        {/* 4. Circuit Line & Node */}
        <div className="absolute top-2/3 left-6 lg:left-16 opacity-20 pointer-events-none text-white">
          <svg width="90" height="90" viewBox="0 0 90 90" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 25 L45 25 L60 40 L80 40" strokeDasharray="3 3" />
            <circle cx="80" cy="40" r="3" fill="#ffc300" />
            <path d="M20 60 L40 60 L50 72 L70 72" />
            <circle cx="20" cy="60" r="2.5" fill="currentColor" />
          </svg>
        </div>

        {/* 5. Cyber Hexagon */}
        <div className="absolute bottom-1/3 right-8 lg:right-28 opacity-20 pointer-events-none text-accent animate-[spin_24s_linear_infinite]">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polygon points="12,2 22,8 22,16 12,22 2,16 2,8" />
          </svg>
        </div>

        {/* 6. Geometric Cross Plus */}
        <div className="absolute top-1/2 left-12 lg:left-28 opacity-25 pointer-events-none text-accent">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 4v16m-8-8h16" strokeLinecap="round" />
          </svg>
        </div>

        {/* 7. Zig-Zag Signal Wave */}
        <div
          className="absolute bottom-1/4 left-10 sm:left-24 animate-pulse text-blue-400/25 pointer-events-none"
          style={{ animationDuration: "4s" }}
        >
          <svg width="38" height="38" viewBox="0 0 44 22" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 11l7-9 11 18 13-16 9 11" />
          </svg>
        </div>

        {/* 8. Star Plus Sparkle */}
        <div className="absolute bottom-20 right-16 sm:right-24 animate-[spin_12s_linear_infinite_reverse] text-accent/35 pointer-events-none">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-24 relative z-10">
        {/* ================= HERO & ABOUT SECTION ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/20 text-accent text-xs font-bold uppercase tracking-widest backdrop-blur-sm shadow-[0_0_15px_rgba(255,195,0,0.15)]"
            >
              <Users className="w-4 h-4 text-accent" />
              Studi Banding & Relasi
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight"
            >
              Latihan Keterampilan Manajemen <br className="hidden lg:block" />
              <span className="text-accent drop-shadow-[0_0_20px_rgba(255,195,0,0.3)]">
                Mahasiswa Pra-Dasar 2026
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/70 text-md leading-relaxed max-w-3xl"
            >
              LKMM Pra-Dasar (Latihan Keterampilan Manajemen Mahasiswa
              Pra-Dasar) adalah kegiatan pelatihan manajemen mahasiswa tingkat
              awal, sebelum menuju ke tahap kaderisasi selanjutnya yaitu LKMM
              Dasar. Kegiatan ini bertujuan untuk melatih jiwa kepemimpinan
              mahasiswa baru, kemampuan berkomunikasi, mengembangkan sifat
              kritis, dan memposisikan diri secara efektif dalam organisasi
              kemahasiswaan.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              <a
                href="#timeline"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-slate-900 font-bold rounded-full hover:scale-105 hover:shadow-[0_0_30px_rgba(255,195,0,0.4)] transition-all duration-300"
              >
                Lihat Jadwal
                <Calendar className="w-5 h-5" />
              </a>
              <a
                href="#capaian"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                Output Kegiatan
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-4 flex justify-center"
          >
            <div className="w-full max-w-sm p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-lg shadow-2xl relative group hover:border-accent/30 transition-all duration-500 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl"></div>

              <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden mb-6 border border-white/10 relative">
                <img
                  src={Velove}
                  alt="Ketua Pelaksana LKMM Pra-Dasar 2026"
                  className="w-full h-full object-cover transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#043761] via-transparent to-transparent opacity-80"></div>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-extrabold text-white mb-1">
                  Velove Putri Adema
                </h3>
                <p className="text-sm text-white/50 font-medium">
                  Ketua Pelaksana LKMM Pra-Dasar 2026
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ================= GALERI KEGIATAN (MARQUEE STYLE) ================= */}
        <section className="space-y-12 pt-10">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4 mb-2">
              <span className="w-8 sm:w-12 h-[2px] bg-accent rounded-full"></span>
              <span className="text-accent font-bold text-sm uppercase tracking-widest">
                Galeri
              </span>
              <span className="w-8 sm:w-12 h-[2px] bg-accent rounded-full"></span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center justify-center gap-3">
              <ImageIcon className="w-8 h-8 text-accent" />
              Keseruan Kegiatan
            </h2>

            <p className="text-white/50 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mt-4">
              <span className="hidden md:inline">
                Hover untuk berhenti &middot;{" "}
              </span>
              Klik untuk perbesar
            </p>
          </div>

          <div className="marquee-wrapper relative flex flex-col gap-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
            {/* --- BARIS 1 (Scroll ke Kiri) --- */}
            <div className="marquee-row flex w-fit">
              <div className="marquee-content flex shrink-0 gap-6 pr-6 animate-marquee">
                {galeriBaris1.map((foto, idx) => (
                  <div
                    key={`row1-a-${idx}`}
                    onClick={() => setSelectedIndex(idx)}
                    className="w-[280px] sm:w-[350px] aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer shrink-0 relative group"
                  >
                    <img
                      src={foto}
                      alt={`Galeri Kegiatan 1 - Foto ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs border border-white/30 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <ZoomIn className="w-4 h-4 text-white" />
                        </div>
                      </div>
                  </div>
                ))}
              </div>
              <div
                className="marquee-content flex shrink-0 gap-6 pr-6 animate-marquee"
                aria-hidden="true"
              >
                {galeriBaris1.map((foto, idx) => (
                  <div
                    key={`row1-b-${idx}`}
                    onClick={() => setSelectedIndex(idx)}
                    className="w-[280px] sm:w-[350px] aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer shrink-0 relative group"
                  >
                    <img
                      src={foto}
                      alt={`Galeri Kegiatan 1 - Foto Duplikat ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs border border-white/30 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <ZoomIn className="w-4 h-4 text-white" />
                        </div>
                      </div>
                  </div>
                ))}
              </div>
            </div>

            {/* --- BARIS 2 (Scroll ke Kanan / Reverse) --- */}
            <div className="marquee-row flex w-fit">
              <div className="marquee-content flex shrink-0 gap-6 pr-6 animate-marquee-reverse">
                {galeriBaris2.map((foto, idx) => (
                  <div
                    key={`row2-a-${idx}`}
                    onClick={() => setSelectedIndex(galeriBaris1.length + idx)}
                    className="w-[280px] sm:w-[350px] aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer shrink-0 relative group"
                  >
                    <img
                      src={foto}
                      alt={`Galeri Kegiatan 2 - Foto ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs border border-white/30 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <ZoomIn className="w-4 h-4 text-white" />
                        </div>
                      </div>
                  </div>
                ))}
              </div>
              <div
                className="marquee-content flex shrink-0 gap-6 pr-6 animate-marquee-reverse"
                aria-hidden="true"
              >
                {galeriBaris2.map((foto, idx) => (
                  <div
                    key={`row2-b-${idx}`}
                    onClick={() => setSelectedIndex(galeriBaris1.length + idx)}
                    className="w-[280px] sm:w-[350px] aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer shrink-0 relative group"
                  >
                    <img
                      src={foto}
                      alt={`Galeri Kegiatan 2 - Foto Duplikat ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs border border-white/30 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <ZoomIn className="w-4 h-4 text-white" />
                        </div>
                      </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-100%); }
            }
            .animate-marquee {
              animation: marquee 35s linear infinite;
            }
            .animate-marquee-reverse {
              animation: marquee 40s linear infinite reverse;
            }
            
            @media (min-width: 768px) {
              .marquee-row:hover .marquee-content {
                animation-play-state: paused;
              }
            }
          `}</style>
        </section>

        {/* ================= CAPAIAN SECTION ================= */}
        <section id="capaian" className="space-y-16 pt-16">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4 mb-2">
              <span className="w-8 sm:w-12 h-[2px] bg-accent rounded-full"></span>
              <span className="text-accent font-bold text-sm uppercase tracking-widest">
                Highlights
              </span>
              <span className="w-8 sm:w-12 h-[2px] bg-accent rounded-full"></span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center justify-center gap-3">
              <Target className="w-8 h-8 text-accent" />
              Pencapaian Kegiatan LKMM Pra-Dasar 2026
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {achievementsData.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: (index % 3) * 0.1 }}
                  className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-accent/50 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_15px_30px_rgba(255,195,0,0.1)] group flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                  <div className="space-y-5 relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 group-hover:bg-accent group-hover:border-accent transition-all duration-300 shadow-inner">
                        <IconComponent className="w-7 h-7 text-white group-hover:text-slate-900 transition-colors" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 group-hover:border-accent/30 group-hover:text-accent transition-colors">
                        {item.tag}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors mb-3">
                        {item.title}
                      </h3>
                      <p className="text-sm text-white/70 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ================= TIMELINE SECTION ================= */}
        <section id="timeline" className="space-y-16 pt-16">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4 mb-2">
              <span className="w-8 sm:w-12 h-[2px] bg-accent rounded-full"></span>
              <span className="text-accent font-bold text-sm uppercase tracking-widest">
                Jadwal
              </span>
              <span className="w-8 sm:w-12 h-[2px] bg-accent rounded-full"></span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center justify-center gap-3">
              <Calendar className="w-8 h-8 text-accent" />
              Timeline Kegiatan
            </h2>
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-0">
            <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-0.5 bg-white/10 -translate-x-1/2" />
            <div className="space-y-12">
              {timelineData.map((item, index) => {
                const isEven = index % 2 === 0;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className={`relative flex flex-col sm:flex-row items-center ${isEven ? "sm:flex-row-reverse" : ""}`}
                  >
                    <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 z-10 w-12 h-12 rounded-full bg-primary border-4 border-[#043761] flex items-center justify-center shadow-[0_0_15px_rgba(255,195,0,0.2)]">
                      <div
                        className={`w-full h-full rounded-full flex items-center justify-center border ${item.status === "Done" ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-400" : item.status === "Active" ? "border-accent bg-accent/20 text-accent shadow-[0_0_10px_rgba(255,195,0,0.5)]" : "border-white/20 bg-white/5 text-white/50"}`}
                      >
                        {item.status === "Done" ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Clock className="w-5 h-5" />
                        )}
                      </div>
                    </div>

                    <div className="w-full sm:w-[calc(50%-3rem)] ml-14 sm:ml-0">
                      <div className="p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-accent/50 backdrop-blur-md transition-all duration-300 hover:shadow-[0_10px_30px_rgba(255,195,0,0.15)] group hover:-translate-y-1 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-3 py-1.5 text-xs font-bold rounded-lg bg-accent/20 text-accent border border-accent/30 tracking-wider">
                            {item.date}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-white/70 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* ================= MODAL LIGHTBOX ================= */}
      <EventGalleryModal
        isOpen={selectedIndex !== null}
        currentIndex={selectedIndex}
        images={allGallery}
        category="LKMM-PD"
        title="LKMM-PD HIMSIKA 2026"
        onClose={() => setSelectedIndex(null)}
        onNavigate={(newIdx) => setSelectedIndex(newIdx)}
      />
    </div>
  );
}
