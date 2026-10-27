import { motion } from "motion/react";
import Reveal from "../../components/Reveal";
import AasHeader from "../../components/AasHeader";
import { SHARING_DATA } from "../../data/sharingData";

// Halaman Sharing Session (portal AAS).
//
// Sumber: himsika.unsika.ac.id/sharing-session. Teks, tanggal, dan benefit
// diambil apa adanya; di situs asli rinciannya dibuka lewat modal, di sini
// ditampilkan langsung supaya tidak ada lapisan mengambang yang tidak perlu
// (DESIGN.md: lightbox adalah satu-satunya lapisan mengambang).
//
// Arah tampilan mengikuti DESIGN.md (ENERGY 2 / RHYTHM 2 / MOTION 2):
// - Bentuk garis waktu, bukan petak kartu seragam. Sumbernya sendiri menyusun
//   sesi menurut tanggal ("Timeline: ..."), jadi tanggal yang memimpin urutan
//   dan panel isinya menyusul (R-05, R-14).
// - Aksen emas hanya menandai tanggal, satu sorotan per baris (R-29).
export default function SharingSession() {
  return (
    <div className="min-h-screen bg-page font-primary text-white pb-24 selection:bg-accent selection:text-[#02182b]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AasHeader
          judul="Sharing"
          sorot="Session"
          deskripsi="Sesi berbagi ilmu divisi AAS HIMSIKA, disusun menurut tanggal pelaksanaan."
        />

        <Reveal>
          <p className="text-sm text-white/60 max-w-2xl">
            Data ini tersimpan di dalam website, bukan dari database online.
          </p>
        </Reveal>

        <ol className="mt-10 relative">
          {/* Satu batang waktu, bukan kartu berulang */}
          <div className="absolute left-[15px] sm:left-[19px] top-2 bottom-2 w-px bg-border" />

          {SHARING_DATA.map((item, i) => (
            <li key={item.id} className="relative pl-12 sm:pl-16 pb-10 last:pb-0">
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.06, ease: "easeOut" }}
                aria-hidden="true"
                className="absolute left-0 top-1 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 bg-page border-border"
              >
                <span className="text-xs font-bold text-white/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </motion.span>

              <Reveal delay={i * 0.04}>
                <article className="rounded-2xl bg-card border border-white/12 p-5 sm:p-6">
                  <p className="text-sm font-bold text-accent">{item.tanggal}</p>
                  <h2 className="mt-1 text-lg sm:text-xl font-bold text-white">
                    {item.nama}
                  </h2>

                  <dl className="mt-4 grid gap-3 sm:grid-cols-[auto_1fr] sm:gap-x-6">
                    <dt className="text-xs font-bold uppercase tracking-widest text-white/40">
                      Benefit
                    </dt>
                    <dd className="text-sm text-white/80">{item.benefit}</dd>
                  </dl>

                  <p className="mt-4 text-sm text-white/65 leading-relaxed">
                    {item.deskripsi}
                  </p>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
