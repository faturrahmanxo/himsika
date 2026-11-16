import PageHeader from "../../components/PageHeader";
import Reveal from "../../components/Reveal";
import { visi, misi, divisiRingkas } from "../../data/profilData";

// Halaman Visi & Misi.
// Sumber isi: himsika.unsika.ac.id/visi-misi, teks tidak diubah.
// Visi ditampilkan sebagai kutipan besar; misi sebagai daftar bernomor karena
// isinya memang urutan butir, bukan kartu (R-05).
export default function VisiMisi() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#02182b] via-[#043761] to-[#02182b] font-primary text-white pb-24 relative overflow-hidden selection:bg-accent selection:text-[#02182b]">
      {/* Background Dekorasi Khas HIMSIKA */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff07_1px,transparent_1px),linear-gradient(to_bottom,#ffffff07_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_75%_50%_at_50%_20%,#000_70%,transparent_100%)]"></div>
        <div
          className="absolute w-[35rem] h-[35rem] rounded-full blur-[140px] bg-accent/10 -top-24 left-1/2 -translate-x-1/2 pointer-events-none animate-pulse"
          style={{ animationDuration: "8s" }}
        ></div>
        <div className="absolute w-[28rem] h-[28rem] rounded-full blur-[120px] bg-info/15 top-1/3 -right-24 pointer-events-none"></div>
        <div className="absolute w-[30rem] h-[30rem] rounded-full blur-[130px] bg-blue-500/10 bottom-10 -left-20 pointer-events-none"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <PageHeader
          judul="Visi &"
          sorot="Misi"
          deskripsi="Arah dan langkah HIMSIKA dalam membina mahasiswa Sistem Informasi."
        />

        {/* Visi */}
        <Reveal>
          <section className="rounded-3xl bg-[#021f3f]/85 backdrop-blur-md border border-[#1b4e80] p-8 sm:p-12 relative overflow-hidden shadow-2xl shadow-black/30">
            <div className="absolute top-0 left-0 w-2 h-full bg-linear-to-b from-accent to-accent/30 shadow-[0_0_15px_rgba(255,195,0,0.5)]" />
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
                <li className="flex gap-4 items-start group">
                  <span className="shrink-0 mt-0.5 flex items-center justify-center w-8 h-8 rounded-lg bg-[#021f3f] border border-[#1b4e80] text-accent font-black text-sm shadow-md group-hover:border-accent/60 group-hover:scale-105 transition-all">
                    {i + 1}
                  </span>
                  <p className="text-white/80 leading-relaxed group-hover:text-white transition-colors">{m}</p>
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
                <article className="h-full rounded-2xl bg-[#021f3f]/80 backdrop-blur-xs border border-[#1b4e80] hover:border-accent/60 hover:-translate-y-1 transition-all p-6 shadow-lg shadow-black/25">
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
