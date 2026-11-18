import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
// IMPORT DATA UTAMA & SUPABASE
import artikelData from "../data/artikel";
import supabase from "../supabase-client";

const ITEMS_PER_PAGE = 6;

// Urutkan artikel: prioritas Sorotan Utama (is_hot) di paling atas, lalu tanggal terbaru, lalu ID tertinggi
export const sortArticlesList = (list) =>
  [...list].sort((a, b) => {
    if (a.is_hot && !b.is_hot) return -1;
    if (!a.is_hot && b.is_hot) return 1;
    const dateA = a.datetime || "";
    const dateB = b.datetime || "";
    return dateB.localeCompare(dateA) || Number(b.id) - Number(a.id);
  });

const getArticleYear = (article) => {
  if (article.datetime && /^\d{4}/.test(String(article.datetime))) {
    return String(article.datetime).slice(0, 4);
  }
  const match = String(article.date || "").match(/\b(20\d{2})\b/);
  return match ? match[1] : "";
};

export default function Artikel() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("Semua");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  // Inisialisasi data yang sudah tersortir sejak frame pertama agar tidak ada efek berkedip / bertukar posisi
  const [articles, setArticles] = useState(() => {
    const localHotId = typeof window !== "undefined" ? localStorage.getItem("himsika_hot_article_id") : null;
    const initialList = localHotId
      ? artikelData.map((a) => ({ ...a, is_hot: String(a.id) === String(localHotId) }))
      : artikelData;
    return sortArticlesList(initialList);
  });
  const [isLoading, setIsLoading] = useState(false);
  const categories = ["Semua", "Berita", "Kegiatan", "Opini", "Prestasi"];

  useEffect(() => {
    async function fetchArticles() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("artikel")
          .select("*")
          .order("datetime", { ascending: false })
          .order("id", { ascending: false });

        if (!error && data && data.length > 0) {
          const localHotId = typeof window !== "undefined" ? localStorage.getItem("himsika_hot_article_id") : null;
          const hasAnyDbHot = data.some((d) => Boolean(d.is_hot));
          const normalized = data.map((d) => {
            const fallback =
              artikelData.find((a) => String(a.id) === String(d.id)) ||
              artikelData.find((a) => a.title === d.title);
            return {
              ...d,
              is_hot: localHotId
                ? String(d.id) === String(localHotId)
                : hasAnyDbHot
                ? Boolean(d.is_hot)
                : Boolean(fallback?.is_hot),
              image:
                d.image && d.image.trim()
                  ? d.image.trim()
                  : fallback?.image || "",
              category:
                d.category ||
                (Array.isArray(d.categories) && d.categories.length > 0
                  ? d.categories[0]
                  : fallback?.category || "Berita"),
              date: d.date || fallback?.date || "",
              excerpt: d.excerpt || fallback?.excerpt || "",
            };
          });

          // Database adalah sumber utama: artikel yang dihapus di admin tidak muncul lagi dari data lokal.
          const combined = sortArticlesList(normalized);

          // Cek kesamaan data: jika urutan dan isi sudah sama, jangan picu re-render agar tidak ada kedipan
          setArticles((prev) => {
            const isSame =
              prev.length === combined.length &&
              prev.every(
                (art, i) =>
                  String(art.id) === String(combined[i].id) &&
                  art.title === combined[i].title &&
                  art.image === combined[i].image &&
                  Boolean(art.is_hot) === Boolean(combined[i].is_hot),
              );
            return isSame ? prev : combined;
          });
        }
      } catch (err) {
        console.warn("Menggunakan data artikel lokal:", err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchArticles();
  }, []);

  const availableYears = useMemo(() => {
    const years = new Set(articles.map(getArticleYear).filter(Boolean));
    return ["Semua", ...Array.from(years).sort((a, b) => b.localeCompare(a))];
  }, [articles]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  // Sorotan Utama hanya dari artikel yang ditandai is_hot (jika tidak ada, fallback ke artikel pertama)
  const sorotanArticle = useMemo(
    () => articles.find((a) => a.is_hot === true) || articles[0] || null,
    [articles],
  );

  const isDefaultView =
    activeCategory === "Semua" &&
    !searchQuery.trim() &&
    selectedYear === "Semua" &&
    sortOrder === "newest" &&
    currentPage === 1;

  // Filter Data Berdasarkan Kategori, Pencarian, Tahun, dan Urutan
  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = articles.filter((article) => {
      if (isDefaultView && sorotanArticle && String(article.id) === String(sorotanArticle.id)) {
        return false;
      }
      if (activeCategory !== "Semua" && article.category !== activeCategory) return false;
      if (selectedYear !== "Semua" && getArticleYear(article) !== selectedYear) return false;
      if (q) {
        const hay = `${article.title || ""} ${article.excerpt || ""} ${article.category || ""} ${article.author || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      const dateA = a.datetime || "";
      const dateB = b.datetime || "";
      return sortOrder === "newest"
        ? dateB.localeCompare(dateA) || Number(b.id) - Number(a.id)
        : dateA.localeCompare(dateB) || Number(a.id) - Number(b.id);
    });
  }, [articles, activeCategory, selectedYear, searchQuery, sortOrder, isDefaultView, sorotanArticle]);

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const displayedArticles = filteredArticles.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  const featuredArticle = isDefaultView ? sorotanArticle : null;

  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="min-h-screen bg-linear-to-b from-[#043761] via-primary to-[#043761] font-primary pt-32 sm:pt-36 pb-20 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="absolute w-[30rem] h-[30rem] rounded-full blur-[140px] bg-accent/15 top-0 left-0 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* TITLE */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center md:text-left relative z-10">
        <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
          <span className="w-8 sm:w-12 h-[2px] bg-accent rounded-full hidden md:block"></span>
          <span className="text-accent font-bold text-sm uppercase tracking-widest">
            Updates & News
          </span>
          <span className="w-8 sm:w-12 h-[2px] bg-accent rounded-full md:hidden"></span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 relative inline-block">
          Artikel{" "}
          <span className="text-accent drop-shadow-[0_0_15px_rgba(255,195,0,0.4)]">
            HIMSIKA
          </span>
        </h1>
        <p className="text-white/80 text-lg max-w-2xl mb-10 mx-auto md:mx-0 leading-relaxed">
          Pusat informasi, kegiatan, dan opini terbaru dari Himpunan.
        </p>

        {/* Filter Bar: Kategori, Pencarian, Tahun & Urutan */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Tab Kategori */}
          <div className="flex flex-wrap justify-center md:justify-start gap-2.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border backdrop-blur-sm cursor-pointer ${
                  activeCategory === cat
                    ? "bg-accent border-accent text-slate-900 shadow-[0_0_15px_rgba(255,195,0,0.4)]"
                    : "bg-white/5 border-white/10 text-white/70 hover:border-accent/50 hover:text-accent hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search, Filter Tahun, Urutkan */}
          <div className="flex flex-wrap items-center justify-center md:justify-start lg:justify-end gap-2.5">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-white/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari artikel..."
                className="w-full bg-white/5 border border-white/15 rounded-full pl-10 pr-9 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-accent transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  aria-label="Hapus pencarian"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-accent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter tahun"
              className="bg-[#02182b]/90 border border-white/15 rounded-full pl-4 pr-9 py-2.5 text-sm font-semibold text-white appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%23ffc300%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.1rem_1.1rem] bg-[right_0.75rem_center] bg-no-repeat focus:outline-none focus:border-accent cursor-pointer"
            >
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr === "Semua" ? "Semua Tahun" : `Tahun ${yr}`}
                </option>
              ))}
            </select>

            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Urutkan artikel"
              className="bg-[#02182b]/90 border border-white/15 rounded-full pl-4 pr-9 py-2.5 text-sm font-semibold text-white appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%23ffc300%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.1rem_1.1rem] bg-[right_0.75rem_center] bg-no-repeat focus:outline-none focus:border-accent cursor-pointer"
            >
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
            </select>
          </div>
        </div>
      </header>
      {/* END TITLE */}

      {/* Jika Data Kosong */}
      {filteredArticles.length === 0 && !featuredArticle && (
        <div className="text-center text-white/60 py-20 relative z-10 max-w-md mx-auto px-4">
          <p className="text-base font-semibold mb-3">Tidak ada artikel yang cocok dengan filter.</p>
          {(activeCategory !== "Semua" || searchQuery || selectedYear !== "Semua") && (
            <button
              type="button"
              onClick={() => {
                setActiveCategory("Semua");
                setSearchQuery("");
                setSelectedYear("Semua");
                setSortOrder("newest");
                setCurrentPage(1);
              }}
              className="px-5 py-2 rounded-full bg-accent text-slate-900 font-bold text-xs cursor-pointer hover:bg-accent-hover transition-colors"
            >
              Reset Filter
            </button>
          )}
        </div>
      )}

      {/* Featured Article Dinamis */}
      {featuredArticle && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 relative z-10">
          <article className="relative bg-white/5 backdrop-blur-lg rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 group flex flex-col lg:flex-row hover:border-accent/50 hover:shadow-[0_0_30px_rgba(255,195,0,0.15)] transition-all duration-500">
            <div className="lg:w-3/5 aspect-video lg:aspect-auto relative overflow-hidden">
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                onError={(e) => {
                  const fallback = artikelData[0]?.image;
                  if (fallback && e.currentTarget.src !== fallback) {
                    e.currentTarget.src = fallback;
                  }
                }}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#043761]/80 via-transparent to-transparent opacity-60"></div>
              <div className="absolute top-4 left-4">
                <span className="px-4 py-1.5 bg-accent/90 backdrop-blur-sm text-slate-900 text-xs font-extrabold rounded-full uppercase tracking-widest">
                  Sorotan Utama
                </span>
              </div>
            </div>

            <div className="lg:w-2/5 p-8 sm:p-10 lg:p-12 flex flex-col justify-center relative z-10">
              <div className="flex items-center gap-4 mb-4 text-xs font-bold uppercase tracking-widest text-accent/80">
                <span className="text-accent">{featuredArticle.category}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                <time>{featuredArticle.date}</time>
              </div>
              <Link to={`/artikel/${featuredArticle.id}`}>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 leading-tight group-hover:text-accent transition-colors line-clamp-3">
                  {featuredArticle.title}
                </h2>
              </Link>
              <p className="text-white/70 leading-relaxed mb-8 line-clamp-3">
                {featuredArticle.excerpt}
              </p>

              <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/10">
                <Link
                  to={`/artikel/${featuredArticle.id}`}
                  className="text-lg font-bold text-accent mt-auto group-hover:text-white transition-colors"
                >
                  Baca Selengkapnya →
                </Link>
              </div>
            </div>
          </article>
        </section>
      )}

      {/* Grid Articles Dinamis */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedArticles.map((article) => (
            <article
              key={article.id}
              className="bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 hover:border-accent/50 hover:-translate-y-2 transition-all duration-300 flex flex-col group"
            >
              <Link
                to={`/artikel/${article.id}`}
                className="block relative aspect-[4/3] overflow-hidden"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  onError={(e) => {
                    const fallback =
                      artikelData.find((a) => String(a.id) === String(article.id))?.image ||
                      artikelData[0]?.image;
                    if (fallback && e.currentTarget.src !== fallback) {
                      e.currentTarget.src = fallback;
                    }
                  }}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 bg-accent/90 text-slate-900 text-[10px] uppercase font-bold rounded-lg">
                    {article.category}
                  </span>
                </div>
              </Link>
              <div className="p-6 sm:p-8 flex flex-col flex-grow">
                <time className="text-xs font-semibold text-accent/80 mb-3 block uppercase tracking-widest">
                  {article.date}
                </time>
                <Link to={`/artikel/${article.id}`} className="block mb-3">
                  <h2 className="text-xl font-bold text-white group-hover:text-accent transition-colors line-clamp-2">
                    {article.title}
                  </h2>
                </Link>
                <p className="text-white/70 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                  {article.excerpt}
                </p>
                <Link
                  to={`/artikel/${article.id}`}
                  className="text-sm font-bold text-accent mt-auto group-hover:text-white transition-colors"
                >
                  Baca Selengkapnya →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-14 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => {
                setCurrentPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-4 py-2.5 rounded-full bg-white/5 border border-white/15 text-white text-xs font-bold flex items-center gap-1.5 hover:border-accent hover:text-accent disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => {
                    setCurrentPage(pageNum);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`w-10 h-10 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                    safePage === pageNum
                      ? "bg-accent text-slate-900 shadow-[0_0_15px_rgba(255,195,0,0.4)]"
                      : "bg-white/5 border border-white/15 text-white/80 hover:border-accent hover:text-accent"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => {
                setCurrentPage((p) => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-4 py-2.5 rounded-full bg-white/5 border border-white/15 text-white text-xs font-bold flex items-center gap-1.5 hover:border-accent hover:text-accent disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
            >
              <span>Berikutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>
    </motion.main>
  );
}
