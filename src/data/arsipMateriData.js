// Data halaman Arsip Materi AAS HIMSIKA.
// Sumber: folder Google Drive "Pengarsipan Materi" milik HIMSIKA, yang ditaut
// dari tombol Pengarsipan Materi di himsika.unsika.ac.id/aas.
// Struktur folder (semester dan angkatan) diambil apa adanya dari Drive.

export const CATATAN_AKSES = `Halo Semuanya,

Di dalam folder ini, terdapat dua subfolder berdasarkan angkatan:
1. Kurikulum Angkatan 23 & Sebelumnya
2. Kurikulum Angkatan 24

subfolder ini dipisahkan karena terdapat beberapa mata kuliah yang berbeda antara kedua angkatan. Meskipun ada mata kuliah yang sama, materi yang diberikan bisa saja berbeda, sehingga dibuat dua subfolder untuk menghindari kebingungan.

Silakan pelajari materi sesuai dengan mata kuliah yang diambil. Namun, jika ada mata kuliah yang sama dan ingin membandingkan materi dari kedua angkatan, silakan eksplorasi dengan bijak.

Selamat belajar.`;

const folder = (id) => `https://drive.google.com/drive/folders/${id}`;

export const ARSIP_MATERI = [
  {
    id: 1,
    semester: "Semester 1",
    url: folder("1_fJnIVbTYFkf0aUmZCfjn6sgaIOBm-c1"),
    angkatan: [
      {
        label: "Kurikulum Angkatan 23 & Sebelumnya",
        url: folder("1ip7QWZEk3pB-GLcatfsKKwlB_SUrVEf1"),
      },
      {
        label: "Kurikulum Angkatan 24",
        url: folder("1oY7cdiAJ5vTR3pQ9HhL9OxDVIM030O9h"),
      },
    ],
  },
  {
    id: 2,
    semester: "Semester 2",
    url: folder("1SPGkN99sWxcLUjtwyA8MMwswL_X4q9dH"),
    angkatan: [
      {
        label: "Kurikulum Angkatan 23 & Sebelumnya",
        url: folder("1v3LQvEnFis5fjVq--4NOCqGDVi2S9-MD"),
      },
      {
        label: "Kurikulum Angkatan 24",
        url: folder("1LQ2oov0A8dIygX7ts0OV1Er3f0T7YTLd"),
      },
    ],
  },
  {
    id: 3,
    semester: "Semester 3",
    url: folder("14had1sMGNKnUh9lv1Nf22U1vHMA-B_Wa"),
    angkatan: [
      {
        label: "Kurikulum Angkatan 23 & Sebelumnya",
        url: folder("1JRudnrazjq8s5DTxyGfI2sWqsZnlo13t"),
      },
      {
        label: "Kurikulum Angkatan 24",
        url: folder("1DSB_Qoe6TWsBqEod2R4DQ2qCU-2Vzstc"),
      },
    ],
  },
  {
    id: 4,
    semester: "Semester 4",
    url: folder("13ATlqnqbd7B2vpwB3tRgsKcErAUzVcfq"),
    angkatan: [
      {
        label: "Kurikulum Angkatan 23 & Sebelumnya",
        url: folder("1RTFHLt50FtHczK-UECvrtoZDrQ1lcnF6"),
      },
      {
        label: "Kurikulum Angkatan 24",
        url: folder("1co2tRiUhT7mzPHW9siDzfJnwYjWeyRtp"),
      },
    ],
  },
  {
    id: 5,
    semester: "Semester 5",
    url: folder("1YLZvrh5swX_mWtt75zCdwyJnqShLWfkk"),
    angkatan: [
      {
        label: "Kurikulum Angkatan 23 & Sebelumnya",
        url: folder("1MHUjFzYQ8ZVc-Ts1HY1A6kBcui8juHnW"),
      },
      {
        label: "Kurikulum Angkatan 24",
        url: folder("1NfrZn_dSSmoj51o6GLlfai-HJE64VMw8"),
      },
    ],
  },
];
