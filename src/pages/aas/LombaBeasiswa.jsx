import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  ExternalLink,
  Search,
  Filter,
  ArrowLeft,
  BookOpen,
  Sparkles,
  X,
  ChevronRight,
  Share2,
  CheckCircle2,
  ArrowUpDown,
  Hourglass,
  MapPin,
  Check,
  Trophy,
  MessageCircle,
  Menu,
} from "lucide-react";

import LogoAAS from "../../assets/logo/proker/AAS.png"; // Sesuaikan path jika perlu
import supabase from "../../supabase-client"; // Sesuaikan path jika perlu

const LOMBA_CATEGORIES = [
  "Semua",
  "IT & Software",
  "Beasiswa",
  "UI/UX Design",
  "Data Science",
  "Web Dev",
  "Data & AI",
  "Business & Economics",
  "Design & Poster",
  "Riset & Karya Tulis",
];

const SORT_OPTIONS = [
  { id: "furthest", label: "Deadline Terjauh" },
  { id: "nearest", label: "Deadline Terdekat" },
  { id: "az", label: "Abjad (A-Z)" },
];

const SITE_URL = "https://himsika.unsika.ac.id"; // sesuaikan dengan domain production
const PAGE_TITLE = "Info Lomba & Beasiswa — AAS HIMSIKA";
const PAGE_DESCRIPTION =
  "Kumpulan info lomba akademik dan beasiswa terbaru untuk mahasiswa Sistem Informasi, dikurasi oleh Academic Achievement Support (AAS) HIMSIKA Unsika. Cari, filter, dan urutkan sesuai deadline.";

const formatWhatsAppLink = (phone) => {
  if (!phone) return "";
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) cleaned = "62" + cleaned.substring(1);
  return `https://wa.me/${cleaned}`;
};

