import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Reveal from "../../components/Reveal";
import AasHeader from "../../components/AasHeader";
import { ARSIP_MATERI, CATATAN_AKSES } from "../../data/arsipMateriData";

// Halaman Arsip Materi (portal AAS).
//
// Sumber: folder Google Drive "Pengarsipan Materi" milik HIMSIKA, yang ditaut
// dari tombol Pengarsipan Materi di himsika.unsika.ac.id/aas. Berkas materinya
// ada di Drive, jadi halaman ini adalah pintu masuknya: satu tempat untuk
// membuka folder semester dan angkatan yang benar.
//
// Arah tampilan mengikuti DESIGN.md (ENERGY 2 / RHYTHM 2 / MOTION 2):
// - Bentuk daftar buka-tutup (akordeon), bukan petak kartu seragam. Isi tiap
//   semester berbeda (dua angkatan), jadi daftar bisa memuat jumlah yang
//   berbeda tanpa memaksa tinggi yang sama (R-05, R-14).
// - Tautan "Buka folder" adalah aksi utama; aksen emas hanya pada tautan
//   semester yang sedang dibuka (R-29).
export default function ArsipMateri() {
  const [terbuka, setTerbuka] = useState(ARSIP_MATERI[0]?.id ?? null);

  const toggle = (id) => setTerbuka((kini) => (kini === id ? null : id));

  return (
    <div className="min-h-screen bg-page font-primary text-white pb-24 selection:bg-accent selection:text-[#02182b]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AasHeader
          judul="Arsip"
          sorot="Materi"
          deskripsi="Kumpulan materi kuliah yang diarsipkan divisi AAS HIMSIKA, tersimpan di Google Drive."
        />

        {/* Catatan akses dari pengelola folder */}
        <Reveal>
          <section className="rounded-2xl bg-surface/50 border border-border p-5 sm:p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-accent">
              Sebelum membuka
            </h2>
            <p className="mt-3 text-sm text-white/75 leading-relaxed whitespace-pre-line">
              {CATATAN_AKSES}
            </p>
          </section>
        </Reveal>

        <Reveal>
          <p className="mt-8 text-sm text-white/60 max-w-2xl">
            Pilih semester, lalu pilih kurikulum sesuai angkatanmu. Setiap tautan
            membuka folder Drive di tab baru.
          </p>
        </Reveal>

        {/* Daftar semester */}
        <ul className="mt-6 grid gap-3">
          {ARSIP_MATERI.map((sem) => {
            const dibuka = terbuka === sem.id;
            return (
              <li key={sem.id}>
                <Reveal>
                  <div
                    className={`rounded-2xl bg-card border overflow-hidden transition-colors ${
                      dibuka ? "border-accent/60" : "border-white/12"
                    }`}
                  >
                    <div className="flex items-center gap-2 p-4 sm:p-5">
                      <button
                        type="button"
                        onClick={() => toggle(sem.id)}
                        aria-expanded={dibuka}
                        className="flex-1 flex items-center gap-3 text-left rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        <span
                          aria-hidden="true"
                          className={`flex items-center justify-center w-9 h-9 shrink-0 rounded-lg border text-sm font-black tabular-nums ${
                            dibuka
                              ? "bg-accent border-accent text-accent-foreground"
                              : "bg-surface/50 border-border text-white/60"
                          }`}
                        >
                          {sem.id}
                        </span>
                        <span className="text-lg font-bold text-white">
                          {sem.semester}
                        </span>
                        <svg
                          aria-hidden="true"
                          className={`ml-auto w-5 h-5 shrink-0 text-white/50 transition-transform ${
                            dibuka ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 9l6 6 6-6"
                          />
                        </svg>
                      </button>

                      <a
                        href={sem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 inline-flex items-center min-h-[44px] px-4 rounded-lg border border-border text-sm font-semibold text-white/80 hover:text-white hover:border-white/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        Buka folder
                      </a>
                    </div>

                    <AnimatePresence initial={false}>
                      {dibuka && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <ul className="px-4 sm:px-5 pb-4 sm:pb-5 grid gap-2 sm:grid-cols-2">
                            {sem.angkatan.map((ang) => (
                              <li key={ang.label}>
                                <a
                                  href={ang.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between gap-3 min-h-[44px] px-4 py-2.5 rounded-lg bg-deep border border-border text-sm font-semibold text-white/80 hover:text-white hover:border-white/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                                >
                                  <span>{ang.label}</span>
                                  <svg
                                    aria-hidden="true"
                                    className="w-4 h-4 shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M14 5h5v5M19 5l-8 8M12 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"
                                    />
                                  </svg>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
