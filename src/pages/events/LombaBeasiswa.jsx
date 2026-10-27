import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";

import LogoAAS from "../../assets/logo/proker/AAS.png";
import supabase from "../../supabase-client";
import { LOMBA_CADANGAN } from "../../data/lombaFallback";

// Halaman Info Lomba & Beasiswa (portal AAS).
//
// Data: tabel `lomba` di Supabase. Fitur tetap sama seperti versi sebelumnya:
// cari, saring kategori, urutkan, lihat detail, salin link penyelenggara,
// dan kontak WhatsApp narahubung.
//
// Arah tampilan mengikuti DESIGN.md (ENERGY 2 / RHYTHM 2 / MOTION 2):
// - Permukaan solid, tanpa grid latar dan tanpa orb glow (R-07, R-10, R-13).
// - Satu aksen emas dipakai hemat: saring aktif, satu CTA, satu penanda deadline (R-29).
// - Bentuk daftar-indeks, bukan grid kartu seragam, supaya tenggat terbaca lebih dulu;
//   tenggat adalah kolom yang menentukan keputusan pengguna (R-05, R-14).
// - Detail dibuka sebagai panel samping agar arah datangnya jelas (R-19).
// - Ikon dilepas, label teks yang bekerja (R-04).

const SORT_OPTIONS = [
  { id: "furthest", label: "Deadline Terjauh" },
  { id: "nearest", label: "Deadline Terdekat" },
  { id: "az", label: "Abjad (A-Z)" },
];

// Ubah nomor telepon jadi tautan WhatsApp.
const formatWhatsAppLink = (phone) => {
  if (!phone) return "";
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.substring(1);
  }
  return `https://wa.me/${cleaned}`;
};

