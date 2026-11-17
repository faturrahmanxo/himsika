import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Mail,
  Send,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
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

  // State Accordion FAQ
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
      // Graceful fallback
    }

    setIsSubmittingPesan(false);
    setIsSentPesan(true);
  };

  const handleOpenWhatsAppPesan = () => {
    const textWA = `Halo Pengurus HIMSIKA,%0A%0ASaya *${encodeURIComponent(
      formData.nama,
    )}* (${encodeURIComponent(formData.email)} / ${encodeURIComponent(
      formData.whatsapp || "-",
    )}).%0A%0A*Perihal:* ${encodeURIComponent(
      formData.perihal,
    )}%0A*Pesan:*%0A${encodeURIComponent(formData.pesan)}`;
    window.open(`https://wa.me/6287857203936?text=${textWA}`, "_blank");
  };

  const handleSubmitAspirasi = async (e) => {
    e.preventDefault();
    setIsSubmittingAspirasi(true);

    try {
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
      // Graceful fallback
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
      {/* Background Identitas HIMSIKA (Tenang, elegan, tanpa ornamen berkedip) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_30%,#000_70%,transparent_100%)]"></div>
        <div className="absolute w-[36rem] h-[36rem] rounded-full blur-[160px] bg-accent/10 -top-24 left-1/4 -translate-x-1/2"></div>
        <div className="absolute w-[30rem] h-[30rem] rounded-full blur-[160px] bg-primary/30 bottom-10 -left-20"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Halaman (Spasi lapang agar tidak pernah tertutup navbar) */}
        <header className="pt-36 pb-12 sm:pt-40 sm:pb-16 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05]">
              Hubungi <span className="text-accent">HIMSIKA</span>
            </h1>
            <p className="mt-4 sm:mt-5 text-base sm:text-lg text-white/70 leading-relaxed max-w-2xl mx-auto">
              Pintu komunikasi resmi untuk pertanyaan informasi, kemitraan sponsor, kerja sama antar lembaga, serta kotak aspirasi mahasiswa.
            </p>
          </motion.div>
        </header>

        {/* 1. SECTION CONTACT PERSON RESMI (Simpel & Elegan) */}
        <section className="mb-20">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Contact <span className="text-accent">Person</span>
            </h2>
            <p className="text-xs sm:text-sm text-white/60 mt-1.5">
              Hubungi fungsionaris kami langsung melalui WhatsApp untuk konsultasi dan respon cepat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Contact Person 1: Muhammad Daffa A. P. */}
            <div className="rounded-3xl bg-card border border-border hover:border-accent/50 transition-all duration-300 shadow-xl p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-center sm:items-start">
              <div className="w-28 sm:w-32 aspect-square rounded-2xl overflow-hidden bg-surface shrink-0 border border-white/10">
                <img
                  src={fotoDaffa}
                  alt="Muhammad Daffa A. P."
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 text-center sm:text-left flex flex-col justify-between h-full">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-accent/15 text-accent border border-accent/25 mb-2">
                    Humas &amp; Informasi
                  </span>
                  <h3 className="text-lg font-bold text-white leading-snug">
                    Muhammad Daffa A. P.
                  </h3>
                  <p className="text-xs text-white/60 mt-1 mb-3 leading-relaxed">
                    Pelayanan Informasi Umum, Kerja Sama Media, dan Narahubung Mahasiswa.
                  </p>
                  <p className="text-xs font-mono text-white/80 mb-4">
                    WhatsApp: <span className="text-accent font-semibold">+62 878-5720-3936</span>
                  </p>
                </div>

                <a
                  href="https://wa.me/6287857203936?text=Halo%20Kang%20Daffa%20(Humas%20HIMSIKA),%20saya%20ingin%20bertanya%20seputar%20informasi%20himpunan."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-accent text-[#043761] hover:bg-accent-hover font-bold text-xs text-center transition-colors shadow-md"
                >
                  Chat WhatsApp Daffa
                </a>
              </div>
            </div>

            {/* Contact Person 2: Refaya Nindya Secondita */}
            <div className="rounded-3xl bg-card border border-border hover:border-accent/50 transition-all duration-300 shadow-xl p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-center sm:items-start">
              <div className="w-28 sm:w-32 aspect-square rounded-2xl overflow-hidden bg-surface shrink-0 border border-white/10">
                <img
                  src={fotoRefaya}
                  alt="Refaya Nindya Secondita"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 text-center sm:text-left flex flex-col justify-between h-full">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-accent/15 text-accent border border-accent/25 mb-2">
                    Kemitraan &amp; Administrasi
                  </span>
                  <h3 className="text-lg font-bold text-white leading-snug">
                    Refaya Nindya Secondita
                  </h3>
                  <p className="text-xs text-white/60 mt-1 mb-3 leading-relaxed">
                    Hubungan Antar Lembaga, Proposal Sponsorship, dan Administrasi Kemitraan.
                  </p>
                  <p className="text-xs font-mono text-white/80 mb-4">
                    WhatsApp: <span className="text-accent font-semibold">+62 881-0245-01248</span>
                  </p>
                </div>

                <a
                  href="https://wa.me/62881024501248?text=Halo%20Teh%20Refaya%20(Kemitraan%20HIMSIKA),%20saya%20ingin%20mengajukan%20kerja%20sama%20atau%20proposal%20kegiatan."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-accent text-[#043761] hover:bg-accent-hover font-bold text-xs text-center transition-colors shadow-md"
                >
                  Chat WhatsApp Refaya
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 2. KARTU SEKRETARIAT & KANAL RESMI */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {/* Kartu 1: Alamat Sekretariat */}
          <div className="bg-surface/85 border border-border hover:border-accent/40 rounded-3xl p-7 transition-all shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-accent uppercase tracking-wider">
                  Sekretariat Fisik
                </span>
                <span className="text-[11px] text-white/60 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                  Fakultas Ilmu Komputer
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Gedung HIMSIKA UNSIKA</h3>
              <p className="text-sm text-white/70 leading-relaxed mb-6">
                Kampus Universitas Singaperbangsa Karawang.
                <br />
                <span className="text-white/50 text-xs mt-1 block">
                  Jl. HS.Ronggo Waluyo, Puseurjaya, Kec. Telukjambe Timur, Kabupaten Karawang, Jawa Barat 41361.
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-border/50">
              <button
                type="button"
                onClick={handleCopyAddress}
                className="flex-1 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/90 border border-white/10 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Alamat Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-accent" />
                    <span>Salin Alamat</span>
                  </>
                )}
              </button>
              <a
                href="https://maps.google.com/maps?q=Universitas%20Singaperbangsa%20Karawang"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/90 border border-white/10 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Buka Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-accent" />
              </a>
            </div>
          </div>

          {/* Kartu 2: Surel & Media Sosial */}
          <div className="bg-surface/85 border border-border hover:border-accent/40 rounded-3xl p-7 transition-all shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-accent uppercase tracking-wider">
                  Kanal Resmi
                </span>
                <span className="text-[11px] text-white/60 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                  Terverifikasi
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Surel &amp; Media Sosial</h3>
              <p className="text-sm text-white/70 leading-relaxed mb-4">
                Surat menyurat dinas, proposal kerja sama, dan publikasi kegiatan:
              </p>

              <a
                href="mailto:himsika@cs.unsika.ac.id"
                className="block p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all mb-4 text-center"
              >
                <span className="text-[11px] text-white/50 block mb-0.5">Email Resmi Himpunan</span>
                <span className="text-sm font-bold text-accent">himsika@cs.unsika.ac.id</span>
              </a>
            </div>

            <div>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/50 text-center">
                <a
                  href="https://www.instagram.com/himsika/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 rounded-xl bg-white/5 hover:bg-accent hover:text-[#043761] border border-white/10 text-xs font-semibold transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="https://www.linkedin.com/in/himpunan-mahasiswa-sistem-informasi-himsika-108636243/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 rounded-xl bg-white/5 hover:bg-accent hover:text-[#043761] border border-white/10 text-xs font-semibold transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href="https://youtube.com/@himpunanmahasiswasisteminf8699?si=lZ6B6DmKq5gw9Q5c"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 rounded-xl bg-white/5 hover:bg-accent hover:text-[#043761] border border-white/10 text-xs font-semibold transition-colors"
                >
                  YouTube
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 3. DUAL FORM & PETA LOKASI */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 items-start">
          {/* Kolom Form */}
          <div className="lg:col-span-7">
            <div className="bg-surface/90 border border-border rounded-3xl p-6 sm:p-8 shadow-xl">
              {/* Tab Switcher */}
              <div className="flex items-center gap-2 p-1.5 bg-deep/90 rounded-2xl border border-border mb-8">
                <button
                  type="button"
                  onClick={() => setActiveTab("pesan")}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === "pesan"
                      ? "bg-accent text-[#043761] shadow-md"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Kirim Pesan / Kemitraan
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("aspirasi")}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === "aspirasi"
                      ? "bg-accent text-[#043761] shadow-md"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Kotak Aspirasi
                </button>
              </div>

              <AnimatePresence mode="wait">
                {/* TAB 1: FORM HUBUNGI KAMI */}
                {activeTab === "pesan" && (
                  <motion.div
                    key="tab-pesan"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="mb-6">
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        Tinggalkan Pesan
                      </h3>
                      <p className="text-xs sm:text-sm text-white/60 mt-1">
                        Isi form di bawah ini dan kami akan segera merespons pesan kamu.
                      </p>
                    </div>

                    {isSentPesan ? (
                      <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center my-4">
                        <h4 className="text-lg font-bold text-white mb-2">
                          Pesan Berhasil Terkirim!
                        </h4>
                        <p className="text-xs sm:text-sm text-white/80 max-w-md mx-auto mb-5 leading-relaxed">
                          Terima kasih telah menghubungi HIMSIKA. Pengurus kami akan segera meninjau pesan kamu.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={handleOpenWhatsAppPesan}
                            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-accent text-[#043761] font-bold text-xs cursor-pointer"
                          >
                            Lanjut Chat ke WhatsApp
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
                            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white cursor-pointer"
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
                              placeholder="Nama kamu..."
                              className="w-full px-4 py-2.5 rounded-xl bg-deep/90 border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm text-white placeholder-white/30"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1.5">
                              Email <span className="text-accent">*</span>
                            </label>
                            <input
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                              }
                              placeholder="nama@email.com"
                              className="w-full px-4 py-2.5 rounded-xl bg-deep/90 border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm text-white placeholder-white/30"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1.5">
                              WhatsApp (Opsional)
                            </label>
                            <input
                              type="tel"
                              value={formData.whatsapp}
                              onChange={(e) =>
                                setFormData({ ...formData, whatsapp: e.target.value })
                              }
                              placeholder="08xxxxxxxxxx"
                              className="w-full px-4 py-2.5 rounded-xl bg-deep/90 border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm text-white placeholder-white/30"
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
                              className="w-full px-4 py-2.5 rounded-xl bg-deep/90 border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm text-white cursor-pointer"
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
                            Pesan <span className="text-accent">*</span>
                          </label>
                          <textarea
                            required
                            rows={4}
                            value={formData.pesan}
                            onChange={(e) =>
                              setFormData({ ...formData, pesan: e.target.value })
                            }
                            placeholder="Tuliskan pesan atau detail kerja sama..."
                            className="w-full px-4 py-2.5 rounded-xl bg-deep/90 border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm text-white placeholder-white/30 resize-none overflow-y-auto [scrollbar-width:none]"
                          ></textarea>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmittingPesan}
                          className="w-full py-3 px-6 rounded-xl bg-accent hover:bg-accent-hover text-[#043761] font-bold text-sm transition-colors cursor-pointer disabled:opacity-60"
                        >
                          {isSubmittingPesan ? "Mengirim..." : "Kirim Pesan"}
                        </button>
                      </form>
                    )}
                  </motion.div>
                )}

                {/* TAB 2: FORM KOTAK ASPIRASI */}
                {activeTab === "aspirasi" && (
                  <motion.div
                    key="tab-aspirasi"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="mb-6">
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        Kotak Aspirasi Mahasiswa
                      </h3>
                      <p className="text-xs sm:text-sm text-white/60 mt-1">
                        Sampaikan masukan, kritik membangun, atau aspirasi demi kemajuan HIMSIKA.
                      </p>
                    </div>

                    {isSentAspirasi ? (
                      <div className="p-6 rounded-2xl bg-accent/10 border border-accent/30 text-center my-4">
                        <h4 className="text-lg font-bold text-white mb-2">
                          Aspirasi Berhasil Disampaikan!
                        </h4>
                        <p className="text-xs sm:text-sm text-white/80 max-w-md mx-auto mb-5 leading-relaxed">
                          Terima kasih atas aspirasi kamu. Masukan ini akan dibahas dalam evaluasi kepengurusan HIMSIKA.
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
                          className="px-5 py-2 rounded-xl bg-accent text-[#043761] font-bold text-xs cursor-pointer"
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
                                  ? "Anonim (Dirahasiakan)"
                                  : aspirasiData.nama
                              }
                              onChange={(e) =>
                                setAspirasiData({
                                  ...aspirasiData,
                                  nama: e.target.value,
                                })
                              }
                              placeholder="Nama kamu..."
                              className={`w-full px-4 py-2.5 rounded-xl bg-deep/90 border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm text-white placeholder-white/30 ${
                                aspirasiData.isAnonim
                                  ? "opacity-60 cursor-not-allowed italic"
                                  : ""
                              }`}
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1.5">
                              Kategori Aspirasi
                            </label>
                            <select
                              value={aspirasiData.kategori}
                              onChange={(e) =>
                                setAspirasiData({
                                  ...aspirasiData,
                                  kategori: e.target.value,
                                })
                              }
                              className="w-full px-4 py-2.5 rounded-xl bg-deep/90 border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm text-white cursor-pointer"
                            >
                              <option value="Program Kerja & Event">Program Kerja &amp; Event</option>
                              <option value="Akademik & Advokasi Mahasiswa">Akademik &amp; Advokasi</option>
                              <option value="Fasilitas & Pelayanan Himpunan">Fasilitas &amp; Pelayanan</option>
                              <option value="Komunikasi & Media Sosial">Komunikasi &amp; Media</option>
                              <option value="Kritik Umum & Lainnya">Kritik Umum</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-white/80 mb-1.5">
                            Isi Aspirasi <span className="text-accent">*</span>
                          </label>
                          <textarea
                            required
                            rows={4}
                            value={aspirasiData.isi}
                            onChange={(e) =>
                              setAspirasiData({
                                ...aspirasiData,
                                isi: e.target.value,
                              })
                            }
                            placeholder="Tuliskan aspirasi atau kritik kamu..."
                            className="w-full px-4 py-2.5 rounded-xl bg-deep/90 border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm text-white placeholder-white/30 resize-none overflow-y-auto [scrollbar-width:none]"
                          ></textarea>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmittingAspirasi}
                          className="w-full py-3 px-6 rounded-xl bg-accent hover:bg-accent-hover text-[#043761] font-bold text-sm transition-colors cursor-pointer disabled:opacity-60"
                        >
                          {isSubmittingAspirasi ? "Mengirim..." : "Kirimkan Aspirasi"}
                        </button>
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Kolom Peta Google Maps */}
          <div className="lg:col-span-5">
            <div className="bg-surface/85 border border-border rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span>Peta Kampus UNSIKA</span>
                </h3>
                <span className="text-xs text-white/60">Karawang, Jawa Barat</span>
              </div>

              <div
                data-lenis-prevent
                className="w-full h-[280px] sm:h-[300px] rounded-2xl overflow-hidden border border-border relative mb-4"
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
                  className="w-full h-full"
                ></iframe>
              </div>

              <p className="text-xs text-white/60 leading-relaxed">
                Ruang sekretariat berada di Fakultas Ilmu Komputer. Konfirmasi terlebih dahulu via narahubung WhatsApp jika ingin berkunjung.
              </p>
            </div>
          </div>
        </section>

        {/* 4. FAQ SEPUTAR HUBUNGI KAMI */}
        <section className="border-t border-border/60 pt-16">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Pertanyaan yang <span className="text-accent">Sering Diajukan</span>
            </h2>
            <p className="text-xs sm:text-sm text-white/60 mt-1.5">
              Jawaban seputar kemitraan, konsultasi, dan penyampaian aspirasi di HIMSIKA.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
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
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <span className="font-bold text-sm sm:text-base text-white">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-accent transition-transform duration-300 shrink-0 ${
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
                        <div className="p-4 sm:p-5 pt-0 border-t border-border/30 text-xs sm:text-sm text-white/70 leading-relaxed">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
