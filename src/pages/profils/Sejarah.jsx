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
    <div className="min-h-screen bg-page font-primary text-white pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          judul="Sejarah"
          sorot="HIMSIKA"
          deskripsi="Perjalanan himpunan mahasiswa Sistem Informasi Universitas Singaperbangsa Karawang sejak 2020."
        />

        {/* Ringkasan: tahun berdiri sebagai penanda besar, paragraf di sebelahnya */}
        <section className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <Reveal className="lg:col-span-4">
            <div className="rounded-3xl bg-card border border-border p-8">
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
            {/* Garis waktu: satu batang, bukan kartu berulang */}
            <div className="absolute left-[15px] sm:left-[19px] top-2 bottom-2 w-px bg-border" />
            {kabinet.map((k, i) => (
              <li key={k.nama} className="relative pl-12 sm:pl-16 pb-10 last:pb-0">
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.06, ease: "easeOut" }}
                  className={`absolute left-0 top-0 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 ${
                    i === kabinet.length - 1
                      ? "bg-accent border-accent"
                      : "bg-page border-border"
                  }`}
                >
                  <span
                    className={`text-xs font-bold ${
                      i === kabinet.length - 1 ? "text-accent-foreground" : "text-white/60"
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
                    {i === kabinet.length - 1 && (
                      <span className="text-[11px] font-bold uppercase tracking-wider text-white/60 border border-border rounded-full px-2.5 py-0.5">
                        Menjabat
                      </span>
                    )}
                  </div>
                  {k.catatan && (
                    <p className="mt-1.5 text-sm text-white/60">{k.catatan}</p>
                  )}
                </Reveal>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
