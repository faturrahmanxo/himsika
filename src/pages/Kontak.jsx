import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Mail,
  Phone,
  Send,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  HeartHandshake,
  MessageSquareHeart,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import Reveal from "../components/Reveal";

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
  const [isSentPesan, setIsSentPesan] = useState(false);

  // State Feedback Form Kritik & Saran
  const [aspirasiData, setAspirasiData] = useState({
    nama: "",
    isAnonim: false,
    kategori: "Program Kerja & Event",
    isi: "",
  });
  const [isSentAspirasi, setIsSentAspirasi] = useState(false);

  // State Copy Alamat
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    const alamat =
      "Jl. HS.Ronggo Waluyo, Puseurjaya, Kec. Telukjambe Timur, Kabupaten Karawang, Jawa Barat 41361";
    navigator.clipboard.writeText(alamat);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmitPesan = (e) => {
    e.preventDefault();
    setIsSentPesan(true);
    setTimeout(() => {
      // Buka opsi kirim langsung ke WhatsApp admin jika diinginkan
      const textWA = `Halo Pengurus HIMSIKA,%0A%0ASaya *${encodeURIComponent(
        formData.nama
      )}* (${encodeURIComponent(formData.email)} / ${encodeURIComponent(
        formData.whatsapp || "-"
      )}).%0A%0A*Perihal:* ${encodeURIComponent(
        formData.perihal
      )}%0A*Pesan:*%0A${encodeURIComponent(formData.pesan)}`;
      window.open(`https://wa.me/6287857203936?text=${textWA}`, "_blank");
    }, 1200);
  };

  const handleSubmitAspirasi = (e) => {
    e.preventDefault();
    setIsSentAspirasi(true);
  };

  const faqs = [
    {
      q: "Bagaimana alur pengajuan Media Partner atau Kolaborasi Event?",
      a: "Kamu bisa mengisi formulir di halaman ini dengan memilih kategori 'Media Partner / Kolaborasi' atau langsung menghubungi narahubung kami melalui WhatsApp. Tim Relasi HIMSIKA akan membalas maksimal 1x24 jam kerja.",
    },
    {
      q: "Apakah aspirasi dan kritik di kotak aspirasi dijamin kerahasiaannya?",
      a: "Ya! Kami menyediakan opsi 'Kirim sebagai Anonim'. Segala masukan yang masuk akan langsung kami jadikan bahan evaluasi rapat pengurus tanpa mempublikasikan identitas pengirim.",
    },
    {
      q: "Di mana lokasi sekretariat fisik HIMSIKA?",
      a: "Sekretariat HIMSIKA berada di lingkungan Gedung Fakultas Ilmu Komputer (Fasilkom), Kampus Universitas Singaperbangsa Karawang (UNSIKA), Jl. HS. Ronggo Waluyo, Telukjambe Timur.",
    },
    {
      q: "Kapan jam aktif pelayanan dan respon narahubung?",
      a: "Narahubung kami aktif melayani pesan pada hari Senin hingga Sabtu pukul 08.00 - 20.00 WIB. Pesan di luar jam tersebut akan direspon pada sesi pelayanan berikutnya.",
    },
  ];

  return (
    <div className="min-h-screen bg-page font-primary text-white pb-24 selection:bg-accent selection:text-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Halaman */}
        <PageHeader
          judul="Hubungi"
          sorot="HIMSIKA"
          deskripsi="Pintu komunikasi terbuka untuk pertanyaan, ajakan kolaborasi, kemitraan sponsor, serta aspirasi mahasiswa demi kemajuan Sistem Informasi UNSIKA."
        />

        {/* 1. KARTU KONTAK UTAMA (Grid 3 Kolom) */}
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* Kartu 1: Alamat Sekretariat */}
            <div className="bg-surface/80 border border-border/80 hover:border-accent/50 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 shadow-lg relative flex flex-col justify-between group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl"></div>
              <div>
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/30 text-accent flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Sekretariat</h3>
                <p className="text-sm text-white/70 leading-relaxed mb-6">
                  Gedung Fakultas Ilmu Komputer, Universitas Singaperbangsa Karawang.
                  <br />
                  <span className="text-white/50 text-xs mt-1 block">
                    Jl. HS.Ronggo Waluyo, Puseurjaya, Telukjambe Timur, Karawang 41361.
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/90 border border-white/10 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Tersalin!</span>
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
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/90 border border-white/10 flex items-center justify-center transition-colors"
                  title="Buka Google Maps"
                >
                  <ExternalLink className="w-4 h-4 text-accent" />
                </a>
              </div>
            </div>

            {/* Kartu 2: Narahubung WhatsApp (2 Narahubung seperti di WordPress) */}
            <div className="bg-surface/80 border border-border/80 hover:border-accent/50 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 shadow-lg relative flex flex-col justify-between group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl"></div>
              <div>
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/30 text-accent flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Narahubung Resmi</h3>
                <p className="text-sm text-white/70 leading-relaxed mb-4">
                  Hubungi fungsionaris kami langsung via WhatsApp untuk respon cepat:
                </p>
                <div className="space-y-3">
                  <a
                    href="https://wa.me/6287857203936"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/40 transition-all group/item"
                  >
                    <div>
                      <div className="text-xs text-white/50">Humas & Informasi</div>
                      <div className="text-sm font-bold text-white group-hover/item:text-emerald-400">
                        Muhammad Daffa A. P.
                      </div>
                    </div>
                    <span className="text-xs font-mono text-accent bg-accent/10 px-2.5 py-1 rounded-lg">
                      +62 878-5720-3936
                    </span>
                  </a>

                  <a
                    href="https://wa.me/62881024501246"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/40 transition-all group/item"
                  >
                    <div>
                      <div className="text-xs text-white/50">Kemitraan & Administrasi</div>
                      <div className="text-sm font-bold text-white group-hover/item:text-emerald-400">
                        Refaya Nindya Secondita
                      </div>
                    </div>
                    <span className="text-xs font-mono text-accent bg-accent/10 px-2.5 py-1 rounded-lg">
                      +62 881-0245-01246
                    </span>
                  </a>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-border/50 text-[11px] text-white/50 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Senin - Sabtu: 08.00 - 20.00 WIB
              </div>
            </div>

            {/* Kartu 3: Email & Media Sosial */}
            <div className="bg-surface/80 border border-border/80 hover:border-accent/50 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 shadow-lg relative flex flex-col justify-between group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl"></div>
              <div>
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/30 text-accent flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Email & Media Sosial</h3>
                <p className="text-sm text-white/70 leading-relaxed mb-4">
                  Surat menyurat resmi, proposal kerja sama, serta update kegiatan terkini:
                </p>
                <a
                  href="mailto:himsika@cs.unsika.ac.id"
                  className="block p-3 rounded-xl bg-white/5 hover:bg-accent/10 border border-white/10 hover:border-accent/40 transition-all mb-4 text-center group/mail"
                >
                  <span className="text-xs text-white/50 block mb-0.5">Email Resmi Himpunan</span>
                  <span className="text-sm font-bold text-accent group-hover/mail:underline">
                    himsika@cs.unsika.ac.id
                  </span>
                </a>
              </div>
              <div>
                <span className="text-xs text-white/50 block mb-2 font-semibold">
                  Kanal Resmi Kami:
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

        {/* 2. DUAL FORM & PETA LOKASI INTERAKTIF */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {/* Kolom Kiri: Dual Form (Hubungi Kami / Kotak Aspirasi) */}
          <div className="lg:col-span-7">
            <Reveal>
              <div className="bg-surface/90 border border-border rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                {/* Tab Switcher */}
                <div className="flex items-center gap-2 p-1.5 bg-deep/80 rounded-2xl border border-border mb-8">
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
                    <span>Kotak Aspirasi (Kritik & Saran)</span>
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
                        <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center my-6">
                          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-4">
                            <Check className="w-8 h-8" />
                          </div>
                          <h4 className="text-xl font-bold text-white mb-2">
                            Pesan Berhasil Terkirim!
                          </h4>
                          <p className="text-sm text-white/70 max-w-md mx-auto mb-6">
                            Terima kasih telah menghubungi HIMSIKA. Narahubung kami juga
                            dapat langsung membuka obrolan via WhatsApp.
                          </p>
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
                            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors cursor-pointer"
                          >
                            Kirim Pesan Lain
                          </button>
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
                            className="w-full py-3.5 px-6 rounded-xl bg-accent hover:bg-accent-hover text-deep font-black text-sm tracking-wide flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(255,195,0,0.4)] cursor-pointer"
                          >
                            <Send className="w-4 h-4" />
                            <span>Kirim Pesan Sekarang</span>
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
                        <div className="p-8 rounded-2xl bg-accent/10 border border-accent/30 text-center my-6">
                          <div className="w-14 h-14 rounded-full bg-accent/20 text-accent mx-auto flex items-center justify-center mb-4">
                            <Sparkles className="w-8 h-8" />
                          </div>
                          <h4 className="text-xl font-bold text-white mb-2">
                            Aspirasi Kamu Telah Diterima!
                          </h4>
                          <p className="text-sm text-white/80 max-w-md mx-auto mb-6">
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
                            Kirim Aspirasi Lagi
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
                                    ? "Anonim (Rahasia)"
                                    : aspirasiData.nama
                                }
                                onChange={(e) =>
                                  setAspirasiData({
                                    ...aspirasiData,
                                    nama: e.target.value,
                                  })
                                }
                                placeholder="Tuliskan nama atau samaran..."
                                className={`w-full px-4 py-3 rounded-xl bg-deep/90 border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none text-sm text-white placeholder-white/30 transition-all ${
                                  aspirasiData.isAnonim
                                    ? "opacity-50 cursor-not-allowed italic"
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
                            className="w-full py-3.5 px-6 rounded-xl bg-accent hover:bg-accent-hover text-deep font-black text-sm tracking-wide flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(255,195,0,0.4)] cursor-pointer"
                          >
                            <Send className="w-4 h-4" />
                            <span>Kirimkan Aspirasi Saya</span>
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
              <div className="bg-surface/80 border border-border rounded-3xl p-6 shadow-xl h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-accent" />
                      <span>Peta Lokasi Kampus</span>
                    </h3>
                    <span className="text-xs text-white/50 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                      Karawang, Jawa Barat
                    </span>
                  </div>
                  {/* Google Maps Embed */}
                  <div className="w-full h-[280px] sm:h-[320px] rounded-2xl overflow-hidden border border-border/80 relative shadow-inner mb-4">
                    <iframe
                      title="Lokasi Universitas Singaperbangsa Karawang"
                      src="https://maps.google.com/maps?q=Universitas%20Singaperbangsa%20Karawang&t=m&z=15&output=embed&iwloc=near"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full grayscale-[20%] contrast-[110%] hover:grayscale-0 transition-all duration-500"
                    ></iframe>
                  </div>
                </div>

                <div className="bg-deep/70 rounded-2xl p-4 border border-border/60">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-accent/10 text-accent shrink-0 mt-0.5">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white mb-0.5">
                        Menemui Kami Secara Langsung?
                      </h4>
                      <p className="text-[12px] text-white/60 leading-relaxed">
                        Silakan konfirmasi terlebih dahulu via narahubung WhatsApp
                        sebelum berkunjung ke ruangan sekretariat HIMSIKA agar fungsionaris
                        kami dapat menyambutmu.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* 3. TANYA JAWAB (FAQ) SEPUTAR HUBUNGI KAMI */}
        <Reveal>
          <div className="border-t border-border/60 pt-16">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Pertanyaan yang <span className="text-accent">Sering Diajukan</span>
              </h2>
              <p className="text-sm text-white/70 mt-2">
                Informasi ringkas seputar interaksi, kerja sama, dan aspirasi di HIMSIKA.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-surface/50 border border-border/70 rounded-2xl p-6 hover:border-accent/40 transition-colors"
                >
                  <h4 className="text-base font-bold text-white mb-2 flex items-start gap-2.5">
                    <span className="text-accent font-black text-sm mt-0.5">Q:</span>
                    <span>{faq.q}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed pl-6">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
