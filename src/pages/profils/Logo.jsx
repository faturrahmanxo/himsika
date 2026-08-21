import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Hexagon, Compass } from "lucide-react";

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

export default function LogoPage() {
  // Membagi makna menjadi sisi kiri dan kanan khusus untuk tampilan desktop radial
  const leftMeanings = himsikaMeanings.slice(0, 5);
  const rightMeanings = himsikaMeanings.slice(5, 9);

  return (
    <div className="min-h-screen bg-[#043761] font-primary pt-32 pb-24 relative overflow-x-hidden selection:bg-accent selection:text-[#043761]">
      {/* ================= BACKGROUND DEKORASI ================= */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]"></div>
        <div className="absolute w-[40rem] h-[40rem] rounded-full blur-[160px] bg-accent/10 top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
        {/* ================= HEADER SECTION ================= */}
        <section className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/20 text-accent text-xs font-bold tracking-widest uppercase backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4" />
            Identitas & Filosofi
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight"
          >
            Anatomi Makna <span className="text-accent">Logo</span>
          </motion.h1>
        </section>

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
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/5 border border-white/10 p-6 rounded-2xl text-right hover:border-accent/40 hover:bg-white/10 transition-all duration-300 relative group"
                >
                  <span className="text-accent font-black text-sm block mb-1">
                    {item.id}
                  </span>
                  <h3 className="text-white font-bold text-lg mb-1 group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-white/60 text-xs leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Tengah (Logo Utama Zentris + Orbit Ring) */}
            <div className="col-span-4 flex justify-center sticky top-40 h-fit">
              <div className="relative w-full max-w-[280px] aspect-square flex items-center justify-center">
                {/* Efek Lingkaran Jaringan/Orbit */}
                <div className="absolute inset-0 border border-white/5 rounded-full animate-[spin_30s_linear_infinite]"></div>
                <div className="absolute -inset-10 border border-dashed border-accent/20 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>

                {/* Container Logo Glow */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut",
                  }}
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
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/5 border border-white/10 p-6 rounded-2xl text-left hover:border-accent/40 hover:bg-white/10 transition-all duration-300 relative group"
                >
                  <span className="text-accent font-black text-sm block mb-1">
                    {item.id}
                  </span>
                  <h3 className="text-white font-bold text-lg mb-1 group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-white/60 text-xs leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* TAMPILAN MOBILE & TABLET (RESPONSIF - LOGO DI ATAS, MAKNA VERTIKAL) */}
          <div className="flex lg:hidden flex-col gap-12">
            {/* Logo Mobile */}
            <div className="flex justify-center">
              <div className="w-56 h-56 rounded-full bg-white/5 border border-white/10 p-6 backdrop-blur-md flex items-center justify-center shadow-xl relative">
                <div className="absolute -inset-4 border border-dashed border-accent/20 rounded-full animate-[spin_20s_linear_infinite]"></div>
                <img
                  src={HimsikaLogo}
                  alt="Logo HIMSIKA"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* List Makna Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {himsikaMeanings.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/5 border border-white/10 p-6 rounded-2xl flex gap-4 items-start"
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
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= LOGO AKSARA CAKRA SECTION (BALANCED STYLE) ================= */}
        <section className="relative rounded-[2.5rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 p-6 sm:p-12 lg:p-16 items-center relative z-10">
            {/* Kiri (Filosofi Aksara) */}
            <div className="lg:col-span-4 space-y-4 text-center lg:text-right order-2 lg:order-1">
              <div className="inline-flex p-3 rounded-2xl bg-white/5 border border-white/10 text-accent mb-2">
                <Hexagon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-wider">
                AKSARA
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Memiliki arti ilmu, catatan, dan pengetahuan kuat yang akan
                abadi, diwariskan terus-menerus, dan tidak akan pernah hilang
                ditelan waktu.
              </p>
            </div>

            {/* Tengah (Logo Kabinet Zentris) */}
            <div className="lg:col-span-4 flex flex-col items-center order-1 lg:order-2">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center mb-4">
                <div className="absolute inset-0 border border-dashed border-white/10 rounded-full animate-[spin_25s_linear_infinite]"></div>
                <img
                  src={AksaraCakraLogo}
                  alt="Logo Kabinet Aksara Cakra"
                  className="w-[80%] h-[80%] object-contain drop-shadow-[0_0_25px_rgba(255,195,0,0.25)]"
                />
              </div>
              <div className="text-center">
                <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-1">
                  Nama Kabinet
                </p>
                <h4 className="text-white font-extrabold text-lg tracking-wide">
                  Aksara Cakra
                </h4>
              </div>
            </div>

            {/* Kanan (Filosofi Cakra) */}
            <div className="lg:col-span-4 space-y-4 text-center lg:text-left order-3">
              <div className="inline-flex p-3 rounded-2xl bg-white/5 border border-white/10 text-accent mb-2">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-wider">
                CAKRA
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Dinamai sebagai roda pergerakan atau poros utama organisasi yang
                teratur, berputar stabil, kuat, dan berjalan secara
                berkesinambungan.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
