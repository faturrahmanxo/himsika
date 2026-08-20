import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Target,
  ExternalLink,
  CheckCircle2,
  Clock,
  Image as ImageIcon,
  Rocket,
  X,
  Users,
  Network,
  BookOpen,
  MessageSquare,
  Brain,
  Compass,
  HeartHandshake
} from "lucide-react";

// --- SILAKAN IMPORT GAMBAR ASLI KAMU DI SINI ---
import Dilan from "../../assets/images/pengurus/divisiRelasi/Dilan.webp";
import FotoKegiatan1 from "../../assets/images/events/galeri1.webp";

// Data Timeline Make Connection
const timelineData = [
  {
    date: "15 April 2026",
    title: "Open Recruitment Kepanitiaan",
    desc: "Pendaftaran untuk anggota kepanitiaan program kerja Make Connection resmi dibuka.",
    status: "Done",
  },
  {
    date: "02 Mei 2026",
    title: "Rapat Koordinasi Himpunan",
    desc: "Pembahasan konsep acara, fiksasi rundown, dan pembagian tugas antar divisi.",
    status: "Done",
  },
  {
    date: "09 Mei 2026",
    title: "Pelaksanaan Kunjungan (Match Day)",
    desc: "Pemberangkatan dan pelaksanaan studi banding ke Himpunan Mahasiswa tujuan.",
    status: "Active",
  },
  {
    date: "12 Mei 2026",
    title: "Evaluasi & Follow Up",
    desc: "Rapat evaluasi kegiatan dan perumusan rencana kolaborasi lanjutan.",
    status: "Upcoming",
  },
];

// Data Capaian Kegiatan Make Connection (7 Poin, Compact Version)
const achievementsData = [
  {
    id: 1,
    icon: Network,
    title: "Terbangunnya Relasi",
    desc: "Terjalinnya hubungan kolaboratif antara HIMSIKA Unsika dan Himatif UIN SGD Bandung.",
    tag: "Koneksi",
  },
  {
    id: 2,
    icon: BookOpen,
    title: "Peningkatan Wawasan",
    desc: "Memahami struktur organisasi, manajemen proker, dan strategi pengembangan himpunan.",
    tag: "Edukasi",
  },
  {
    id: 3,
    icon: MessageSquare,
    title: "Sharing Knowledge",
    desc: "Pertukaran informasi dan pengalaman melalui sesi sharing dan forum group discussion.",
    tag: "Diskusi",
  },
  {
    id: 4,
    icon: Brain,
    title: "Penguatan Soft Skill",
    desc: "Mengembangkan komunikasi, kerja sama tim, leadership, dan problem solving.",
    tag: "Pengembangan",
  },
  {
    id: 5,
    icon: Compass,
    title: "Pengalaman Akademik",
    desc: "Memperoleh insight lingkungan kampus UIN SGD Bandung melalui sesi tur kampus.",
    tag: "Eksplorasi",
  },
  {
    id: 6,
    icon: HeartHandshake,
    title: "Kebersamaan Terjalin",
    desc: "Kegiatan interaktif berhasil mempererat hubungan personal antar peserta dua himpunan.",
    tag: "Kekeluargaan",
  },
  {
    id: 7,
    icon: Rocket,
    title: "Fondasi Kolaborasi",
    desc: "Pondasi rencana kolaborasi lebih luas seperti proyek bersama dan kegiatan akademik.",
    tag: "Masa Depan",
  },
];

