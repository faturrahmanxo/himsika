import { useState, useEffect } from "react";
import Reveal from "../../components/Reveal";
import AasHeader from "../../components/AasHeader";
import { PRESTASI_DATA } from "../../data/prestasiData";
import supabase from "../../supabase-client";

// Halaman Prestasi Mahasiswa (portal AAS).
// Terintegrasi dengan database Supabase (tabel 'prestasi') dengan fallback ke PRESTASI_DATA.

const parsePemenang = (p) => {
  if (Array.isArray(p)) return p;
  if (typeof p === "string") {
    try {
      const parsed = JSON.parse(p);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return p.split("\n").map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
};

export default function Prestasi() {
  const [prestasiList, setPrestasiList] = useState(PRESTASI_DATA);
  const [sumberCadangan, setSumberCadangan] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchPrestasi() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("prestasi")
          .select("*")
          .order("id", { ascending: false });

        if (!error && data && data.length > 0) {
          // Normalisasi kolom gambar dan instagramUrl jika dari Supabase
          const normalized = data.map((d) => ({
            id: d.id,
            peringkat: d.peringkat,
            judul: d.judul,
            pemenang: parsePemenang(d.pemenang),
            gambar: d.gambar || d.image || "",
            instagramUrl: d.instagram_url || d.instagramUrl || "https://www.instagram.com/himsika.unsika/",
          }));
          setPrestasiList(normalized);
          setSumberCadangan(false);
        } else {
          setPrestasiList(PRESTASI_DATA);
          setSumberCadangan(true);
        }
      } catch (err) {
        console.warn("Menggunakan data prestasi lokal:", err.message);
        setPrestasiList(PRESTASI_DATA);
        setSumberCadangan(true);
      } finally {
        setLoading(false);
      }
    }

    fetchPrestasi();
  }, []);

  const idTertinggi = prestasiList.find((p) => p.peringkat === "Juara 1")?.id;

  return (
    <div className="min-h-screen bg-page font-primary text-white pb-24 selection:bg-accent selection:text-[#02182b]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <AasHeader
          judul="Prestasi"
          sorot="Mahasiswa"
          deskripsi="Pencapaian mahasiswa Sistem Informasi yang tercatat di divisi AAS HIMSIKA."
        />

        <Reveal>
          <p className="text-sm text-white/70 max-w-2xl">
            Setiap entri memuat peringkat, nama penerima, dan tautan dokumentasi.
            {sumberCadangan && " (Menampilkan arsip terkurasi AAS)." }
          </p>
        </Reveal>

        {loading ? (
          <div className="mt-8 border border-[#1b4e80] rounded-2xl bg-[#02203d] p-10 text-center shadow-lg">
            <p className="text-sm font-semibold text-white/80">Memuat data prestasi...</p>
          </div>
        ) : (
          <ol className="mt-8 grid gap-4 sm:gap-5">
            {prestasiList.map((item) => {
              const tertinggi = item.id === idTertinggi;
              const pemenangArr = parsePemenang(item.pemenang);
              return (
                <li key={item.id}>
                  <Reveal>
                    <article
                      className={`group rounded-2xl bg-[#021f3f] border overflow-hidden grid sm:grid-cols-[240px_1fr] transition duration-200 hover:-translate-y-1 shadow-lg shadow-black/25 ${
                        tertinggi
                          ? "border-accent shadow-[0_0_20px_rgba(255,195,0,0.18)]"
                          : "border-[#1b4e80] hover:border-accent/60"
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

                      <div className="p-5 sm:p-6 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-4">
                            <span
                              className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                                tertinggi
                                  ? "bg-accent/20 border border-accent/50 text-accent font-black"
                                  : "bg-white/10 border border-white/15 text-white/80"
                              }`}
                            >
                              {item.peringkat}
                            </span>
                            {tertinggi && (
                              <span className="shrink-0 text-[11px] font-bold uppercase tracking-wide text-accent">
                                Peringkat Tertinggi
                              </span>
                            )}
                          </div>

                          <h2 className="mt-2 text-lg sm:text-xl font-bold text-white leading-snug group-hover:text-accent transition-colors">
                            {item.judul}
                          </h2>

                          <ul className="mt-3 space-y-1">
                            {pemenangArr.map((nama, idx) => (
                              <li
                                key={idx}
                                className="text-sm text-white/75 leading-relaxed"
                              >
                                {nama}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-4 pt-3 border-t border-white/10">
                          <a
                            href={item.instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                          >
                            <span>Buka dokumentasi Instagram</span>
                            <svg
                              className="w-3.5 h-3.5"
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
                      </div>
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
