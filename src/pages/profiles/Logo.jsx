import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Hexagon, Compass, Star, Zap } from "lucide-react";

// --- IMPORT GAMBAR LOGO ---
import HimsikaLogo from "../../assets/logo/HIMSIKA.png";
import AksaraCakraLogo from "../../assets/logo/AksaraCakra.png";

// Data Makna Logo HIMSIKA
const himsikaMeanings = [
  {
    id: "01",
    title: "Bentuk Lingkaran",
    desc: "Mewakili kekekalan 'tidak ada matinya'. Melindungi integritas komunitas.",
  },
  {
    id: "02",
    title: "Dominan Biru",
    desc: "Mewakili ketenangan dan tanggung jawab. HIMSIKA kuat dan dapat diandalkan.",
  },
  {
    id: "03",
    title: "Merah & Putih",
    desc: "Rasa hormat kepada NKRI serta warna merah khusus untuk almamater UNSIKA.",
  },
  {
    id: "04",
    title: "Lingkaran Putih Tipis",
    desc: "Melambangkan perlindungan, kebenaran solid, dan kemurnian dalam berproses.",
  },
  {
    id: "05",
    title: "Huruf 'S'",
    desc: "Representasi inisial depan dari program studi tercinta, Sistem Informasi.",
  },
  {
    id: "06",
    title: "Angka 4",
    desc: "Target IPK sempurna (Zero Mistake) yang menjadi pedoman sukses dalam berproses.",
  },
  {
    id: "07",
    title: "Proses Jaringan",
    desc: "Tidak membedakan SARA, terus beradaptasi dan relevan mengikuti perkembangan zaman.",
  },
  {
    id: "08",
    title: "Lambang Gear",
    desc: "Menjelaskan satu identitas mutlak: seluruh anggota HIMSIKA adalah pekerja keras.",
  },
  {
    id: "09",
    title: "Bayangan Kuning",
    desc: "Menjalankan fungsi organisasi dengan penuh keceriaan, kebahagiaan, dan optimisme.",
  },
];

// Kata kunci untuk pita marquee
const marqueeWords = [
  "HIMSIKA",
  "SISTEM INFORMASI",
  "AKSARA CAKRA",
  "ZERO MISTAKE",
  "SATU IDENTITAS",
  "PEKERJA KERAS",
];

