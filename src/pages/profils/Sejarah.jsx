import { motion } from "motion/react";
import PageHeader from "../../components/PageHeader";
import Reveal from "../../components/Reveal";
import { sejarahSingkat, kabinet } from "../../data/profilData";

// Halaman Sejarah.
// Sumber isi: himsika.unsika.ac.id/sejarah, teks tidak diubah.
// Struktur: ringkasan berdampingan, lalu timeline kabinet (bukan grid kartu
// seragam) supaya urutan tahun terbaca sebagai satu garis waktu (RHYTHM 2).
export default function Sejarah() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#02182b] via-[#043761] to-[#02182b] font-primary text-white pb-24 relative overflow-hidden selection:bg-accent selection:text-[#02182b]">
      {/* Background Dekorasi Khas HIMSIKA */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff07_1px,transparent_1px),linear-gradient(to_bottom,#ffffff07_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_75%_50%_at_50%_20%,#000_70%,transparent_100%)]"></div>
        <div
          className="absolute w-[35rem] h-[35rem] rounded-full blur-[140px] bg-accent/10 -top-24 left-1/2 -translate-x-1/2 pointer-events-none animate-pulse"
          style={{ animationDuration: "8s" }}
        ></div>
        <div className="absolute w-[28rem] h-[28rem] rounded-full blur-[120px] bg-info/15 top-1/3 -right-24 pointer-events-none"></div>
        <div className="absolute w-[30rem] h-[30rem] rounded-full blur-[130px] bg-blue-500/10 bottom-10 -left-20 pointer-events-none"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <PageHeader
          judul="Sejarah"
          sorot="HIMSIKA"
          deskripsi="Perjalanan himpunan mahasiswa Sistem Informasi Universitas Singaperbangsa Karawang sejak 2020."
        />

        {/* Ringkasan: tahun berdiri sebagai penanda besar, paragraf di sebelahnya */}
        <section className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <Reveal className="lg:col-span-4">
            <div className="rounded-3xl bg-[#021f3f]/85 backdrop-blur-md border border-[#1b4e80] hover:border-accent/50 p-8 shadow-xl shadow-black/30 transition-all">
              <p className="text-xs font-bold tracking-widest uppercase text-white/60">
                Berdiri sejak
              </p>
              <p className="mt-2 text-3xl sm:text-4xl font-black text-accent leading-tight">
                {sejarahSingkat.didirikan}
              </p>
              <div className="mt-6 pt-6 border-t border-border space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-white/60">Kabinet</span>
                  <span className="text-2xl font-black text-white">6</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-white/60">Divisi</span>
                  <span className="text-2xl font-black text-white">4</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-white/60">Departemen</span>
                  <span className="text-2xl font-black text-white">8</span>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-8 space-y-5">
            <Reveal>
              <p className="text-lg sm:text-xl text-white/85 leading-relaxed">
                {sejarahSingkat.ringkas}
              </p>
            </Reveal>
            {sejarahSingkat.detail.map((p, i) => (
              <Reveal key={i} delay={0.05 * (i + 1)}>
                <p className="text-base text-white/60 leading-relaxed">{p}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Timeline kabinet */}
        <section className="mt-24">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Kabinet dari masa ke masa
            </h2>
            <p className="mt-3 text-white/60 max-w-2xl">
              Setiap tahun kepengurusan membawa nama kabinetnya sendiri.
            </p>
          </Reveal>

          <ol className="mt-10 relative">
            {/* Garis waktu: satu batang dengan gradasi halus */}
            <div className="absolute left-[15px] sm:left-[19px] top-2 bottom-2 w-[2px] bg-linear-to-b from-accent/80 via-white/20 to-accent" />
            {kabinet.map((k, i) => {
              const isAktif = i === kabinet.length - 1;
              return (
                <li key={k.nama} className="relative pl-12 sm:pl-16 pb-10 last:pb-0">
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.06, ease: "easeOut" }}
                    className={`absolute left-0 top-0 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all ${
                      isAktif
                        ? "bg-accent border-accent shadow-[0_0_20px_rgba(255,195,0,0.4)]"
                        : "bg-[#021f3f] border-[#1b4e80]"
                    }`}
                  >
                    <span
                      className={`text-xs font-bold ${
                        isAktif ? "text-[#02182b]" : "text-white/60"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </motion.span>

                  <Reveal delay={i * 0.04}>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-white">
                        {k.nama}
                      </h3>
                      <span className="text-sm font-semibold text-accent">
                        {k.tahun}
                      </span>
                      {isAktif && (
                        <span className="text-[11px] font-bold uppercase tracking-wider text-accent border border-accent/40 bg-accent/15 rounded-full px-2.5 py-0.5">
                          Menjabat
                        </span>
                      )}
                    </div>
                    {k.catatan && (
                      <p className="mt-1.5 text-sm text-white/60">{k.catatan}</p>
                    )}
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    </div>
  );
}