export default function MakeConnectionPage() {
  const [selectedImage, setSelectedImage] = useState(null);

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

        <div className="absolute top-24 left-10 sm:left-20 animate-[spin_8s_linear_infinite] text-accent/30">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C12 6.62742 6.62742 12 0 12C6.62742 12 12 17.3726 12 24C12 17.3726 17.3726 12 24 12C17.3726 12 12 6.62742 12 0Z" />
          </svg>
        </div>
        <div className="absolute top-1/3 right-10 sm:right-24 animate-bounce text-white/10" style={{ animationDuration: "5s" }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <circle cx="12" cy="12" r="8" />
          </svg>
        </div>
        <div className="absolute bottom-1/4 left-10 sm:left-24 animate-pulse text-blue-400/20" style={{ animationDuration: "4s" }}>
          <svg width="35" height="35" viewBox="0 0 44 22" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 11l7-9 11 18 13-16 9 11" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
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
              className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight"
            >
              Make <br className="hidden lg:block" />
              <span className="text-accent drop-shadow-[0_0_20px_rgba(255,195,0,0.3)]">
                Connection
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/70 text-lg leading-relaxed max-w-3xl"
            >
              Make Connection merupakan program kerja Divisi Relasi, kegiatan ini berupa studi banding ke Himpunan Mahasiswa Komputer di luar Unsika. Dengan diadakannya Make Connection ini, Pengurus Himsika akan mendapatkan input yang baru dan menjalin hubungan dengan Himpunan Mahasiswa Komputer yang dituju.
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
                  src={Dilan}
                  alt="Ketua Pelaksana Make Connection"
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
                  Dillan Gustav Alfaro
                </h3>
                <p className="text-sm text-white/50 font-medium">
                  Ketua Pelaksana Make Connection 2026
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ================= GALERI KEGIATAN (COMPACT MARQUEE) ================= */}
        <section className="space-y-10 pt-8">
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
          </div>

          <div className="marquee-wrapper relative flex flex-col gap-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
            <div className="flex w-fit">
              <div className="marquee-content flex shrink-0 gap-4 pr-4 animate-marquee">
                {[1, 2, 3, 4, 5].map((item, idx) => (
                  <div key={`row1-a-${idx}`} onClick={() => setSelectedImage(FotoKegiatan1)} className="w-[260px] sm:w-[320px] aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer shrink-0 relative group">
                    <img src={FotoKegiatan1} alt="Galeri" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-[#043761]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 bg-accent text-slate-900 rounded-full text-xs font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">Perbesar Foto</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="marquee-content flex shrink-0 gap-4 pr-4 animate-marquee" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((item, idx) => (
                  <div key={`row1-b-${idx}`} onClick={() => setSelectedImage(FotoKegiatan1)} className="w-[260px] sm:w-[320px] aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer shrink-0 relative group">
                    <img src={FotoKegiatan1} alt="Galeri" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-[#043761]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 bg-accent text-slate-900 rounded-full text-xs font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">Perbesar Foto</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex w-fit">
              <div className="marquee-content flex shrink-0 gap-4 pr-4 animate-marquee-reverse">
                {[1, 2, 3, 4, 5].map((item, idx) => (
                  <div key={`row2-a-${idx}`} onClick={() => setSelectedImage(FotoKegiatan1)} className="w-[260px] sm:w-[320px] aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer shrink-0 relative group">
                    <img src={FotoKegiatan1} alt="Galeri" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-[#043761]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 bg-accent text-slate-900 rounded-full text-xs font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">Perbesar Foto</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="marquee-content flex shrink-0 gap-4 pr-4 animate-marquee-reverse" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((item, idx) => (
                  <div key={`row2-b-${idx}`} onClick={() => setSelectedImage(FotoKegiatan1)} className="w-[260px] sm:w-[320px] aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer shrink-0 relative group">
                    <img src={FotoKegiatan1} alt="Galeri" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-[#043761]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 bg-accent text-slate-900 rounded-full text-xs font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">Perbesar Foto</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <style>{`
            @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
            .animate-marquee { animation: marquee 35s linear infinite; }
            .animate-marquee-reverse { animation: marquee 40s linear infinite reverse; }
            .marquee-wrapper:hover .marquee-content { animation-play-state: paused; }
          `}</style>
        </section>

        {/* ================= CAPAIAN SECTION (VERSI COMPACT 7 ITEM) ================= */}
        <section id="capaian" className="space-y-10 pt-12">
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
              Pencapaian Make Connection 2026
            </h2>
          </div>

          {/* Grid 4 Kolom di Laptop agar ringkas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievementsData.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.3, delay: (index % 4) * 0.1 }}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-accent/50 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:shadow-lg group flex flex-col relative overflow-hidden"
                >
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-accent group-hover:border-accent transition-all duration-300">
                        <IconComponent className="w-5 h-5 text-white group-hover:text-slate-900 transition-colors" />
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 group-hover:border-accent/30 group-hover:text-accent transition-colors">
                        {item.tag}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors mb-1.5">
                        {item.title}
                      </h3>
                      <p className="text-xs text-white/70 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ================= TIMELINE SECTION (VERSI COMPACT) ================= */}
        <section id="timeline" className="space-y-10 pt-12">
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
            <div className="space-y-8">
              {timelineData.map((item, index) => {
                const isEven = index % 2 === 0;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className={`relative flex flex-col sm:flex-row items-center ${isEven ? "sm:flex-row-reverse" : ""}`}
                  >
                    <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 z-10 w-10 h-10 rounded-full bg-primary border-4 border-[#043761] flex items-center justify-center">
                      <div className={`w-full h-full rounded-full flex items-center justify-center border ${item.status === "Done" ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-400" : item.status === "Active" ? "border-accent bg-accent/20 text-accent shadow-[0_0_10px_rgba(255,195,0,0.5)]" : "border-white/20 bg-white/5 text-white/50"}`}>
                        {item.status === "Done" ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </div>
                    </div>

                    <div className="w-full sm:w-[calc(50%-2.5rem)] ml-12 sm:ml-0">
                      <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-accent/50 backdrop-blur-md transition-all duration-300 hover:shadow-lg group relative overflow-hidden">
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-accent/20 text-accent border border-accent/30 tracking-wider">
                            {item.date}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors mb-1.5">
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
                className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}