import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import PageHeader from "../../components/PageHeader";
import Reveal from "../../components/Reveal";

// Import foto kontributor
import fotoFajar from "../../assets/images/pengurus/divisiKominfo/Fajar-Raihan-Hanafi.webp";
import fotoHabib from "../../assets/images/pengurus/divisiKominfo/Habib-Iqbal-Faturrahman.webp";
import fotoMutaz from "../../assets/images/pengurus/divisiKominfo/Mu-taz-Al-Ghaniy.webp";
import fotoTrinanda from "../../assets/images/pengurus/divisiKominfo/Trinanda-Iman-Karandi.webp";

const CREDIT_DATA = [
  {
    id: "1",
    nama: "Fajar Raihan Hanafi",
    peran: "Project Manager and Frontend Developer",
    deskripsi: "Merancang antarmuka modern, sistem desain, serta pengalaman pengguna secara menyeluruh.",
    foto: fotoFajar,
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    status: "Student",
  },
  {
    id: "2",
    nama: "Habib Iqbal Faturrahman",
    peran: "Frontend Developer",
    deskripsi: "Mengembangkan komponen React, animasi interaktif, serta integrasi sistem tingkat lanjut.",
    foto: fotoHabib,
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    status: "Student",
  },
  {
    id: "3",
    nama: "Mu'taz Al Ghaniy",
    peran: "Frontend Developer",
    deskripsi: "Mengelola arsitektur server, integrasi Supabase, keamanan data, dan pembuatan API.",
    foto: fotoMutaz,
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    status: "Student",
  },
  {
    id: "4",
    nama: "Trinanda Iman",
    peran: "Developer support",
    deskripsi: "Menyusun dokumentasi, aset visual, media pendukung, serta penyelarasan konten website.",
    foto: fotoTrinanda,
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    status: "Student",
  },
];

/* Spring flip: terasa natural, responsif, dan tidak ada "jeda" di awal gerakan */
const FLIP_SPRING = { stiffness: 260, damping: 24, mass: 0.7 };
const TILT_SPRING = { stiffness: 180, damping: 18, mass: 0.6 };
const MAX_TILT = 8; // derajat

