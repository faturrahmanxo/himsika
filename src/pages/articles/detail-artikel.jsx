import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ZoomIn } from "lucide-react";
import EventGalleryModal from "../../components/EventGalleryModal.jsx";
// IMPORT DATA & SUPABASE
import artikelData from "../../data/artikel";
import supabase from "../../supabase-client";

// Ubah artikel lama yang memiliki gallery menumpuk di awal menjadi struktur teratur
// (paragraf pembuka -> sub-bab -> paragraf -> foto landscape ber-caption) seperti Make Connection x Standing.
function normalizeArticleBlocks(blocks) {
  if (!Array.isArray(blocks) || blocks.length === 0) return [];
  const extractedImages = [];
  const cleanBlocks = [];

  for (const block of blocks) {
    if (block?.type === "gallery" && Array.isArray(block.images)) {
      for (const imgItem of block.images) {
        if (imgItem?.src && String(imgItem.src).trim()) {
          const cleanAlt = imgItem.alt || "Dokumentasi Kegiatan HIMSIKA";
          const isRawCamName = /^(IMG_|Salinan|DSC|PXL)/i.test(cleanAlt);
          extractedImages.push({
            type: "image",
            image: String(imgItem.src).trim(),
            alt: cleanAlt,
            caption: imgItem.caption || (isRawCamName ? "Dokumentasi Kegiatan HIMSIKA" : cleanAlt),
          });
        }
      }
    } else if (block) {
      cleanBlocks.push(block);
    }
  }

  const hasInlineImage = cleanBlocks.some((b) => b.type === "image" && b.image);
  if (!hasInlineImage && extractedImages.length > 0 && cleanBlocks.length > 0) {
    const maxPhotos = Math.min(3, extractedImages.length);
    const chosen = extractedImages.slice(0, maxPhotos);
    const result = [];
    const total = cleanBlocks.length;
    const insertAfterIndices = new Set();

    if (maxPhotos === 1) {
      insertAfterIndices.add(Math.min(1, total - 1));
    } else if (maxPhotos === 2) {
      insertAfterIndices.add(Math.min(1, total - 1));
      insertAfterIndices.add(Math.max(2, total - 2));
    } else {
      insertAfterIndices.add(Math.min(1, total - 1));
      insertAfterIndices.add(Math.floor(total / 2));
      insertAfterIndices.add(Math.max(2, total - 2));
    }

    let photoIdx = 0;
    cleanBlocks.forEach((b, idx) => {
      result.push(b);
      if (insertAfterIndices.has(idx) && photoIdx < chosen.length) {
        result.push(chosen[photoIdx++]);
      }
    });
    while (photoIdx < chosen.length) {
      result.push(chosen[photoIdx++]);
    }
    return result;
  }

  return cleanBlocks;
}

