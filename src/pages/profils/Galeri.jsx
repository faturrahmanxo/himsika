import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ZoomIn } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import Reveal from "../../components/Reveal";
import EventGalleryModal from "../../components/EventGalleryModal";
import galeriDefault from "../../data/galeriData";
import supabase from "../../supabase-client";

// Halaman Galeri Kegiatan.
// Terintegrasi dengan database Supabase (tabel 'galeri') dengan fallback ke galeriDefault.

// Pre-sort default galeri secara descending berdasarkan ID agar selaras dengan Supabase sejak frame pertama
const sortedDefaultGaleri = [...galeriDefault].sort(
  (a, b) => Number(b.id) - Number(a.id),
);

export default function Galeri() {
  const [album, setAlbum] = useState("Semua");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [galeriList, setGaleriList] = useState(sortedDefaultGaleri);

  useEffect(() => {
    async function fetchGaleri() {
      try {
        const { data, error } = await supabase
          .from("galeri")
          .select("*")
          .order("id", { ascending: false });

        if (!error && data && data.length > 0) {
          const normalized = data.map((d) => {
            const fallback =
              galeriDefault.find((g) => String(g.id) === String(d.id)) ||
              galeriDefault[Number(d.id) - 1];
            return {
              ...d,
              foto: (d.foto && d.foto.trim()) ? d.foto.trim() : (fallback?.foto || ""),
              album: d.album || fallback?.album || "Kegiatan",
              albumSlug: d.album_slug || d.albumSlug || fallback?.albumSlug || "",
            };
          });

          // Cek kesamaan data: jika data sama persis, jangan picu re-render agar foto tidak berkedip
          setGaleriList((prev) => {
            const isSame =
              prev.length === normalized.length &&
              prev.every(
                (item, i) =>
                  String(item.id) === String(normalized[i].id) &&
                  item.foto === normalized[i].foto &&
                  item.album === normalized[i].album,
              );
            return isSame ? prev : normalized;
          });
        }
      } catch (err) {
        console.warn("Menggunakan data galeri lokal:", err.message);
      }
    }

    fetchGaleri();
  }, []);

  const albumList = useMemo(
    () => ["Semua", ...new Set(galeriList.map((g) => g.album))],
    [galeriList],
  );

  const tampil = useMemo(
    () =>
      album === "Semua"
        ? galeriList
        : galeriList.filter((g) => g.album === album),
    [album, galeriList],
  );

  return (
    <div className="relative min-h-screen bg-page font-primary text-white pb-24 overflow-x-clip selection:bg-accent selection:text-[#043761]">
      {/* Background Motif Identitas (Sama dengan halaman Logo) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]"></div>
        <div className="absolute left-1/2 top-1/4 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[160px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
                  ? galeriList.length
                  : galeriList.filter((g) => g.album === a).length;
              return (
                <button
                  key={a}
                  role="tab"
                  aria-selected={dipilih}
                  onClick={() => setAlbum(a)}
                  className={`px-4 py-2.5 min-h-[44px] text-sm font-semibold rounded-lg border transition-all cursor-pointer ${
                    dipilih
                      ? "bg-accent border-accent text-accent-foreground font-bold shadow-[0_0_15px_rgba(255,195,0,0.3)]"
                      : "bg-surface/50 border-border text-white/70 hover:text-white hover:border-accent/40"
                  }`}
                >
                  {a}
                  <span
                    className={`ml-2 text-xs ${
                      dipilih ? "text-[#02182b]/80 font-bold" : "text-white/60"
                    }`}
                  >
                    {jumlah}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Petak foto */}
        <AnimatePresence mode="wait">
          <motion.div
            key={album}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-[160px] sm:auto-rows-[200px]"
          >
            {tampil.map((g, i) => (
              <div
                key={g.id || i}
                className={`${
                  i % 7 === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1"
                } w-full h-full`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedIndex(i)}
                  aria-label={`Perbesar foto ${g.album}`}
                  className="group relative w-full h-full rounded-2xl overflow-hidden bg-card border border-border hover:border-accent/60 transition-all shadow-md shadow-black/20 cursor-pointer block text-left"
                >
                  <img
                    src={g.foto}
                    alt={`Dokumentasi ${g.album}`}
                    loading="lazy"
                    onError={(e) => {
                      const fallback = galeriDefault[i % galeriDefault.length]?.foto;
                      if (fallback && e.currentTarget.src !== fallback) {
                        e.currentTarget.src = fallback;
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay Kaca Pembesar */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center pointer-events-none">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs border border-white/30 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <ZoomIn className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  {/* Label Album di Bawah */}
                  <span className="absolute inset-x-0 bottom-0 p-3 bg-linear-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="text-xs font-semibold text-white">
                      {g.album}
                    </span>
                  </span>
                </button>
              </div>
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

      {/* ================= MODAL LIGHTBOX IDENTIK DENGAN EVENT ================= */}
      <EventGalleryModal
        isOpen={selectedIndex !== null}
        currentIndex={selectedIndex}
        images={tampil.map((g) => g.foto)}
        category={
          selectedIndex !== null && tampil[selectedIndex]?.album
            ? tampil[selectedIndex].album.toUpperCase()
            : album === "Semua"
            ? "DOKUMENTASI"
            : album.toUpperCase()
        }
        title={
          selectedIndex !== null && tampil[selectedIndex]?.album
            ? `Dokumentasi ${tampil[selectedIndex].album}`
            : "Galeri Kegiatan HIMSIKA"
        }
        onClose={() => setSelectedIndex(null)}
        onNavigate={(newIdx) => setSelectedIndex(newIdx)}
      />
    </div>
  );
}
