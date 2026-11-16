import React, { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function EventGalleryModal({
  isOpen,
  currentIndex,
  images = [],
  category = "DOKUMENTASI",
  title = "Galeri Kegiatan",
  onClose,
  onNavigate,
}) {
  const handlePrev = useCallback(
    (e) => {
      if (e) e.stopPropagation();
      if (!images.length) return;
      const prevIdx = (currentIndex - 1 + images.length) % images.length;
      onNavigate(prevIdx);
    },
    [currentIndex, images.length, onNavigate]
  );

  const handleNext = useCallback(
    (e) => {
      if (e) e.stopPropagation();
      if (!images.length) return;
      const nextIdx = (currentIndex + 1) % images.length;
      onNavigate(nextIdx);
    },
    [currentIndex, images.length, onNavigate]
  );

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && images.length > 0 && currentIndex !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-[999999] bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 select-none"
        >
          {/* Header Atas: Tombol ESC Minimalis */}
          <div className="w-full flex justify-end items-center z-50">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 text-white/70 hover:text-white text-xs sm:text-sm font-semibold tracking-wider transition-colors cursor-pointer px-2.5 py-1.5 rounded-lg hover:bg-white/10"
              aria-label="Tutup popup (Esc)"
            >
              <X className="w-4 h-4" />
              <span>ESC</span>
            </button>
          </div>

          {/* Area Tengah: Foto & Navigasi Panah Kiri-Kanan */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-auto px-2 sm:px-12"
          >
            {/* Tombol Panah Kiri */}
            {images.length > 1 && (
              <button
                onClick={handlePrev}
                aria-label="Foto sebelumnya"
                className="absolute left-1 sm:left-4 z-50 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 border border-white/15 hover:border-white/40 text-white/80 hover:text-white hover:scale-110 active:scale-95 transition-all cursor-pointer backdrop-blur-sm shadow-xl"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Foto Utama */}
            <div className="relative max-w-full max-h-[70vh] sm:max-h-[75vh] flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={images[currentIndex]}
                  alt={`${title} - Foto ${currentIndex + 1}`}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="max-w-full h-auto max-h-[70vh] sm:max-h-[75vh] object-contain rounded-2xl sm:rounded-3xl shadow-2xl"
                />
              </AnimatePresence>
            </div>

            {/* Tombol Panah Kanan */}
            {images.length > 1 && (
              <button
                onClick={handleNext}
                aria-label="Foto berikutnya"
                className="absolute right-1 sm:right-4 z-50 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 border border-white/15 hover:border-white/40 text-white/80 hover:text-white hover:scale-110 active:scale-95 transition-all cursor-pointer backdrop-blur-sm shadow-xl"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bagian Bawah: Kategori Emas, Judul Kegiatan, dan Nomor Urut */}
          <div className="w-full text-center space-y-1 pb-2 z-50">
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-accent">
              {category}
            </p>
            <h4 className="text-sm sm:text-base font-bold text-white tracking-wide">
              {title}
            </h4>
            <p className="text-xs text-white/50 font-medium">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
