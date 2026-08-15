import { useState } from "react";
import { Link } from "react-router-dom";
// IMPORT DATA UTAMA (Sesuaikan path)
import artikelData from "../data/artikel";

export default function Artikel() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [visibleCount, setVisibleCount] = useState(3);
  const categories = ["Semua", "Berita", "Kegiatan", "Opini", "Prestasi"];

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setVisibleCount(3);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  // Filter Data Berdasarkan Kategori
  const filteredArticles = artikelData.filter(
    (article) =>
      activeCategory === "Semua" || article.category === activeCategory,
  );

  // Pisahkan artikel pertama sebagai Highlight (jika ada data)
  const featuredArticle =
    filteredArticles.length > 0 ? filteredArticles[0] : null;

  // Sisanya masuk ke grid
  const displayedArticles = filteredArticles.slice(1, visibleCount + 1);

  return (
    <main className="min-h-screen bg-linear-to-b from-[#043761] via-primary to-[#043761] font-primary pt-42 pb-20 relative overflow-hidden">
      {/* Background (TETAP SAMA) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="absolute w-[30rem] h-[30rem] rounded-full blur-[120px] bg-accent/20 top-0 left-0 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
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

        {/* Tab Kategori */}
        <div className="flex flex-wrap justify-center md:justify-start gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border backdrop-blur-sm ${
                activeCategory === cat
                  ? "bg-accent border-accent text-slate-900 shadow-[0_0_15px_rgba(255,195,0,0.4)]"
                  : "bg-white/5 border-white/10 text-white/70 hover:border-accent/50 hover:text-accent hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>
      {/* END TITLE */}

      {/* Jika Data Kosong */}
      {filteredArticles.length === 0 && (
        <div className="text-center text-white/60 py-20 relative z-10">
          Belum ada artikel di kategori ini.
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

        {/* Load More Button */}
        {filteredArticles.length > visibleCount + 1 && (
          <div className="mt-16 text-center">
            <button
              onClick={handleLoadMore}
              className="px-8 py-4 rounded-full bg-white/5 border border-white/20 text-white font-bold hover:bg-accent hover:text-slate-900 transition-all cursor-pointer"
            >
              Muat Lebih Banyak
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
