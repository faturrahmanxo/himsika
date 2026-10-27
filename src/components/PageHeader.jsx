import { motion } from "motion/react";

// Header halaman. Dipakai Sejarah, Visi Misi, Struktur, dan Galeri.
// Gerak: muncul sekali saat halaman dibuka (R-19), bukan animasi berulang.
export default function PageHeader({
  judul,
  sorot,
  deskripsi,
  children,
  rata = "kiri",
}) {
  const tengah = rata === "tengah";

  return (
    <header className="relative pt-32 pb-14 sm:pt-36 sm:pb-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={tengah ? "max-w-3xl mx-auto text-center" : "max-w-3xl"}
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05]">
          {judul}
          {sorot && <span className="text-accent"> {sorot}</span>}
        </h1>
        {deskripsi && (
          <p
            className={`mt-5 text-base sm:text-lg text-white/70 leading-relaxed ${
              tengah ? "mx-auto" : ""
            } max-w-2xl`}
          >
            {deskripsi}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </motion.div>
    </header>
  );
}
