import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import PageHeader from "../../components/PageHeader";
import Reveal from "../../components/Reveal";
import pengurus from "../../data/pengurusData";

// Halaman Struktur Organisasi.
// Sumber isi: himsika.unsika.ac.id/struktur-organisasi, nama, jabatan, dan foto
// pengurus diambil apa adanya (R-18: tidak ada orang atau jabatan karangan).
//
// Catatan: file ini sebelumnya rusak (isi hanya `<div></div>;` tanpa return)
// sehingga halaman tampil kosong. Sekarang diisi penuh.

const KELOMPOK = [
  { id: "semua", label: "Semua" },
  { id: "bph", label: "Badan Pengurus Harian" },
  { id: "kadiv", label: "Ketua Divisi" },
  { id: "internal", label: "Divisi Internal" },
  { id: "relasi", label: "Divisi Relasi" },
  { id: "kominfo", label: "Divisi Kominfo" },
  { id: "edukasi", label: "Divisi Edukasi" },
];

export default function StrukturOrganisasi() {
  const [aktif, setAktif] = useState("semua");

  const tampil =
    aktif === "semua" ? pengurus : pengurus.filter((p) => p.kelompok === aktif);

  return (
    <div className="min-h-screen bg-page font-primary text-white pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          judul="Struktur"
          sorot="Organisasi"
          deskripsi="Kepengurusan HIMSIKA periode 2025-2026, dari Badan Pengurus Harian hingga departemen."
        />

        {/* Filter: menyaring tampilan, bukan dekorasi (R-26) */}
        <Reveal>
          <div
            role="tablist"
            aria-label="Saring pengurus berdasarkan bagian"
            className="flex flex-wrap gap-2 pb-8"
          >
            {KELOMPOK.map((k) => {
              const jumlah =
                k.id === "semua"
                  ? pengurus.length
                  : pengurus.filter((p) => p.kelompok === k.id).length;
              const dipilih = aktif === k.id;
              return (
                <button
                  key={k.id}
                  role="tab"
                  aria-selected={dipilih}
                  onClick={() => setAktif(k.id)}
                  className={`px-4 py-2.5 min-h-[44px] text-sm font-semibold rounded-lg border transition-colors ${
                    dipilih
                      ? "bg-accent border-accent text-accent-foreground"
                      : "bg-surface/50 border-border text-white/70 hover:text-white hover:border-white/30"
                  }`}
                >
                  {k.label}
                  <span
                    className={`ml-2 text-xs ${dipilih ? "text-accent-foreground/70" : "text-white/60"}`}
                  >
                    {jumlah}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Grid pengurus */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={aktif}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5"
          >
            {tampil.map((p, i) => (
              <Reveal key={p.nama} delay={Math.min(i * 0.03, 0.3)}>
                <figure className="group h-full rounded-2xl overflow-hidden bg-card border border-border hover:border-accent/50 transition-colors">
                  <div className="aspect-[4/5] overflow-hidden bg-surface">
                    <img
                      src={p.foto}
                      alt={`${p.nama}, ${p.jabatan}`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                  <figcaption className="p-4">
                    <p className="text-sm font-bold text-white leading-snug">
                      {p.nama}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-accent leading-snug">
                      {p.jabatan}
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </motion.div>
        </AnimatePresence>

        <Reveal>
          <p className="mt-10 text-sm text-white/60">
            Menampilkan {tampil.length} dari {pengurus.length} pengurus.
          </p>
        </Reveal>
      </div>
    </div>
  );
}
