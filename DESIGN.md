# DESIGN.md — HIMSIKA UNSIKA

Arah desain untuk situs Himpunan Mahasiswa Sistem Informasi, Universitas Singaperbangsa Karawang.
Dokumen ini sumber kebenaran (R-37): setiap keputusan visual di halaman baru harus bisa dirujuk ke sini.

## Identitas

HIMSIKA adalah himpunan mahasiswa program studi Sistem Informasi. Audiensnya mahasiswa,
calon mahasiswa, alumni, dan mitra kampus. Nada yang dituju: **rapi, hangat, dan dapat dipercaya** —
organisasi kampus yang serius mengelola program kerja, bukan startup teknologi.

Kesan yang salah dan harus dihindari: "landing page produk SaaS". Situs ini arsip kegiatan
dan struktur organisasi; isinya yang berbicara, bukan efeknya.

## Dial

| Dial | Nilai | Alasan |
|---|---|---|
| **ENERGY** | 2 | Organisasi kampus. Tenang dan terbaca, bukan panggung. |
| **RHYTHM** | 2 | Bagian punya bobot berbeda: hero ringkas, timeline panjang, galeri padat. Tidak seragam, tidak acak. |
| **MOTION** | 2 | Muncul saat masuk viewport + satu lightbox. Tidak ada animasi berulang tanpa henti. |

## Palet

Identitas diambil dari warna resmi HIMSIKA (biru tua + emas). Palet lama punya **15 biru
yang saling bertumpuk** — banyak di antaranya tak bisa dibedakan mata. Dirapikan jadi 7 langkah
bermakna, masing-masing punya satu tugas.

| Token | Nilai | Tugas |
|---|---|---|
| `--color-base` | `#043761` | Latar halaman. (Sebelumnya di-hardcode 104×.) |
| `--color-deep` | `#02182b` | Bagian paling gelap / footer. |
| `--color-surface` | `#001f54` | Panel sekunder. |
| `--color-card` | `#073969` | Kartu. |
| `--color-primary` | `#034078` | Aksi utama, header. |
| `--color-border` | `#163b70` | Garis pemisah. |
| `--color-accent` | `#ffc300` | **Satu** aksen. Dipakai hemat: penanda aktif, satu CTA utama, satu sorotan per layar. |

Status: `--color-success #22c55e`, `--color-danger #ef4444`, `--color-info #3b82f6`.

Warna Tailwind bawaan yang bocor (`slate-900` 85×, `blue-400/500`, `red-400/500`, `gray-*`,
`yellow-*`) **tidak dipakai lagi** di halaman baru. Semua mengacu ke token di atas.

Kontras: aksen `#ffc300` di latar `#043761` = **7.57:1** (lolos WCAG AA untuk teks normal).

## Tipografi

`Plus Jakarta Sans` (sudah dipakai proyek). Satu keluarga, bobot yang membedakan hierarki:
`font-black` untuk judul halaman, `font-bold` untuk nama, `font-medium` untuk label.
Tidak ada font kedua, tidak ada huruf mono sebagai hiasan.

## Gerak (Motion)

Aturan: setiap gerakan punya alasan tertulis, tidak ada yang berjalan terus-menerus.

| Gerakan | Alasan |
|---|---|
| Muncul saat masuk viewport (fade + geser 20px, sekali) | Menuntun mata saat menggulir; berhenti setelah tampil. |
| Hover naik 4px pada kartu | Menandai elemen yang bisa diklik. |
| Lightbox galeri | Melihat foto ukuran penuh. Ini satu-satunya lapisan mengambang. |
| Transisi buka/tutup (drawer, akordeon) | Menjelaskan dari mana panel datang. |

Yang **tidak** dipakai: animasi berulang tanpa henti (pulse, float, spin), efek masuk
bertumpuk pada satu elemen, dan glow di mana-mana.

## Batas Dosis (R-10 s/d R-13)

- **Glass** (backdrop-blur): maksimal 2 permukaan — navbar dan satu panel. Sisanya solid.
- **Glow**: maksimal 1 elemen per layar.
- **Radius**: skala tetap — `rounded-lg` (kontrol kecil), `rounded-2xl` (kartu), `rounded-3xl` (panel besar). Tidak semua jadi pill.
- **Shadow**: hanya untuk yang benar-benar terangkat (lightbox, dropdown). Kartu diam di bidangnya.

## Isi

Semua teks dan foto di halaman Sejarah, Visi Misi, Struktur Organisasi, dan Galeri
diambil dari situs resmi `himsika.unsika.ac.id` — bukan karangan. Foto pengurus dan
dokumentasi kegiatan memang milik HIMSIKA. Nama, jabatan, dan tahun kabinet tidak diubah.
