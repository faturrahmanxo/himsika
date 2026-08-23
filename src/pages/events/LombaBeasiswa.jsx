import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { 
  Trophy, 
  Calendar, 
  Clock, 
  ExternalLink, 
  Search, 
  Filter, 
  ArrowLeft, 
  BookOpen, 
  MessageCircle, 
  Sparkles, 
  X, 
  ChevronRight,
  Share2,
  CheckCircle2,
  ArrowUpDown,
  Hourglass
} from "lucide-react";
import LogoAAS from "../../assets/logo/proker/AAS.png";
import { LOMBA_DATA, LOMBA_CATEGORIES } from "../../data/lombaData";

export default function LombaBeasiswa() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState("furthest"); // "furthest", "nearest", "az"
  const [selectedLomba, setSelectedLomba] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Filtered & Sorted competitions
  const processedData = useMemo(() => {
    let result = LOMBA_DATA.filter((item) => {
      const matchCategory =
        selectedCategory === "Semua" ||
        item.categories.includes(selectedCategory);

      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        query === "" ||
        item.title.toLowerCase().includes(query) ||
        item.organizer.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.categories.some((c) => c.toLowerCase().includes(query));

      return matchCategory && matchSearch;
    });

    // Apply sorting
    if (sortBy === "furthest") {
      result.sort((a, b) => b.deadlineTimestamp - a.deadlineTimestamp);
    } else if (sortBy === "nearest") {
      result.sort((a, b) => a.deadlineTimestamp - b.deadlineTimestamp);
    } else if (sortBy === "az") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  // Copy share link
  const handleShare = (item) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `${item.title} - Info Lomba AAS HIMSIKA\nDeadline: ${item.deadlinePendaftaran}\nLink: ${item.instagramUrl || window.location.href}`
      );
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="min-h-screen pt-28 sm:pt-36 pb-24 bg-linear-to-b from-[#02182b] via-[#043761] to-[#02182b] font-primary relative overflow-hidden flex flex-col items-center selection:bg-accent selection:text-slate-900 text-white">
      
      {/* ================= BACKGROUND DEKORASI ================= */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
        <div className="absolute w-[35rem] h-[35rem] rounded-full blur-[140px] bg-accent/10 top-16 left-1/2 -translate-x-1/2"></div>
        <div className="absolute w-[25rem] h-[25rem] rounded-full blur-[120px] bg-blue-500/10 bottom-20 left-10"></div>
        <div className="absolute w-[25rem] h-[25rem] rounded-full blur-[120px] bg-emerald-500/10 top-1/2 right-10"></div>
      </div>

      <div className="w-full max-w-6xl px-4 sm:px-6 relative z-10 flex flex-col items-center">
        
        {/* ================= BREADCRUMB / NAV BACK ================= */}
        <div className="w-full flex items-center justify-between mb-8">
          <Link
            to="/aas"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs sm:text-sm font-semibold backdrop-blur-md transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke AAS</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white p-1 shadow-md hidden sm:flex items-center justify-center">
              <img src={LogoAAS} alt="Logo AAS" className="w-full h-full object-contain" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-accent/90 bg-accent/10 border border-accent/20 px-3 py-1.5 rounded-full">
              AAS Portal
            </span>
          </div>
        </div>

        {/* ================= HERO HEADER ================= */}
        <div className="text-center max-w-2xl mb-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-accent tracking-[0.2em] uppercase bg-accent/10 border border-accent/20 px-3.5 py-1 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Academic Achievement Support
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md mb-3">
              Info Lomba & Beasiswa
            </h1>
            <p className="text-sm sm:text-base text-white/75 font-normal leading-relaxed">
              Daftar kompetisi & beasiswa diurutkan dari <b>deadline paling terjauh (waktu persiapan terpanjang)</b> hingga terdekat.
            </p>
          </motion.div>
        </div>

        {/* ================= SEARCH, FILTER & SORT CONTROLS ================= */}
        <div className="w-full bg-[#011627]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl mb-8 space-y-4">
          
          {/* Search Bar & Sort Dropdown Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Cari nama lomba, penyelenggara, atau topik (Web, UI/UX, BMC, Data...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#021d33] border border-white/10 rounded-xl pl-12 pr-10 py-3 text-sm sm:text-base text-white placeholder:text-white/40 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                  title="Hapus pencarian"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 bg-[#021d33] border border-white/10 rounded-xl px-3 py-2 sm:py-0 shrink-0">
              <ArrowUpDown className="w-4 h-4 text-accent" />
              <span className="text-xs text-white/50 hidden md:inline">Urutan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-semibold text-white focus:outline-none cursor-pointer pr-2"
              >
                <option value="furthest" className="bg-[#02182b] text-white">
                  ⏳ Deadline Terjauh (Paling Panjang)
                </option>
                <option value="nearest" className="bg-[#02182b] text-white">
                  ⚡ Deadline Terdekat
                </option>
                <option value="az" className="bg-[#02182b] text-white">
                  🔤 Nama Lomba (A-Z)
                </option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-1">
            <Filter className="w-4 h-4 text-accent shrink-0 hidden sm:block mr-1" />
            {LOMBA_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide shrink-0 transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-accent text-slate-950 shadow-[0_0_15px_rgba(255,195,0,0.35)]"
                      : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Result Count Info & Status */}
          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-white/60">
            <div className="flex items-center gap-2">
              <Hourglass className="w-3.5 h-3.5 text-accent" />
              <span>
                Menampilkan <b className="text-white">{processedData.length}</b> dari {LOMBA_DATA.length} info lomba
              </span>
            </div>
            {(searchQuery || selectedCategory !== "Semua" || sortBy !== "furthest") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("Semua");
                  setSortBy("furthest");
                }}
                className="text-accent hover:underline font-semibold cursor-pointer"
              >
                Reset Filter & Urutan
              </button>
            )}
          </div>
        </div>

        {/* ================= COMPETITION CARDS GRID ================= */}
        {processedData.length > 0 ? (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {processedData.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.4) }}
                className="group bg-gradient-to-b from-[#032340] to-[#04335c] border border-white/10 hover:border-accent/40 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xl hover:shadow-[0_12px_30px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Accent top border highlight */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div>
                  {/* Top Bar: Category Badges & Urutan Index */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex flex-wrap gap-1.5">
                      {item.categories.map((c) => (
                        <span
                          key={c}
                          className="text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/90 px-2.5 py-0.5 rounded-full border border-white/10"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-accent/80 bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-md shrink-0">
                      #{idx + 1}
                    </span>
                  </div>

                  {/* Title & Organizer */}
                  <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors line-clamp-2 leading-snug mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-white/60 font-medium mb-4">
                    {item.organizer}
                  </p>

                  {/* Deadlines Box */}
                  <div className="bg-[#011425]/70 border border-white/5 rounded-xl p-3 space-y-2 mb-4">
                    <div className="flex items-start gap-2 text-xs">
                      <Calendar className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white/50 block text-[10px] uppercase tracking-wider">
                          Pendaftaran:
                        </span>
                        <span className="font-semibold text-white/90">
                          {item.deadlinePendaftaran}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-xs">
                      <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white/50 block text-[10px] uppercase tracking-wider">
                          Pengumpulan Karya:
                        </span>
                        <span className="font-semibold text-white/90">
                          {item.deadlinePengumpulan}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Benefit Summary */}
                  {item.benefitSummary && (
                    <div className="flex items-start gap-2 text-xs text-white/70 mb-5 bg-accent/5 border border-accent/10 rounded-lg p-2.5">
                      <Trophy className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <p className="line-clamp-2 leading-relaxed text-[11px]">
                        {item.benefitSummary}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions Button */}
                <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedLomba(item)}
                    className="flex-1 bg-white/10 hover:bg-accent hover:text-slate-950 font-bold text-xs py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>Lihat Detail</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {item.instagramUrl && (
                    <a
                      href={item.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 bg-white/5 hover:bg-pink-600/30 hover:border-pink-500/50 border border-white/10 text-white rounded-xl flex items-center justify-center transition-all shrink-0"
                      title="Buka Instagram"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    onClick={() => handleShare(item)}
                    className="w-9 h-9 bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white rounded-xl flex items-center justify-center transition-all shrink-0 cursor-pointer"
                    title="Bagikan Info Lomba"
                  >
                    {copiedId === item.id ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="w-full bg-[#011627]/60 border border-white/10 rounded-2xl p-12 text-center my-8 max-w-lg">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-white/40">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Tidak Ada Lomba Ditemukan
            </h3>
            <p className="text-xs sm:text-sm text-white/60 mb-6">
              Tidak ditemukan lomba dengan kata kunci atau filter kategori yang dipilih.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("Semua");
                setSortBy("furthest");
              }}
              className="px-5 py-2.5 bg-accent text-slate-950 rounded-xl text-xs font-bold tracking-wide hover:brightness-110 transition-all cursor-pointer"
            >
              Reset Pencarian
            </button>
          </div>
        )}

      </div>

      {/* ================= MODAL DETAIL LOMBA ================= */}
      <AnimatePresence>
        {selectedLomba && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLomba(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            ></motion.div>

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-2xl max-h-[90vh] bg-gradient-to-b from-[#032340] to-[#011425] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col overflow-hidden z-10"
            >
              {/* Header Modal */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {selectedLomba.categories.map((c) => (
                      <span
                        key={c}
                        className="text-[10px] font-bold uppercase tracking-wider bg-accent/20 text-accent px-2.5 py-0.5 rounded-full border border-accent/30"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                    {selectedLomba.title}
                  </h2>
                  <p className="text-xs text-white/60 font-semibold mt-1">
                    {selectedLomba.organizer}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedLomba(null)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto py-5 space-y-6 pr-1 custom-scrollbar">
                
                {/* Timeline Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-[#02182b] border border-white/10 rounded-xl p-3.5 flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-white/50 block">
                        Deadline Pendaftaran
                      </span>
                      <span className="text-sm font-semibold text-white">
                        {selectedLomba.deadlinePendaftaran}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#02182b] border border-white/10 rounded-xl p-3.5 flex items-start gap-3">
                    <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-white/50 block">
                        Deadline Pengumpulan
                      </span>
                      <span className="text-sm font-semibold text-white">
                        {selectedLomba.deadlinePengumpulan}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Deskripsi Lengkap */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-accent mb-2.5 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" /> Deskripsi & Informasi Lengkap
                  </h4>
                  <div className="bg-[#02182b]/60 border border-white/10 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm text-white/80 leading-relaxed whitespace-pre-line space-y-2">
                    {selectedLomba.description}
                  </div>
                </div>

                {/* Contact Person */}
                {selectedLomba.contacts && selectedLomba.contacts.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2.5 flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4" /> Narahubung / Contact Person
                    </h4>
                    <div className="space-y-2">
                      {selectedLomba.contacts.map((contact, i) => (
                        <div
                          key={i}
                          className="bg-[#02182b] border border-white/10 rounded-xl p-3 flex items-center justify-between text-xs text-white/90"
                        >
                          <span className="font-medium">{contact}</span>
                          {contact.includes("08") || contact.includes("+62") ? (
                            <a
                              href={`https://wa.me/${contact.replace(/[^0-9]/g, "").replace(/^0/, "62")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-400 hover:text-emerald-300 font-bold inline-flex items-center gap-1 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20"
                            >
                              <span>Chat WhatsApp</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer CTA Buttons */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap gap-3">
                {selectedLomba.registrationUrl && (
                  <a
                    href={selectedLomba.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-accent hover:brightness-110 text-slate-950 font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
                  >
                    <span>Daftar Lomba Sekarang</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                {selectedLomba.guidebookUrl && (
                  <a
                    href={selectedLomba.guidebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    <BookOpen className="w-4 h-4 text-accent" />
                    <span>Guidebook / Panduan</span>
                  </a>
                )}

                {selectedLomba.instagramUrl && (
                  <a
                    href={selectedLomba.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Instagram</span>
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
