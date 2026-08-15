import React from "react";
import { motion } from "motion/react";
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
} from "lucide-react";

// --- SILAKAN IMPORT GAMBAR ASLI KAMU DI SINI ---
import Dilan from "../../assets/images/pengurus/Dilan.webp";
// import FotoKegiatan1 from "../assets/images/isct/1.jpg";
// import FotoKegiatan2 from "../assets/images/isct/2.jpg";
// import FotoKegiatan3 from "../assets/images/isct/3.jpg";

// Data Timeline ISCT
const timelineData = [
  {
    date: "10 September 2026",
    title: "Open Registration",
    desc: "Pendaftaran peserta turnamen resmi dibuka untuk seluruh mahasiswa.",
    status: "Done",
  },
  {
    date: "25 September 2026",
    title: "Technical Meeting",
    desc: "Penjelasan rules, pembagian bracket, dan tata tertib turnamen.",
    status: "Done",
  },
  {
    date: "01 Oktober 2026",
    title: "Opening & Match Day 1",
    desc: "Upacara pembukaan dilanjutkan dengan babak penyisihan pertama.",
    status: "Active",
  },
  {
    date: "05 Oktober 2026",
    title: "Grand Final & Awarding",
    desc: "Pertandingan puncak penentuan juara dan penyerahan hadiah.",
    status: "Upcoming",
  },
];

// Data Capaian Kegiatan
const achievementsData = [
  {
    id: 1,
    icon: Users,
    title: "Partisipasi Masif",
    desc: "Diikuti oleh lebih dari 50+ tim dari berbagai angkatan dan program studi, menciptakan atmosfer kompetitif yang sehat.",
    tag: "Antusiasme",
  },
  {
    id: 2,
    icon: Swords,
    title: "Sportivitas Tinggi",
    desc: "Seluruh pertandingan berjalan dengan fair play dan menjunjung tinggi nilai persaudaraan antar mahasiswa.",
    tag: "Fair Play",
  },
  {
    id: 3,
    icon: Medal,
    title: "Regenerasi Atlet E-Sports",
    desc: "Berhasil menjaring bakat-bakat baru yang berpotensi mewakili universitas di kancah turnamen nasional.",
    tag: "Bakat",
  },
];

export default function ISCTPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#043761] via-primary to-[#043761] font-primary pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-accent selection:text-slate-900">
      {/* Background Dekorasi Konsisten */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="absolute w-[40rem] h-[40rem] rounded-full blur-[150px] bg-accent/15 top-0 left-0 -translate-x-1/4 -translate-y-1/4 animate-pulse"></div>
        <div
          className="absolute w-[30rem] h-[30rem] rounded-full blur-[120px] bg-red-500/10 bottom-0 right-0 translate-x-1/3 translate-y-1/3 animate-pulse"
          style={{ animationDuration: "7s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-24 relative z-10">
        {/* ================= HERO & ABOUT SECTION ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Kiri: Deskripsi & Tombol Daftar */}
          <div className="lg:col-span-8 space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/20 text-accent text-xs font-bold uppercase tracking-widest backdrop-blur-sm shadow-[0_0_15px_rgba(255,195,0,0.15)]"
            >
              <Gamepad2 className="w-4 h-4 text-accent" />
              E-Sports & Tournament
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight"
            >
              Information System <br className="hidden lg:block" />
              Company Tour{" "}
              <span className="text-accent drop-shadow-[0_0_20px_rgba(255,195,0,0.3)]">
                (ISCT)
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/70 text-lg leading-relaxed max-w-3xl"
            >
              Information System Company Tour merupakan program kerja Divisi
              Relasi berupa kunjungan ke perusahaan-perusahaan yang bergerak di
              bidang sistem informasi.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              <Link
                to="/daftar-isct" // Ganti dengan link pendaftaran aslimu
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

          {/* Kanan: Profil Ketua Pelaksana */}
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
                  Dillan Gustav Alfaro
                </h3>
                <p className="text-sm text-white/50 font-medium">
                  Ketua Pelaksana ISCT 2026
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ================= GALERI KEGIATAN ================= */}
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
              Keseruan ISCT
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Foto 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="aspect-video rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-accent/50 group relative"
            >
              <div className="absolute inset-0 flex items-center justify-center text-white/30">
                Foto Kegiatan 1
              </div>
              {/* <img src={FotoKegiatan1} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> */}
            </motion.div>
            {/* Foto 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, delay: 0.1 }}
              className="aspect-video rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-accent/50 group relative"
            >
              <div className="absolute inset-0 flex items-center justify-center text-white/30">
                Foto Kegiatan 2
              </div>
              {/* <img src={FotoKegiatan2} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> */}
            </motion.div>
            {/* Foto 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, delay: 0.2 }}
              className="aspect-video rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-accent/50 group relative md:col-span-2 lg:col-span-1"
            >
              <div className="absolute inset-0 flex items-center justify-center text-white/30">
                Foto Kegiatan 3
              </div>
              {/* <img src={FotoKegiatan3} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> */}
            </motion.div>
          </div>
        </section>

        {/* ================= TIMELINE SECTION ================= */}
        <section id="timeline" className="space-y-16 pt-10">
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
              Timeline Turnamen
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

        {/* ================= CAPAIAN SECTION ================= */}
        <section className="space-y-16 pt-10">
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
              Capaian ISCT
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievementsData.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-accent/50 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_15px_30px_rgba(255,195,0,0.1)] group flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                  <div className="space-y-5 relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 group-hover:bg-accent group-hover:border-accent transition-all duration-300 shadow-inner">
                        <IconComponent className="w-7 h-7 text-white group-hover:text-primary transition-colors" />
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
      </div>
    </div>
  );
}
