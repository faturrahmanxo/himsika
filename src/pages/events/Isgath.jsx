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
} from "lucide-react";

// --- SILAKAN IMPORT GAMBAR ASLI KAMU DI SINI ---
import Refaya from "../../assets/images/pengurus/divisiInternal/Refaya.webp";

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

// Data Timeline Information System Gathering 2026
const timelineData = [
  {
    date: "15 April 2026",
    title: "Open Recruitment Kepanitiaan",
    desc: "Pendaftaran untuk anggota kepanitiaan program kerja Information System Gathering 2026 resmi dibuka.",
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

// Data Capaian Kegiatan Information System Gathering 2026
const achievementsData = [
  {
    id: 1,
    icon: Network,
    title: "Terbangunnya Relasi",
    desc: "Terjalinnya hubungan kolaboratif antara HIMSIKA Unsika dan Himatif UIN SGD Bandung sebagai langkah awal kerja sama jangka panjang.",
    tag: "Koneksi",
  },
  {
    id: 2,
    icon: BookOpen,
    title: "Peningkatan Wawasan",
    desc: "Pengurus mendapatkan pemahaman mendalam terkait struktur organisasi, manajemen program kerja, dan strategi pengembangan himpunan.",
    tag: "Edukasi",
  },
  {
    id: 3,
    icon: MessageSquare,
    title: "Sharing Knowledge",
    desc: "Terjadinya pertukaran informasi dan pengalaman melalui sesi sharing dan forum group discussion yang memperkaya perspektif pengurus.",
    tag: "Diskusi",
  },
  {
    id: 4,
    icon: Brain,
    title: "Penguatan Soft Skill",
    desc: "Peserta mampu mengembangkan kemampuan komunikasi, kerja sama tim, leadership, serta kemampuan problem solving melalui diskusi interaktif.",
    tag: "Pengembangan",
  },
  {
    id: 5,
    icon: Compass,
    title: "Pengalaman Akademik",
    desc: "Pengurus memperoleh insight mengenai lingkungan kampus UIN SGD Bandung melalui sesi tur kampus dan interaksi lintas institusi.",
    tag: "Eksplorasi",
  },
  {
    id: 6,
    icon: HeartHandshake,
    title: "Kebersamaan Terjalin",
    desc: "Kegiatan interaktif dan permainan berhasil mempererat hubungan personal antar peserta dari dua himpunan.",
    tag: "Kekeluargaan",
  },
  {
    id: 7,
    icon: Rocket,
    title: "Fondasi Kolaborasi",
    desc: "Kegiatan ini menjadi pondasi bagi rencana kolaborasi lebih luas, seperti proyek bersama, kegiatan akademik, serta pengembangan himpunan.",
    tag: "Masa Depan",
  },
];

export default function IsgathPage() {
  // State untuk menyimpan gambar yang diklik (Lightbox)
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
          className="absolute bottom-1/4 left-10 sm:left-24 animate-pulse text-blue-400/20"
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
              <Users className="w-4 h-4 text-accent" />
              Studi Banding & Relasi
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight"
            >
              Information System <br className="hidden lg:block" />
              <span className="text-accent drop-shadow-[0_0_20px_rgba(255,195,0,0.3)]">
                Gathering 2026
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/70 text-lg leading-relaxed max-w-3xl"
            >
              Isgath (Information System Gathering) merupakan kegiatan
              kaderisasi Prodi terakhir yang bertujuan untuk memperkenalkan
              Program Studi Sistem Informasi Universitas Singaperbangsa Karawang
              kepada mahasiswa baru angkatan 2026. Program kerja ini ditujukan
              untuk mempererat rasa kekeluargaan dan kebersamaan di antara
              sesama mahasiswa baru.
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
                  src={Refaya}
                  alt="Ketua Pelaksana Information System Gathering 2026"
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
                  Refaya Nindya Secondita
                </h3>
                <p className="text-sm text-white/50 font-medium">
                  Ketua Pelaksana Isgath 2026
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
                    onClick={() => setSelectedImage(foto)}
                    className="w-[280px] sm:w-[350px] aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer shrink-0 relative group"
                  >
                    <img
                      src={foto}
                      alt={`Galeri Kegiatan 1 - Foto ${idx + 1}`}
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
                {galeriBaris1.map((foto, idx) => (
                  <div
                    key={`row1-b-${idx}`}
                    onClick={() => setSelectedImage(foto)}
                    className="w-[280px] sm:w-[350px] aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer shrink-0 relative group"
                  >
                    <img
                      src={foto}
                      alt={`Galeri Kegiatan 1 - Foto Duplikat ${idx + 1}`}
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
            <div className="marquee-row flex w-fit">
              <div className="marquee-content flex shrink-0 gap-6 pr-6 animate-marquee-reverse">
                {galeriBaris2.map((foto, idx) => (
                  <div
                    key={`row2-a-${idx}`}
                    onClick={() => setSelectedImage(foto)}
                    className="w-[280px] sm:w-[350px] aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer shrink-0 relative group"
                  >
                    <img
                      src={foto}
                      alt={`Galeri Kegiatan 2 - Foto ${idx + 1}`}
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
                {galeriBaris2.map((foto, idx) => (
                  <div
                    key={`row2-b-${idx}`}
                    onClick={() => setSelectedImage(foto)}
                    className="w-[280px] sm:w-[350px] aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer shrink-0 relative group"
                  >
                    <img
                      src={foto}
                      alt={`Galeri Kegiatan 2 - Foto Duplikat ${idx + 1}`}
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
              Pencapaian Kegiatan ISGATH 2026
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
