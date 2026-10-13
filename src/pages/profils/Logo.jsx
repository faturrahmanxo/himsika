import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// --- IMPORT GAMBAR LOGO ---
// HIMSIKA-hd: versi resmi 2046x2048 px (sumber 2238x2240 dari himsika.unsika.ac.id).
// Scrollytelling memperbesar logo sampai ~2.35x; aset lama 390px akan terlihat blur.
import HimsikaLogo from "../../assets/logo/HIMSIKA-hd.webp";
import HimsikaLogoPng from "../../assets/logo/HIMSIKA-hd.png";
import AksaraCakraLogo from "../../assets/logo/AksaraCakra-trim.png";

// ============================================================================
// DATA MAKNA + KOORDINAT
// ----------------------------------------------------------------------------
// x/y = titik di logo dalam skala 0-1 (0.5,0.5 = tengah). Angka ini bukan
// kira-kira: tiap titik diverifikasi lewat scan piksel aset HD (connected
// component) supaya panah benar-benar menunjuk bagian yang dimaksud.
// ============================================================================
const himsikaMeanings = [
  {
    id: "01",
    title: "Bentuk Lingkaran",
    desc: "Mewakili kekekalan 'tidak ada matinya'. Melindungi integritas komunitas.",
    x: 0.5,
    y: 0.5,
    zoom: 1,
  },
  {
    id: "02",
    title: "Dominan Biru",
    desc: "Mewakili ketenangan dan tanggung jawab. HIMSIKA kuat dan dapat diandalkan.",
    x: 0.74,
    y: 0.68,
    zoom: 1.7,
  },
  {
    id: "03",
    title: "Merah & Putih",
    desc: "Rasa hormat kepada NKRI serta warna merah khusus untuk almamater UNSIKA.",
    x: 0.312,
    y: 0.488,
    zoom: 1.9,
  },
  {
    id: "04",
    title: "Lingkaran Putih Tipis",
    desc: "Melambangkan perlindungan, kebenaran solid, dan kemurnian dalam berproses.",
    x: 0.135,
    y: 0.5,
    zoom: 2.1,
  },
  {
    id: "05",
    title: "Huruf 'S'",
    desc: "Representasi inisial depan dari program studi tercinta, Sistem Informasi.",
    x: 0.443,
    y: 0.46,
    zoom: 2.35,
  },
  {
    id: "06",
    title: "Angka 4",
    desc: "Target IPK sempurna (Zero Mistake) yang menjadi pedoman sukses dalam berproses.",
    x: 0.532,
    y: 0.516,
    zoom: 2.35,
  },
  {
    id: "07",
    title: "Proses Jaringan",
    desc: "Tidak membedakan SARA, terus beradaptasi dan relevan mengikuti perkembangan zaman.",
    x: 0.345,
    y: 0.315,
    zoom: 2.1,
  },
  {
    id: "08",
    title: "Lambang Gear",
    desc: "Menjelaskan satu identitas mutlak: seluruh anggota HIMSIKA adalah pekerja keras.",
    x: 0.927,
    y: 0.563,
    zoom: 2.2,
  },
  {
    id: "09",
    title: "Bayangan Kuning",
    desc: "Menjalankan fungsi organisasi dengan penuh keceriaan, kebahagiaan, dan optimisme.",
    x: 0.613,
    y: 0.667,
    zoom: 2.1,
  },
];

// Timeline: intro -> 9 makna -> outro. x/y/zoom dipakai juga oleh langkah
// pembuka & penutup supaya kamera kembali ke tampilan logo utuh.
const STEPS = [
  { id: "00", title: "Telusuri Makna", desc: "Gulir untuk membedah sembilan makna di balik logo HIMSIKA, satu per satu.", x: 0.5, y: 0.5, zoom: 1 },
  ...himsikaMeanings,
  { id: "10", title: "Satu Logo, Sembilan Makna", desc: "Setiap garis dan warnanya adalah pengingat cara HIMSIKA berproses.", x: 0.5, y: 0.5, zoom: 1 },
];