// Samakan bentuk kolom `categories` yang bisa berupa array atau string Postgres.
const parseCategories = (cat) => {
  if (Array.isArray(cat)) {
    return cat.map((c) => String(c).replace(/["']/g, "").trim()).filter(Boolean);
  }
  if (typeof cat === "string") {
    return cat
      .replace(/[{}]/g, "")
      .split(",")
      .map((c) => c.replace(/["']/g, "").trim())
      .filter(Boolean);
  }
  return [];
};

const TOMBOL =
  "inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-lg border text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-page";

export default function LombaBeasiswa() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState("furthest");
  const [selectedLomba, setSelectedLomba] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const [lombaData, setLombaData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sumberCadangan, setSumberCadangan] = useState(false);

  const closeRef = useRef(null);

  useEffect(() => {
    let masihDipakai = true;

    // Batas waktu: halaman tidak boleh menunggu database tanpa ujung. Kalau
    // database diam, daftar cadangan yang dipakai.
    const batasWaktu = new Promise((_, tolak) =>
      setTimeout(() => tolak(new Error("database tidak menjawab")), 2500),
    );

    async function fetchLombaFromSupabase() {
      try {
        setIsLoading(true);
        const permintaan = supabase
          .from("lomba")
          .select("*")
          .order("id", { ascending: false });

        const { data, error: err } = await Promise.race([permintaan, batasWaktu]);
        if (err) throw err;
        if (!masihDipakai) return;

        // Tabel kosong juga dianggap belum ada isinya, jadi pakai cadangan.
        if (!data || data.length === 0) {
          setLombaData(LOMBA_CADANGAN);
          setSumberCadangan(true);
          return;
        }

        setLombaData(data);
        setSumberCadangan(false);
      } catch {
        // Database tidak bisa dihubungi. Halaman tetap terisi dari daftar
        // cadangan yang tersimpan di dalam project.
        if (!masihDipakai) return;
        setLombaData(LOMBA_CADANGAN);
        setSumberCadangan(true);
      } finally {
        if (masihDipakai) setIsLoading(false);
      }
    }

    fetchLombaFromSupabase();
    return () => {
      masihDipakai = false;
    };
  }, []);

  // Panel detail: Escape menutup, gulir badan halaman dikunci selama terbuka,
  // fokus dipindah ke tombol tutup lalu dikembalikan saat panel ditutup (R-32).
  useEffect(() => {
    if (!selectedLomba) return;
    const sebelumnya = document.activeElement;
    const onKey = (e) => {
      if (e.key === "Escape") setSelectedLomba(null);
    };
    document.addEventListener("keydown", onKey);
    const overflowLama = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflowLama;
      if (sebelumnya instanceof HTMLElement) sebelumnya.focus();
    };
  }, [selectedLomba]);

  const processedData = useMemo(() => {
    const result = lombaData.filter((item) => {
      const itemCategories = parseCategories(item.categories);
      const matchCategory =
        selectedCategory === "Semua" ||
        itemCategories.some(
          (c) => c.toLowerCase() === selectedCategory.toLowerCase(),
        );
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        query === "" ||
        item.title?.toLowerCase().includes(query) ||
        item.organizer?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        itemCategories.some((c) => c.toLowerCase().includes(query));

      return matchCategory && matchSearch;
    });

    if (sortBy === "furthest") {
      result.sort(
        (a, b) => (b.deadline_timestamp || 0) - (a.deadline_timestamp || 0),
      );
    } else if (sortBy === "nearest") {
      result.sort(
        (a, b) => (a.deadline_timestamp || 0) - (b.deadline_timestamp || 0),
      );
    } else if (sortBy === "az") {
      result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    return result;
  }, [lombaData, searchQuery, selectedCategory, sortBy]);

  // Tombol saring disusun dari kategori yang benar-benar ada di data, diurutkan
  // dari yang paling banyak. Jadi tidak ada tombol yang membawa ke hasil kosong.
  const kategoriTersedia = useMemo(() => {
    const jumlah = new Map();
    for (const item of lombaData) {
      for (const kategori of parseCategories(item.categories)) {
        jumlah.set(kategori, (jumlah.get(kategori) || 0) + 1);
      }
    }
    return [
      "Semua",
      ...[...jumlah.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([nama]) => nama),
    ];
  }, [lombaData]);

  // Salin link media sosial / pendaftaran penyelenggara.
  const handleShare = (item) => {
    const socialLink = item.instagram_url || item.registration_url;
    if (socialLink && navigator.clipboard) {
      navigator.clipboard.writeText(socialLink);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      setCopiedId("kosong");
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const resetSaringan = () => {
    setSearchQuery("");
    setSelectedCategory("Semua");
  };

  // Penanda "terdekat" hanya bermakna saat daftar diurutkan menurut deadline terdekat.
  const idTerdekat =
    sortBy === "nearest" && processedData.length > 0
      ? processedData[0].id
      : null;

  return (
    <div className="min-h-screen bg-page font-primary text-white pb-24 selection:bg-accent selection:text-[#02182b]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Kepala halaman */}
        <header className="pt-32 pb-10 sm:pt-36 sm:pb-12">
          <Link
            to="/aas"
            className="text-sm font-semibold text-white/70 hover:text-accent transition-colors rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-page"
          >
            Kembali ke AAS
          </Link>

          <div className="mt-8 flex items-start gap-4 sm:gap-5">
            <img
              src={LogoAAS}
              alt="Logo AAS"
              className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-white object-contain p-1.5"
            />
            <div className="min-w-0">
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.05]">
                Info Lomba &amp; <span className="text-accent">Beasiswa</span>
              </h1>
              <p className="mt-4 text-base sm:text-lg text-white/70 leading-relaxed max-w-2xl">
                Kumpulan kompetisi dan beasiswa yang dikurasi divisi AAS
                HIMSIKA. Setiap entri memuat tenggat pendaftaran dan
                pengumpulan.
              </p>
            </div>
          </div>
        </header>

        {/* Perkakas: cari, urutkan, saring */}
        <section
          aria-label="Cari dan saring"
          className="border-y border-border py-5 sm:py-6"
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <label className="relative flex-1">
              <span className="sr-only">
                Cari lomba, penyelenggara, atau kategori
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari lomba, penyelenggara, atau kategori"
                className="w-full bg-deep border border-border rounded-lg pl-4 pr-11 py-3 text-sm sm:text-base text-white placeholder:text-white/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Bersihkan pencarian"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  &times;
                </button>
              )}
            </label>

            <label className="sm:w-56 shrink-0">
              <span className="sr-only">Urutkan</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ colorScheme: "dark" }}
                className="w-full bg-deep border border-border rounded-lg px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors cursor-pointer"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div
            role="tablist"
            aria-label="Saring berdasarkan kategori"
            className="mt-4 flex flex-wrap gap-2"
          >
            {kategoriTersedia.map((cat) => {
              const aktif = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={aktif}
                  onClick={() => setSelectedCategory(cat)}
                  className={`${TOMBOL} ${
                    aktif
                      ? "bg-accent border-accent text-accent-foreground"
                      : "bg-transparent border-border text-white/70 hover:text-white hover:border-white/30"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </section>

        {/* Jumlah hasil */}
        {!isLoading && (
          <p className="mt-6 text-sm text-white/60">
            Menampilkan{" "}
            <span className="font-bold text-white">
              {processedData.length}
            </span>{" "}
            dari {lombaData.length} info lomba
          </p>
        )}

        {/* Keadaan memuat */}
        {isLoading && (
          <div className="mt-6 border border-border rounded-2xl bg-card p-10 text-center">
            <p className="text-sm font-semibold text-white/70">
              Memuat data lomba...
            </p>
          </div>
        )}

        {/* Keterangan sumber data saat daftar online tidak terjangkau */}
        {!isLoading && sumberCadangan && lombaData.length > 0 && (
          <p className="mt-3 text-xs text-white/50">
            Daftar ini tersimpan di dalam website, bukan dari database online.
            Hubungi divisi AAS kalau ada info yang perlu diperbarui.
          </p>
        )}

        {/* Daftar entri */}
        {!isLoading && processedData.length > 0 && (
          <ul className="mt-6 grid gap-4">
            {processedData.map((item, idx) => {
              const itemCategories = parseCategories(item.categories);
              const terdekat = item.id === idTerdekat;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedLomba(item)}
                    aria-label={`Lihat detail ${item.title}`}
                    className={`group w-full text-left flex gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl bg-card border transition duration-200 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
                      terdekat
                        ? "border-accent/60"
                        : "border-white/12 hover:border-white/25"
                    }`}
                  >
                    <span className="w-7 sm:w-9 shrink-0 pt-1 text-sm font-black text-white/20 tabular-nums">
                      {String(idx + 1).padStart(2, "0")}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <h2 className="text-lg sm:text-xl font-bold leading-snug text-white group-hover:text-accent transition-colors">
                          {item.title}
                        </h2>
                        {terdekat && (
                          <span className="shrink-0 pt-1 text-[11px] font-bold uppercase tracking-wide text-accent">
                            Terdekat
                          </span>
                        )}
                      </div>

                      <p className="mt-1.5 text-sm text-white/65">
                        {item.organizer}
                      </p>

                      {itemCategories.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {itemCategories.map((c) => (
                            <span
                              key={c}
                              className="rounded-md bg-surface/50 border border-border/50 px-2.5 py-1 text-[11px] font-semibold text-white/70"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                        <div className="flex gap-2">
                          <span className="text-white/40">Pendaftaran</span>
                          <span className="font-semibold text-white/90">
                            {item.deadline_pendaftaran || "-"}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-white/40">Pengumpulan</span>
                          <span className="font-semibold text-white/90">
                            {item.deadline_pengumpulan || "-"}
                          </span>
                        </div>
                      </div>

                      {item.benefit && (
                        <p className="mt-3 text-xs text-white/65 line-clamp-2 leading-relaxed">
                          {item.benefit}
                        </p>
                      )}

                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                        Lihat detail
                        <svg
                          className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {/* Keadaan kosong: dibedakan antara belum ada data dan saringan tidak cocok */}
        {!isLoading && processedData.length === 0 && (
          <div className="mt-6 border border-border rounded-2xl bg-card p-10 sm:p-12 max-w-xl">
            {lombaData.length === 0 ? (
              <>
                <h2 className="text-lg font-bold text-white">
                  Belum ada info lomba
                </h2>
                <p className="mt-2 text-sm text-white/70">
                  Data akan muncul di sini setelah divisi AAS menambahkannya.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-white">
                  Tidak ada yang cocok
                </h2>
                <p className="mt-2 text-sm text-white/70">
                  Tidak ada entri untuk kata kunci atau kategori ini.
                </p>
                <button
                  type="button"
                  onClick={resetSaringan}
                  className={`${TOMBOL} mt-5 bg-accent border-accent text-accent-foreground hover:bg-accent-hover`}
                >
                  Tampilkan semua
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Panel detail */}
      <AnimatePresence>
        {selectedLomba && (
          <div className="fixed inset-0 z-[99]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedLomba(null)}
              className="absolute inset-0 bg-[#010e1a]/80"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={selectedLomba.title}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="absolute right-0 top-0 h-full w-full sm:max-w-xl bg-deep border-l border-border flex flex-col"
            >
              {/* Kepala panel */}
              <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-border shrink-0">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/50">
                    Detail
                  </p>
                  <h2 className="mt-1 text-lg sm:text-xl font-bold text-white leading-snug">
                    {selectedLomba.title}
                  </h2>
                  <p className="mt-1 text-sm text-white/60">
                    {selectedLomba.organizer}
                  </p>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setSelectedLomba(null)}
                  className="shrink-0 min-h-[44px] px-4 rounded-lg border border-border text-sm font-semibold text-white/80 hover:text-white hover:border-white/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  Tutup
                </button>
              </div>

              {/* Isi panel */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-8">
                {parseCategories(selectedLomba.categories).length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {parseCategories(selectedLomba.categories).map((c) => (
                      <span
                        key={c}
                        className="rounded-md border border-border px-2 py-0.5 text-[11px] font-semibold text-white/60"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="border border-border rounded-lg p-4">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">
                      Pendaftaran
                    </p>
                    <p className="mt-1 text-sm font-bold text-white">
                      {selectedLomba.deadline_pendaftaran || "-"}
                    </p>
                  </div>
                  <div className="border border-border rounded-lg p-4">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">
                      Pengumpulan
                    </p>
                    <p className="mt-1 text-sm font-bold text-white">
                      {selectedLomba.deadline_pengumpulan || "-"}
                    </p>
                  </div>
                </div>

                {selectedLomba.benefit && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-3">
                      Benefit
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed">
                      {selectedLomba.benefit}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-3">
                    Deskripsi &amp; informasi lengkap
                  </h3>
                  <div className="text-sm text-white/80 leading-relaxed whitespace-pre-line">
                    {selectedLomba.description
                      ? selectedLomba.description.replace(/\\n/g, "\n").trim()
                      : ""}
                  </div>
                </div>

                {selectedLomba.contacts && selectedLomba.contacts.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-3">
                      Narahubung
                    </h3>
                    <ul className="space-y-3">
                      {selectedLomba.contacts.map((contact, idx) => (
                        <li
                          key={idx}
                          className="border border-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <span className="text-sm font-semibold text-white/90">
                            {contact.phone
                              ? `${contact.name}: ${contact.phone}`
                              : contact.name}
                          </span>
                          {contact.phone && (
                            <a
                              href={formatWhatsAppLink(contact.phone)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${TOMBOL} border-success/40 text-success hover:bg-success hover:text-white self-start sm:self-auto`}
                            >
                              Chat WhatsApp
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Kaki panel: aksi */}
              <div className="p-5 sm:p-6 border-t border-border shrink-0 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  {selectedLomba.registration_url && (
                    <a
                      href={selectedLomba.registration_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${TOMBOL} flex-1 bg-accent border-accent text-accent-foreground hover:bg-accent-hover`}
                    >
                      Daftar sekarang
                    </a>
                  )}
                  {selectedLomba.guidebook_url && (
                    <a
                      href={selectedLomba.guidebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${TOMBOL} flex-1 border-border text-white/80 hover:text-white hover:border-white/30`}
                    >
                      Guidebook
                    </a>
                  )}
                  {selectedLomba.instagram_url && (
                    <a
                      href={selectedLomba.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${TOMBOL} flex-1 border-border text-white/80 hover:text-white hover:border-white/30`}
                    >
                      Instagram
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleShare(selectedLomba)}
                  className={`${TOMBOL} w-full border-border text-white/80 hover:text-white hover:border-white/30`}
                >
                  {copiedId === selectedLomba.id
                    ? "Link tersalin"
                    : copiedId === "kosong"
                      ? "Link belum tersedia"
                      : "Salin link penyelenggara"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