export default function DetailArtikel() {
  const { id } = useParams();

  const [article, setArticle] = useState(() =>
    artikelData.find((item) => String(item.id) === String(id)),
  );
  const [loading, setLoading] = useState(!article);

  useEffect(() => {
    async function loadArticle() {
      try {
        const { data, error } = await supabase
          .from("artikel")
          .select("*")
          .eq("id", id)
          .single();

        if (!error && data) {
          const fallback = artikelData.find((item) => String(item.id) === String(id));
          const finalImage = (data.image && data.image.trim()) ? data.image.trim() : (fallback?.image || "");
          
          let finalContent = data.content;
          if (Array.isArray(finalContent) && Array.isArray(fallback?.content)) {
            finalContent = finalContent.map((block, bIdx) => {
              if (block.type === "gallery" && Array.isArray(block.images)) {
                const fallbackBlock = fallback.content[bIdx];
                if (fallbackBlock && fallbackBlock.type === "gallery" && Array.isArray(fallbackBlock.images)) {
                  return {
                    ...block,
                    images: block.images.map((imgItem, iIdx) => ({
                      ...imgItem,
                      src: (imgItem.src && imgItem.src.trim()) ? imgItem.src.trim() : (fallbackBlock.images[iIdx]?.src || ""),
                    })),
                  };
                }
              }
              return block;
            });
          }

          setArticle({
            ...data,
            image: finalImage,
            content: finalContent,
          });
        }
      } catch (e) {
        console.warn("Gagal fetch artikel dari DB:", e.message);
      } finally {
        setLoading(false);
      }
    }

    if (!article) {
      loadArticle();
    }
  }, [id, article]);

  if (loading) {
    return (
      <main className="min-h-screen bg-linear-to-b from-[#043761] via-primary to-[#043761] flex items-center justify-center p-4">
        <div className="text-white/70 font-bold text-base">Memuat artikel...</div>
      </main>
    );
  }

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

  const rawBlocks = Array.isArray(article.content)
    ? article.content
    : typeof article.content === "string"
    ? article.content.trim().startsWith("[")
      ? (() => {
          try {
            return JSON.parse(article.content);
          } catch {
            return [{ type: "paragraph", text: article.content }];
          }
        })()
      : [{ type: "paragraph", text: article.content }]
    : [];

  const contentBlocks = normalizeArticleBlocks(rawBlocks);

  // 2. TAMPILAN UTAMA ARTIKEL
  return (
    <main className="min-h-screen bg-linear-to-b from-[#043761] via-primary to-[#043761] font-primary pt-32 pb-24 selection:bg-accent selection:text-slate-900 relative overflow-hidden">
      {/* Background Dekorasi (Lebih soft agar tidak mengganggu bacaan) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-[20rem] bg-accent/10 blur-[150px] rounded-full"></div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white w-full break-words">
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

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.25] tracking-tight mb-8 break-words">
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
            prose-strong:text-white prose-strong:font-bold prose-s:text-white/60 prose-u:underline prose-u:decoration-accent/60"
        >
          {/* Looping Konten Artikel */}
          {contentBlocks.map((block, index) => {
            if (block.type === "paragraph") {
              return (
                <p
                  key={index}
                  className="text-left sm:text-justify mb-8 break-words [overflow-wrap:anywhere] [word-break:break-word] text-white/85 leading-relaxed sm:leading-loose text-[1.05rem] sm:text-[1.125rem]"
                  dangerouslySetInnerHTML={{ __html: block.text }}
                />
              );
            }
            if (block.type === "heading") {
              return (
                <h3
                  key={index}
                  className="text-2xl sm:text-3xl font-black mt-14 mb-6 text-accent flex items-center gap-3 break-words"
                >
                  <span className="w-2 h-8 bg-accent rounded-full inline-block shrink-0"></span>
                  <span>{block.text}</span>
                </h3>
              );
            }
            if (block.type === "list") {
              const ListTag = block.ordered ? "ol" : "ul";
              return (
                <ListTag
                  key={index}
                  className={`my-8 pl-6 space-y-3 text-white/85 text-[1.05rem] sm:text-[1.15rem] leading-[1.8] ${
                    block.ordered ? "list-decimal" : "list-disc"
                  } marker:text-accent break-words`}
                >
                  {block.items.map((item, i) => (
                    <li key={i} className="break-words" dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ListTag>
              );
            }
            if (block.type === "image") {
              return (
                <figure key={index} className="my-10">
                  <div className="w-full max-w-3xl mx-auto aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-[#02182b] relative group">
                    <img
                      src={block.image}
                      alt={block.alt || "Gambar Artikel"}
                      className="w-full h-full object-cover transform group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 border-2 border-white/5 rounded-2xl pointer-events-none"></div>
                  </div>
                  {block.caption && (
                    <figcaption className="text-center text-sm sm:text-base text-white/50 italic mt-4 flex items-center justify-center gap-2 break-words px-4">
                      {block.caption}
                    </figcaption>
                  )}
                </figure>
              );
            }
            if (block.type === "gallery") {
              return <GalleryGrid key={index} images={block.images} />;
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

// Galeri foto: grid rapi + EventGalleryModal (seragam dengan event)
function GalleryGrid({ images }) {
  const [active, setActive] = useState(null);
  if (!images || images.length === 0) return null;

  return (
    <div className="my-12 not-prose">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className="group relative aspect-[16/10] sm:aspect-video rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-lg cursor-pointer"
          >
            <img
              src={img.src}
              alt={img.alt || `Foto ${i + 1}`}
              loading="lazy"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            {/* Overlay Kaca Pembesar (Persis seperti Event Pages) */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs border border-white/30 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <ZoomIn className="w-4 h-4 text-white" />
              </div>
            </div>
          </button>
        ))}
      </div>

      <EventGalleryModal
        isOpen={active !== null}
        currentIndex={active}
        images={images.map((img) => img.src)}
        category="ARTIKEL & BERITA"
        title="Dokumentasi Berita"
        onClose={() => setActive(null)}
        onNavigate={(newIdx) => setActive(newIdx)}
      />
    </div>
  );
}