const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Tata letak kanvas: kolom kartu di kiri, zona logo di kanan. Dipakai untuk
// render (ukuran elemen) sekaligus untuk matematika zoom di loop gulir.
const layoutOf = (cw, ch) => {
  const leftZone = Math.min(380, Math.max(260, cw * 0.3));
  const gap = Math.max(28, cw * 0.03);
  const rightZone = Math.max(240, cw - leftZone - gap);
  const base = Math.max(120, Math.min(rightZone, ch * 0.82));
  return { leftZone, gap, rightZone, base, logoCx: leftZone + gap + rightZone / 2, logoCy: ch / 2 };
};

// Kurva panah dari tepi kartu ke titik target.
const arrowPath = (x1, y1, x2, y2) => {
  const cx = x1 + (x2 - x1) * 0.5;
  const cy = y1 + (y2 - y1) * 0.1;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
};

// ---------------------------------------------------------------- komponen --

function MeaningCard({ step, active }) {
  return (
    <div
      className={`rounded-2xl border bg-card p-5 sm:p-6 transition-colors duration-300 ${
        active ? "border-accent/60" : "border-white/15"
      }`}
    >
      <div className="flex items-baseline gap-3">
        <span className="text-sm font-black tabular-nums text-accent">{step.id}</span>
        <h3 className="text-lg font-bold leading-snug text-white">{step.title}</h3>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-white/70">{step.desc}</p>
    </div>
  );
}

export default function LogoPage() {
  const reducedMotion = useReducedMotion();
  // Dibaca sinkron supaya tidak ada kedipan layout mobile -> desktop.
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <div className="relative min-h-screen bg-page pt-32 pb-24 font-primary overflow-x-clip selection:bg-accent selection:text-[#043761]">
      {/* ================= BACKGROUND ================= */}
      {/* Grid garis halus = motif identitas situs (tercatat di DESIGN.md).
          Wrapper ini yang memotong glow, bukan halaman, supaya position:
          sticky di dalamnya tetap bekerja. */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]"></div>
        <div className="absolute left-1/2 top-1/4 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[160px]"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ================= HEADER ================= */}
        <section className="mb-16 text-center sm:mb-24">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Anatomi Makna <span className="text-accent">Logo</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base"
          >
            Sembilan elemen di dalam logo ini punya makna masing-masing, dari bentuk
            lingkaran sampai bayangan kuning di bawahnya.
          </motion.p>
        </section>

        {/* ================= SCROLLYTELLING ================= */}
        <section aria-label="Makna elemen logo HIMSIKA">
          <h2 className="sr-only">Sembilan makna elemen logo HIMSIKA</h2>
          {reducedMotion ? (
            <StaticMeanings />
          ) : isDesktop ? (
            <ScrollStory />
          ) : (
            <MobileStory />
          )}
        </section>

        {/* ================= AKSARA CAKRA ================= */}
        <AksaraCakraSection />
      </div>
    </div>
  );
}

