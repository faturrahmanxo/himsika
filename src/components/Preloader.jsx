import React from "react";
import { motion } from "motion/react";

// IMPORT LOGO HIMSIKA DI SINI (Sesuaikan path-nya ya!)
// Pastikan logonya transparan (format PNG/SVG) agar terlihat menyatu
import logoHimsika from "../assets/logo/HIMSIKA.png";

export default function Preloader() {
  return (
    <motion.div
      // Animasi saat preloader menghilang (keluar layar)
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#043761] overflow-hidden"
    >
      {/* Background Dekorasi Konsisten */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="absolute w-[40rem] h-[40rem] rounded-full blur-[120px] bg-accent/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Spinner & Logo */}
        <div className="relative flex items-center justify-center mb-8">
          {/* Cincin Luar Berputar */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-24 h-24 border-4 border-white/5 border-t-accent border-r-accent rounded-full shadow-[0_0_30px_rgba(255,195,0,0.3)]"
          />

          {/* Logo Tengah Statis (Tanpa Efek Denyut) */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Glow effect di belakang logo */}
            <div className="absolute w-12 h-12 bg-accent rounded-full blur-[15px] opacity-40"></div>

            {/* LOGO HIMSIKA MENGGANTIKAN SVG */}
            <img
              src={logoHimsika}
              alt="Logo HIMSIKA"
              className="w-20 h-20 relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] object-contain"
            />
          </div>
        </div>

        {/* Teks Judul */}
        <motion.h2
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="text-2xl sm:text-3xl font-bold text-white tracking-[0.2em] uppercase mb-6"
        >
          HIMSIKA
        </motion.h2>

        {/* Loading Bar (Proses dari 0% ke 100%) */}
        <div className="w-48 sm:w-64 h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            // Durasinya disesuaikan dengan waktu loading website (misal 2 detik)
            transition={{ duration: 2, ease: "circOut" }}
            className="h-full bg-accent shadow-[0_0_15px_rgba(255,195,0,0.8)] rounded-full"
          />
        </div>

        <p className="mt-4 text-[10px] sm:text-xs text-white/50 font-bold tracking-widest uppercase animate-pulse">
          Loading...
        </p>
      </div>
    </motion.div>
  );
}
