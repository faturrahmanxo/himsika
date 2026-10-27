import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { GraduationCap, Trophy, Star } from "lucide-react";

// IMPORT LOGO AAS DI SINI (Sesuaikan path-nya ya!)
// Pastikan logonya transparan/berlatar rapi (format PNG/SVG)
import LogoAAS from "../assets/logo/proker/AAS.png";

// Pesan loading bergilir — nuansa "akademik & pencapaian" sesuai nama AAS
const LOADING_MESSAGES = [
  "Menyiapkan Peluang Terbaik...",
  "Mengumpulkan Info Prestasi...",
  "Merangkai Kesempatan Emas...",
];

// Ikon prestasi yang mengorbit mengelilingi logo, tiap ikon diberi
// offset delay negatif supaya posisinya tersebar merata di lintasan orbit
const ORBIT_ICONS = [
  { Icon: GraduationCap, delay: 0 },
  { Icon: Trophy, delay: -4 },
  { Icon: Star, delay: -8 },
];

export default function PreloaderAAS() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 850);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      // Animasi saat preloader menghilang (keluar layar)
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-[#043761] via-primary to-[#043761] overflow-hidden"
    >
      {/* Background Dekorasi Konsisten dengan Tema Situs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="absolute w-[40rem] h-[40rem] rounded-full blur-[120px] bg-accent/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center px-6">
        {/* Orbit Prestasi & Logo AAS */}
        <div className="relative flex items-center justify-center w-40 h-40 mb-8">
          {/* Cincin putus-putus terluar, berputar sangat pelan */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-accent/25"
          />

          {/* Cincin spinner utama */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="absolute w-24 h-24 border-4 border-white/5 border-t-accent border-r-accent rounded-full shadow-[0_0_30px_rgba(255,195,0,0.3)]"
          />

          {/* Ikon-ikon prestasi (topi wisuda, trofi, bintang) mengorbit logo */}
          {ORBIT_ICONS.map(({ Icon, delay }, i) => (
            <motion.div
              key={i}
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 12,
                ease: "linear",
                delay,
              }}
            >
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#043761] border border-accent/40 flex items-center justify-center shadow-[0_0_10px_rgba(255,195,0,0.4)]">
                <Icon className="w-3.5 h-3.5 text-accent" />
              </div>
            </motion.div>
          ))}

          {/* Logo AAS Tengah */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Glow effect di belakang logo */}
            <div className="absolute w-12 h-12 bg-accent rounded-full blur-[15px] opacity-40"></div>

            <div className="relative z-10 w-16 h-16 rounded-full bg-white p-1.5 shadow-[0_0_15px_rgba(255,255,255,0.3)] flex items-center justify-center">
              <img
                src={LogoAAS}
                alt="Logo Academic Achievement Support HIMSIKA"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Judul & Kepanjangan Nama */}
        <motion.h2
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="text-2xl sm:text-3xl font-black text-white tracking-[0.25em] uppercase leading-none"
        >
          AAS
        </motion.h2>
        <p className="mt-2 text-[9px] sm:text-[11px] text-accent font-bold tracking-[0.25em] uppercase mb-6 text-center">
          Academic Achievement Support
        </p>

        {/* Loading Bar dengan Penanda Trofi Berjalan (0% → 100%) */}
        <div className="relative w-52 sm:w-64">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              // Durasinya disesuaikan dengan waktu loading website (misal 2.2 detik)
              transition={{ duration: 2.2, ease: "circOut" }}
              className="h-full bg-accent shadow-[0_0_15px_rgba(255,195,0,0.8)] rounded-full"
            />
          </div>
          <motion.div
            initial={{ left: "0%" }}
            animate={{ left: "100%" }}
            transition={{ duration: 2.2, ease: "circOut" }}
            className="absolute -top-[9px] -translate-x-1/2 pointer-events-none"
          >
            <Trophy className="w-4 h-4 text-accent drop-shadow-[0_0_6px_rgba(255,195,0,0.8)]" />
          </motion.div>
        </div>

        {/* Pesan Loading Bergilir */}
        <motion.p
          key={messageIndex}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 text-[10px] sm:text-xs text-white/50 font-bold tracking-widest uppercase text-center"
        >
          {LOADING_MESSAGES[messageIndex]}
        </motion.p>
      </div>
    </motion.div>
  );
}
