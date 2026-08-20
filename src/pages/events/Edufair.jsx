import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Briefcase,
  Target,
  Users,
  Lightbulb,
  ExternalLink,
  CheckCircle2,
  Clock,
  Image as ImageIcon,
  Rocket,
  X,
} from "lucide-react";

// --- SILAKAN IMPORT GAMBAR ASLI KAMU DI SINI ---
import Imelvi from "../../assets/images/pengurus/divisiEdukasi/Imelvi.webp";
import FotoKegiatan1 from "../../assets/images/events/edufair/galeri1.webp";

// Data Timeline ISCT (Disesuaikan untuk Company Tour)
const timelineData = [
  {
    date: "10 September 2026",
    title: "Open Registration",
    desc: "Pendaftaran peserta kunjungan industri resmi dibuka untuk seluruh mahasiswa.",
    status: "Done",
  },
  {
    date: "25 September 2026",
    title: "Technical Meeting",
    desc: "Briefing terkait tata tertib, jadwal keberangkatan, dan pembagian kelompok kerja.",
    status: "Done",
  },
  {
    date: "01 Oktober 2026",
    title: "Company Visit Day",
    desc: "Kunjungan langsung ke perusahaan, observasi lingkungan kerja, dan pemaparan materi.",
    status: "Active",
  },
  {
    date: "05 Oktober 2026",
    title: "Sharing Session & Penutup",
    desc: "Sesi diskusi mendalam bersama praktisi, evaluasi kegiatan, dan penyerahan plakat.",
    status: "Upcoming",
  },
];

// Data Capaian Kegiatan (Disesuaikan untuk Company Tour)
const achievementsData = [
  {
    id: 1,
    icon: Target,
    title: "Wawasan Industri",
    desc: "Memberikan gambaran nyata mengenai alur kerja dan teknologi yang digunakan di industri saat ini.",
    tag: "Edukasi",
  },
  {
    id: 2,
    icon: Users,
    title: "Relasi Profesional",
    desc: "Membangun koneksi dan jaringan antara mahasiswa dengan para profesional di perusahaan.",
    tag: "Networking",
  },
  {
    id: 3,
    icon: Lightbulb,
    title: "Kesiapan Karier",
    desc: "Mempersiapkan kompetensi lulusan agar sesuai dengan standar dan ekspektasi dunia kerja.",
    tag: "Karier",
  },
];

