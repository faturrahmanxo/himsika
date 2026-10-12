import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import PageHeader from "../../components/PageHeader";
import Reveal from "../../components/Reveal";
import Lightbox from "../../components/Lightbox";
import galeri from "../../data/galeriData";

// Halaman Galeri Kegiatan.
// Sumber foto: himsika.unsika.ac.id/galeri, dokumentasi asli HIMSIKA.
// Album mengikuti pembagian divisi di situs resmi.
export default function Galeri() {
  const [album, setAlbum] = useState("Semua");
  const [terbuka, setTerbuka] = useState(null);

  const albumList = useMemo(
    () => ["Semua", ...new Set(galeri.map((g) => g.album))],
    [],
  );

  const tampil = useMemo(
    () => (album === "Semua" ? galeri : galeri.filter((g) => g.album === album)),
    [album],
  );

  return (
    <div className="min-h-screen bg-page font-primary text-white pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          judul="Galeri"
          sorot="Kegiatan"
          deskripsi="Dokumentasi kegiatan HIMSIKA, dikelompokkan menurut divisi penyelenggara."
        />

        {/* Album */}
        <Reveal>
          <div
            role="tablist"
            aria-label="Saring galeri berdasarkan album"
            className="flex flex-wrap gap-2 pb-8"
          >
            {albumList.map((a) => {
              const dipilih = album === a;
              const jumlah =
                a === "Semua"
                  ? galeri.length
                  : galeri.filter((g) => g.album === a).length;
              return (
                <button
                  key={a}
                  role="tab"
                  aria-selected={dipilih}
                  onClick={() => setAlbum(a)}
                  className={`px-4 py-2.5 min-h-[44px] text-sm font-semibold rounded-lg border transition-colors ${
                    dipilih
                      ? "bg-accent border-accent text-accent-foreground"
                      : "bg-surface/50 border-border text-white/70 hover:text-white hover:border-white/30"
                  }`}
                >
                  {a}
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

        {/* Petak foto. Foto lebar menonjol agar tidak semua sel sama (R-05). */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={album}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-[150px] sm:auto-rows-[190px]"
          >
            {tampil.map((g, i) => (
              <Reveal
                key={g.id}
                delay={Math.min(i * 0.02, 0.25)}
                className={i % 7 === 0 ? "col-span-2 row-span-2" : ""}
              >
                <button
                  onClick={() => setTerbuka(g)}
                  aria-label={`Perbesar foto ${g.album}`}
                  className="group relative w-full h-full rounded-2xl overflow-hidden bg-card border border-border hover:border-accent/50 transition-colors"
                >
                  <img
                    src={g.foto}
                    alt={`Dokumentasi ${g.album}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  />
                  <span className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-semibold text-white">
                      {g.album}
                    </span>
                  </span>
                </button>
              </Reveal>
            ))}
          </motion.div>
        </AnimatePresence>

        <Reveal>
          <p className="mt-10 text-sm text-white/60">
            {tampil.length} foto{album !== "Semua" ? ` · ${album}` : ""}. Klik
            foto untuk melihat ukuran penuh.
          </p>
        </Reveal>
      </div>

      <AnimatePresence>
        {terbuka && (
          <Lightbox
            foto={terbuka}
            daftar={tampil}
            onClose={() => setTerbuka(null)}
            onPindah={setTerbuka}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
