import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Mail,
  Send,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  HeartHandshake,
  MessageSquareHeart,
  ChevronDown,
  Clock,
  User,
  AtSign,
  MessageCircle,
  CheckCircle2,
  Building2,
  Share2,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";
import supabase from "../supabase-client";

// Import Foto Resmi Narahubung dari Pengurus HIMSIKA
import fotoDaffa from "../assets/images/pengurus/Muhammad-Dafa-Anggara-Putra.webp";
import fotoRefaya from "../assets/images/pengurus/Refaya-Nindya-Secondita.webp";

export default function Kontak() {
  // State Tab Form: "pesan" (Hubungi Kami) atau "aspirasi" (Kritik & Saran)
  const [activeTab, setActiveTab] = useState("pesan");

  // State Feedback Form Hubungi Kami
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    whatsapp: "",
    perihal: "Pertanyaan Umum",
    pesan: "",
  });
  const [isSubmittingPesan, setIsSubmittingPesan] = useState(false);
  const [isSentPesan, setIsSentPesan] = useState(false);

  // State Feedback Form Kritik & Saran
  const [aspirasiData, setAspirasiData] = useState({
    nama: "",
    isAnonim: false,
    kategori: "Program Kerja & Event",
    isi: "",
  });
  const [isSubmittingAspirasi, setIsSubmittingAspirasi] = useState(false);
  const [isSentAspirasi, setIsSentAspirasi] = useState(false);

  // State Accordion FAQ (index yang terbuka, default index 0)
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // State Copy Alamat
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    const alamat =
      "Jl. HS.Ronggo Waluyo, Puseurjaya, Kec. Telukjambe Timur, Kabupaten Karawang, Jawa Barat 41361";
    navigator.clipboard.writeText(alamat);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmitPesan = async (e) => {
    e.preventDefault();
    setIsSubmittingPesan(true);

    try {
      // Coba rekam ke tabel Supabase jika sudah ada tabel kontak_pesan
      await supabase.from("kontak_pesan").insert([
        {
          nama: formData.nama,
          email: formData.email,
          whatsapp: formData.whatsapp,
          perihal: formData.perihal,
          pesan: formData.pesan,
          created_at: new Date().toISOString(),
        },
      ]);
    } catch {
      // Graceful fallback jika tabel belum dibuat di Supabase
    }

    setIsSubmittingPesan(false);
    setIsSentPesan(true);
  };

  const handleOpenWhatsAppPesan = () => {
    const textWA = `Halo Pengurus HIMSIKA,%0A%0ASaya *${encodeURIComponent(
      formData.nama
    )}* (${encodeURIComponent(formData.email)} / ${encodeURIComponent(
      formData.whatsapp || "-"
    )}).%0A%0A*Perihal:* ${encodeURIComponent(
      formData.perihal
    )}%0A*Pesan:*%0A${encodeURIComponent(formData.pesan)}`;
    window.open(`https://wa.me/6287857203936?text=${textWA}`, "_blank");
  };

  const handleSubmitAspirasi = async (e) => {
    e.preventDefault();
    setIsSubmittingAspirasi(true);

    try {
      // Coba rekam ke tabel Supabase jika ada
      await supabase.from("aspirasi").insert([
        {
          nama: aspirasiData.isAnonim ? "Anonim" : aspirasiData.nama,
          is_anonim: aspirasiData.isAnonim,
          kategori: aspirasiData.kategori,
          isi: aspirasiData.isi,
          created_at: new Date().toISOString(),
        },
      ]);
    } catch {
      // Graceful fallback jika tabel belum ada
    }

    setIsSubmittingAspirasi(false);
    setIsSentAspirasi(true);
  };

  const faqs = [
    {
      q: "Bagaimana alur pengajuan Media Partner atau Kolaborasi Event?",
      a: "Kamu bisa mengisi formulir di halaman ini dengan memilih kategori 'Media Partner / Kolaborasi' atau langsung menghubungi narahubung Humas & Kemitraan via WhatsApp. Tim Relasi HIMSIKA akan membalas maksimal 1x24 jam kerja.",
    },
    {
      q: "Apakah aspirasi dan kritik di kotak aspirasi dijamin kerahasiaannya?",
      a: "Ya! Kami menyediakan opsi 'Kirim sebagai Anonim'. Segala masukan yang masuk akan langsung kami jadikan bahan evaluasi rapat pengurus tanpa mempublikasikan identitas pengirim.",
    },
    {
      q: "Di mana lokasi sekretariat fisik HIMSIKA?",
      a: "Sekretariat HIMSIKA berada di lingkungan Gedung Fakultas Ilmu Komputer (Fasilkom), Kampus Universitas Singaperbangsa Karawang (UNSIKA), Jl. HS. Ronggo Waluyo, Puseurjaya, Telukjambe Timur, Karawang.",
    },
    {
      q: "Kapan jam aktif pelayanan dan respon narahubung?",
      a: "Narahubung kami aktif melayani pesan pada hari Senin hingga Sabtu pukul 08.00 - 20.00 WIB. Pesan di luar jam operasional akan direspon pada sesi pelayanan berikutnya.",
    },
    {
      q: "Bagaimana jika ingin mengajukan studi banding atau kunjungan himpunan?",
      a: "Silakan kirimkan surat permohonan resmi dan proposal kunjungan ke email resmi kami di himsika@cs.unsika.ac.id atau koordinasikan terlebih dahulu dengan Divisi Relasi kami via WhatsApp.",
    },
  ];

  return (
    <div className="min-h-screen bg-page font-primary text-white pb-24 relative overflow-hidden selection:bg-accent selection:text-deep">
      {/* ================= 1. ELEMEN LATAR PENDUKUNG (TIDAK FLAT) ================= */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Motif Garis Halus Identitas HIMSIKA (R-07 & DESIGN.md) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_30%,#000_70%,transparent_100%)]"></div>

        {/* Ambient Radial Glow Orbs */}
        <div
          className="absolute w-[36rem] h-[36rem] rounded-full blur-[140px] bg-accent/10 -top-20 left-1/4 -translate-x-1/2 animate-pulse"
          style={{ animationDuration: "8s" }}
        ></div>
        <div
          className="absolute w-[32rem] h-[32rem] rounded-full blur-[130px] bg-info/10 top-1/2 -right-20 animate-pulse"
          style={{ animationDuration: "7s" }}
        ></div>
        <div
          className="absolute w-[28rem] h-[28rem] rounded-full blur-[120px] bg-primary/30 bottom-10 -left-20 animate-pulse"
          style={{ animationDuration: "9s" }}
        ></div>

        {/* Ornamen Geometris SVG Melayang (Sesuai Gaya Edufair & ISCT) */}
        <div className="absolute top-36 left-8 sm:left-16 animate-[spin_12s_linear_infinite] text-accent/25">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C12 6.62742 6.62742 12 0 12C6.62742 12 12 17.3726 12 24C12 17.3726 17.3726 12 24 12C17.3726 12 12 6.62742 12 0Z" />
          </svg>
        </div>
        <div className="absolute top-1/4 right-8 sm:right-20 animate-[spin_16s_linear_infinite_reverse] text-white/10">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="3" />
          </svg>
        </div>
        <div
          className="absolute bottom-1/3 left-6 sm:left-16 animate-bounce text-info/20"
          style={{ animationDuration: "6s" }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="9" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 relative z-10">
        {/* Header Halaman */}
        <PageHeader
          judul="Hubungi"
          sorot="HIMSIKA"
          deskripsi="Pintu komunikasi terbuka untuk pertanyaan, ajakan kolaborasi, kemitraan sponsor, serta aspirasi mahasiswa demi kemajuan Sistem Informasi UNSIKA."
        />

        {/* 2. QUICK HIGHLIGHT PILLS (STATUS OPERASIONAL & LAYANAN) */}
        <div className="flex flex-wrap items-center justify-center gap-3 -mt-6 mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/90 border border-border shadow-lg text-xs backdrop-blur-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-white/80 font-medium">Jam Pelayanan:</span>
            <span className="text-accent font-bold">Senin - Sabtu (08.00 - 20.00 WIB)</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/90 border border-border shadow-lg text-xs backdrop-blur-sm">
            <Clock className="w-3.5 h-3.5 text-accent" />
            <span className="text-white/80 font-medium">Respon Cepat:</span>
            <span className="text-white font-bold">&lt; 2 Jam Kerja</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/90 border border-border shadow-lg text-xs backdrop-blur-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
            <span className="text-white/80 font-medium">Aspirasi:</span>
            <span className="text-accent font-bold">100% Bebas Anonim</span>
          </div>
        </div>

        {/* 3. SECTION UTAMA: NARAHUBUNG RESMI / CONTACT PERSON (SETEMA DENGAN PAGE LAIN) */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-bold uppercase tracking-wider mb-3">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Tim Layanan & Komunikasi</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Contact <span className="text-accent">Person</span>
            </h2>
            <p className="text-sm text-white/70 mt-2">
              Hubungi langsung fungsionaris Divisi Relasi HIMSIKA melalui WhatsApp untuk respon cepat dan konsultasi langsung.
            </p>
          </div>

          {/* Grid Kartu Contact Person Resmi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Contact Person 1: Muhammad Daffa A. P. */}
            <Reveal delay={0.1}>
              <div className="group rounded-3xl overflow-hidden bg-card/90 border border-border hover:border-accent/60 transition-all duration-300 shadow-xl hover:-translate-y-1.5 flex flex-col sm:flex-row relative">
                {/* Glow Efek Sudut */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/15 rounded-full blur-2xl pointer-events-none group-hover:bg-accent/25 transition-all"></div>

                {/* Foto Pengurus */}
                <div className="sm:w-44 aspect-[4/5] sm:aspect-auto overflow-hidden bg-surface relative shrink-0">
                  <img
                    src={fotoDaffa}
                    alt="Muhammad Daffa A. P. - Humas & Informasi"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-deep/90 via-deep/30 to-transparent sm:from-transparent sm:to-deep/90 opacity-70"></div>
                </div>

                {/* Detail Narahubung */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-accent/15 text-accent border border-accent/30 uppercase tracking-wider">
                        Humas & Informasi
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                        Aktif
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold text-white group-hover:text-accent transition-colors leading-snug">
                      Muhammad Daffa A. P.
                    </h3>
                    <p className="text-xs text-white/60 mt-1 mb-4">
                      Fungsionaris Divisi Relasi &bull; Pelayanan Informasi Umum, Kerja Sama Media, dan Narahubung Mahasiswa.
                    </p>

                    <div className="p-2.5 rounded-xl bg-deep/80 border border-border text-xs font-mono text-accent flex items-center justify-between mb-5">
                      <span className="text-white/50 text-[11px]">WhatsApp:</span>
                      <span className="font-bold">+62 878-5720-3936</span>
                    </div>
                  </div>

                  <a
                    href="https://wa.me/6287857203936?text=Halo%20Kang%20Daffa%20(Humas%20HIMSIKA),%20saya%20ingin%20bertanya%20seputar%20informasi%20himpunan."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-deep font-extrabold text-xs flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.35)] cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat WhatsApp Daffa</span>
                  </a>
                </div>
              </div>
            </Reveal>

            {/* Contact Person 2: Refaya Nindya Secondita */}
            <Reveal delay={0.2}>
              <div className="group rounded-3xl overflow-hidden bg-card/90 border border-border hover:border-accent/60 transition-all duration-300 shadow-xl hover:-translate-y-1.5 flex flex-col sm:flex-row relative">
                {/* Glow Efek Sudut */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/15 rounded-full blur-2xl pointer-events-none group-hover:bg-accent/25 transition-all"></div>

                {/* Foto Pengurus */}
                <div className="sm:w-44 aspect-[4/5] sm:aspect-auto overflow-hidden bg-surface relative shrink-0">
                  <img
                    src={fotoRefaya}
                    alt="Refaya Nindya Secondita - Kemitraan & Administrasi"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-deep/90 via-deep/30 to-transparent sm:from-transparent sm:to-deep/90 opacity-70"></div>
                </div>

                {/* Detail Narahubung */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-accent/15 text-accent border border-accent/30 uppercase tracking-wider">
                        Kemitraan & Admin
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                        Aktif
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold text-white group-hover:text-accent transition-colors leading-snug">
                      Refaya Nindya Secondita
                    </h3>
                    <p className="text-xs text-white/60 mt-1 mb-4">
                      Fungsionaris Divisi Relasi &bull; Hubungan Antar Lembaga, Proposal Sponsorship, dan Administrasi Kemitraan.
                    </p>

                    <div className="p-2.5 rounded-xl bg-deep/80 border border-border text-xs font-mono text-accent flex items-center justify-between mb-5">
                      <span className="text-white/50 text-[11px]">WhatsApp:</span>
                      <span className="font-bold">+62 881-0245-01248</span>
                    </div>
                  </div>

                  <a
                    href="https://wa.me/62881024501248?text=Halo%20Teh%20Refaya%20(Kemitraan%20HIMSIKA),%20saya%20ingin%20mengajukan%20kerja%20sama%20atau%20proposal%20kegiatan."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-deep font-extrabold text-xs flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.35)] cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat WhatsApp Refaya</span>
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* 4. KARTU SEKRETARIAT & KANAL RESMI (Grid 2 Kolom) */}
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {/* Kartu 1: Alamat Sekretariat Fisik */}
            <div className="bg-surface/85 border border-border/80 hover:border-accent/50 rounded-3xl p-7 transition-all duration-300 shadow-xl relative flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/30 text-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-accent px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                    Fakultas Ilmu Komputer
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Sekretariat HIMSIKA</h3>
                <p className="text-sm text-white/70 leading-relaxed mb-6">
                  Kampus Universitas Singaperbangsa Karawang (UNSIKA).
                  <br />
                  <span className="text-white/50 text-xs mt-1.5 block leading-normal">
                    Jl. HS.Ronggo Waluyo, Puseurjaya, Kec. Telukjambe Timur, Kabupaten Karawang, Jawa Barat 41361.
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/90 border border-white/10 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Alamat Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-accent" />
                      <span>Salin Alamat Lengkap</span>
                    </>
                  )}
                </button>
                <a
                  href="https://maps.google.com/maps?q=Universitas%20Singaperbangsa%20Karawang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/90 border border-white/10 flex items-center justify-center transition-colors cursor-pointer"
                  title="Buka Google Maps"
                >
                  <ExternalLink className="w-4 h-4 text-accent" />
                </a>
              </div>
            </div>

            {/* Kartu 2: Surel Resmi & Sosial Media */}
            <div className="bg-surface/85 border border-border/80 hover:border-accent/50 rounded-3xl p-7 transition-all duration-300 shadow-xl relative flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/30 text-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-accent px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                    Kanal Terverifikasi
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">Surel & Media Sosial</h3>
                <p className="text-sm text-white/70 leading-relaxed mb-4">
                  Surat menyurat resmi, proposal kemitraan, serta update kegiatan terkini:
                </p>

                <a
                  href="mailto:himsika@cs.unsika.ac.id"
                  className="block p-3 rounded-xl bg-white/5 hover:bg-accent/10 border border-white/10 hover:border-accent/40 transition-all mb-4 text-center group/mail"
                >
                  <span className="text-[11px] text-white/50 block mb-0.5">Email Resmi Himpunan</span>
                  <span className="text-sm font-bold text-accent group-hover/mail:underline flex items-center justify-center gap-1.5">
                    <AtSign className="w-3.5 h-3.5" />
                    himsika@cs.unsika.ac.id
                  </span>
                </a>
              </div>

              <div>
                <span className="text-xs text-white/50 block mb-2 font-semibold">
                  Media Sosial Resmi:
                </span>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50">
                  <a
                    href="https://www.instagram.com/himsika/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-accent hover:text-deep border border-white/10 flex flex-col items-center justify-center gap-1 transition-all text-xs font-semibold"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                    <span>Instagram</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/himpunan-mahasiswa-sistem-informasi-himsika-108636243/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-accent hover:text-deep border border-white/10 flex flex-col items-center justify-center gap-1 transition-all text-xs font-semibold"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href="https://youtube.com/@himpunanmahasiswasisteminf8699?si=lZ6B6DmKq5gw9Q5c"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-accent hover:text-deep border border-white/10 flex flex-col items-center justify-center gap-1 transition-all text-xs font-semibold"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" clipRule="evenodd" />
                    </svg>
                    <span>YouTube</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* 5. DUAL FORM & PETA LOKASI INTERAKTIF */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {/* Kolom Kiri: Dual Form (Hubungi Kami / Kotak Aspirasi) */}
          <div className="lg:col-span-7">
            <Reveal>
              <div className="bg-surface/90 border border-border rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                {/* Tab Switcher */}
                <div className="flex items-center gap-2 p-1.5 bg-deep/90 rounded-2xl border border-border mb-8">
                  <button
                    type="button"
                    onClick={() => setActiveTab("pesan")}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      activeTab === "pesan"
                        ? "bg-accent text-deep shadow-md font-extrabold"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <HeartHandshake className="w-4 h-4" />
                    <span>Kirim Pesan / Kemitraan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("aspirasi")}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      activeTab === "aspirasi"
                        ? "bg-accent text-deep shadow-md font-extrabold"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <MessageSquareHeart className="w-4 h-4" />
                    <span>Kotak Aspirasi Mahasiswa</span>
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {/* TAB 1: FORM HUBUNGI KAMI */}
                  {activeTab === "pesan" && (
                    <motion.div
                      key="tab-pesan"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="mb-6">
                        <h3 className="text-2xl font-black text-white tracking-tight">
                          Tinggalkan Pesan Untuk Kami
                        </h3>
                        <p className="text-sm text-white/70 mt-1">
                          Silakan isi data diri dan perihal pesan. Kami akan menghubungi
                          kamu kembali secepat mungkin.
                        </p>
                      </div>

                      {isSentPesan ? (
                        <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center my-4">
                          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-4">
                            <CheckCircle2 className="w-8 h-8" />
                          </div>
                          <h4 className="text-xl font-bold text-white mb-2">
                            Pesan Berhasil Diterima!
                          </h4>
                          <p className="text-sm text-white/80 max-w-md mx-auto mb-6 leading-relaxed">
                            Terima kasih telah menghubungi HIMSIKA. Tim kami akan segera meninjau pesan kamu. Kamu juga bisa langsung membuka percakapan cepat via WhatsApp.
                          </p>

                          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <button
                              type="button"
                              onClick={handleOpenWhatsAppPesan}
                              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-deep font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>Lanjut Chat ke WhatsApp</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsSentPesan(false);
                                setFormData({
                                  nama: "",
                                  email: "",
                                  whatsapp: "",
                                  perihal: "Pertanyaan Umum",
                                  pesan: "",
                                });
                              }}
                              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors cursor-pointer"
                            >
                              Kirim Pesan Lain
                            </button>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmitPesan} className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-white/80 mb-1.5">
                                Nama Lengkap <span className="text-accent">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={formData.nama}
                                onChange={(e) =>
                                  setFormData({ ...formData, nama: e.target.value })
                                }
                                placeholder="Contoh: Muhammad Hanif"
                                className="w-full px-4 py-3 rounded-xl bg-deep/90 border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm text-white placeholder-white/30 transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-white/80 mb-1.5">
                                Alamat Email <span className="text-accent">*</span>
                              </label>
                              <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) =>
                                  setFormData({ ...formData, email: e.target.value })
                                }
                                placeholder="nama@email.com"
                                className="w-full px-4 py-3 rounded-xl bg-deep/90 border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm text-white placeholder-white/30 transition-all"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-white/80 mb-1.5">
                                No. WhatsApp (Opsional)
                              </label>
                              <input
                                type="tel"
                                value={formData.whatsapp}
                                onChange={(e) =>
                                  setFormData({ ...formData, whatsapp: e.target.value })
                                }
                                placeholder="08xxxxxxxxxx"
                                className="w-full px-4 py-3 rounded-xl bg-deep/90 border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm text-white placeholder-white/30 transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-white/80 mb-1.5">
                                Perihal <span className="text-accent">*</span>
                              </label>
                              <select
                                value={formData.perihal}
                                onChange={(e) =>
                                  setFormData({ ...formData, perihal: e.target.value })
                                }
                                className="w-full px-4 py-3 rounded-xl bg-deep/90 border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm text-white transition-all cursor-pointer"
                              >
                                <option value="Pertanyaan Umum">Pertanyaan Umum</option>
                                <option value="Media Partner / Kolaborasi">
                                  Media Partner / Kolaborasi
                                </option>
                                <option value="Sponsorship & Kemitraan">
                                  Sponsorship & Kemitraan
                                </option>
                                <option value="Studi Banding / Kunjungan">
                                  Studi Banding / Kunjungan
                                </option>
                                <option value="Bisnis & Pemesanan Jasa">
                                  Bisnis & Pemesanan Jasa
                                </option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1.5">
                              Isi Pesan <span className="text-accent">*</span>
                            </label>
                            <textarea
                              required
                              rows={4}
                              value={formData.pesan}
                              onChange={(e) =>
                                setFormData({ ...formData, pesan: e.target.value })
                              }
                              placeholder="Tuliskan pesan, pertanyaan, atau detail pengajuan kerja sama kamu..."
                              className="w-full px-4 py-3 rounded-xl bg-deep/90 border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm text-white placeholder-white/30 transition-all resize-y"
                            ></textarea>
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmittingPesan}
                            className="w-full py-3.5 px-6 rounded-xl bg-accent hover:bg-accent-hover text-deep font-black text-sm tracking-wide flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(255,195,0,0.4)] cursor-pointer disabled:opacity-60"
                          >
                            <Send className="w-4 h-4" />
                            <span>
                              {isSubmittingPesan ? "Mengirim Pesan..." : "Kirim Pesan Sekarang"}
                            </span>
                          </button>
                        </form>
                      )}
                    </motion.div>
                  )}

                  {/* TAB 2: FORM KRITIK & SARAN (KOTAK ASPIRASI) */}
                  {activeTab === "aspirasi" && (
                    <motion.div
                      key="tab-aspirasi"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-bold mb-2">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Privasi Terjaga & Terbuka untuk Anonim</span>
                        </div>
                        <h3 className="text-2xl font-black text-white tracking-tight">
                          Kotak Aspirasi & Evaluasi
                        </h3>
                        <p className="text-sm text-white/70 mt-1">
                          Kritik membangun, aspirasi akademik, saran proker, atau evaluasi
                          kinerja HIMSIKA sangat berharga demi perbaikan bersama.
                        </p>
                      </div>

                      {isSentAspirasi ? (
                        <div className="p-8 rounded-2xl bg-accent/10 border border-accent/30 text-center my-4">
                          <div className="w-14 h-14 rounded-full bg-accent/20 text-accent mx-auto flex items-center justify-center mb-4">
                            <Sparkles className="w-8 h-8" />
                          </div>
                          <h4 className="text-xl font-bold text-white mb-2">
                            Aspirasi Kamu Telah Diterima!
                          </h4>
                          <p className="text-sm text-white/80 max-w-md mx-auto mb-6 leading-relaxed">
                            Terima kasih banyak atas kepedulian dan kontribusimu. Masukan
                            ini akan kami bawa ke rapat evaluasi pimpinan HIMSIKA.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setIsSentAspirasi(false);
                              setAspirasiData({
                                nama: "",
                                isAnonim: false,
                                kategori: "Program Kerja & Event",
                                isi: "",
                              });
                            }}
                            className="px-5 py-2.5 rounded-xl bg-accent text-deep font-bold text-xs transition-colors cursor-pointer"
                          >
                            Kirim Aspirasi Lain
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmitAspirasi} className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-bold text-white/80">
                                  Nama / Inisial
                                </label>
                                <label className="text-[11px] text-accent flex items-center gap-1.5 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={aspirasiData.isAnonim}
                                    onChange={(e) =>
                                      setAspirasiData({
                                        ...aspirasiData,
                                        isAnonim: e.target.checked,
                                      })
                                    }
                                    className="rounded border-border text-accent focus:ring-accent"
                                  />
                                  <span>Kirim Anonim</span>
                                </label>
                              </div>
                              <input
                                type="text"
                                disabled={aspirasiData.isAnonim}
                                value={
                                  aspirasiData.isAnonim
                                    ? "Anonim (Identitas Dirahasiakan)"
                                    : aspirasiData.nama
                                }
                                onChange={(e) =>
                                  setAspirasiData({
                                    ...aspirasiData,
                                    nama: e.target.value,
                                  })
                                }
                                placeholder="Tuliskan nama atau inisial..."
                                className={`w-full px-4 py-3 rounded-xl bg-deep/90 border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm text-white placeholder-white/30 transition-all ${
                                  aspirasiData.isAnonim
                                    ? "opacity-60 cursor-not-allowed italic"
                                    : ""
                                }`}
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-white/80 mb-1.5">
                                Bidang / Kategori Aspirasi
                              </label>
                              <select
                                value={aspirasiData.kategori}
                                onChange={(e) =>
                                  setAspirasiData({
                                    ...aspirasiData,
                                    kategori: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-3 rounded-xl bg-deep/90 border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm text-white transition-all cursor-pointer"
                              >
                                <option value="Program Kerja & Event">
                                  Program Kerja & Event
                                </option>
                                <option value="Akademik & Advokasi Mahasiswa">
                                  Akademik & Advokasi Mahasiswa
                                </option>
                                <option value="Fasilitas & Pelayanan Himpunan">
                                  Fasilitas & Pelayanan Himpunan
                                </option>
                                <option value="Komunikasi & Media Sosial">
                                  Komunikasi & Media Sosial
                                </option>
                                <option value="Kritik Umum & Lainnya">
                                  Kritik Umum & Lainnya
                                </option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1.5">
                              Sampaikan Kritik / Saran / Aspirasi{" "}
                              <span className="text-accent">*</span>
                            </label>
                            <textarea
                              required
                              rows={5}
                              value={aspirasiData.isi}
                              onChange={(e) =>
                                setAspirasiData({
                                  ...aspirasiData,
                                  isi: e.target.value,
                                })
                              }
                              placeholder="Tuliskan saran, keresahan, atau kritik membangun kamu secara lugas dan terbuka..."
                              className="w-full px-4 py-3 rounded-xl bg-deep/90 border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm text-white placeholder-white/30 transition-all resize-y"
                            ></textarea>
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmittingAspirasi}
                            className="w-full py-3.5 px-6 rounded-xl bg-accent hover:bg-accent-hover text-deep font-black text-sm tracking-wide flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(255,195,0,0.4)] cursor-pointer disabled:opacity-60"
                          >
                            <Send className="w-4 h-4" />
                            <span>
                              {isSubmittingAspirasi ? "Mengirim Aspirasi..." : "Kirimkan Aspirasi Saya"}
                            </span>
                          </button>
                        </form>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          </div>

          {/* Kolom Kanan: Google Maps Responsif & Info Tambahan */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            <Reveal>
              <div className="bg-surface/85 border border-border rounded-3xl p-6 shadow-xl h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-accent" />
                      <span>Peta Lokasi Kampus</span>
                    </h3>
                    <span className="text-xs text-white/60 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                      Karawang, Jawa Barat
                    </span>
                  </div>

                  {/* Google Maps Embed dengan wrapper data-lenis-prevent */}
                  <div
                    data-lenis-prevent
                    className="w-full h-[280px] sm:h-[320px] rounded-2xl overflow-hidden border border-border/80 relative shadow-inner mb-4"
                  >
                    <iframe
                      title="Lokasi Universitas Singaperbangsa Karawang"
                      src="https://maps.google.com/maps?q=Universitas%20Singaperbangsa%20Karawang&t=m&z=15&output=embed&iwloc=near"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full grayscale-[15%] contrast-[105%] hover:grayscale-0 transition-all duration-300"
                    ></iframe>
                  </div>
                </div>

                <div className="bg-deep/80 rounded-2xl p-4 border border-border/60">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-accent/10 text-accent shrink-0 mt-0.5">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white mb-1">
                        Ingin Berkunjung Langsung?
                      </h4>
                      <p className="text-[12px] text-white/70 leading-relaxed">
                        Silakan konfirmasi terlebih dahulu via narahubung WhatsApp
                        sebelum berkunjung ke ruangan sekretariat HIMSIKA agar fungsionaris
                        kami dapat menyambutmu dengan hangat.
                      </p>
                      <a
                        href="https://maps.google.com/maps?q=Universitas%20Singaperbangsa%20Karawang"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-accent font-bold hover:underline mt-2.5"
                      >
                        <span>Petunjuk Rute Google Maps</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* 6. TANYA JAWAB (FAQ) SEPUTAR HUBUNGI KAMI (Accordion Interaktif) */}
        <Reveal>
          <div className="border-t border-border/60 pt-16">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Pertanyaan yang <span className="text-accent">Sering Diajukan</span>
              </h2>
              <p className="text-sm text-white/70 mt-2">
                Jawaban ringkas seputar interaksi, kerja sama, dan penyampaian aspirasi di HIMSIKA.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="bg-surface/75 border border-border rounded-2xl overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                    >
                      <span className="font-bold text-sm sm:text-base text-white flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-extrabold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-accent transition-transform duration-300 shrink-0 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="p-5 pt-0 border-t border-border/30 text-xs sm:text-sm text-white/75 leading-relaxed pl-14">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
