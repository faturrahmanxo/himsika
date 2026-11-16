import React from "react";
import EventGalleryModal from "./EventGalleryModal";

// Lightbox galeri wrapper: mengadopsi EventGalleryModal yang portaled ke document.body
// Memastikan Navbar dan Arrow to top berada di bawah modal, serta UI seragam dengan event pages.
export default function Lightbox({ foto, daftar = [], onClose, onPindah }) {
  if (!foto) return null;

  const currentIndex =
    daftar && daftar.length > 0
      ? daftar.findIndex((f) => String(f.id) === String(foto.id))
      : 0;

  const validIndex = currentIndex >= 0 ? currentIndex : 0;
  const currentItem = daftar && daftar[validIndex] ? daftar[validIndex] : foto;

  return (
    <EventGalleryModal
      isOpen={Boolean(foto)}
      currentIndex={validIndex}
      images={daftar.map((item) => item.foto || item.src || item)}
      category={
        currentItem?.album ? currentItem.album.toUpperCase() : "DOKUMENTASI"
      }
      title={
        currentItem?.album
          ? `Dokumentasi ${currentItem.album}`
          : "Galeri Kegiatan HIMSIKA"
      }
      onClose={onClose}
      onNavigate={(newIdx) => {
        if (daftar && daftar[newIdx] && onPindah) {
          onPindah(daftar[newIdx]);
        }
      }}
    />
  );
}