export default function EdufairPage() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="min-h-screen bg-linear-to-b from-[#043761] via-primary to-[#043761] font-primary pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-accent selection:text-slate-900">
      {/* ================= BACKGROUND DEKORASI ================= */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="absolute w-[40rem] h-[40rem] rounded-full blur-[150px] bg-accent/15 top-0 left-0 -translate-x-1/4 -translate-y-1/4 animate-pulse"></div>
        <div
          className="absolute w-[30rem] h-[30rem] rounded-full blur-[120px] bg-red-500/10 bottom-0 right-0 translate-x-1/3 translate-y-1/3 animate-pulse"
          style={{ animationDuration: "7s" }}
        ></div>

        {/* Ornamen SVG Tambahan */}
        <div className="absolute top-24 left-10 sm:left-20 animate-[spin_8s_linear_infinite] text-accent/30">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C12 6.62742 6.62742 12 0 12C6.62742 12 12 17.3726 12 24C12 17.3726 17.3726 12 24 12C17.3726 12 12 6.62742 12 0Z" />
          </svg>
        </div>
        <div
          className="absolute top-1/3 right-10 sm:right-24 animate-bounce text-white/10"
          style={{ animationDuration: "5s" }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <circle cx="12" cy="12" r="8" />
          </svg>
        </div>
        <div
          className="absolute bottom-1/4 left-10 sm:left-24 animate-pulse text-red-400/20"
          style={{ animationDuration: "4s" }}
        >
          <svg
            width="35"
            height="35"
            viewBox="0 0 44 22"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 11l7-9 11 18 13-16 9 11" />
          </svg>
        </div>
        <div className="absolute bottom-20 right-20 animate-[spin_12s_linear_infinite_reverse] text-accent/30">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2v20M2 12h20" />
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
              <Rocket className="w-4 h-4 text-accent" />
              Education
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight"
            >
              Education Fair <br className="hidden lg:block" />
              2026{" "}
              <span className="text-accent drop-shadow-[0_0_20px_rgba(255,195,0,0.3)]">
                (EDUFAIR)
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/70 text-lg leading-relaxed max-w-3xl"
            >
              Education Fair merupakan ajang multi event yang berisi kegiatan
              seminar, workshop, pameran inovasi, dan Silogy National
              Competition 2026.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              <Link
                to="/daftar-isct"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-slate-900 font-bold rounded-full hover:scale-105 hover:shadow-[0_0_30px_rgba(255,195,0,0.4)] transition-all duration-300"
              >
                Daftar Sekarang
                <ExternalLink className="w-5 h-5" />
              </Link>
              <a
                href="#timeline"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                Lihat Jadwal
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
                  src={Imelvi}
                  alt="Ketua Pelaksana ISCT"
                  className="w-full h-full object-cover transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#043761] via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-accent text-slate-900 rounded-full shadow-lg">
                    Ketua Pelaksana
                  </span>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-extrabold text-white mb-1">
                  Imelvi Kurnia Zalukhu
                </h3>
                <p className="text-sm text-white/50 font-medium">
                  Ketua Pelaksana Education Fair 2026
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ================= GALERI KEGIATAN (MARQUEE STYLE) ================= */}
        <section className="space-y-12">
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
              Keseruan Edufair
            </h2>
            <p className="text-white/50 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mt-4">
              Hover untuk berhenti · Klik untuk perbesar
            </p>
          </div>

          <div className="marquee-wrapper relative flex flex-col gap-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
            {/* --- BARIS 1 (Scroll ke Kiri) --- */}
            <div className="flex w-fit">
              <div className="marquee-content flex shrink-0 gap-6 pr-6 animate-marquee">
                {[1, 2, 3, 4, 5].map((item, idx) => (
                  <div
                    key={`row1-a-${idx}`}
                    onClick={() => setSelectedImage(FotoKegiatan1)}
                    className="w-[280px] sm:w-[350px] aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer shrink-0 relative group"
                  >
                    <img
                      src={FotoKegiatan1}
                      alt={`Galeri Kegiatan ${item}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-[#043761]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 bg-accent text-slate-900 rounded-full text-xs font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        Perbesar Foto
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="marquee-content flex shrink-0 gap-6 pr-6 animate-marquee"
                aria-hidden="true"
              >
                {[1, 2, 3, 4, 5].map((item, idx) => (
                  <div
                    key={`row1-b-${idx}`}
                    onClick={() => setSelectedImage(FotoKegiatan1)}
                    className="w-[280px] sm:w-[350px] aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer shrink-0 relative group"
                  >
                    <img
                      src={FotoKegiatan1}
                      alt={`Galeri Kegiatan ${item}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-[#043761]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 bg-accent text-slate-900 rounded-full text-xs font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        Perbesar Foto
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* --- BARIS 2 (Scroll ke Kanan / Reverse) --- */}
            <div className="flex w-fit">
              <div className="marquee-content flex shrink-0 gap-6 pr-6 animate-marquee-reverse">
                {[1, 2, 3, 4, 5].map((item, idx) => (
                  <div
                    key={`row2-a-${idx}`}
                    onClick={() => setSelectedImage(FotoKegiatan1)}
                    className="w-[280px] sm:w-[350px] aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer shrink-0 relative group"
                  >
                    <img
                      src={FotoKegiatan1}
                      alt={`Galeri Kegiatan ${item}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-[#043761]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 bg-accent text-slate-900 rounded-full text-xs font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        Perbesar Foto
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="marquee-content flex shrink-0 gap-6 pr-6 animate-marquee-reverse"
                aria-hidden="true"
              >
                {[1, 2, 3, 4, 5].map((item, idx) => (
                  <div
                    key={`row2-b-${idx}`}
                    onClick={() => setSelectedImage(FotoKegiatan1)}
                    className="w-[280px] sm:w-[350px] aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer shrink-0 relative group"
                  >
                    <img
                      src={FotoKegiatan1}
                      alt={`Galeri Kegiatan ${item}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-[#043761]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 bg-accent text-slate-900 rounded-full text-xs font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        Perbesar Foto
                      </span>
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
            
            .marquee-wrapper:hover .marquee-content {
              animation-play-state: paused;
            }
          `}</style>
        </section>
      </div>

      {/* ================= MODAL LIGHTBOX ================= */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full flex flex-col items-center justify-center"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 md:-right-12 z-10 w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-accent hover:text-slate-900 transition-all cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <img
                src={selectedImage}
                alt="Full Size Gallery"
                className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
