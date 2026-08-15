import { useParams, Link } from "react-router-dom";
// IMPORT DATA (Sesuaikan path)
import artikelData from "../../data/artikel";

export default function DetailArtikel() {
  const { id } = useParams();

  // Cari artikel berdasarkan ID
  const article = artikelData.find((item) => item.id === Number(id));

  // 1. STATE JIKA ARTIKEL TIDAK DITEMUKAN (Dibikin lebih elegan)
  if (!article) {
    return (
      <main className="min-h-screen bg-linear-to-b from-[#043761] via-primary to-[#043761] flex items-center justify-center p-4">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-10 rounded-[2rem] text-center max-w-md shadow-2xl">
          <h1 className="text-white text-3xl font-extrabold mb-4">404</h1>
          <p className="text-white/70 mb-8">
            Artikel yang kamu cari tidak ditemukan atau mungkin sudah dihapus.
          </p>
          <Link
            to="/artikel"
            className="inline-flex px-8 py-3 bg-accent text-slate-900 font-bold rounded-full hover:scale-105 transition-transform"
          >
            Kembali ke Berita
          </Link>
        </div>
      </main>
    );
  }

  // 2. TAMPILAN UTAMA ARTIKEL
  return (
    <main className="min-h-screen bg-linear-to-b from-[#043761] via-primary to-[#043761] font-primary pt-32 pb-24 selection:bg-accent selection:text-slate-900 relative overflow-hidden">
      {/* Background Dekorasi (Lebih soft agar tidak mengganggu bacaan) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-[20rem] bg-accent/10 blur-[150px] rounded-full"></div>
      </div>

      <article className="max-w-[50rem] mx-auto px-5 sm:px-6 lg:px-8 relative z-10 text-white">
        {/* Tombol Kembali (Gaya Pill/Kapsul Glassmorphism) */}
        <Link
          to="/artikel"
          className="group inline-flex items-center gap-3 px-5 py-2.5 mb-10 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md rounded-full text-white/80 hover:text-accent transition-all duration-300 font-bold text-xs sm:text-sm uppercase tracking-widest shadow-lg"
        >
          <svg
            className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Kembali ke Berita
        </Link>

        {/* Header Artikel */}
        <header className="mb-12 border-b border-white/10 pb-10">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 text-xs sm:text-sm font-bold uppercase tracking-widest text-accent/90">
            <span className="bg-accent/10 border border-accent/20 px-4 py-1.5 rounded-full shadow-sm">
              {article.category}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/30 hidden sm:block"></span>
            <time dateTime={article.datetime} className="text-white/60">
              {article.date}
            </time>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.2] tracking-tight mb-8">
            {article.title}
          </h1>

          {/* Author Info */}
          {article.author && (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-yellow-600 flex items-center justify-center text-slate-900 font-black text-lg shadow-lg">
                {article.author.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm sm:text-base">
                  {article.author}
                </span>
                <span className="text-white/50 text-xs font-medium uppercase tracking-wider">
                  Penulis
                </span>
              </div>
            </div>
          )}
        </header>

        {/* Isi Artikel Dinamis */}
        {/* Pengaturan Typography (prose) yang sangat nyaman dibaca */}
        <div
          className="prose prose-invert max-w-none prose-lg 
            prose-p:text-white/85 prose-p:leading-[1.8] sm:prose-p:leading-[2] prose-p:text-[1.05rem] sm:prose-p:text-[1.15rem] 
            prose-headings:text-white prose-headings:font-extrabold prose-headings:tracking-tight 
            prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-a:font-bold
            prose-strong:text-white prose-strong:font-bold"
        >
          {/* Looping Konten Artikel */}
          {article.content.map((block, index) => {
            if (block.type === "paragraph") {
              return (
                <p
                  key={index}
                  // Di HP rata kiri (agar tidak ada jarak aneh), di Layar besar rata kanan-kiri
                  className="text-left sm:text-justify mb-8"
                  dangerouslySetInnerHTML={{ __html: block.text }}
                />
              );
            }
            if (block.type === "heading") {
              return (
                <h3
                  key={index}
                  className="text-2xl sm:text-3xl font-black mt-14 mb-6 text-accent flex items-center gap-3"
                >
                  <span className="w-2 h-8 bg-accent rounded-full inline-block"></span>
                  {block.text}
                </h3>
              );
            }
            if (block.type === "image") {
              return (
                <figure key={index} className="my-12">
                  <div className="w-full rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-white/5 relative group">
                    <img
                      src={block.image}
                      alt={block.alt || "Gambar Artikel"}
                      className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 border-2 border-white/5 rounded-[2rem] pointer-events-none"></div>
                  </div>
                  {block.caption && (
                    <figcaption className="text-center text-sm sm:text-base text-white/50 italic mt-5 flex items-center justify-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {block.caption}
                    </figcaption>
                  )}
                </figure>
              );
            }
            return null;
          })}
        </div>

        {/* Footer Artikel (Share / Tag) */}
        <footer className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm font-medium">
            Terima kasih telah membaca.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
          >
            Kembali ke Atas
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        </footer>
      </article>
    </main>
  );
}