function CreditCard({ item }) {
  const reduceMotion = useReducedMotion();
  const [flipped, setFlipped] = useState(false);

  // Sudut flip (0 -> 180) digerakkan spring
  const flip = useSpring(0, FLIP_SPRING);

  // Tilt 3D mengikuti kursor (hanya mouse)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tiltY = useSpring(mouseX, TILT_SPRING);
  const rotateX = useSpring(mouseY, TILT_SPRING);
  const rotateY = useTransform([flip, tiltY], ([f, t]) => f + t);

  useEffect(() => {
    const target = flipped ? 180 : 0;
    if (reduceMotion) flip.jump(target);
    else flip.set(target);
  }, [flipped, reduceMotion, flip]);

  const handlePointerEnter = (e) => {
    if (e.pointerType === "mouse") setFlipped(true);
  };

  const handlePointerLeave = (e) => {
    if (e.pointerType !== "mouse") return;
    setFlipped(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handlePointerMove = (e) => {
    if (e.pointerType !== "mouse" || reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(px * MAX_TILT * 2);
    mouseY.set(-py * MAX_TILT * 2);
  };

  // Layar sentuh: ketuk untuk membalik kartu
  const handlePointerUp = (e) => {
    if (e.pointerType !== "mouse") setFlipped((v) => !v);
  };

  return (
    <div
      className="group w-full aspect-[3/4.3] relative select-none outline-none focus-visible:ring-2 focus-visible:ring-accent/70 rounded-3xl"
      style={{ perspective: "1000px" }}
      tabIndex={0}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onFocus={() => setFlipped(true)}
      onBlur={() => setFlipped(false)}
    >
      <motion.div
        className="w-full h-full relative rounded-3xl shadow-xl group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] group-focus-visible:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-shadow duration-300 will-change-transform"
        style={{ transformStyle: "preserve-3d", rotateY, rotateX }}
      >
        {/* ================= SISI DEPAN (FRONT) ================= */}
        <div
          className="absolute inset-0 w-full h-full rounded-3xl p-4 bg-card border border-border group-hover:border-accent/60 group-focus-visible:border-accent/60 overflow-hidden flex flex-col justify-between transition-colors duration-300 shadow-lg"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          {/* Efek Kilau Cahaya */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[600ms] ease-out pointer-events-none z-20" />

          {/* Foto Kontributor */}
          <div className="relative w-full h-[68%] rounded-2xl overflow-hidden bg-surface">
            <img
              src={item.foto}
              alt={item.nama}
              loading="lazy"
              draggable={false}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            {/* Gradasi lembut di bawah foto supaya transisi ke info lebih halus */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

            {/* Lencana Status */}
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-semibold tracking-wider text-accent flex items-center gap-1.5">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-ping" />
                <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-accent" />
              </span>
              {item.status}
            </div>
          </div>

          {/* Info Kontributor */}
          <div className="pt-2 px-1 pb-1 relative">
            <h3 className="text-base font-bold text-white group-hover:text-accent transition-colors duration-300 truncate">
              {item.nama}
            </h3>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-accent/90 mt-0.5">
              {item.peran}
            </p>

            {/* Hiasan Bawah Kartu */}
            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
              <div className="flex gap-1 items-center">
                <span className="w-2 h-1 rounded-full bg-accent group-hover:w-4 transition-all duration-300" />
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span className="w-1 h-1 rounded-full bg-white/20" />
              </div>
              <span className="text-[10px] text-white/50 font-medium tracking-wide">
                HIMSIKA DEV
              </span>
            </div>
          </div>
        </div>

        {/* ================= SISI BELAKANG (BACK) ================= */}
        <div
          className="absolute inset-0 w-full h-full rounded-3xl p-6 bg-surface border border-accent/50 overflow-hidden flex flex-col justify-between text-center"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Ambient Glow Belakang */}
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-accent/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-accent/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex-1 flex flex-col justify-center items-center relative z-10 my-auto">
            <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/40 flex items-center justify-center mb-3 text-accent shadow-inner">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>

            <h4 className="text-sm font-bold text-accent tracking-wide mb-1">
              {item.peran}
            </h4>
            <p className="text-xs text-white/80 leading-relaxed my-2 font-normal">
              "{item.deskripsi}"
            </p>
          </div>

          {/* Tautan Sosial */}
          <div className="pt-3 border-t border-white/10 flex justify-center gap-2.5 relative z-10">
            {[
              { label: "GitHub", href: item.github },
              { label: "LinkedIn", href: item.linkedin },
            ].map(
              (link) =>
                link.href && (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={flipped ? 0 : -1}
                    onPointerUp={(e) => e.stopPropagation()}
                    className="px-3 py-1.5 text-xs rounded-xl bg-white/10 hover:bg-accent hover:text-black active:scale-95 font-semibold transition-all duration-200 border border-white/15"
                  >
                    {link.label}
                  </a>
                )
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const TECH_STACK = ["React", "Tailwind CSS", "Motion", "Supabase"];

function CreditFooter() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="group relative mt-14 max-w-3xl mx-auto rounded-3xl p-px overflow-hidden shadow-lg">
      {/* Border gradien berputar pelan */}
      <motion.div
        aria-hidden="true"
        className="absolute -inset-[100%] pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, rgba(59,130,246,0.9) 60deg, transparent 120deg, transparent 240deg, rgba(255,255,255,0.35) 300deg, transparent 360deg)",
        }}
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative rounded-[calc(1.5rem-1px)] bg-card px-6 py-9 sm:px-12 sm:py-12 text-center overflow-hidden">
        {/* Ambient: grid halus + glow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:1.75rem_1.75rem] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] pointer-events-none" />
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-40 rounded-full bg-accent/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Emblem dengan cincin berdenyut */}
          <div className="relative w-14 h-14 mb-5">
            <span className="absolute inset-0 rounded-2xl bg-accent/20 animate-ping [animation-duration:2.8s]" />
            <div className="relative w-full h-full rounded-2xl bg-accent/15 border border-accent/40 flex items-center justify-center text-accent shadow-inner group-hover:rotate-6 group-hover:scale-105 transition-transform duration-300">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
          </div>

          <h4 className="text-base sm:text-lg font-bold text-white tracking-wide">
            HIMSIKA <span className="text-accent">Web Development</span>
          </h4>

          {/* Pembatas dengan titik aksen */}
          <div className="flex items-center gap-3 my-4 w-full max-w-xs">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/20" />
            <span className="flex gap-1">
              <span className="w-2 h-1 rounded-full bg-accent" />
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="w-1 h-1 rounded-full bg-white/20" />
            </span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/20" />
          </div>

          <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-xl">
            Didedikasikan untuk seluruh anggota tim dan pihak yang telah mendukung pembuatan serta pengembangan ekosistem website HIMSIKA.
          </p>

          {/* Tech stack */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {TECH_STACK.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-full text-[11px] font-semibold text-white/80 bg-white/5 border border-white/10 hover:border-accent/60 hover:text-accent hover:-translate-y-0.5 transition-all duration-200 cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>

          <p className="mt-6 text-[10px] text-white/40 tracking-wide">
            &copy; {new Date().getFullYear()} HIMSIKA. Dibangun bersama oleh tim.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Credit() {
  return (
    <div className="min-h-screen bg-page font-primary text-white pb-24 relative overflow-hidden">
      {/* Background Glow Ambient */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
        <div className="absolute w-[28rem] h-[28rem] rounded-full blur-[120px] bg-accent/10 top-0 left-1/2 -translate-x-1/2 animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* PageHeader (Persis seperti di Halaman Galeri) */}
        <PageHeader
          judul="Credit"
          sorot="Tim"
          deskripsi="Apresiasi tinggi untuk para pengembang dan kontributor utama dibalik pembuatan website HIMSIKA."
        />

        {/* Grid 4 Kartu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-10">
          {CREDIT_DATA.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.05}>
              <CreditCard item={item} />
            </Reveal>
          ))}
        </div>

        {/* ================= KARTU PENJELASAN BAWAH ================= */}
        <Reveal>
          <CreditFooter />
        </Reveal>
      </div>
    </div>
  );
}