// ------------------------------------------------------------ reduced motion --
// Tanpa animasi sama sekali: logo utuh + nomor penanda di tiap bagian + daftar
// makna. Semua informasi tetap terbaca tanpa satu pun gerakan.
function StaticMeanings() {
  return (
    <div className="grid items-start gap-10 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <div className="relative mx-auto aspect-square w-full max-w-[420px]">
          <img src={HimsikaLogo} alt="Logo HIMSIKA" className="h-full w-full object-contain" />
          {himsikaMeanings.map((m) => (
            <span
              key={m.id}
              aria-hidden="true"
              className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent bg-page text-[10px] font-black tabular-nums text-accent"
              style={{ left: `${m.x * 100}%`, top: `${m.y * 100}%` }}
            >
              {m.id}
            </span>
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
        {himsikaMeanings.map((m) => (
          <MeaningCard key={m.id} step={m} active={false} />
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ desktop --
// Satu kanvas sticky; posisi gulir mengendalikan zoom + pan logo, panah
// menunjuk bagian yang sedang dibahas, kartu berganti satu per satu.
function ScrollStory() {
  const wrapRef = useRef(null);
  const stickyRef = useRef(null);
  const imgRef = useRef(null);
  const arrowRef = useRef(null);
  const haloRef = useRef(null);
  const stickyTopRef = useRef(112);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [active, setActive] = useState(0);

  // Ukuran kanvas -> untuk posisi & ukuran elemen logo saat render.
  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, []);

  // Inti scrollytelling: satu loop rAF, langsung menyetel transform (tanpa
  // re-render React per frame) supaya tetap mulus di laptop kelas menengah.
  useEffect(() => {
    let raf = 0;
    let last = -1;
    const sticky = stickyRef.current;
    if (sticky) {
      const t = parseFloat(window.getComputedStyle(sticky).top);
      if (!Number.isNaN(t)) stickyTopRef.current = t;
    }
    const tick = () => {
      const wrap = wrapRef.current;
      if (wrap && sticky) {
        const wr = wrap.getBoundingClientRect();
        const sr = sticky.getBoundingClientRect();
        const cw = sr.width;
        const ch = sr.height;
        const range = wr.height - sr.height;
        const progress = range > 4 ? clamp((stickyTopRef.current - wr.top) / range, 0, 1) : 0;
        const p = progress * (STEPS.length - 1);
        const seg = clamp(Math.floor(p), 0, STEPS.length - 2);
        const f = easeInOutCubic(clamp(p - seg, 0, 1));
        const a = STEPS[seg];
        const b = STEPS[seg + 1];
        const zoom = a.zoom + (b.zoom - a.zoom) * f;
        const fx = a.x + (b.x - a.x) * f;
        const fy = a.y + (b.y - a.y) * f;

        const L = layoutOf(cw, ch);
        const half = (L.base * zoom) / 2;
        // Batasi pan supaya logo selalu menutupi zona kanan (tidak ada celah),
        // lalu target diarahkan sedekat mungkin ke tengah zona itu.
        const loX = cw - L.logoCx - half;
        const hiX = L.leftZone + L.gap - L.logoCx + half;
        const loY = ch - L.logoCy - half;
        const hiY = -L.logoCy + half;
        const tx = loX <= hiX ? clamp(-(fx - 0.5) * L.base * zoom, loX, hiX) : 0;
        const ty = loY <= hiY ? clamp(-(fy - 0.5) * L.base * zoom, loY, hiY) : 0;

        const img = imgRef.current;
        if (img) {
          img.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${zoom.toFixed(4)})`;
        }
        // Titik target di layar = posisi asli bagian logo setelah transform.
        const tipX = L.logoCx + tx + (fx - 0.5) * L.base * zoom;
        const tipY = L.logoCy + ty + (fy - 0.5) * L.base * zoom;
        // Mulai dari tepi kanan kartu (bukan menimpa teksnya), lengkung tipis ke target.
        const d = arrowPath(L.leftZone + 16, 86, tipX, tipY);
        if (arrowRef.current) arrowRef.current.setAttribute("d", d);
        if (haloRef.current) {
          haloRef.current.setAttribute("cx", tipX);
          haloRef.current.setAttribute("cy", tipY);
        }

        const next = Math.round(p);
        if (next !== last) {
          last = next;
          setActive(next);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const jumpTo = (index) => {
    const wrap = wrapRef.current;
    const sticky = stickyRef.current;
    if (!wrap || !sticky) return;
    const range = wrap.offsetHeight - sticky.offsetHeight;
    const top = wrap.getBoundingClientRect().top + window.scrollY - stickyTopRef.current;
    window.scrollTo({ top: top + (range * index) / (STEPS.length - 1) + 2, behavior: "smooth" });
  };

  const L = layoutOf(size.w, size.h);
  const showArrow = active >= 1 && active <= himsikaMeanings.length;

  return (
    <div ref={wrapRef} data-story-wrap className="relative h-[560vh]">
      <div
        ref={stickyRef}
        data-story-sticky
        className="sticky top-[104px] h-[calc(100vh-144px)] min-h-[480px] max-h-[900px] overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {/* Logo: digerakkan lewat transform oleh loop gulir. Mask horizontal
              meleburkan tepi kiri logo ke latar (bukan potongan keras), mask
              vertikal melembutkan potongan atas/bawah saat zoom. */}
          <div
            className="absolute inset-0"
            style={{
              maskImage: `linear-gradient(to right, transparent ${L.leftZone + L.gap - 30}px, black ${L.leftZone + L.gap + 190}px), linear-gradient(to bottom, transparent 0%, black 9%, black 91%, transparent 100%)`,
              WebkitMaskImage: `linear-gradient(to right, transparent ${L.leftZone + L.gap - 30}px, black ${L.leftZone + L.gap + 190}px), linear-gradient(to bottom, transparent 0%, black 9%, black 91%, transparent 100%)`,
              maskComposite: "intersect",
              WebkitMaskComposite: "source-in",
            }}
          >
            <img
              ref={imgRef}
              src={HimsikaLogo}
              onError={(e) => {
                e.currentTarget.src = HimsikaLogoPng;
              }}
              alt="Logo HIMSIKA"
              draggable={false}
              className="absolute object-contain will-change-transform"
              style={{
                left: L.logoCx - L.base / 2,
                top: L.logoCy - L.base / 2,
                width: L.base,
                height: L.base,
              }}
            />
          </div>

          {/* Panah: satu kurva berkepala + halo titik; hanya muncul saat membahas makna. */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-300"
            viewBox={`0 0 ${size.w} ${size.h}`}
            fill="none"
            style={{ opacity: showArrow ? 1 : 0 }}
            aria-hidden="true"
          >
            <defs>
              <marker
                id="logo-arrowhead"
                viewBox="0 0 10 10"
                refX="8.6"
                refY="5"
                markerWidth="7.5"
                markerHeight="7.5"
                orient="auto-start-reverse"
              >
                <path d="M 0 0.6 L 9.6 5 L 0 9.4 z" fill="#ffc300" />
              </marker>
            </defs>
            <path
              ref={arrowRef}
              stroke="#ffc300"
              strokeWidth="1.75"
              strokeLinecap="round"
              markerEnd="url(#logo-arrowhead)"
            />
            <circle ref={haloRef} r="12" stroke="#ffc300" strokeOpacity="0.45" />
          </svg>

          {/* Kolom kiri: kartu penjelasan (satu aktif) + navigasi nomor. */}
          <div
            className="absolute bottom-6 left-0 top-6 flex flex-col justify-between"
            style={{ width: L.leftZone }}
          >
            <div className="relative">
              {STEPS.map((step, i) => (
                <div
                  key={step.id}
                  className={`transition-[opacity,visibility] duration-300 ${
                    i === active ? "visible relative opacity-100" : "invisible absolute inset-x-0 top-0 opacity-0"
                  }`}
                >
                  <MeaningCard step={step} active={i === active} />
                </div>
              ))}
              <div
                className={`mt-3 text-xs font-bold tracking-wide text-white/70 transition-opacity duration-300 ${
                  active === 0 ? "opacity-100" : "opacity-0"
                }`}
              >
                Gulir untuk mulai menelusuri
              </div>
            </div>

            <nav aria-label="Pilih makna" className="flex w-fit flex-col">
              {himsikaMeanings.map((m, i) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => jumpTo(i + 1)}
                  aria-current={active === i + 1 ? "true" : undefined}
                  className={`group flex h-11 items-center gap-2 transition-colors ${
                    active === i + 1 ? "text-accent" : "text-white/60 hover:text-white"
                  }`}
                >
                  <span
                    className={`h-px transition-all duration-300 ${
                      active === i + 1 ? "w-6 bg-accent" : "w-3 bg-white/30 group-hover:bg-white/60"
                    }`}
                  ></span>
                  <span className="text-xs font-black tabular-nums">{m.id}</span>
                </button>
              ))}
            </nav>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------- mobile --
// Logo kecil menempel di atas (seperti kaca pembesar: bagian yang dibahas
// selalu di tengah lingkaran), kartu makna lewat satu per satu di bawahnya.
function MobileStory() {
  const [active, setActive] = useState(0);
  const [base, setBase] = useState(160);
  const winRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const el = winRef.current;
    if (!el) return;
    const measure = () => setBase(el.clientWidth);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;
    let last = -1;
    const tick = () => {
      const line = window.innerHeight * 0.55;
      let best = 0;
      let seen = false;
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top <= line) {
          best = i;
          seen = true;
        }
      });
      if (!seen) best = 0;
      if (best !== last) {
        last = best;
        setActive(best);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const step = himsikaMeanings[clamp(active, 0, himsikaMeanings.length - 1)];
  const tx = -(step.x - 0.5) * base * step.zoom;
  const ty = -(step.y - 0.5) * base * step.zoom;

  return (
    <div className="flex flex-col">
      <div className="sticky top-[100px] z-20 bg-page pb-5 pt-2 sm:top-[104px]">
        <div className="flex justify-center">
          <div
            ref={winRef}
            className="relative h-40 w-40 overflow-hidden rounded-full border border-white/15 bg-white/5 sm:h-48 sm:w-48"
          >
            <img
              src={HimsikaLogo}
              alt="Logo HIMSIKA"
              draggable={false}
              className="h-full w-full object-contain transition-transform duration-500 ease-out"
              style={{ transform: `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${step.zoom})` }}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent/90"
            ></span>
          </div>
        </div>
        <div className="mt-2 text-center">
          <span className="text-xs font-black tabular-nums text-accent">{step.id}</span>
          <span className="ml-2 text-sm font-bold text-white">{step.title}</span>
        </div>
      </div>

      <div className="grid gap-4">
        {himsikaMeanings.map((m, i) => (
          <div key={m.id} ref={(el) => (cardRefs.current[i] = el)}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <MeaningCard step={m} active={i === active} />
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------ aksara cakra --
function AksaraCakraSection() {
  return (
    <section className="relative mt-24 overflow-hidden rounded-[2.5rem] border border-white/10 bg-card sm:mt-32">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[100px]"
        aria-hidden="true"
      ></div>

      <div className="relative z-10 grid grid-cols-1 items-center gap-12 p-6 sm:p-12 lg:grid-cols-12 lg:p-16">
        <div className="order-2 space-y-4 text-center lg:order-1 lg:col-span-4 lg:text-right">
          <h3 className="text-2xl font-black tracking-wider text-white">AKSARA</h3>
          <p className="text-sm leading-relaxed text-white/70">
            Memiliki arti ilmu, catatan, dan pengetahuan kuat yang akan abadi, diwariskan
            terus-menerus, dan tidak akan pernah hilang ditelan waktu.
          </p>
        </div>

        <div className="order-1 flex flex-col items-center lg:order-2 lg:col-span-4">
          <div className="mb-4 flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64">
            <img
              src={AksaraCakraLogo}
              alt="Logo Kabinet Aksara Cakra"
              className="h-[92%] w-[92%] object-contain"
            />
          </div>
          <div className="text-center">
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-white/70">
              Nama Kabinet
            </p>
            <h4 className="text-lg font-extrabold tracking-wide text-white">Aksara Cakra</h4>
          </div>
        </div>

        <div className="order-3 space-y-4 text-center lg:col-span-4 lg:text-left">
          <h3 className="text-2xl font-black tracking-wider text-white">CAKRA</h3>
          <p className="text-sm leading-relaxed text-white/70">
            Dinamai sebagai roda pergerakan atau poros utama organisasi yang teratur,
            berputar stabil, kuat, dan berjalan secara berkesinambungan.
          </p>
        </div>
      </div>
    </section>
  );
}
