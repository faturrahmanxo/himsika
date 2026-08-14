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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Background Glow Overlay */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto space-y-20">
        {/* ================= HERO & DEFINISI SECTION ================= */}
        <section className="text-center max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            Annual Big Event HIMSIKA
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-blue-400 bg-clip-text text-transparent"
          >
            Education Fair 2026
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-xl text-left sm:text-justify text-slate-300 leading-relaxed space-y-4"
          >
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-500 rounded-full inline-block" />
              Apa itu Edufair 2026?
            </h2>
            <p className="text-base sm:text-lg">
              <strong className="text-blue-400">Education Fair (Edufair) 2026</strong>{" "}
              adalah program kerja tahunan bergengsi yang diselenggarakan oleh{" "}
              <strong className="text-white">Himpunan Mahasiswa Sistem Informasi (HIMSIKA)</strong>. 
              Acara ini hadir sebagai wadah integratif skala nasional untuk memfasilitasi pengembangan wawasan,
              kreativitas, dan kompetensi digital masyarakat luas khususnya generasi muda.
            </p>
            <p className="text-base sm:text-lg">
              Mengusung tema utama seputar pemanfaatan <span className="text-indigo-400 font-semibold">Generative AI</span> dan inovasi bisnis digital,
              Edufair 2026 menggabungkan tiga pilar utama kegiatan: 
              <span className="text-slate-100 font-semibold"> Seminar & Workshop Nasional</span>, 
              <span className="text-slate-100 font-semibold"> Silogy National Competition</span>, serta 
              <span className="text-slate-100 font-semibold"> Pameran Inovasi Teknologi</span>.
            </p>
          </motion.div>
        </section>

        {/* ================= TIMELINE SECTION ================= */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-3">
              <Calendar className="w-8 h-8 text-blue-500" />
              Timeline Akademik & Kegiatan
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Rangkaian tanggal penting dan jadwal pelaksanaan Education Fair 2026.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto px-4">
            {/* Garis Tengah Timeline */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-slate-800 -translate-x-1/2 hidden sm:block" />
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-800 sm:hidden" />

            <div className="space-y-8">
              {timelineData.map((item, index) => {
                const isEven = index % 2 === 0;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`relative flex flex-col sm:flex-row items-center ${
                      isEven ? "sm:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Icon Node */}
                    <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 z-10 w-10 h-10 rounded-full bg-slate-900 border-2 border-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                      {item.status === "Done" ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Clock className="w-5 h-5 text-blue-400" />
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="w-full sm:w-[calc(50%-2.5rem)] ml-14 sm:ml-0">
                      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 shadow-lg group hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-3 py-1 text-xs font-semibold rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {item.date}
                          </span>
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded ${
                              item.status === "Done"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : item.status === "Active"
                                ? "bg-amber-500/10 text-amber-400"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-400 mt-1">
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
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-3">
              <Award className="w-8 h-8 text-indigo-500" />
              Pencapaian Edufair 2026
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Berbagai capaian, dampak positif, serta keberhasilan yang diraih dalam penyelenggaraan Education Fair 2026.
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
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900/80 transition-all duration-300 shadow-md group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-indigo-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <IconComponent className="w-6 h-6 text-indigo-400" />
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
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