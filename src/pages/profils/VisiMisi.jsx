import PageHeader from "../../components/PageHeader";
import Reveal from "../../components/Reveal";
import { visi, misi, divisiRingkas } from "../../data/profilData";

// Halaman Visi & Misi.
// Sumber isi: himsika.unsika.ac.id/visi-misi, teks tidak diubah.
// Visi ditampilkan sebagai kutipan besar; misi sebagai daftar bernomor karena
// isinya memang urutan butir, bukan kartu (R-05).
export default function VisiMisi() {
  return (
    <div className="min-h-screen bg-page font-primary text-white pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          judul="Visi &"
          sorot="Misi"
          deskripsi="Arah dan langkah HIMSIKA dalam membina mahasiswa Sistem Informasi."
        />

        {/* Visi */}
        <Reveal>
          <section className="rounded-3xl bg-card border border-border p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-accent" />
            <p className="text-xs font-bold tracking-widest uppercase text-accent">
              Visi
            </p>
            <p className="mt-5 text-xl sm:text-2xl lg:text-3xl font-bold leading-snug text-white">
              {visi}
            </p>
          </section>
        </Reveal>

        {/* Misi */}
        <section className="mt-16">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Misi</h2>
            <p className="mt-3 text-white/60 max-w-2xl">
              Enam langkah yang HIMSIKA jalankan untuk mewujudkan visi tersebut.
            </p>
          </Reveal>

          <ol className="mt-8 grid sm:grid-cols-2 gap-x-10 gap-y-6">
            {misi.map((m, i) => (
              <Reveal key={i} delay={i * 0.04}>
                <li className="flex gap-4 items-start">
                  <span className="shrink-0 mt-0.5 flex items-center justify-center w-8 h-8 rounded-lg bg-surface border border-border text-accent font-bold text-sm">
                    {i + 1}
                  </span>
                  <p className="text-white/75 leading-relaxed">{m}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* Divisi ringkas: menghubungkan visi-misi ke struktur nyata */}
        <section className="mt-20">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Yang menjalankannya
            </h2>
            <p className="mt-3 text-white/60 max-w-2xl">
              Empat divisi dengan delapan departemen menggerakkan program kerja
              HIMSIKA.
            </p>
          </Reveal>

          <div className="mt-8 grid sm:grid-cols-2 gap-5">
            {divisiRingkas.map((d, i) => (
              <Reveal key={d.nama} delay={i * 0.05}>
                <article className="h-full rounded-2xl bg-surface/60 border border-border p-6">
                  <h3 className="text-lg font-bold text-white">{d.nama}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-accent">
                    {d.dept}
                  </p>
                  <p className="mt-3 text-sm text-white/60 leading-relaxed">
                    {d.tugas}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
