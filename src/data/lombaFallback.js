// Daftar cadangan Lomba & Beasiswa.
//
// Halaman /aas/lomba-beasiswa mengambil data dari tabel `lomba` di Supabase.
// Kalau tabel itu tidak bisa dihubungi, halaman memakai daftar di sini supaya
// isinya tetap terbaca.
//
// Bentuk data di sini disamakan dengan kolom tabel Supabase (snake_case), jadi
// komponen tidak perlu tahu asal datanya. Sumbernya src/data/lombaData.js.

import { LOMBA_DATA } from "./lombaData";

// Rapikan teks kontak: samakan semua jenis tanda hubung, buang emoji, tanda
// sambung tak terlihat, dan penanda bullet, lalu rapatkan spasi berlebih.
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}]/gu;
const SAMBUNG_TAK_TERLIHAT = /[\uFE0E\uFE0F\u200D]/g;

const rapikanTeks = (teks) =>
  String(teks)
    .normalize("NFKC")
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .replace(EMOJI, "")
    .replace(SAMBUNG_TAK_TERLIHAT, "")
    .replace(/^[•·\-\s]+/, "")
    .replace(/\s+/g, " ")
    .trim();

// Ambil nomor HP Indonesia dari sebuah teks kontak, lalu kembalikan dalam
// format lokal (08xx). Nomor rekening tidak ikut terbaca karena tidak diawali
// 0, 62, atau 8.
const ambilNomorHp = (teks) => {
  const rapat = teks.replace(/[\s\-().]/g, "");
  const cocok = rapat.match(/(?:\+?62|0)8\d{7,12}/);
  if (!cocok) return "";

  let digit = cocok[0].replace(/\D/g, "");
  if (digit.startsWith("62")) digit = "0" + digit.slice(2);
  else if (digit.startsWith("8")) digit = "0" + digit;
  return digit;
};

// Ambil nama narahubung. Nama paling sering ada di dalam tanda kurung
// ("Minvention (085168906745)"); kalau tidak ada, pakai teks sebelum titik dua.
const ambilNama = (teks) => {
  const dalamKurung = teks.match(/\(([^)]+)\)/);
  if (dalamKurung) {
    const nama = rapikanTeks(dalamKurung[1]);
    if (nama) return nama;
  }

  const sebelumTitikDua = rapikanTeks(teks.split(":")[0]);
  const labelUmum = /^(more information|contact person|cp|narahubung|admin|info)$/i;
  if (
    sebelumTitikDua &&
    !labelUmum.test(sebelumTitikDua) &&
    sebelumTitikDua.length <= 40
  ) {
    return sebelumTitikDua;
  }

  return "";
};

// Ubah daftar kontak teks bebas jadi bentuk yang dipakai komponen.
// Entri tanpa nomor HP tetap disimpan sebagai keterangan tanpa tombol WhatsApp.
const ubahKontak = (daftar) => {
  if (!Array.isArray(daftar)) return [];

  return daftar.map((baris) => {
    const teks = rapikanTeks(baris);
    const nomor = ambilNomorHp(teks);
    if (!nomor) return { name: teks, phone: "" };
    return { name: ambilNama(teks) || "Narahubung", phone: nomor };
  });
};

const keBentukTabel = (item) => ({
  id: item.id,
  title: item.title,
  organizer: item.organizer,
  categories: item.categories,
  deadline_pendaftaran: item.deadlinePendaftaran,
  deadline_pengumpulan: item.deadlinePengumpulan,
  benefit: item.benefitSummary,
  instagram_url: item.instagramUrl,
  registration_url: item.registrationUrl,
  guidebook_url: item.guidebookUrl,
  description: item.description,
  contacts: ubahKontak(item.contacts),
  deadline_timestamp: item.deadlineTimestamp,
});

export const LOMBA_CADANGAN = LOMBA_DATA.map(keBentukTabel);

export default LOMBA_CADANGAN;
