import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ExternalLink } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import Reveal from "../../components/Reveal";
import pengurus from "../../data/pengurusData";

function InstagramIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// Halaman Struktur Organisasi.
// Sumber isi: Data kepengurusan HIMSIKA periode 2025-2026.

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
  const [selectedMember, setSelectedMember] = useState(null);

  // Keyboard shortcut ESC untuk menutup modal & cegah background scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedMember(null);
    };

    if (selectedMember) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedMember]);

  const tampil =
    aktif === "semua" ? pengurus : pengurus.filter((p) => p.kelompok === aktif);

  const getNamaKelompok = (id) => {
    const found = KELOMPOK.find((k) => k.id === id);
    return found ? found.label : "Anggota HIMSIKA";
  };

  const getInstagramUrl = (member) => {
    if (member?.instagram) {
      if (member.instagram.startsWith("http")) return member.instagram;
      return `https://instagram.com/${member.instagram.replace(/^@/, "")}`;
    }
    return "https://instagram.com/himsika.unsika";
  };

  const getLinkedinUrl = (member) => {
    if (member?.linkedin) {
      if (member.linkedin.startsWith("http")) return member.linkedin;
      return `https://linkedin.com/in/${member.linkedin}`;
    }
    return `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(
      member?.nama ? member.nama + " HIMSIKA" : "HIMSIKA UNSIKA"
    )}`;
  };

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
                  className={`px-4 py-2.5 min-h-[44px] text-sm font-semibold rounded-lg border transition-colors cursor-pointer ${
                    dipilih
                      ? "bg-accent border-accent text-accent-foreground"
                      : "bg-surface/50 border-border text-white/70 hover:text-white hover:border-white/30"
                  }`}
                >
                  {k.label}
                  <span
                    className={`ml-2 text-xs ${
                      dipilih ? "text-accent-foreground/70" : "text-white/60"
                    }`}
                  >
                    {jumlah}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Grid pengurus asli (seperti awal) */}
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
                <figure
                  onClick={() => setSelectedMember(p)}
                  className="group h-full rounded-2xl overflow-hidden bg-card border border-border hover:border-accent/50 transition-colors cursor-pointer text-left flex flex-col"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-surface">
                    <img
                      src={p.foto}
                      alt={`${p.nama}, ${p.jabatan}`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                  <figcaption className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-sm font-bold text-white leading-snug">
                        {p.nama}
                      </p>
                      <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-accent leading-snug">
                        {p.jabatan}
                      </p>
                    </div>
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

      {/* POPUP MODAL DETAIL PENGURUS & MEDIA SOSIAL */}
      <AnimatePresence>
        {selectedMember && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="member-modal-title"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />

            {/* Popup Card: disesuaikan dengan rasio foto asli 4:5 tanpa memotong gambar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 16 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative w-full max-w-[340px] sm:max-w-[360px] bg-card border border-border rounded-2xl overflow-hidden shadow-2xl z-10 max-h-[92vh] overflow-y-auto"
            >
              {/* Tombol Tutup */}
              <button
                onClick={() => setSelectedMember(null)}
                type="button"
                aria-label="Tutup popup profil"
                className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white/80 hover:text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow-md"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Foto Pengurus: Rasio asli 4:5, foto full utuh tanpa terpotong */}
              <div className="relative aspect-[4/5] w-full bg-surface overflow-hidden">
                <img
                  src={selectedMember.foto}
                  alt={selectedMember.nama}
                  className="w-full h-full object-cover block"
                />
              </div>

              {/* Data Diri & Media Sosial: berada di bawah foto, tidak menutupi gambar */}
              <div className="p-5">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-accent/15 border border-accent/40 text-accent text-[11px] font-bold uppercase tracking-wider">
                    {selectedMember.jabatan}
                  </span>
                  <span className="text-[11px] text-white/60 font-medium">
                    {getNamaKelompok(selectedMember.kelompok)}
                  </span>
                </div>

                <h3
                  id="member-modal-title"
                  className="text-lg sm:text-xl font-bold text-white leading-tight"
                >
                  {selectedMember.nama}
                </h3>

                {/* Info Angkatan & Program Studi */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-accent/15 border border-accent/30 text-accent text-[11px] font-bold">
                    Angkatan {selectedMember.angkatan || (selectedMember.jabatan?.includes("ANGGOTA") ? "2024" : "2023")}
                  </span>
                  <span className="text-[11px] text-white/50">
                    S1 Sistem Informasi
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-accent mb-3 flex items-center justify-between">
                    <span>Tautan Media Sosial</span>
                    <span className="text-[10px] text-white/40 normal-case">
                      Klik untuk mengunjungi
                    </span>
                  </p>

                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Instagram */}
                    {selectedMember.instagram ? (
                      <a
                        href={getInstagramUrl(selectedMember)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Buka Instagram ${selectedMember.nama}`}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-surface/80 hover:bg-surface border border-border hover:border-pink-500/50 text-white text-xs font-semibold transition-all group"
                      >
                        <InstagramIcon className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
                        <span>Instagram</span>
                        <ExternalLink className="w-3 h-3 text-white/40 group-hover:text-white" />
                      </a>
                    ) : (
                      <div
                        className="relative group/tooltip flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-surface/30 border border-white/5 text-white/35 text-xs font-medium cursor-not-allowed select-none"
                        title="Belum dicantumkan"
                      >
                        <InstagramIcon className="w-4 h-4 text-white/25" />
                        <span>Instagram</span>
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-black/90 border border-white/20 text-[10px] text-white/90 whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none shadow-lg z-40">
                          Belum dicantumkan
                        </span>
                      </div>
                    )}

                    {/* LinkedIn */}
                    {selectedMember.linkedin ? (
                      <a
                        href={getLinkedinUrl(selectedMember)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Buka LinkedIn ${selectedMember.nama}`}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-surface/80 hover:bg-surface border border-border hover:border-blue-500/50 text-white text-xs font-semibold transition-all group"
                      >
                        <LinkedinIcon className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                        <span>LinkedIn</span>
                        <ExternalLink className="w-3 h-3 text-white/40 group-hover:text-white" />
                      </a>
                    ) : (
                      <div
                        className="relative group/tooltip flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-surface/30 border border-white/5 text-white/35 text-xs font-medium cursor-not-allowed select-none"
                        title="Belum dicantumkan"
                      >
                        <LinkedinIcon className="w-4 h-4 text-white/25" />
                        <span>LinkedIn</span>
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-black/90 border border-white/20 text-[10px] text-white/90 whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none shadow-lg z-40">
                          Belum dicantumkan
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
