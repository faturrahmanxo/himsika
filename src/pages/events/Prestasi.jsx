import Reveal from "../../components/Reveal";
import AasHeader from "../../components/AasHeader";
import { PRESTASI_DATA } from "../../data/prestasiData";

// Halaman Prestasi Mahasiswa (portal AAS).
//
// Sumber: himsika.unsika.ac.id/prestasi-mahasiswa-si. Peringkat, nama, NIM, dan
// foto tidak diubah (DESIGN.md bagian "Isi").
//
// Arah tampilan mengikuti DESIGN.md (ENERGY 2 / RHYTHM 2 / MOTION 2):
// - Daftar, bukan petak kartu seragam. Foto tiap pencapaian punya rasio yang
//   berbeda-beda (ada tangkapan layar ponsel), jadi petak berukuran sama akan
//   memotongnya; baris daftar menampilkan foto utuh tanpa memaksa satu ukuran.
// - Peringkat adalah satu-satunya pembeda hierarki. Aksen emas hanya menandai
//   peringkat juara 1, bukan setiap baris (R-14, R-29).
// - Permukaan solid, tanpa grid latar dan tanpa orb glow (R-07, R-13).
export default function Prestasi() {
  // Juara 1 adalah pencapaian tertinggi yang tercatat di sini, jadi hanya
  // baris ini yang diberi penanda aksen.
  const idTertinggi = PRESTASI_DATA.find((p) => p.peringkat === "Juara 1")?.id;

  return (
    <div className="min-h-screen bg-page font-primary text-white pb-24 selection:bg-accent selection:text-[#02182b]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AasHeader
          judul="Prestasi"
          sorot="Mahasiswa"
          deskripsi="Pencapaian mahasiswa Sistem Informasi yang tercatat di divisi AAS HIMSIKA."
        />

        <Reveal>
          <p className="text-sm text-white/60 max-w-2xl">
            Setiap entri memuat peringkat, nama penerima, dan tautan dokumentasi.
            Data ini tersimpan di dalam website, bukan dari database online.
          </p>
        </Reveal>

        <ol className="mt-8 grid gap-4 sm:gap-5">
          {PRESTASI_DATA.map((item) => {
            const tertinggi = item.id === idTertinggi;
            return (
              <li key={item.id}>
                <Reveal>
                  <article
                    className={`group rounded-2xl bg-card border overflow-hidden grid sm:grid-cols-[240px_1fr] transition duration-200 hover:-translate-y-1 ${
                      tertinggi
                        ? "border-accent/60"
                        : "border-white/12 hover:border-white/25"
                    }`}
                  >
                    <a
                      href={item.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Lihat dokumentasi ${item.judul} di Instagram`}
                      className="block bg-deep aspect-[16/10] sm:aspect-auto sm:h-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
                    >
                      <img
                        src={item.gambar}
                        alt={`Dokumentasi ${item.judul}`}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    </a>

                    <div className="p-5 sm:p-6 min-w-0">
                      <div className="flex items-center justify-between gap-4">
                        <p
                          className={`text-xs font-bold uppercase tracking-widest ${
                            tertinggi ? "text-accent" : "text-white/60"
                          }`}
                        >
                          {item.peringkat}
                        </p>
                        {tertinggi && (
                          <span className="shrink-0 text-[11px] font-bold uppercase tracking-wide text-accent">
                            Tertinggi
                          </span>
                        )}
                      </div>

                      <h2 className="mt-1.5 text-lg sm:text-xl font-bold text-white leading-snug">
                        {item.judul}
                      </h2>

                      <ul className="mt-3 space-y-1">
                        {item.pemenang.map((nama) => (
                          <li
                            key={nama}
                            className="text-sm text-white/70 leading-relaxed"
                          >
                            {nama}
                          </li>
                        ))}
                      </ul>

                      <a
                        href={item.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-1.5 min-h-[44px] text-sm font-semibold text-white/80 hover:text-accent transition-colors rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        Lihat di Instagram
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5h5v5M19 5l-8 8M12 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"
                          />
                        </svg>
                      </a>
                    </div>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
