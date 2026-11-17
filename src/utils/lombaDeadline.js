// Utilitas deteksi & penghitungan tenggat (deadline) lomba & beasiswa HIMSIKA.
// Digunakan oleh AdminDashboard dan LombaBeasiswa publik untuk mendeteksi
// dan secara otomatis menghapus/menyembunyikan kompetisi yang sudah lewat dari tanggal akhir.

const BULAN_MAP = {
  januari: 0,
  jan: 0,
  februari: 1,
  feb: 1,
  maret: 2,
  mar: 2,
  april: 3,
  apr: 3,
  mei: 4,
  may: 4,
  juni: 5,
  jun: 5,
  juli: 6,
  jul: 6,
  agustus: 7,
  ags: 7,
  agu: 7,
  aug: 7,
  september: 8,
  sep: 8,
  oktober: 9,
  okt: 9,
  oct: 9,
  november: 10,
  nov: 10,
  desember: 11,
  des: 11,
  dec: 11,
};

/**
 * Mengurai string tanggal bahasa Indonesia / ISO menjadi epoch timestamp (ms) pada akhir hari (23:59:59.999).
 * Mendukung tanggal tunggal maupun rentang tanggal (misal: "20 Juli - 12 September 2026").
 */
export function parseDeadlineDate(dateStr, fallbackYear = null) {
  if (!dateStr || typeof dateStr !== "string") return null;
  const clean = dateStr.trim();
  if (!clean) return null;

  // Format ISO YYYY-MM-DD
  const isoMatch = clean.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    const y = parseInt(isoMatch[1], 10);
    const m = parseInt(isoMatch[2], 10) - 1;
    const d = parseInt(isoMatch[3], 10);
    return new Date(y, m, d, 23, 59, 59, 999).getTime();
  }

  // Jika berupa rentang tanggal ("20 Juli - 12 September 2026" / "16 Juli–5 Agustus 2026"),
  // ambil bagian akhir (deadline akhir)
  const parts = clean.split(/[-–—]|sampai|s\/d|\bsd\b/i);
  const endPart = parts[parts.length - 1].trim();

  // Cari tahun 4 digit di akhir atau di string utama
  const yearMatch =
    endPart.match(/\b(20\d\d)\b/) || clean.match(/\b(20\d\d)\b/);
  const year = yearMatch
    ? parseInt(yearMatch[1], 10)
    : fallbackYear || new Date().getFullYear();

  // Cari nama bulan dari endPart atau seluruh clean string
  let month = null;
  for (const [namaBulan, idx] of Object.entries(BULAN_MAP)) {
    const regex = new RegExp(`\\b${namaBulan}\\b`, "i");
    if (regex.test(endPart) || regex.test(clean)) {
      month = idx;
      break;
    }
  }

  // Cari tanggal (1-31)
  const dayMatch = endPart.match(/\b([12]\d|3[01]|0?[1-9])\b/);
  const day = dayMatch ? parseInt(dayMatch[1], 10) : null;

  if (month !== null && day !== null) {
    return new Date(year, month, day, 23, 59, 59, 999).getTime();
  }

  // Coba parser bawaan JavaScript jika ada format standar lainnya
  const nativeParsed = Date.parse(clean);
  if (!isNaN(nativeParsed)) {
    const d = new Date(nativeParsed);
    d.setHours(23, 59, 59, 999);
    return d.getTime();
  }

  return null;
}

/**
 * Mengambil timestamp batas akhir final dari item lomba.
 * Mengutamakan deadline_pengumpulan (karena tahap akhir karya),
 * lalu fallback ke deadline_pendaftaran, lalu deadline_timestamp.
 */
export function getLombaFinalTimestamp(item) {
  if (!item) return null;

  // 1. Prioritaskan deadline pengumpulan jika diisi
  if (item.deadline_pengumpulan) {
    const ts = parseDeadlineDate(item.deadline_pengumpulan);
    if (ts) return ts;
  }

  // 2. Fallback ke deadline pendaftaran
  if (item.deadline_pendaftaran) {
    const ts = parseDeadlineDate(item.deadline_pendaftaran);
    if (ts) return ts;
  }

  // 3. Fallback ke field deadline_timestamp yang tersimpan
  if (item.deadline_timestamp && !isNaN(Number(item.deadline_timestamp))) {
    return Number(item.deadline_timestamp);
  }

  return null;
}

/**
 * Memeriksa apakah lomba sudah melewati akhir tanggal (expired).
 * Menghasilkan true jika deadline sudah lewat dari waktu saat ini.
 */
export function isLombaExpired(item) {
  const ts = getLombaFinalTimestamp(item);
  if (!ts) return false;
  return ts < Date.now();
}

