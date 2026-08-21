import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { 
  Trophy, 
  Award, 
  Users, 
  BookMarked,
  MessageCircle 
} from "lucide-react";

// --- IMPORT LOGO AAS KAMU DI SINI ---
import LogoAAS from "../../assets/logo/proker/AAS.png"; 

export default function AASPage() {
  const [activeTab, setActiveTab] = useState("aas");

  return (
    // PERBAIKAN 1: Menambahkan pt-32 sm:pt-40 agar konten turun ke bawah Navbar Utama
    <div className="min-h-screen pt-32 sm:pt-40 pb-20 bg-linear-to-b from-[#02182b] via-[#043761] to-[#02182b] font-primary relative overflow-hidden flex flex-col items-center selection:bg-accent selection:text-slate-900">
      
      {/* ================= BACKGROUND DEKORASI ================= */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
        <div className="absolute w-[30rem] h-[30rem] rounded-full blur-[120px] bg-accent/10 top-20 left-1/2 -translate-x-1/2 animate-pulse"></div>
        <div className="absolute w-[20rem] h-[20rem] rounded-full blur-[100px] bg-blue-400/10 bottom-0 left-0 animate-pulse" style={{ animationDuration: '6s' }}></div>
      </div>

      {/* ================= HEADER NAVBAR (TOGGLE PILL STYLE) ================= */}
      {/* PERBAIKAN 2: Desain diubah jadi kapsul melayang (rounded-full) agar lebih elegan */}
      <nav className="w-[90%] max-w-[360px] bg-[#011425]/90 backdrop-blur-md rounded-full py-3 px-6 flex justify-between items-center relative z-20 shadow-2xl border border-white/10 mb-10">
        <Link 
          to="/" 
          className="text-xs font-bold text-white/60 hover:text-white transition-colors tracking-wide"
        >
          Beranda
        </Link>
        <button
          onClick={() => setActiveTab("aas")}
          className={`text-xs font-bold tracking-wide transition-all relative px-2 py-1 ${
            activeTab === "aas" ? "text-white" : "text-white/60 hover:text-white"
          }`}
        >
          AAS
          {activeTab === "aas" && (
            <motion.div layoutId="underline" className="absolute -bottom-1 left-0 right-0 h-[2px] bg-accent rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("about")}
          className={`text-xs font-bold tracking-wide transition-all relative px-2 py-1 ${
            activeTab === "about" ? "text-white" : "text-white/60 hover:text-white"
          }`}
        >
          Tentang Kita
          {activeTab === "about" && (
            <motion.div layoutId="underline" className="absolute -bottom-1 left-0 right-0 h-[2px] bg-accent rounded-full" />
          )}
        </button>
      </nav>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="w-full max-w-lg px-6 relative z-10 flex flex-col items-center flex-1">
        <AnimatePresence mode="wait">
          
          {/* ----------------- TAB 1: MENU UTAMA AAS ----------------- */}
          {activeTab === "aas" ? (
            <motion.div
              key="aas"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center"
            >
              {/* Header Titles */}
              <div className="text-center mb-8">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-2 drop-shadow-lg">
                  AAS HIMSIKA
                </h1>
                <p className="text-xs sm:text-sm font-bold text-white/70 tracking-[0.2em] uppercase">
                  Academic Achievement Support
                </p>
              </div>

              {/* Logo AAS */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white rounded-full p-2 mb-10 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                <div className="w-full h-full rounded-full overflow-hidden border border-gray-100 flex items-center justify-center">
                  <img src={LogoAAS} alt="Logo AAS" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Tombol-Tombol Link */}
              <div className="w-full space-y-4 mb-12">
                <a href="#" className="group relative w-full bg-gradient-to-r from-[#032340] to-[#054378] border border-white/10 rounded-2xl py-4 px-6 flex items-center shadow-[0_10px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_10px_25px_rgba(255,195,0,0.2)] hover:border-accent/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                    <Trophy className="w-5 h-5 text-[#043761]" />
                  </div>
                  <span className="flex-1 text-center font-bold text-white text-sm sm:text-base tracking-wide pr-10">
                    PRESTASI MAHASISWA
                  </span>
                </a>

                <a href="#" className="group relative w-full bg-gradient-to-r from-[#032340] to-[#054378] border border-white/10 rounded-2xl py-4 px-6 flex items-center shadow-[0_10px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_10px_25px_rgba(255,195,0,0.2)] hover:border-accent/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                    <Award className="w-5 h-5 text-[#043761]" />
                  </div>
                  <span className="flex-1 text-center font-bold text-white text-sm sm:text-base tracking-wide pr-10">
                    LOMBA & BEASISWA
                  </span>
                </a>

                <a href="#" className="group relative w-full bg-gradient-to-r from-[#032340] to-[#054378] border border-white/10 rounded-2xl py-4 px-6 flex items-center shadow-[0_10px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_10px_25px_rgba(255,195,0,0.2)] hover:border-accent/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                    <Users className="w-5 h-5 text-[#043761]" />
                  </div>
                  <span className="flex-1 text-center font-bold text-white text-sm sm:text-base tracking-wide pr-10">
                    SHARING SESSION
                  </span>
                </a>

                <a href="#" className="group relative w-full bg-gradient-to-r from-[#032340] to-[#054378] border border-white/10 rounded-2xl py-4 px-6 flex items-center shadow-[0_10px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_10px_25px_rgba(255,195,0,0.2)] hover:border-accent/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                    <BookMarked className="w-5 h-5 text-[#043761]" />
                  </div>
                  <span className="flex-1 text-center font-bold text-white text-sm sm:text-base tracking-wide pr-10">
                    ARSIP MATERI
                  </span>
                </a>
              </div>

              {/* Sosial Media (Menggunakan SVG Manual anti-error) */}
              <div className="flex gap-4 mb-12">
                <a href="#" className="w-12 h-12 bg-[#02182b] border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-accent hover:text-slate-900 transition-colors shadow-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className="w-12 h-12 bg-[#02182b] border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-accent hover:text-slate-900 transition-colors shadow-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
                <a href="#" className="w-12 h-12 bg-[#02182b] border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-accent hover:text-slate-900 transition-colors shadow-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                  </svg>
                </a>
              </div>

              {/* Contact Person */}
              <div className="flex flex-col items-center gap-3">
                <span className="text-xs font-bold text-white/50 tracking-widest uppercase mb-1">
                  Contact Person
                </span>
                <a href="https://wa.me/6280000000000" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors bg-emerald-400/10 px-4 py-2 rounded-full border border-emerald-400/20">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">Auzilia Chantika Ardiana</span>
                </a>
                <a href="https://wa.me/6280000000000" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors bg-emerald-400/10 px-4 py-2 rounded-full border border-emerald-400/20">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">Meyta Sabrina</span>
                </a>
              </div>
            </motion.div>

          ) : (

            /* ----------------- TAB 2: TENTANG KITA ----------------- */
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center text-center mt-4"
            >
              {/* Logo */}
              <div className="w-24 h-24 bg-white rounded-full p-1.5 mb-8 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                <div className="w-full h-full rounded-full overflow-hidden border border-gray-100 flex items-center justify-center">
                  <img src={LogoAAS} alt="Logo AAS" className="w-full h-full object-cover" />
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 leading-snug">
                Tentang Academic <br /> Achievement Support
              </h2>
              
              <p className="text-sm text-white/80 font-medium mb-8 max-w-sm">
                We are a dedicated team committed to academic achievement, student support, and collaborative learning.
              </p>

              {/* Quote */}
              <div className="w-full relative mb-10 py-6 border-y border-white/10">
                <p className="text-lg sm:text-xl font-black italic text-accent tracking-wide">
                  "We Beyond boundaries, unlimited possibilities."
                </p>
              </div>

              {/* Paragraf Penjelasan */}
              <div className="space-y-4 text-sm sm:text-base text-white/70 leading-relaxed text-justify px-2">
                <p>
                  Academic Achievement Support (AAS), berperan sebagai wadah pendukung untuk mahasiswa Sistem Informasi yang memiliki potensi dalam bidang akademis untuk membantunya meningkatkan soft skill mereka dan membantu dalam menggapai prestasi yang unggul atau yang terbaik buat mereka.
                </p>
                <p>
                  AAS juga adalah program kerja yang bersifat kondisional mengikuti kalender akademik dan program lomba yang bersangkutan, dan AAS juga merupakan program kerja yang kegiatannya dilakukan full online.
                </p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}