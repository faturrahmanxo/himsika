import { Link } from "react-router-dom";
import { motion } from "motion/react";
import LogoAAS from "../assets/logo/proker/AAS.png";

// Kepala halaman turunan AAS (Prestasi, Sharing Session, Arsip Materi).
// Dipakai bersama supaya ketiga halaman punya jalan kembali ke /aas dan
// penanda divisi yang sama (R-24, R-31).
// Gerak: judul muncul sekali saat halaman dibuka, bukan animasi berulang (R-19).
export default function AasHeader({ judul, sorot, deskripsi }) {
  return (
    <header className="pt-32 pb-10 sm:pt-36 sm:pb-12">
      <Link
        to="/aas"
        className="text-sm font-semibold text-white/70 hover:text-accent transition-colors rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-page"
      >
        Kembali ke AAS
      </Link>

      <div className="mt-8 flex items-start gap-4 sm:gap-5">
        <img
          src={LogoAAS}
          alt="Logo AAS"
          className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-white object-contain p-1.5"
        />
        <div className="min-w-0">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.05]"
          >
            {judul}
            {sorot && <span className="text-accent"> {sorot}</span>}
          </motion.h1>
          {deskripsi && (
            <p className="mt-4 text-base sm:text-lg text-white/70 leading-relaxed max-w-2xl">
              {deskripsi}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
