import React from "react";
import { motion } from "motion/react";
import {
  Calendar,
  Award,
  Sparkles,
  Users,
  BrainCircuit,
  Trophy,
  Flame,
  Network,
  GraduationCap,
  TrendingUp,
  CheckCircle2,
  Clock,
} from "lucide-react";

// Data Timeline Edufair 2026
const timelineData = [
  {
    date: "02 April 2026",
    title: "Open Regist Pameran",
    desc: "Pembukaan pendaftaran stan pameran inovasi dan karya teknologi mahasiswa.",
    status: "Done",
  },
  {
    date: "30 April 2026",
    title: "Close Regist Pameran",
    desc: "Batas akhir pendaftaran pameran karya dan inovasi.",
    status: "Done",
  },
  {
    date: "19 Mei 2026",
    title: "Open Regist Perlombaan",
    desc: "Pendaftaran resmi Silogy National Competition dibuka untuk SMA/SMK & Mahasiswa.",
    status: "Active",
  },
  {
    date: "23 Mei 2026",
    title: "Seminar & Workshop",
    desc: "Pelaksanaan Seminar Workshop Nasional Generative AI secara Hybrid.",
    status: "Upcoming",
  },
  {
    date: "23 Juni 2026",
    title: "Close Regist Lomba",
    desc: "Batas akhir pengumpulan karya dan pendaftaran lomba nasional.",
    status: "Upcoming",
  },
  {
    date: "07 Juli 2026",
    title: "Final Presentasi & Penilaian Lomba",
    desc: "Tahap finalisasi, presentasi di hadapan juri, dan pengumuman pemenang.",
    status: "Upcoming",
  },
];

// Data Pencapaian Edufair 2026
const achievementsData = [
  {
    id: 1,
    icon: Trophy,
    title: "Pelaksanaan Dua Event Besar Berjalan Sukses",
    desc: "Education Fair 2026 sukses menyelenggarakan Seminar Workshop Nasional dan Silogy National Competition 2026 dengan partisipasi ribuan peserta secara hybrid.",
    tag: "Event Utama",
  },
  {
    id: 2,
    icon: Users,
    title: "Hadirnya Pemateri Profesional dan Ahli",
    desc: "Keberlangsungan acara menghadirkan pakar AI untuk mendukung pengembangan wawasan dalam penggunaan generative AI khususnya dalam mendorong Inovasi Digital, serta mempersiapkan peserta menghadapi peluang dan tantangan era teknologi.",
    tag: "Narasumber",
  },
  {
    id: 3,
    icon: BrainCircuit,
    title: "Workshop Hands-On Generative AI",
    desc: "Peserta melakukan praktik langsung membangun model kecerdasan buatan seperti Chatbot sehingga meningkatkan skill teknis dan pemahaman algoritma AI.",
    tag: "Practicum",
  },
  {
    id: 4,
    icon: Sparkles,
    title: "Pameran Inovasi & Karya Mahasiswa",
    desc: "Pameran menampilkan karya, proyek, dan inovasi mahasiswa yang mencerminkan kemampuan serta kreativitas generasi muda di bidang teknologi.",
    tag: "Exhibition",
  },
  {
    id: 5,
    icon: Award,
    title: "Terselenggaranya Lomba Tingkat Nasional",
    desc: "Silogy National Competition menyediakan wadah kompetisi bagi siswa SMA/SMK dan mahasiswa dari berbagai daerah untuk berinovasi dan bersaing secara kreatif.",
    tag: "Kompetisi",
  },
  {
    id: 6,
    icon: Flame,
    title: "Antusiasme Tinggi dari Peserta",
    desc: "Tingkat partisipasi sangat aktif dalam seminar, workshop, pameran, dan lomba menunjukkan minat besar terhadap perkembangan teknologi dan Generative AI.",
    tag: "Partisipasi",
  },
  {
    id: 7,
    icon: Network,
    title: "Ruang Kolaborasi Akademik & Industri",
    desc: "Education Fair mempertemukan mahasiswa, dosen, praktisi industri, dan masyarakat sehingga membentuk jejaring kolaboratif yang kuat.",
    tag: "Networking",
  },
  {
    id: 8,
    icon: GraduationCap,
    title: "Komitmen HIMSIKA SDM Unggul",
    desc: "Kegiatan ini menjadi bukti kontribusi nyata HIMSIKA dalam meningkatkan kompetensi mahasiswa, mendorong kreativitas, dan memperkuat ekosistem pendidikan digital.",
    tag: "Kontribusi",
  },
  {
    id: 9,
    icon: TrendingUp,
    title: "Dampak Nyata bagi Peserta",
    desc: "Pengetahuan, keterampilan teknis, wawasan finansial, dan jaringan profesional peserta meningkat signifikan melalui seluruh rangkaian kegiatan Education Fair 2026.",
    tag: "Impact",
  },
];

