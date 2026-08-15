import { useState } from "react";
import { Link } from "react-router-dom";

// Import gambar mockup
import Image1 from "../assets/images/1.jpg";
import Image2 from "../assets/images/2.jpg";
import Image3 from "../assets/images/3.jpg";

// Import gambar kegiatan Make Connection
import Image4 from "../assets/images/artikel&berita/mc-fgd.jpeg";

export default function Artikel() {
  const [activeCategory, setActiveCategory] = useState("Semua");

  const [visibleCount, setVisibleCount] = useState(3);

  const categories = ["Semua", "Berita", "Kegiatan", "Opini", "Prestasi"];

  const featuredArticle = {
    id: 1,
    title:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
    excerpt:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    date: "12 Agustus 2026",
    datetime: "2026-08-12",
    author: "Divisi Kominfo",
    category: "Berita",
    image: Image1,
  };

  const articles = [
    {
      id: 2,
      title: 'Pererat Hubungan dan Berbagi Inovasi, HIMSIKA UNSIKA Gelar Studi Banding "Make Connection × Standing" Bersama HIMATIF UNPAD',
      excerpt:
        "Dalam upaya memperluas cakrawala organisasi dan membangun jejaring akademis yang kuat, Himsika sukses menyelenggarakan studi banding kolaboratif bersama Himatif Unpad.",
      date: "09 Mei 2026",
      datetime: "2026-05-09",
      category: "Kegiatan",
      image: Image4,
    },
    {
      id: 3,
      title: "Neque porro quisquam est, qui dolorem ipsum.",
      excerpt:
        "Adipisci velit, sed quia non numquam eius modi tempora incidunt.",
      date: "05 Agustus 2026",
      datetime: "2026-08-05",
      category: "Prestasi",
      image: Image3,
    },
    {
      id: 4,
      title: "Quis autem vel eum iure reprehenderit qui in ea.",
      excerpt:
        "Molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla.",
      date: "01 Agustus 2026",
      datetime: "2026-08-01",
      category: "Opini",
      image: Image1,
    },
    {
      id: 5,
      title: "At vero eos et accusamus et iusto odio dignissimos.",
      excerpt:
        "Voluptatum deleniti atque corrupti quos dolores et quas molestias.",
      date: "28 Juli 2026",
      datetime: "2026-07-28",
      category: "Berita",
      image: Image2,
    },
    {
      id: 6,
      title: "Similique sunt in culpa qui officia deserunt.",
      excerpt: "Et harum quidem rerum facilis est et expedita distinctio.",
      date: "25 Juli 2026",
      datetime: "2026-07-25",
      category: "Kegiatan",
      image: Image3,
    },
    {
      id: 7,
      title: "Itaque earum rerum hic tenetur a sapiente delectus.",
      excerpt:
        "Maiores alias consequatur aut perferendis doloribus asperiores repellat.",
      date: "20 Juli 2026",
      datetime: "2026-07-20",
      category: "Prestasi",
      image: Image1,
    },
    
    {
      id: 8,
      title:
        'Pererat Hubungan dan Berbagi Inovasi, HIMSIKA UNSIKA Gelar Studi Banding "Make Connection × Standing" Bersama HIMATIF UNPAD',
      excerpt:
        "Dalam upaya memperluas cakrawala organisasi dan membangun jejaring akademis yang kuat, Himsika sukses menyelenggarakan studi banding kolaboratif bersama Himatif Unpad.",
      date: "09 Mei 2026",
      datetime: "2026-05-09",
      category: "Kegiatan",
      image: Image4,
    },
  ];

  // LANGKAH 2: Fungsi saat kategori diklik (Reset hitungan)
  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setVisibleCount(3); // Kembalikan batas ke 3 saat ganti kategori
  };

  // LANGKAH 3: Fungsi penambah jumlah saat tombol diklik
  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 3); // Tambah 3 item lagi
  };

  // LANGKAH 4: Filter data dan potong (slice) sesuai batas visibleCount
  const filteredArticles = articles.filter(
    (article) =>
      activeCategory === "Semua" || article.category === activeCategory,
  );

  // Ini adalah data akhir yang akan di-render ke layar
  const displayedArticles = filteredArticles.slice(0, visibleCount);

  return (
    <main className="min-h-screen bg-linear-to-b from-[#043761] via-primary to-[#043761] font-primary pt-32 pb-20 selection:bg-accent selection:text-slate-900 relative overflow-hidden">
      {/* Background Dekorasi Tech/Glassmorphism */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="absolute w-[30rem] h-[30rem] rounded-full blur-[120px] bg-accent/20 top-0 left-0 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div
          className="absolute w-[25rem] h-[25rem] rounded-full blur-[120px] bg-info/20 bottom-0 right-0 translate-x-1/3 translate-y-1/3 animate-pulse"
          style={{ animationDuration: "7s" }}
        ></div>

        {/* Ornamen Floating */}
        <div
          className="absolute top-40 right-10 sm:right-24 animate-bounce text-accent/30"
          style={{ animationDuration: "5s" }}
        >
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
        </div>
        <div
          className="absolute bottom-60 left-10 sm:left-20 animate-pulse text-info/30"
          style={{ animationDuration: "4s" }}
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="3"
              stroke="currentColor"
              strokeWidth="2"
            ></circle>
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            ></circle>
          </svg>
        </div>
      </div>

      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center md:text-left relative z-10">
        <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
          <span className="w-8 sm:w-12 h-[2px] bg-accent rounded-full hidden md:block"></span>
          <span className="text-accent font-bold text-sm uppercase tracking-widest">
            Updates & News
          </span>
          <span className="w-8 sm:w-12 h-[2px] bg-accent rounded-full md:hidden"></span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 relative inline-block">
          Kabar{" "}
          <span className="text-accent drop-shadow-[0_0_15px_rgba(255,195,0,0.4)]">
            HIMSIKA
          </span>
          {/* Bintang Sparkle */}
          <svg
            className="absolute -top-6 -right-10 w-6 h-6 text-accent/60 hidden sm:block animate-[spin_10s_linear_infinite]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
        </h1>

        <p className="text-white/80 text-lg max-w-2xl mb-10 mx-auto md:mx-0 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>

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

      {/* Featured Article */}
      {(activeCategory === "Semua" ||
        activeCategory === featuredArticle.category) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 relative z-10">
          <article className="relative bg-white/5 backdrop-blur-lg rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 group flex flex-col lg:flex-row hover:border-accent/50 hover:shadow-[0_0_30px_rgba(255,195,0,0.15)] transition-all duration-500">
            <div className="lg:w-3/5 aspect-video lg:aspect-auto relative overflow-hidden">
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                loading="lazy"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#043761]/80 via-transparent to-transparent opacity-60"></div>
              <div className="absolute top-4 left-4">
                <span className="px-4 py-1.5 bg-accent/90 backdrop-blur-sm text-slate-900 text-xs font-extrabold rounded-full shadow-md uppercase tracking-widest">
                  Sorotan Utama
                </span>
              </div>
            </div>

            <div className="lg:w-2/5 p-8 sm:p-10 lg:p-12 flex flex-col justify-center relative z-10">
              <div className="flex items-center gap-4 mb-4 text-xs font-bold uppercase tracking-widest text-accent/80">
                <span className="text-accent">{featuredArticle.category}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                <time
                  dateTime={featuredArticle.datetime}
                  className="text-white/60"
                >
                  {featuredArticle.date}
                </time>
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
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent font-bold backdrop-blur-sm">
                    DK
                  </div>
                  <span className="text-sm font-semibold text-white/90">
                    {featuredArticle.author}
                  </span>
                </div>
                <Link
                  to={`/artikel/${featuredArticle.id}`}
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white group-hover:bg-accent group-hover:text-slate-900 group-hover:border-accent group-hover:shadow-[0_0_15px_rgba(255,195,0,0.5)] transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </article>
        </section>
      )}

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Loop data yang sudah dipotong (displayedArticles) */}
          {displayedArticles.map((article) => (
            <article
              key={article.id}
              className="bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 hover:border-accent/50 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:-translate-y-2 transition-all duration-300 group flex flex-col relative"
            >
              {/* Efek Garis Hover Atas */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-accent opacity-0 group-hover:opacity-100 transition-opacity z-20" />

              <Link
                to={`/artikel/${article.id}`}
                className="block relative aspect-[4/3] overflow-hidden"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  loading="lazy"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-[#043761]/20 group-hover:bg-transparent transition-colors duration-500"></div>
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 bg-accent/90 backdrop-blur-sm text-slate-900 text-[10px] uppercase tracking-widest font-bold rounded-lg shadow-sm">
                    {article.category}
                  </span>
                </div>
              </Link>

              <div className="p-6 sm:p-8 flex flex-col flex-grow">
                <time
                  dateTime={article.datetime}
                  className="text-xs font-semibold text-accent/80 mb-3 block uppercase tracking-widest"
                >
                  {article.date}
                </time>
                <Link to={`/artikel/${article.id}`} className="block mb-3">
                  <h2 className="text-xl font-bold text-white leading-snug group-hover:text-accent transition-colors line-clamp-2">
                    {article.title}
                  </h2>
                </Link>
                <p className="text-white/70 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                  {article.excerpt}
                </p>

                <Link
                  to={`/artikel/${article.id}`}
                  className="inline-flex items-center text-sm font-bold text-accent group-hover:text-white transition-colors mt-auto"
                >
                  Baca Selengkapnya
                  <svg
                    className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* LANGKAH 5: Tampilkan tombol HANYA jika data yang tersembunyi masih ada */}
        {visibleCount < filteredArticles.length && (
          <div className="mt-16 text-center">
            <button
              onClick={handleLoadMore}
              className="px-8 py-4 rounded-full bg-white/5 backdrop-blur-sm border border-white/20 text-white font-bold hover:bg-accent hover:border-accent hover:text-slate-900 hover:shadow-[0_0_20px_rgba(255,195,0,0.4)] transition-all duration-300 cursor-pointer"
            >
              Muat Lebih Banyak
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