export default function LombaBeasiswa() {
  // STATE NAVBAR
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // STATE KONTEN LOMBA
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState("furthest");
  const [selectedLomba, setSelectedLomba] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [lombaData, setLombaData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const sortRef = useRef(null);
  const filterContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);

  // --- SEO: title, meta description, canonical, Open Graph & Twitter Card ---
  useEffect(() => {
    document.title = PAGE_TITLE;
    const canonicalUrl = `${SITE_URL}/aas/lomba-beasiswa`;

    const setMeta = (attr, key, content) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("name", "description", PAGE_DESCRIPTION);
    setMeta("property", "og:title", PAGE_TITLE);
    setMeta("property", "og:description", PAGE_DESCRIPTION);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:image", LogoAAS);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", PAGE_TITLE);
    setMeta("name", "twitter:description", PAGE_DESCRIPTION);
    setMeta("name", "twitter:image", LogoAAS);

    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    let favicon = document.querySelector("link[rel~='icon']");
    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }
    favicon.href = LogoAAS;
  }, []);

  // --- SEO: structured data (JSON-LD) untuk halaman koleksi lomba/beasiswa ---
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      url: `${SITE_URL}/aas/lomba-beasiswa`,
      isPartOf: {
        "@type": "WebSite",
        name: "AAS HIMSIKA",
        url: `${SITE_URL}/aas`,
      },
    });
    document.head.appendChild(script);
    return () => document.head.removeChild(script);
  }, []);

  // SCROLL NAVBAR EFFECT
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // FETCH SUPABASE
  useEffect(() => {
    async function fetchLombaFromSupabase() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("lomba")
          .select("*")
          .order("id", { ascending: false });
        if (error) throw error;
        setLombaData(data || []);
      } catch (error) {
        console.error("Gagal mengambil data lomba:", error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLombaFromSupabase();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target))
        setIsSortOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const parseCategories = (cat) => {
    if (Array.isArray(cat))
      return cat
        .map((c) => String(c).replace(/["']/g, "").trim())
        .filter(Boolean);
    if (typeof cat === "string")
      return cat
        .replace(/[{}]/g, "")
        .split(",")
        .map((c) => c.replace(/["']/g, "").trim())
        .filter(Boolean);
    return [];
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - filterContainerRef.current.offsetLeft);
    setScrollLeftPos(filterContainerRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - filterContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    filterContainerRef.current.scrollLeft = scrollLeftPos - walk;
  };

  const processedData = useMemo(() => {
    let result = lombaData.filter((item) => {
      const itemCategories = parseCategories(item.categories);
      const matchCategory =
        selectedCategory === "Semua" ||
        itemCategories.some(
          (c) => c.toLowerCase() === selectedCategory.toLowerCase(),
        );
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        query === "" ||
        item.title?.toLowerCase().includes(query) ||
        item.organizer?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        itemCategories.some((c) => c.toLowerCase().includes(query));
      return matchCategory && matchSearch;
    });

    if (sortBy === "furthest")
      result.sort(
        (a, b) => (b.deadline_timestamp || 0) - (a.deadline_timestamp || 0),
      );
    else if (sortBy === "nearest")
      result.sort(
        (a, b) => (a.deadline_timestamp || 0) - (b.deadline_timestamp || 0),
      );
    else if (sortBy === "az")
      result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));

    return result;
  }, [lombaData, searchQuery, selectedCategory, sortBy]);

  const handleShare = (item, e) => {
    e.stopPropagation();
    const socialLink = item.instagram_url || item.registration_url;
    if (socialLink && navigator.clipboard) {
      navigator.clipboard.writeText(socialLink);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      alert("Link media sosial penyelenggara belum tersedia.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#043761] via-primary to-[#043761] font-primary relative flex flex-col text-white selection:bg-accent selection:text-[#043761]">
      {/* Background Ornamen — konsisten dengan tema kaca situs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
        <div className="absolute w-[40rem] h-[40rem] rounded-full blur-[150px] bg-accent/10 top-0 left-1/2 -translate-x-1/2"></div>
        <div className="absolute w-[30rem] h-[30rem] rounded-full blur-[120px] bg-[#043761]/40 bottom-0 left-0"></div>
        <Trophy
          className="absolute top-[38%] right-[6%] w-10 h-10 text-white/[0.03] hidden sm:block"
          style={{ animation: "spin 28s linear infinite" }}
        />
        <Sparkles
          className="absolute top-[16%] left-[10%] w-6 h-6 text-accent/[0.1] hidden sm:block"
          style={{ animation: "spin 10s linear infinite" }}
        />
      </div>

      {/* ================= NAVBAR KHUSUS AAS ================= */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled ? "bg-[#043761]/90 backdrop-blur-xl border-white/10 py-3 shadow-lg" : "bg-transparent border-transparent py-5"}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/aas" className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 bg-white rounded-full p-1 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              <img
                src={LogoAAS}
                alt="Logo Academic Achievement Support HIMSIKA"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              {/* Bukan h1 — judul utama halaman ini adalah hero "Eksplorasi Peluangmu" di bawah */}
              <span className="block font-extrabold text-lg leading-tight tracking-wide text-white">
                AAS
              </span>
              <span className="block text-[10px] text-accent uppercase tracking-widest font-bold">
                HIMSIKA
              </span>
            </div>
          </Link>

          {/* Menu Navigasi Tanpa Tombol Web Utama (Sesuai Konsep Berdiri Sendiri) */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/aas"
              className="text-sm font-bold tracking-wide transition-colors text-white/70 hover:text-white"
            >
              Menu Utama AAS
            </Link>
          </nav>

          <button
            className="md:hidden text-white p-2 bg-white/10 rounded-xl border border-white/10 active:scale-95 transition-transform"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Buka atau tutup menu navigasi"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-accent" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Nav Floating Card Dropdown — menyamai pola di halaman AAS utama */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute top-full left-4 right-4 mt-2 bg-[#043761]/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-3 shadow-2xl flex flex-col gap-2 z-50"
              role="menu"
            >
              <Link
                to="/aas"
                role="menuitem"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-left font-bold py-3 px-4 rounded-xl transition-all text-sm flex items-center justify-between text-white/80 hover:bg-white/5 hover:text-white"
              >
                <span>Kembali ke Menu AAS</span>
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ================= MAIN CONTENT LOMBA ================= */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10 flex flex-col">
        <style>{`
          ::-webkit-scrollbar { width: 6px; height: 6px; }
          ::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
          ::-webkit-scrollbar-thumb { background: #ffc300; border-radius: 9999px; }
          ::-webkit-scrollbar-thumb:hover { background: #ffcf33; }
        `}</style>

        {/* BREADCRUMB KEMBALI */}
        <div className="w-full mb-8">
          <Link
            to="/aas"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-sm font-semibold backdrop-blur-md transition-all group w-fit"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Beranda AAS</span>
          </Link>
        </div>

        <div className="text-center max-w-3xl mb-12 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 text-xs font-black text-[#043761] tracking-widest uppercase bg-accent px-4 py-1.5 rounded-full mb-6 shadow-[0_0_20px_rgba(255,195,0,0.3)]">
              <Sparkles className="w-4 h-4" /> Info Lomba & Beasiswa
            </span>
            {/* Satu-satunya h1 di halaman ini */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-lg mb-6 leading-tight">
              Eksplorasi <span className="text-accent">Peluangmu</span>
            </h1>
            <p className="text-base sm:text-lg text-white/70 font-medium leading-relaxed max-w-2xl mx-auto">
              Temukan peluang kompetisi dan beasiswa terbaik untuk meningkatkan
              prestasimu.
            </p>
          </motion.div>
        </div>

        {/* KOTAK PENCARIAN & FILTER */}
        <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-5 sm:p-8 shadow-2xl mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-accent transition-colors" />
              <label htmlFor="lomba-search" className="sr-only">
                Cari lomba, penyelenggara, atau kategori
              </label>
              <input
                id="lomba-search"
                type="text"
                placeholder="Cari lomba, penyelenggara, atau kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-2xl pl-14 pr-12 py-4 text-sm sm:text-base text-white placeholder:text-white/40 focus:outline-none focus:border-accent/50 focus:bg-black/40 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  aria-label="Hapus kata pencarian"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1.5 rounded-full bg-white/5 hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="relative shrink-0 z-20" ref={sortRef}>
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                aria-haspopup="listbox"
                aria-expanded={isSortOpen}
                className="flex items-center justify-between w-full lg:w-56 gap-3 bg-black/20 hover:bg-black/40 border border-white/10 rounded-2xl px-5 py-4 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <ArrowUpDown className="w-5 h-5 text-accent" />
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none mb-1">
                      Urutkan
                    </span>
                    <span className="text-sm font-bold text-white leading-none">
                      {SORT_OPTIONS.find((o) => o.id === sortBy)?.label}
                    </span>
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-white/40 transition-transform duration-300 ${isSortOpen ? "rotate-90" : ""}`}
                />
              </button>
              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    role="listbox"
                    className="absolute right-0 top-full mt-2 w-full lg:w-56 bg-[#043761]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden py-2"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        role="option"
                        aria-selected={sortBy === option.id}
                        onClick={() => {
                          setSortBy(option.id);
                          setIsSortOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-colors hover:bg-white/5 ${sortBy === option.id ? "text-accent bg-white/5" : "text-white/70"}`}
                      >
                        <span>{option.label}</span>
                        {sortBy === option.id && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="relative flex items-center w-full">
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 mr-3 shrink-0 hidden sm:flex z-10 pointer-events-none">
              <Filter className="w-4 h-4 text-accent" />
            </div>
            <div
              ref={filterContainerRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className={`flex-1 flex items-center gap-2 overflow-x-auto scrollbar-none py-1 select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
            >
              {LOMBA_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      if (!isDragging) setSelectedCategory(cat);
                    }}
                    aria-pressed={isActive}
                    className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide shrink-0 transition-all duration-300 border pointer-events-auto ${isActive ? "bg-accent border-accent text-[#043761] shadow-[0_0_20px_rgba(255,195,0,0.3)]" : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-accent/50 text-white/60 hover:text-accent"}`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10 pt-6 mb-8 px-2 sm:px-4">
          <div className="flex items-center gap-3 text-white/70 text-sm">
            <Hourglass className="w-4 h-4 text-accent" />
            <span>
              Menampilkan{" "}
              <span className="font-bold text-white text-base">
                {processedData.length}
              </span>{" "}
              dari {lombaData.length} info lomba
            </span>
          </div>
        </div>

        {/* GRID LOMBA & BEASISWA */}
        {isLoading ? (
          <div className="w-full flex flex-col items-center justify-center py-24 my-6 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-md shadow-xl">
            <div className="w-10 h-10 border-3 border-accent border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(255,195,0,0.3)]"></div>
            <p className="text-white/70 font-bold text-sm tracking-wide">
              Memuat data lomba dari database...
            </p>
          </div>
        ) : processedData.length > 0 ? (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {processedData.map((item, idx) => {
              const itemCategories = parseCategories(item.categories);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: Math.min(idx * 0.05, 0.5),
                  }}
                  className="group bg-white/5 backdrop-blur-lg border border-white/10 hover:border-accent/50 rounded-[2rem] p-6 flex flex-col transition-all duration-500 relative shadow-xl hover:shadow-[0_0_30px_rgba(255,195,0,0.15)] hover:-translate-y-1.5 overflow-hidden"
                >
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  <div className="flex-1 relative z-10">
                    <div className="flex items-start justify-between gap-2 mb-5">
                      <div className="flex flex-wrap gap-2">
                        {itemCategories.slice(0, 2).map((c) => (
                          <span
                            key={c}
                            className="text-[10px] font-bold uppercase tracking-widest bg-accent/10 border border-accent/20 text-accent px-3 py-1 rounded-full"
                          >
                            {c}
                          </span>
                        ))}
                        {itemCategories.length > 2 && (
                          <span className="text-[10px] font-bold text-white/60 bg-white/10 border border-white/10 px-2.5 py-1 rounded-full">
                            +{itemCategories.length - 2}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => handleShare(item, e)}
                        type="button"
                        aria-label={`Bagikan info ${item.title}`}
                        className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-all shrink-0 cursor-pointer pointer-events-auto z-20"
                      >
                        {copiedId === item.id ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 pointer-events-none" />
                        ) : (
                          <Share2 className="w-4 h-4 pointer-events-none" />
                        )}
                      </button>
                    </div>
                    <h2 className="text-xl font-black text-white group-hover:text-accent transition-colors line-clamp-2 leading-snug mb-2">
                      {item.title}
                    </h2>
                    <div className="flex items-center gap-1.5 text-xs text-white/60 font-medium mb-6">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate">{item.organizer}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
                        <Calendar className="w-4 h-4 text-accent mb-2" />
                        <p className="text-[9px] uppercase tracking-widest text-white/40 font-bold mb-0.5">
                          Pendaftaran
                        </p>
                        <p className="text-xs font-bold text-white truncate">
                          {item.deadline_pendaftaran}
                        </p>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
                        <Clock className="w-4 h-4 text-emerald-400 mb-2" />
                        <p className="text-[9px] uppercase tracking-widest text-white/40 font-bold mb-0.5">
                          Pengumpulan
                        </p>
                        <p className="text-xs font-bold text-white truncate">
                          {item.deadline_pengumpulan}
                        </p>
                      </div>
                    </div>
                    {item.benefit && (
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-3 mb-6 flex items-start gap-2.5">
                        <Trophy className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <p className="text-xs text-white/80 font-medium line-clamp-2 leading-snug">
                          {item.benefit}
                        </p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedLomba(item)}
                    type="button"
                    className="w-full pt-4 mt-auto border-t border-white/10 flex items-center justify-between text-xs font-bold text-white/60 group-hover:text-white transition-colors relative z-10 cursor-pointer pointer-events-auto"
                  >
                    <span>Lihat Detail Lengkap</span>
                    <div className="w-8 h-8 rounded-full bg-accent text-[#043761] flex items-center justify-center transform group-hover:translate-x-2 transition-transform">
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-12 text-center my-8 max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 text-white/30">
              <Search className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-black text-white mb-2">
              Pencarian Tidak Ditemukan
            </h2>
          </div>
        )}
      </main>

      {/* ================= MODAL DETAIL POPUP ================= */}
      <AnimatePresence>
        {selectedLomba && (
          <div className="fixed inset-0 z-[99] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLomba(null)}
              className="absolute inset-0 bg-[#010e1a]/80 backdrop-blur-md cursor-pointer"
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: "spring", damping: 25 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="lomba-modal-title"
              className="relative w-full max-w-3xl bg-[#043761]/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden z-10 flex flex-col max-h-[90vh]"
            >
              <button
                onClick={() => setSelectedLomba(null)}
                aria-label="Tutup detail lomba"
                className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/5 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer z-50 group"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              </button>
              <div className="flex-1 overflow-y-auto relative z-10">
                <div className="p-6 sm:p-8 pt-10">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {parseCategories(selectedLomba.categories).map((c) => (
                      <span
                        key={c}
                        className="text-[10px] font-black uppercase tracking-widest bg-accent text-[#043761] px-3.5 py-1.5 rounded-full shadow-[0_0_15px_rgba(255,195,0,0.3)]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                  <h2
                    id="lomba-modal-title"
                    className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight pr-10"
                  >
                    {selectedLomba.title}
                  </h2>
                  <p className="text-sm text-white/60 mb-8">
                    {selectedLomba.organizer}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3.5 group hover:bg-white/10 hover:border-accent/30 transition-colors">
                      <div className="w-9 h-9 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Calendar className="w-4 h-4 text-accent" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-0.5">
                          Pendaftaran
                        </span>
                        <span className="text-sm font-bold text-white truncate">
                          {selectedLomba.deadline_pendaftaran}
                        </span>
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3.5 group hover:bg-white/10 hover:border-emerald-400/30 transition-colors">
                      <div className="w-9 h-9 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Clock className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-0.5">
                          Pengumpulan
                        </span>
                        <span className="text-sm font-bold text-white truncate">
                          {selectedLomba.deadline_pengumpulan}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-accent mb-4 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" /> DESKRIPSI & INFORMASI
                      </h3>
                      <div className="bg-white/5 rounded-2xl p-5 sm:p-6 border border-white/10">
                        <div className="text-sm text-white/80 leading-relaxed whitespace-pre-line">
                          {selectedLomba.description
                            ? selectedLomba.description
                                .replace(/\\n/g, "\n")
                                .trim()
                            : ""}
                        </div>
                      </div>
                    </div>
                    {selectedLomba.contacts &&
                      selectedLomba.contacts.length > 0 && (
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4 flex items-center gap-2">
                            <MessageCircle className="w-4 h-4" /> CONTACT PERSON
                          </h3>
                          <div className="space-y-3">
                            {selectedLomba.contacts.map((contact, idx) => (
                              <div
                                key={idx}
                                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-white/20 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0"></div>
                                  <span className="text-sm font-semibold text-white/90">
                                    {contact.name} : {contact.phone}
                                  </span>
                                </div>
                                <a
                                  href={formatWhatsAppLink(contact.phone)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`Chat WhatsApp dengan ${contact.name}`}
                                  className="bg-transparent border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0 self-start sm:self-auto"
                                >
                                  Chat WhatsApp{" "}
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6 bg-white/5 backdrop-blur-lg border-t border-white/10 flex flex-row w-full gap-2.5 sm:gap-4 shrink-0 relative z-20">
                {selectedLomba.registration_url && (
                  <a
                    href={selectedLomba.registration_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-[2] bg-accent hover:bg-[#ffcf33] text-[#043761] font-black text-xs sm:text-base py-3 sm:py-4 px-3 sm:px-6 rounded-full flex items-center justify-center gap-1.5 sm:gap-2.5 transition-all shadow-[0_0_15px_rgba(255,195,0,0.3)] hover:-translate-y-0.5 overflow-hidden"
                  >
                    <span className="truncate">Daftar Sekarang</span>
                    <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  </a>
                )}
                {selectedLomba.guidebook_url && (
                  <a
                    href={selectedLomba.guidebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs sm:text-sm py-3 sm:py-4 px-2 sm:px-4 rounded-full flex items-center justify-center gap-1.5 sm:gap-2.5 transition-all hover:-translate-y-0.5 overflow-hidden"
                  >
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white/50 shrink-0" />
                    <span className="truncate hidden sm:inline">Guidebook</span>
                    <span className="sm:hidden truncate">Panduan</span>
                  </a>
                )}
                {selectedLomba.instagram_url && (
                  <a
                    href={selectedLomba.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gradient-to-tr from-pink-600 to-purple-600 hover:opacity-90 text-white font-bold text-xs sm:text-sm py-3 sm:py-4 px-2 sm:px-4 rounded-full flex items-center justify-center gap-1.5 sm:gap-2.5 transition-all shadow-lg hover:shadow-pink-500/25 hover:-translate-y-0.5 overflow-hidden"
                  >
                    <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    <span>Instagram</span>
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= FOOTER KHUSUS AAS ================= */}
      <footer className="w-full bg-[#043761]/95 backdrop-blur-xl border-t border-white/10 py-12 relative z-20 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <div className="w-8 h-8 bg-white rounded-full p-0.5">
                <img
                  src={LogoAAS}
                  alt="Logo Academic Achievement Support HIMSIKA"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h3 className="font-extrabold text-lg">AAS HIMSIKA</h3>
            </div>
            <address className="text-white/50 text-xs max-w-xs leading-relaxed not-italic">
              Academic Achievement Support. <br /> Divisi Akademik HIMSIKA{" "}
              <br /> Universitas Singaperbangsa Karawang.
            </address>
          </div>
          <div className="flex flex-col items-center md:items-end gap-6">
            <h3 className="text-xs font-bold text-white/40 tracking-widest uppercase">
              Hubungi Kami (WhatsApp)
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://wa.me/6285133052875"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Hubungi Auzilia Chantika via WhatsApp"
                className="flex items-center gap-2 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-[#043761] px-4 py-2 rounded-full border border-[#25D366]/20 transition-all font-bold text-sm"
              >
                <MessageCircle className="w-4 h-4" /> Auzilia Chantika
              </a>
              <a
                href="https://wa.me/6289668484467"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Hubungi Meyta Sabrina via WhatsApp"
                className="flex items-center gap-2 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-[#043761] px-4 py-2 rounded-full border border-[#25D366]/20 transition-all font-bold text-sm"
              >
                <MessageCircle className="w-4 h-4" /> Meyta Sabrina
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-white/5 text-center flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Academic Achievement Support. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
