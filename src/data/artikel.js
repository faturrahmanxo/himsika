// Sesuaikan path import gambar dengan struktur foldermu
import ImageUtama from "../assets/images/artikel&berita/mc-fgd.jpeg";
import ImageFGD from "../assets/images/diskusi-fgd.jpeg";
import ImageFotbar from "../assets/images/fotbar-unpad.jpeg";
import ImageLain1 from "../assets/images/1.webp";
import ImageLain2 from "../assets/images/2.webp";

const artikelData = [
  {
    id: 1,
    title:
      'Pererat Hubungan dan Berbagi Inovasi, HIMSIKA UNSIKA Gelar Studi Banding "Make Connection × Standing" Bersama HIMATIF UNPAD',
    category: "Kegiatan",
    date: "09 Mei 2026",
    datetime: "2026-05-09",
    image: ImageUtama,
    excerpt:
      'HIMSIKA UNSIKA sukses menyelenggarakan kolaborasi "Make Connection × Standing" bersama HIMATIF UNPAD sebagai upaya mempererat relasi dan berbagi inspirasi.',
    content: [
      {
        type: "paragraph",
        // PENTING: Gunakan string biasa, HTML tag dimasukkan ke dalam kutip
        text: '<strong>JATINANGOR</strong>  — Dalam upaya memperluas cakrawala organisasi dan membangun jejaring akademis yang kuat, Himpunan Mahasiswa Sistem Informasi Universitas Singaperbangsa Karawang sukses menyelenggarakan salah satu program kerja unggulannya, "Make Connection × Standing". Pada kesempatan kali ini, kegiatan tersebut dilaksanakan melalui kolaborasi sinergis dengan program kerja milik Himpunan Mahasiswa Teknik Informatika (Himatif Unpad) yang bernama "Standing". Kolaborasi dua program kerja ini mengusung tajuk resmi "Make Connection × Standing" dengan tema kegiatan “Menjalin Relasi, Berbagi Inspirasi untuk Organisasi yang Berkualitas” dan berlangsung pada Sabtu, 9 Mei 2026.',
      },
      {
        type: "paragraph",
        text: "Bertempat di Gedung Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA) Unpad, Jatinangor, pertemuan antara dua himpunan berbasis teknologi informasi ini berlangsung dengan hangat, interaktif, dan penuh semangat kolaboratif.",
      },
      {
        type: "heading",
        text: "Sinergi Profil Organisasi dan Pertukaran Ide",
      },
      {
        type: "paragraph",
        text: `Rangkaian acara "Make Connection x Standing" diawali dengan sesi pembukaan formal yang kemudian dilanjutkan dengan pemaparan profil masing-masing himpunan. Melalui sesi ini, baik Himsika maupun Himatif berkesempatan untuk mengenalkan visi, misi, struktur kepengurusan, serta program kerja unggulan yang menjadi fokus utama dalam periode kepengurusan masing-masing. Pemaparan ini membuka ruang diskusi awal mengenai perbedaan dan persamaan tantangan struktural yang dihadapi oleh kedua himpunan tersebut.`,
      },
      {
        type: "image",
        image: ImageUtama,
        alt: "Foto bersama Ketua Pelaksana",
        caption:
          "[Gambar 1. Foto bersama Ketua Pelaksana Make Connection & Ketua Himatif]",
      },
      {
        type: "paragraph",
        text: "Setelah pengenalan struktural secara makro, agenda berlanjut ke inti kolaborasi, yaitu Focus Group Discussion (FGD). Dalam sesi FGD ini, para pengurus dari kedua himpunan dibagi ke dalam beberapa kelompok berdasarkan bidang kerja atau divisi yang setara (seperti divisi internal, eksternal, pengembangan sumber daya mahasiswa, hingga riset dan teknologi).",
      },
      {
        type: "paragraph",
        text: "<br />Sesi diskusi kelompok ini berlangsung interaktif, di mana masing-masing himpunan saling bertukar pikiran mengenai efektivitas program kerja, pengelolaan konflik internal, hingga strategi adaptasi organisasi mahasiswa di tengah perkembangan teknologi yang dinamis.",
      },
      {
        type: "image",
        image: ImageFGD,
        alt: "Suasana Diskusi FGD",
        caption:
          "Gambar 2. Sesi Focus Group Discussion (FGD) yang berlangsung interaktif",
      },
      {
        type: "heading",
        text: "Mempererat Keakraban di Kampus Jatinangor",
      },
      {
        type: "paragraph",
        text: "Setelah diskusi yang cukup mendalam dan produktif, rangkaian kegiatan ditutup dengan agenda yang lebih santai dan rekreatif, yaitu Campus Tour dimana kami mengelilingi kampus Unpad dipandu oleh teman-teman Himatif. Sembari menikmati suasana asri Jatinangor, momen ini dimanfaatkan oleh para peserta untuk saling berbincang secara informal, mempererat kedekatan personal, dan memperluas jaringan pertemanan antar-mahasiswa.",
      },
      {
        type: "paragraph",
        text: "<br />Kegiatan studi banding kolaboratif ini diakhiri dengan penyerahan plakat kenang-kenangan sebagai simbol dimulainya hubungan baik antara kedua belah pihak, diikuti dengan sesi foto bersama seluruh fungsionaris yang hadir.",
      },
      {
        type: "image",
        image: ImageFotbar,
        alt: "Sesi foto bersama",
        caption: "Gambar 3. Sesi foto bersama HIMSIKA UNSIKA × HIMATIF UNPAD",
      },
      {
        type: "paragraph",
        text: 'Melalui kolaborasi "Make Connection × Standing" ini, Himsika Unsika tidak hanya membawa pulang perspektif baru dalam pengelolaan organisasi, tetapi juga berhasil meletakkan batu pertama bagi potensi kolaborasi akademis maupun non-akademis dengan Himatif Unpad di masa yang akan datang.',
      },
    ],
  },
  {
    id: 2,
    title: "HIMSIKA Raih Juara 1 Lomba UI/UX Nasional 2026",
    category: "Berita",
    date: "10 Agustus 2026",
    datetime: "2026-08-10",
    image: ImageLain1,
    excerpt:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda, quod dicta saepe excepturi deserunt voluptate a porro, commodi dignissimos corporis officiis dolorum laboriosam libero. Laborum optio adipisci totam incidunt nemo!",
    content: [
      {
        type: "paragraph",
        text: "Isi lengkap dari artikel prestasi ini ada di sini...",
      },
    ],
  },
  {
    id: 3,
    title: "Suksesnya Acara Pelatihan Web Dasar 2026",
    category: "Kegiatan",
    date: "28 Juli 2026",
    datetime: "2026-07-28",
    author: "Divisi Pendidikan",
    image: ImageLain2,
    excerpt:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda, quod dicta saepe excepturi deserunt voluptate a porro, commodi dignissimos corporis officiis dolorum laboriosam libero. Laborum optio adipisci totam incidunt nemo!",
    content: [
      {
        type: "paragraph",
        text: "Isi lengkap dari berita pelatihan web dasar...",
      },
    ],
  },
  {
    id: 4,
    title: "Opini: Masa Depan AI dalam Dunia Perkuliahan",
    category: "Opini",
    date: "15 Juli 2026",
    datetime: "2026-07-15",
    image: ImageLain1,
    excerpt:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Assumenda, quod dicta saepe excepturi deserunt voluptate a porro, commodi dignissimos corporis officiis dolorum laboriosam libero. Laborum optio adipisci totam incidunt nemo!",
    content: [
      {
        type: "paragraph",
        text: "Isi lengkap opini AI...",
      },
    ],
  },
];

export default artikelData;
