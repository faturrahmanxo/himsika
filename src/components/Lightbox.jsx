import { useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";

// Lightbox galeri: melihat satu foto ukuran penuh.
// Ini satu-satunya lapisan mengambang di halaman galeri (DESIGN.md).
// Alasan (R-19): membuka detail tanpa meninggalkan halaman.
export default function Lightbox({ foto, daftar, onClose, onPindah }) {
  const tutupRef = useRef(null);
  const panelRef = useRef(null);

  const pindah = useCallback(
    (arah) => {
      if (!daftar || daftar.length < 2) return;
      const idx = daftar.findIndex((f) => f.id === foto.id);
      if (idx < 0) return;
      const next = (idx + arah + daftar.length) % daftar.length;
      onPindah(daftar[next]);
    },
    [daftar, foto, onPindah],
  );

  // Kunci keyboard: Esc menutup, panah kiri/kanan pindah foto.
  // Fokus dikembalikan ke pemicu saat menutup agar alur keyboard tidak putus.
  useEffect(() => {
    const sebelumnya = document.activeElement;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") pindah(1);
      if (e.key === "ArrowLeft") pindah(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    tutupRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      if (sebelumnya instanceof HTMLElement) sebelumnya.focus();
    };
  }, [onClose, pindah]);

  // Tahan fokus di dalam lightbox selama terbuka.
  const onTab = (e) => {
    if (e.key !== "Tab" || !panelRef.current) return;
    const fokusable = panelRef.current.querySelectorAll(
      'button, [href], [tabindex]:not([tabindex="-1"])',
    );
    if (!fokusable.length) return;
    const pertama = fokusable[0];
    const terakhir = fokusable[fokusable.length - 1];
    if (e.shiftKey && document.activeElement === pertama) {
      e.preventDefault();
      terakhir.focus();
    } else if (!e.shiftKey && document.activeElement === terakhir) {
      e.preventDefault();
      pertama.focus();
    }
  };

  const idx = daftar ? daftar.findIndex((f) => f.id === foto.id) + 1 : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="dialog"
      aria-modal="true"
      aria-label={`Foto ${foto.album}`}
      className="fixed inset-0 z-[200] bg-deep/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        onKeyDown={onTab}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl"
      >
        {/* Tombol tutup: target 44px (R-03) */}
        <button
          ref={tutupRef}
          onClick={onClose}
          aria-label="Tutup foto"
          className="absolute -top-12 right-0 sm:-top-14 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <motion.img
          key={foto.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          src={foto.foto}
          alt={`Dokumentasi ${foto.album}`}
          className="w-full max-h-[75vh] object-contain rounded-2xl"
        />

        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-sm text-white/70">
            <span className="text-accent font-semibold">{foto.album}</span>
            {daftar && daftar.length > 1 && (
              <span className="text-white/60">
                {" "}
                · {idx} dari {daftar.length}
              </span>
            )}
          </p>

          {daftar && daftar.length > 1 && (
            <div className="flex gap-2">
              <button
                onClick={() => pindah(-1)}
                aria-label="Foto sebelumnya"
                className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => pindah(1)}
                aria-label="Foto berikutnya"
                className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