export default function EdufairPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#043761] via-primary to-[#043761] font-primary pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-accent selection:text-slate-900">
      {/* Background Dekorasi Konsisten */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="absolute w-[40rem] h-[40rem] rounded-full blur-[150px] bg-accent/15 top-0 left-0 -translate-x-1/4 -translate-y-1/4 animate-pulse"></div>
        <div
          className="absolute w-[30rem] h-[30rem] rounded-full blur-[120px] bg-info/15 bottom-0 right-0 translate-x-1/3 translate-y-1/3 animate-pulse"
          style={{ animationDuration: "7s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-24 relative z-10">
        {/* ================= HERO & DEFINISI SECTION ================= */}
        <section className="text-center max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/20 text-accent text-xs font-bold uppercase tracking-widest backdrop-blur-sm shadow-[0_0_15px_rgba(255,195,0,0.15)]"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            Annual Big Event HIMSIKA
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white"
          >
            Education Fair{" "}
            <span className="text-accent drop-shadow-[0_0_20px_rgba(255,195,0,0.3)]">
              2026
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-8 sm:p-10 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-lg shadow-2xl text-left sm:text-justify text-white/80 leading-relaxed space-y-6 relative overflow-hidden group hover:border-accent/30 transition-colors duration-500"
          >
            {/* Aksen Garis Kiri Glow */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-2 h-8 bg-accent rounded-full inline-block shadow-[0_0_10px_rgba(255,195,0,0.5)]" />
              Apa itu Edufair 2026?
            </h2>
            <p className="text-base sm:text-lg">
              <strong className="text-accent">
                Education Fair (Edufair) 2026
              </strong>{" "}
              adalah program kerja tahunan bergengsi yang diselenggarakan oleh{" "}
              <strong className="text-white">
                Himpunan Mahasiswa Sistem Informasi (HIMSIKA)
              </strong>
              . Acara ini hadir sebagai wadah integratif skala nasional untuk
              memfasilitasi pengembangan wawasan, kreativitas, dan kompetensi
              digital masyarakat luas khususnya generasi muda.
            </p>
            <p className="text-base sm:text-lg">
              Mengusung tema utama seputar pemanfaatan{" "}
              <span className="text-accent font-semibold">Generative AI</span>{" "}
              dan inovasi bisnis digital, Edufair 2026 menggabungkan tiga pilar
              utama kegiatan:
              <span className="text-white font-semibold">
                {" "}
                Seminar & Workshop Nasional
              </span>
              ,
              <span className="text-white font-semibold">
                {" "}
                Silogy National Competition
              </span>
              , serta
              <span className="text-white font-semibold">
                {" "}
                Pameran Inovasi Teknologi
              </span>
              .
            </p>
          </motion.div>
        </section>

        {/* ================= TIMELINE SECTION ================= */}
        <section className="space-y-16">
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
            <p className="text-white/60 max-w-xl mx-auto text-sm sm:text-base">
              Rangkaian tanggal penting dan jadwal pelaksanaan Education Fair
              2026.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-0">
            {/* Garis Tengah Timeline */}
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
                    className={`relative flex flex-col sm:flex-row items-center ${
                      isEven ? "sm:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Icon Node */}
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

                    {/* Card Content */}
                    <div className="w-full sm:w-[calc(50%-3rem)] ml-14 sm:ml-0">
                      <div className="p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-accent/50 backdrop-blur-md transition-all duration-300 hover:shadow-[0_10px_30px_rgba(255,195,0,0.15)] group hover:-translate-y-1 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-3 py-1.5 text-xs font-bold rounded-lg bg-accent/20 text-accent border border-accent/30 tracking-wider">
                            {item.date}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                              item.status === "Done"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : item.status === "Active"
                                  ? "bg-accent/10 text-accent border-accent/20 animate-pulse"
                                  : "bg-white/5 text-white/40 border-white/10"
                            }`}
                          >
                            {item.status}
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

        {/* ================= PENCAPAIAN SECTION ================= */}
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
              <Award className="w-8 h-8 text-accent" />
              Pencapaian Edufair
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-sm sm:text-base">
              Berbagai capaian, dampak positif, serta keberhasilan yang diraih
              dalam penyelenggaraan Education Fair 2026.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievementsData.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-accent/50 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_15px_30px_rgba(255,195,0,0.1)] group flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Efek Glow Pojok Atas Kanan */}
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
                      <p className="text-sm text-white/70 leading-relaxed line-clamp-4">
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