function Marquee({ reverse = false, className = "" }) {
  const words = [...marqueeWords, ...marqueeWords];
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div
        className={`inline-flex items-center gap-6 ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        {[...words, ...words].map((word, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 text-white/70 font-extrabold text-sm sm:text-base tracking-[0.3em] uppercase"
          >
            {word}
            <Star className="w-3.5 h-3.5 text-accent fill-accent shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function LogoPage() {
  // Membagi makna menjadi sisi kiri dan kanan khusus untuk tampilan desktop radial
  const leftMeanings = himsikaMeanings.slice(0, 5);
  const rightMeanings = himsikaMeanings.slice(5, 9);

  return (
    <div className="min-h-screen bg-[#043761] font-primary pt-32 pb-24 relative overflow-x-hidden selection:bg-accent selection:text-[#043761]">
      {/* ================= BACKGROUND DEKORASI ================= */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]"></div>
        <div className="absolute w-[40rem] h-[40rem] rounded-full blur-[160px] bg-accent/10 top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-slow"></div>

        {/* Elemen mengambang tambahan */}
        <motion.div
          className="absolute top-40 left-[8%] text-accent/30"
          animate={{ y: [0, -18, 0], rotate: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        >
          <Sparkles className="w-8 h-8" />
        </motion.div>
        <motion.div
          className="absolute top-[55%] right-[10%] text-white/15"
          animate={{ y: [0, 20, 0], rotate: [0, -20, 0] }}
          transition={{
            repeat: Infinity,
            duration: 7,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <Hexagon className="w-10 h-10" />
        </motion.div>
        <motion.div
          className="absolute bottom-32 left-[15%] text-accent/20"
          animate={{ y: [0, -14, 0] }}
          transition={{
            repeat: Infinity,
            duration: 5,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Zap className="w-7 h-7" />
        </motion.div>
        <motion.div
          className="absolute top-[20%] right-[20%] text-white/10"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
        >
          <Compass className="w-9 h-9" />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* ================= HEADER SECTION ================= */}
        <section className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/20 text-accent text-xs font-bold tracking-widest uppercase backdrop-blur-md"
          >
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.span>
            Identitas & Filosofi
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight"
          >
            Anatomi Makna{" "}
            <span className="text-accent bg-gradient-to-r from-accent via-white to-accent bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer">
              Logo
            </span>
          </motion.h1>
        </section>

        {/* ================= MARQUEE STRIP ================= */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="-mx-4 sm:-mx-6 lg:-mx-8"
        >
          <div className="py-4 border-y border-white/10 bg-white/[0.03] backdrop-blur-sm">
            <Marquee />
          </div>
        </motion.section>

        {/* ================= LOGO HIMSIKA RADIAL SPREAD SECTION ================= */}
        <section className="relative">
          {/* TAMPILAN DESKTOP (LOGO DI TENGAH, MAKNA MENYEBAR KIRI-KANAN) */}
          <div className="hidden lg:grid grid-cols-12 gap-8 items-center relative min-h-[700px]">
            {/* Sisi Kiri (Makna 1 - 5) */}
            <div className="col-span-4 space-y-6">
              {leftMeanings.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: idx * 0.1,
                    type: "spring",
                    stiffness: 90,
                  }}
                  whileHover={{ scale: 1.03, x: -4 }}
                  className="bg-white/5 border border-white/10 p-6 rounded-2xl text-right hover:border-accent/40 hover:bg-white/10 transition-colors duration-300 relative group cursor-default"
                >
                  <motion.span
                    className="text-accent font-black text-sm block mb-1"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 + 0.15 }}
                  >
                    {item.id}
                  </motion.span>
                  <h3 className="text-white font-bold text-lg mb-1 group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-white/60 text-xs leading-relaxed">
                    {item.desc}
                  </p>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-px bg-accent group-hover:w-6 transition-all duration-300" />
                </motion.div>
              ))}
            </div>

            {/* Tengah (Logo Utama Zentris + Orbit Ring) */}
            <div className="col-span-4 flex justify-center sticky top-40 h-fit">
              <div className="relative w-full max-w-[280px] aspect-square flex items-center justify-center">
                {/* Efek Lingkaran Jaringan/Orbit */}
                <div className="absolute inset-0 border border-white/5 rounded-full animate-[spin_30s_linear_infinite]"></div>
                <div className="absolute -inset-10 border border-dashed border-accent/20 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
                <div className="absolute -inset-20 border border-dotted border-white/10 rounded-full animate-[spin_55s_linear_infinite]"></div>

                {/* Orbit dot berjalan */}
                <div className="absolute -inset-10 animate-[spin_12s_linear_infinite]">
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_12px_rgba(255,195,0,0.8)]" />
                </div>

                {/* Glow berdenyut */}
                <div className="absolute inset-4 rounded-full bg-accent/10 blur-2xl animate-pulse-slow" />

                {/* Container Logo Glow */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut",
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="w-full h-full rounded-full bg-gradient-to-b from-white/5 to-transparent border border-white/10 p-8 backdrop-blur-md shadow-2xl flex items-center justify-center relative z-10"
                >
                  <img
                    src={HimsikaLogo}
                    alt="Logo HIMSIKA"
                    className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                  />
                </motion.div>
              </div>
            </div>

            {/* Sisi Kanan (Makna 6 - 9) */}
            <div className="col-span-4 space-y-6">
              {rightMeanings.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: idx * 0.1,
                    type: "spring",
                    stiffness: 90,
                  }}
                  whileHover={{ scale: 1.03, x: 4 }}
                  className="bg-white/5 border border-white/10 p-6 rounded-2xl text-left hover:border-accent/40 hover:bg-white/10 transition-colors duration-300 relative group cursor-default"
                >
                  <motion.span
                    className="text-accent font-black text-sm block mb-1"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 + 0.15 }}
                  >
                    {item.id}
                  </motion.span>
                  <h3 className="text-white font-bold text-lg mb-1 group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-white/60 text-xs leading-relaxed">
                    {item.desc}
                  </p>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-px bg-accent group-hover:w-6 transition-all duration-300" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* TAMPILAN MOBILE & TABLET (RESPONSIF - LOGO DI ATAS, MAKNA VERTIKAL) */}
          <div className="flex lg:hidden flex-col gap-12">
            {/* Logo Mobile */}
            <div className="flex justify-center">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
                className="w-56 h-56 rounded-full bg-white/5 border border-white/10 p-6 backdrop-blur-md flex items-center justify-center shadow-xl relative"
              >
                <div className="absolute -inset-4 border border-dashed border-accent/20 rounded-full animate-[spin_20s_linear_infinite]"></div>
                <div className="absolute inset-2 rounded-full bg-accent/10 blur-xl animate-pulse-slow" />
                <img
                  src={HimsikaLogo}
                  alt="Logo HIMSIKA"
                  className="w-full h-full object-contain relative z-10"
                />
              </motion.div>
            </div>

            {/* List Makna Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {himsikaMeanings.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (idx % 2) * 0.08 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/5 border border-white/10 p-6 rounded-2xl flex gap-4 items-start hover:border-accent/40 hover:bg-white/10 transition-colors duration-300"
                >
                  <span className="text-accent font-black font-mono text-lg leading-none pt-1">
                    {item.id}.
                  </span>
                  <div>
                    <h3 className="text-white font-bold text-base mb-1">
                      {item.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= LOGO AKSARA CAKRA SECTION (BALANCED STYLE) ================= */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-[2.5rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 overflow-hidden"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>

          {/* Pita marquee diagonal dekoratif */}
          <div className="absolute -left-16 top-8 -rotate-6 w-[140%] opacity-40 pointer-events-none">
            <Marquee reverse className="border-y border-accent/20 py-1.5" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 p-6 sm:p-12 lg:p-16 items-center relative z-10">
            {/* Kiri (Filosofi Aksara) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-4 space-y-4 text-center lg:text-right order-2 lg:order-1"
            >
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                className="inline-flex p-3 rounded-2xl bg-white/5 border border-white/10 text-accent mb-2"
              >
                <Hexagon className="w-6 h-6" />
              </motion.div>
              <h3 className="text-2xl font-black text-white tracking-wider">
                AKSARA
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Memiliki arti ilmu, catatan, dan pengetahuan kuat yang akan
                abadi, diwariskan terus-menerus, dan tidak akan pernah hilang
                ditelan waktu.
              </p>
            </motion.div>

            {/* Tengah (Logo Kabinet Zentris) */}
            <div className="lg:col-span-4 flex flex-col items-center order-1 lg:order-2">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center mb-4">
                <div className="absolute inset-0 border border-dashed border-white/10 rounded-full animate-[spin_25s_linear_infinite]"></div>
                <div className="absolute -inset-3 border border-dotted border-accent/20 rounded-full animate-[spin_35s_linear_infinite_reverse]"></div>
                <motion.img
                  src={AksaraCakraLogo}
                  alt="Logo Kabinet Aksara Cakra"
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 4.5,
                    ease: "easeInOut",
                  }}
                  whileHover={{ scale: 1.06 }}
                  className="w-[80%] h-[80%] object-contain drop-shadow-[0_0_25px_rgba(255,195,0,0.25)]"
                />
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-1">
                  Nama Kabinet
                </p>
                <h4 className="text-white font-extrabold text-lg tracking-wide">
                  Aksara Cakra
                </h4>
              </motion.div>
            </div>

            {/* Kanan (Filosofi Cakra) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-4 space-y-4 text-center lg:text-left order-3"
            >
              <motion.div
                whileHover={{ rotate: -15, scale: 1.1 }}
                className="inline-flex p-3 rounded-2xl bg-white/5 border border-white/10 text-accent mb-2"
              >
                <Compass className="w-6 h-6" />
              </motion.div>
              <h3 className="text-2xl font-black text-white tracking-wider">
                CAKRA
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Dinamai sebagai roda pergerakan atau poros utama organisasi yang
                teratur, berputar stabil, kuat, dan berjalan secara
                berkesinambungan.
              </p>
            </motion.div>
          </div>
        </motion.section>
      </div>

      {/* ================= KEYFRAMES TAMBAHAN ================= */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        .animate-marquee {
          animation: marquee 28s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 32s linear infinite;
        }
        @keyframes shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
        @keyframes pulseSlow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .animate-pulse-slow {
          animation: pulseSlow 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
