// Data halaman Prestasi Mahasiswa AAS HIMSIKA.
// Sumber: himsika.unsika.ac.id/prestasi-mahasiswa-si.
// Peringkat, nama penerima, NIM, dan tautan Instagram diambil apa adanya dari
// situs resmi dan tidak diubah (DESIGN.md bagian "Isi"). Foto dokumentasi
// milik HIMSIKA, diunduh dari folder upload situs yang sama.

import zevgo from "../assets/images/prestasi/zevgo.jpg";
import genbi from "../assets/images/prestasi/genbi.jpg";
import iestf from "../assets/images/prestasi/iestf.jpg";
import agriculture from "../assets/images/prestasi/agriculture.jpg";
import compfairJuara1 from "../assets/images/prestasi/compfair-juara1.jpg";
import compfairJuara2a from "../assets/images/prestasi/compfair-juara2a.jpg";
import compfairJuara2b from "../assets/images/prestasi/compfair-juara2b.jpg";
import pkm from "../assets/images/prestasi/pkm.jpg";
import genexpo from "../assets/images/prestasi/genexpo.jpg";

export const PRESTASI_DATA = [
  {
    id: 1,
    peringkat: "Juara 2",
    judul: "ZevGo Entrance 4.0",
    pemenang: [
      "Annisa Balqis Kusuma Putri (2410631250005)",
      "Kintan Dyah Astuti (2410631250095)",
      "Raynaldi Dwi Arnanto (2410631250072)",
    ],
    gambar: zevgo,
    instagramUrl: "https://www.instagram.com/p/DYBdE5GGNl7/",
  },
  {
    id: 2,
    peringkat: "Juara 2",
    judul: "GenBI Innovation Zone 1.0",
    pemenang: [
      "Mubaroq Dwiki Husni Farhan",
      "Fadilah Nur Lutfah",
      "Yuuka Natasya Aji",
    ],
    gambar: genbi,
    instagramUrl: "https://www.instagram.com/p/DXOp8xuGEIa/",
  },
  {
    id: 3,
    peringkat: "Juara 2",
    judul: "IESTF pada Bidang KTI 2025",
    pemenang: [
      "Yuuka Natasya Aji (2310631250079)",
      "Hafshah (2310631250020)",
      "Alifia Nur Huda (2310631250005)",
    ],
    gambar: iestf,
    instagramUrl: "https://www.instagram.com/p/DRCGID0kzbu/",
  },
  {
    id: 4,
    peringkat: "Pemenang",
    judul: "Lomba Agriculture Competition 2025",
    pemenang: ["Yuuka Natasya (2310631250079)"],
    gambar: agriculture,
    instagramUrl: "https://www.instagram.com/p/DRB_z8pE_uS/",
  },
  {
    id: 5,
    peringkat: "Juara 1",
    judul: "Compfair pada bidang Business Plan Competition 2025",
    pemenang: [
      "Annisa Balqis Kusuma P. (2410631250005)",
      "Maulana Rafi (2410631250057)",
      "Mustika Aliesta Pratiwi (2410631250063)",
      "Nabila Latifa Tullaili (2410631250065)",
      "Nur Azhim Ramadhan (2410631250067)",
    ],
    gambar: compfairJuara1,
    instagramUrl: "https://www.instagram.com/p/DQMBU_hk3XZ/",
  },
  {
    id: 6,
    peringkat: "Juara 2",
    judul: "Compfair pada bidang Business Plan Competition 2025",
    pemenang: [
      "Amirul Ichsandina (2410631250083)",
      "Nisa Ardila (2410631250027)",
      "Trinanda Iman Karandi (2410631250033)",
      "Rahma Nur Khotimah (2410631250029)",
      "Nisa Ainul Hakim (2410631250026)",
    ],
    gambar: compfairJuara2a,
    instagramUrl: "https://www.instagram.com/p/DQL6h2vE1lK/",
  },
  {
    id: 7,
    peringkat: "Juara 2",
    judul: "Compfair pada bidang Business Plan Competition 2025",
    pemenang: [
      "Amirul Ichsandina (2410631250083)",
      "Nisa Ardila (2410631250027)",
      "Trinanda Iman Karandi (2410631250033)",
      "Rahma Nur Khotimah (2410631250029)",
      "Nisa Ainul Hakim (2410631250026)",
    ],
    gambar: compfairJuara2b,
    instagramUrl: "https://www.instagram.com/p/DNfZadvTdvp/",
  },
  {
    id: 8,
    peringkat: "Penerima Pendanaan",
    judul: "PKM 2025",
    pemenang: ["Maura Aqlaila R. (2210631250060)"],
    gambar: pkm,
    instagramUrl: "https://www.instagram.com/p/DNf0wBZT9R_/",
  },
  {
    id: 9,
    peringkat: "Juara 2",
    judul: "Gen Expo pada bidang Next Gen Digital Preneur Competition 2025",
    pemenang: [
      "Muhammad Alpha Athallah N. (2310631250067)",
      "Faricha Dillia Dinda Thomas (2310631250054)",
    ],
    gambar: genexpo,
    instagramUrl: "https://www.instagram.com/p/DKV0bL3IMYE/",
  },
];
