import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import supabase from "../../supabase-client";
import pengurusData from "../../data/pengurusData";
import artikelData from "../../data/artikel";
import galeriDefault from "../../data/galeriData";
import { PRESTASI_DATA } from "../../data/prestasiData";
import LogoHimsika from "../../assets/logo/HIMSIKA.png";
import ImageHero1 from "../../assets/images/1.webp";
import ImageHero2 from "../../assets/images/2.webp";
import ImageHero3 from "../../assets/images/3.webp";
import {
  Trophy,
  FileText,
  Award,
  Image as ImageIcon,
  Users,
  LogOut,
  Menu as MenuIcon,
  X as XIcon,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  ExternalLink,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { isLombaExpired, getLombaFinalTimestamp } from "../../utils/lombaDeadline";

const HERO_IMAGES = [
  {
    src: ImageHero1,
    title: "Make Connection × Standing",
    subtitle: "Kolaborasi sinergis Himsika Unsika × Himatif Unpad",
  },
  {
    src: ImageHero2,
    title: "Information System Company Tour",
    subtitle: "Mengenal inovasi dan transformasi industri teknologi",
  },
  {
    src: ImageHero3,
    title: "Kebersamaan & Sinergi Organisasi",
    subtitle: "Fungsionaris Himpunan Mahasiswa Sistem Informasi",
  },
];

const MENU_GROUPS = [
  {
    id: "beranda",
    title: "Beranda",
    items: [
      { id: "lomba", label: "Dashboard Lomba", title: "Lomba & Beasiswa", icon: Trophy, countKey: "lomba" },
    ],
  },
  {
    id: "administrasi",
    title: "Administrasi",
    items: [
      {
        id: "artikel",
        label: "Artikel & Berita",
        title: "Artikel & Berita",
        icon: FileText,
        countKey: "artikel",
        children: [
          { id: "artikel-utama", label: "Data Utama & Daftar" },
          { id: "artikel-bagian", label: "Penyusun Bagian & Dokum" },
        ],
      },
      { id: "galeri", label: "Dokumentasi Galeri", title: "Galeri Kegiatan", icon: ImageIcon, countKey: "galeri" },
      { id: "prestasi", label: "Prestasi Mahasiswa", title: "Prestasi Mahasiswa", icon: Award, countKey: "prestasi" },
      { id: "pengurus", label: "Data Pengurus", title: "Profil & Pengurus", icon: Users, countKey: "pengurus" },
    ],
  },
];

const KELOMPOK_OPTIONS = [
  { id: "bph", label: "Badan Pengurus Harian (BPH)" },
  { id: "kadiv", label: "Ketua Divisi" },
  { id: "internal", label: "Divisi Internal" },
  { id: "relasi", label: "Divisi Relasi" },
  { id: "kominfo", label: "Divisi Kominfo" },
  { id: "edukasi", label: "Divisi Edukasi" },
];

const ALBUM_OPTIONS = [
  "Divisi Internal",
  "Divisi Relasi",
  "Divisi Kominfo",
  "Divisi Edukasi",
  "BPH",
  "Kegiatan Akbar",
];

const ARTIKEL_CATEGORIES = ["Berita", "Kegiatan", "Opini", "Prestasi"];
const PAGE_SIZE = 8;

const inputCls =
  "w-full bg-[#001f54] border border-[#163b70] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-[#b3d2f5]/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/40 transition-colors";
const selectCls =
  "w-full bg-[#001f54] border border-[#163b70] rounded-xl pl-4 pr-12 py-2.5 text-white text-sm appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%23b3d2f5%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1.25rem_center] bg-no-repeat focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/40 transition-colors cursor-pointer";
const textareaCls =
  "w-full bg-[#001f54] border border-[#163b70] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-[#b3d2f5]/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/40 transition-colors resize-none overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";
const labelCls = "block text-xs font-bold text-[#b3d2f5] mb-1.5";

// Urutan artikel: tanggal terbaru dulu. Pakai kolom datetime, kalau kosong baca teks "26 September 2026".
const BULAN = {
  januari: 1, februari: 2, maret: 3, april: 4, mei: 5, juni: 6,
  juli: 7, agustus: 8, september: 9, oktober: 10, november: 11, desember: 12,
};

function parseTanggal(text) {
  const m = String(text || "").toLowerCase().match(/(\d{1,2})\s+([a-z]+)\s+(\d{4})/);
  if (!m || !BULAN[m[2]]) return "";
  return `${m[3]}-${String(BULAN[m[2]]).padStart(2, "0")}-${m[1].padStart(2, "0")}`;
}

function artikelSortKey(a) {
  if (a.datetime) return String(a.datetime).slice(0, 10);
  return parseTanggal(a.date);
}

function sortArtikel(list) {
  return [...list].sort(
    (a, b) =>
      artikelSortKey(b).localeCompare(artikelSortKey(a)) ||
      Number(b.id) - Number(a.id),
  );
}

function parseCategories(cat) {
  if (Array.isArray(cat)) {
    return cat.map((c) => String(c).replace(/["'\\]/g, "").trim()).filter(Boolean);
  }
  if (typeof cat === "string") {
    return cat
      .replace(/[[\]{}]/g, "")
      .split(",")
      .map((c) => c.replace(/["'\\]/g, "").trim())
      .filter(Boolean);
  }
  return [];
}

function parsePemenang(p) {
  if (Array.isArray(p)) return p;
  if (typeof p === "string") {
    try {
      const parsed = JSON.parse(p);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return p.split("\n").map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
}

// ---------- Parser & Compiler Konten Artikel ----------
function parseArticleContent(content) {
  let blocks = [];
  if (Array.isArray(content)) {
    blocks = content;
  } else if (typeof content === "string" && content.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) blocks = parsed;
    } catch {
      // not json
    }
  }

  // Jika bukan array blocks, anggap sebagai teks biasa
  if (!blocks || blocks.length === 0) {
    return {
      galleryImages: [],
      leadText: typeof content === "string" ? content : "",
      sections: [],
    };
  }

  const galleryImages = [];
  let leadText = "";
  const sections = [];
  let currentSection = null;

  for (const block of blocks) {
    if (block.type === "gallery" && Array.isArray(block.images)) {
      block.images.forEach((img) => {
        const src = typeof img === "string" ? img : img.src;
        if (src && src.trim()) galleryImages.push(src.trim());
      });
      continue;
    }

    if (block.type === "heading") {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        id: "sec_" + Math.random().toString(36).slice(2, 9),
        title: block.text || "",
        image: "",
        caption: "",
        text: "",
      };
      continue;
    }

    if (currentSection) {
      if (block.type === "image") {
        if (!currentSection.image) {
          currentSection.image = block.image || "";
          currentSection.caption = block.caption || "";
        } else {
          currentSection.text =
            (currentSection.text ? currentSection.text + "\n\n" : "") +
            (block.caption || block.image);
        }
      } else if (block.type === "paragraph") {
        currentSection.text =
          (currentSection.text ? currentSection.text + "\n\n" : "") + (block.text || "");
      } else if (block.type === "list" && Array.isArray(block.items)) {
        const listText = block.items.map((it) => "• " + it).join("\n");
        currentSection.text =
          (currentSection.text ? currentSection.text + "\n\n" : "") + listText;
      }
    } else {
      if (block.type === "paragraph") {
        leadText = (leadText ? leadText + "\n\n" : "") + (block.text || "");
      } else if (block.type === "image") {
        if (block.image) galleryImages.push(block.image);
      }
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return { galleryImages, leadText, sections };
}

function compileArticleContent({ galleryImages, leadText, sections }) {
  const blocks = [];

  // 1. Galeri Dokumentasi Utama (Landscape) di Bawah Judul
  const validGallery = (galleryImages || [])
    .map((g) => (typeof g === "string" ? g.trim() : g?.src?.trim()))
    .filter(Boolean);
  if (validGallery.length > 0) {
    blocks.push({
      type: "gallery",
      images: validGallery.map((src) => ({ src, alt: "Dokumentasi Kegiatan" })),
    });
  }

  // 2. Paragraf Pengantar
  if (leadText && leadText.trim()) {
    leadText
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean)
      .forEach((text) => blocks.push({ type: "paragraph", text }));
  }

  // 3. Bagian-Bagian Artikel (Sub-Bab)
  (sections || []).forEach((sec) => {
    if (sec.title && sec.title.trim()) {
      blocks.push({ type: "heading", text: sec.title.trim() });
    }
    if (sec.image && sec.image.trim()) {
      blocks.push({
        type: "image",
        image: sec.image.trim(),
        alt: sec.title || "Dokumentasi Bagian",
        caption: sec.caption || "",
      });
    }
    if (sec.text && sec.text.trim()) {
      sec.text
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean)
        .forEach((text) => blocks.push({ type: "paragraph", text }));
    }
  });

  return blocks;
}

function TextFormatToolbar({ textareaRef, value, onChange }) {
  const apply = (type) => {
    const el = textareaRef?.current;
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const current = value || "";
    const selected = current.slice(start, end);

    let prefix = "";
    let suffix = "";
    if (type === "bold") {
      prefix = "<b>";
      suffix = "</b>";
    } else if (type === "italic") {
      prefix = "<i>";
      suffix = "</i>";
    } else if (type === "strike") {
      prefix = "<s>";
      suffix = "</s>";
    } else if (type === "underline") {
      prefix = "<u>";
      suffix = "</u>";
    } else if (type === "bullet") {
      prefix = "\n• ";
      suffix = "";
    }

    const replacement = selected ? `${prefix}${selected}${suffix}` : `${prefix}teks${suffix}`;
    const nextVal = current.slice(0, start) + replacement + current.slice(end);
    onChange(nextVal);

    setTimeout(() => {
      el.focus();
      const cursor = start + prefix.length + (selected ? selected.length : 4);
      el.setSelectionRange(cursor, cursor);
    }, 15);
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 mb-2 bg-[#02182b]/80 border border-[#163b70] px-2.5 py-1.5 rounded-lg text-xs">
      <span className="text-[10px] font-bold text-accent uppercase tracking-wider mr-1">Format Teks:</span>
      <button
        type="button"
        title="Tebal (Bold)"
        onClick={() => apply("bold")}
        className="px-2 py-0.5 font-black text-white hover:text-accent hover:bg-white/10 rounded transition-colors cursor-pointer"
      >
        B
      </button>
      <button
        type="button"
        title="Miring (Italic)"
        onClick={() => apply("italic")}
        className="px-2 py-0.5 italic font-bold text-white hover:text-accent hover:bg-white/10 rounded transition-colors cursor-pointer"
      >
        I
      </button>
      <button
        type="button"
        title="Coret (Strikethrough)"
        onClick={() => apply("strike")}
        className="px-2 py-0.5 line-through font-bold text-white hover:text-accent hover:bg-white/10 rounded transition-colors cursor-pointer"
      >
        S
      </button>
      <button
        type="button"
        title="Garis Bawah (Underline)"
        onClick={() => apply("underline")}
        className="px-2 py-0.5 underline font-bold text-white hover:text-accent hover:bg-white/10 rounded transition-colors cursor-pointer"
      >
        U
      </button>
      <button
        type="button"
        title="Poin List"
        onClick={() => apply("bullet")}
        className="px-2 py-0.5 font-bold text-white hover:text-accent hover:bg-white/10 rounded transition-colors cursor-pointer"
      >
        • List
      </button>
    </div>
  );
}

// ---------- Komponen kecil ----------

function CustomModal({ isOpen, type, title, message, confirmText, cancelText, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-[#02182b]/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md bg-[#073969] border border-[#163b70] rounded-2xl p-6 shadow-2xl text-white"
          >
            <h3 className="text-base sm:text-lg font-bold mb-2">{title}</h3>
            <p className="text-sm text-[#b3d2f5] leading-relaxed mb-6 whitespace-pre-line">{message}</p>
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              {type === "confirm" && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {cancelText}
                </button>
              )}
              <button
                type="button"
                onClick={onConfirm}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  type === "confirm"
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-accent hover:bg-accent-hover text-[#001f54]"
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Thumb({ src, alt, className = "w-12 h-12", rounded = "rounded-lg" }) {
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [src]);
  if (!src || broken) {
    return (
      <div className={`${className} ${rounded} shrink-0 bg-[#001f54] border border-[#163b70] flex items-center justify-center text-[9px] font-bold text-[#b3d2f5]/40 uppercase`}>
        Foto
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setBroken(true)}
      className={`${className} ${rounded} shrink-0 object-cover border border-[#163b70] bg-[#001f54]`}
    />
  );
}

function ImageUploadField({ label, value, onChange, onAlert }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      onAlert("Ukuran gambar maksimal 5 MB. Pilih berkas yang lebih kecil.", "Validasi Ukuran");
      return;
    }
    try {
      setUploading(true);
      const filePath = `uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const { error } = await supabase.storage
        .from("himsika-assets")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });
      if (error) {
        onAlert(
          error.message?.toLowerCase().includes("bucket not found")
            ? "Bucket 'himsika-assets' belum dibuat di menu Storage Supabase. Untuk sementara, tempel URL foto langsung di kolom teks."
            : "Gagal mengunggah foto: " + error.message,
          "Gagal Unggah",
        );
        return;
      }
      const { data } = supabase.storage.from("himsika-assets").getPublicUrl(filePath);
      if (data?.publicUrl) onChange(data.publicUrl);
    } catch (err) {
      onAlert("Terjadi kesalahan saat upload: " + err.message, "Kesalahan Sistem");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Tempel URL foto atau klik Upload"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputCls} flex-1`}
        />
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2.5 bg-[#163b70] hover:bg-[#1f4e8f] text-white text-xs font-bold rounded-xl border border-white/10 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
        >
          {uploading ? "Mengunggah..." : "Upload Foto"}
        </button>
      </div>
      {value && (
        <div className="mt-2 flex items-center gap-3 p-2 bg-[#001f54] border border-[#163b70] rounded-xl">
          <Thumb src={value} alt="Pratinjau" className="w-10 h-10" />
          <span className="text-[11px] text-[#b3d2f5]/70 truncate flex-1">{value}</span>
          <button
            type="button"
            onClick={() => onChange("")}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-red-300 hover:bg-red-500/15 cursor-pointer"
          >
            Hapus
          </button>
        </div>
      )}
    </div>
  );
}

// Editor item per bagian artikel (Sub-bab)
function SectionEditorItem({ section, index, total, onChange, onMoveUp, onMoveDown, onDelete, onAlert }) {
  const textareaRef = useRef(null);

  return (
    <div className="p-4 sm:p-5 bg-[#001f54] border border-[#163b70] rounded-2xl space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-5 bg-accent rounded-full inline-block"></span>
          <span className="text-xs font-black text-white uppercase tracking-wider">
            Bagian #{index + 1}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={index === 0}
            onClick={onMoveUp}
            title="Pindah ke Atas"
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white text-xs transition-colors cursor-pointer"
          >
            ▲
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={onMoveDown}
            title="Pindah ke Bawah"
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white text-xs transition-colors cursor-pointer"
          >
            ▼
          </button>
          <button
            type="button"
            onClick={onDelete}
            title="Hapus Bagian"
            className="px-2.5 py-1 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold transition-colors cursor-pointer ml-1"
          >
            ✕ Hapus
          </button>
        </div>
      </div>

      <div>
        <label className={labelCls}>Judul Bagian / Sub-Bab</label>
        <input
          type="text"
          placeholder="Contoh: 1. Silogy Nexpo 2026: Edukasi dan Pameran Inovasi Digital"
          value={section.title || ""}
          onChange={(e) => onChange("title", e.target.value)}
          className={inputCls}
        />
        <span className="block text-[10px] text-accent/80 mt-1">
          Akan otomatis tampil dengan garis aksen kuning di sebelah kiri judul.
        </span>
      </div>

      <div className="p-3 bg-[#02182b]/60 border border-[#163b70]/60 rounded-xl space-y-2.5">
        <ImageUploadField
          label="Foto Dokumentasi Bagian (Landscape)"
          value={section.image || ""}
          onChange={(val) => onChange("image", val)}
          onAlert={onAlert}
        />
        {section.image && (
          <div className="aspect-video w-full max-w-sm rounded-xl overflow-hidden border border-[#163b70] bg-[#02182b] relative">
            <img src={section.image} alt="Preview Landscape" className="w-full h-full object-cover" />
            <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 text-[9px] font-bold text-accent rounded">
              Landscape 16:9
            </span>
          </div>
        )}
        <div>
          <label className={labelCls}>Keterangan Foto / Caption (Opsional)</label>
          <input
            type="text"
            placeholder="Contoh: [Gambar 1. Pembukaan Edufair oleh Kepala Jurusan]"
            value={section.caption || ""}
            onChange={(e) => onChange("caption", e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>Isi Paragraf Bagian</label>
        <TextFormatToolbar
          textareaRef={textareaRef}
          value={section.text || ""}
          onChange={(val) => onChange("text", val)}
        />
        <textarea
          ref={textareaRef}
          rows="4"
          placeholder="Tulis narasi untuk bagian ini. Pisahkan paragraf dengan baris baru (enter)..."
          value={section.text || ""}
          onChange={(e) => onChange("text", e.target.value)}
          className={textareaCls}
        />
      </div>
    </div>
  );
}

// Daftar data generik: pencarian, filter, tabel ringkas, dan pagination (dipakai semua menu).
function ListSection({ title, items, loading, searchText, filters, filterOf, columns, emptyText }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const okSearch = !q || searchText(item).toLowerCase().includes(q);
      const okFilter = !filters || filter === "Semua" || filterOf(item) === filter;
      return okSearch && okFilter;
    });
  }, [items, search, filter, searchText, filters, filterOf]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);

  return (
    <section className="bg-[#073969] border border-[#163b70] rounded-3xl p-4 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="font-bold text-white text-base">{title}</h2>
        <span className="text-xs text-accent font-bold px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
          {items.length} data
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="search"
          placeholder="Cari..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className={`${inputCls} md:max-w-sm`}
        />
        {filters && (
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {["Semua", ...filters].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => {
                  setFilter(f);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  filter === f
                    ? "bg-accent text-[#001f54]"
                    : "bg-[#001f54] text-[#b3d2f5] hover:text-white border border-[#163b70]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#163b70]">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="bg-[#001f54] text-[#b3d2f5] text-xs">
              {columns.map((c) => (
                <th key={c.header} className={`p-3.5 font-semibold ${c.className || ""}`}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading && items.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-[#b3d2f5]/60">
                  Memuat data...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-[#b3d2f5]/60">
                  {search || filter !== "Semua" ? "Tidak ada data yang cocok." : emptyText}
                </td>
              </tr>
            ) : (
              rows.map((item) => (
                <tr key={item.id} className="hover:bg-[#001f54]/50 transition-colors">
                  {columns.map((c) => (
                    <td key={c.header} className={`p-3.5 align-middle ${c.className || ""}`}>
                      {c.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > PAGE_SIZE && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 text-xs">
          <span className="text-[#b3d2f5]/70">
            {start + 1} - {Math.min(start + PAGE_SIZE, filtered.length)} dari {filtered.length}
          </span>
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <button
              type="button"
              disabled={current <= 1}
              onClick={() => setPage(current - 1)}
              className="px-3 py-1.5 rounded-lg bg-[#001f54] border border-[#163b70] text-[#b3d2f5] hover:text-white disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={`w-8 h-8 rounded-lg font-bold cursor-pointer ${
                  current === n
                    ? "bg-accent text-[#001f54]"
                    : "bg-[#001f54] text-[#b3d2f5] hover:text-white border border-[#163b70]"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              disabled={current >= totalPages}
              onClick={() => setPage(current + 1)}
              className="px-3 py-1.5 rounded-lg bg-[#001f54] border border-[#163b70] text-[#b3d2f5] hover:text-white disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function FormSection({ title, editing, onCancel, children, preview, previewTitle = "Live Preview Card" }) {
  return (
    <section className="bg-[#073969] border border-[#163b70] rounded-3xl p-6 sm:p-7 shadow-xl">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
        <h2 className="text-base sm:text-lg font-bold text-white">{title}</h2>
        {editing && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-bold text-[#b3d2f5] hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full cursor-pointer transition-colors"
          >
            Batal Edit
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        <div className="lg:col-span-7">{children}</div>
        <div className="lg:col-span-5 bg-[#001f54] border border-[#163b70] rounded-2xl p-5 shadow-inner">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">{previewTitle}</span>
          </div>
          {preview}
        </div>
      </div>
    </section>
  );
}

const ActionBtn = ({ onClick, children, tone = "accent" }) => (
  <button
    type="button"
    onClick={onClick}
    className={`text-xs font-semibold px-2 py-1 rounded-lg cursor-pointer transition-colors ${
      tone === "danger" ? "text-red-300 hover:bg-red-500/15" : tone === "muted" ? "text-[#b3d2f5] hover:bg-white/10" : "text-accent hover:bg-accent/10"
    }`}
  >
    {children}
  </button>
);

const SubmitBtn = ({ children }) => (
  <div className="md:col-span-2 flex justify-end pt-4 border-t border-white/10">
    <button
      type="submit"
      className="px-6 py-2.5 bg-accent text-[#001f54] font-black rounded-full hover:bg-accent-hover text-sm shadow-md cursor-pointer transition-colors"
    >
      {children}
    </button>
  </div>
);

// ---------- Halaman utama ----------

export default function AdminDashboard() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState("artikel-utama");
  const [builderArtikelId, setBuilderArtikelId] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState({
    beranda: true,
    administrasi: true,
  });
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  useEffect(() => {
    if (session) return;
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [session]);

  const toggleGroup = (groupId) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const [modalConfig, setModalConfig] = useState({ isOpen: false });
  const closeModal = () => setModalConfig((p) => ({ ...p, isOpen: false }));
  const showAlert = (message, title = "Pemberitahuan") =>
    setModalConfig({ isOpen: true, type: "alert", title, message, confirmText: "Mengerti", onConfirm: closeModal });
  const showConfirm = (message, action, title = "Konfirmasi") =>
    setModalConfig({
      isOpen: true,
      type: "confirm",
      title,
      message,
      confirmText: "Ya, Hapus",
      cancelText: "Batal",
      onConfirm: () => {
        closeModal();
        action();
      },
    });

  // Lomba
  const emptyLomba = {
    title: "", organizer: "", description: "", deadline_pendaftaran: "", deadline_pengumpulan: "",
    benefit: "", categories: [], deadline_timestamp: "", registration_url: "", guidebook_url: "",
    instagram_url: "", contacts: [],
  };
  const [lombaList, setLombaList] = useState([]);
  const [loadingLomba, setLoadingLomba] = useState(false);
  const [editingLombaId, setEditingLombaId] = useState(null);
  const [formDataLomba, setFormDataLomba] = useState(emptyLomba);

  // Artikel
  const emptyArtikel = {
    title: "", category: "Berita", date: "", author: "Divisi Kominfo", image: "", excerpt: "", content: "", is_hot: false,
  };
  const [artikelList, setArtikelList] = useState([]);
  const [loadingArtikel, setLoadingArtikel] = useState(false);
  const [editingArtikelId, setEditingArtikelId] = useState(null);
  const [formDataArtikel, setFormDataArtikel] = useState(emptyArtikel);

  // State Builder Khusus Artikel
  const [builderGallery, setBuilderGallery] = useState([]);
  const [builderLead, setBuilderLead] = useState("");
  const [builderSections, setBuilderSections] = useState([]);
  const [newGalleryInput, setNewGalleryInput] = useState("");
  const [articleEditorTab, setArticleEditorTab] = useState("visual");
  const [articlePreviewTab, setArticlePreviewTab] = useState("card");
  const leadTextareaRef = useRef(null);

  const selectedArtikelForBuilder = useMemo(() => {
    return (
      artikelList.find((a) => a.id === builderArtikelId) ||
      artikelList[0] ||
      null
    );
  }, [artikelList, builderArtikelId]);

  useEffect(() => {
    if (activeMenu === "artikel-bagian" && selectedArtikelForBuilder && (!builderArtikelId || builderArtikelId !== selectedArtikelForBuilder.id)) {
      setBuilderArtikelId(selectedArtikelForBuilder.id);
      const parsed = parseArticleContent(selectedArtikelForBuilder.content);
      setBuilderGallery(parsed.galleryImages);
      setBuilderLead(parsed.leadText);
      setBuilderSections(parsed.sections);
    }
  }, [activeMenu, selectedArtikelForBuilder, builderArtikelId]);

  const handleSelectArtikelForBuilder = (artId) => {
    const art = artikelList.find((a) => String(a.id) === String(artId));
    if (!art) return;
    setBuilderArtikelId(art.id);
    const parsed = parseArticleContent(art.content);
    setBuilderGallery(parsed.galleryImages);
    setBuilderLead(parsed.leadText);
    setBuilderSections(parsed.sections);
  };

  const handleOpenBagianBuilder = (art) => {
    setBuilderArtikelId(art.id);
    const parsed = parseArticleContent(art.content);
    setBuilderGallery(parsed.galleryImages);
    setBuilderLead(parsed.leadText);
    setBuilderSections(parsed.sections);
    setActiveMenu("artikel-bagian");
    scrollTop();
  };

  const handleSaveBagianArtikel = async () => {
    if (!selectedArtikelForBuilder) return;
    const compiled = compileArticleContent({
      galleryImages: builderGallery,
      leadText: builderLead,
      sections: builderSections,
    });

    try {
      const { error } = await supabase
        .from("artikel")
        .update({ content: compiled })
        .eq("id", selectedArtikelForBuilder.id);

      if (error) {
        return showAlert("Gagal menyimpan bagian artikel: " + error.message, "Kendala Sistem");
      }

      setArtikelList((prev) =>
        prev.map((a) => (a.id === selectedArtikelForBuilder.id ? { ...a, content: compiled } : a)),
      );
      showAlert(`Bagian dan dokumentasi untuk "${selectedArtikelForBuilder.title}" berhasil disimpan!`, "Berhasil Disimpan");
    } catch (err) {
      showAlert("Gagal menyimpan bagian artikel: " + err.message, "Kendala Sistem");
    }
  };

  // Prestasi
  const emptyPrestasi = { judul: "", peringkat: "Juara 1", pemenang: "", gambar: "", instagram_url: "" };
  const [prestasiList, setPrestasiList] = useState([]);
  const [loadingPrestasi, setLoadingPrestasi] = useState(false);
  const [editingPrestasiId, setEditingPrestasiId] = useState(null);
  const [formDataPrestasi, setFormDataPrestasi] = useState(emptyPrestasi);

  // Galeri
  const emptyGaleri = { album: "Divisi Kominfo", foto: "", caption: "" };
  const [galeriList, setGaleriList] = useState([]);
  const [loadingGaleri, setLoadingGaleri] = useState(false);
  const [editingGaleriId, setEditingGaleriId] = useState(null);
  const [formDataGaleri, setFormDataGaleri] = useState(emptyGaleri);

  // Pengurus
  const emptyPengurus = { nama: "", jabatan: "", kelompok: "bph", foto: "", instagram: "", linkedin: "" };
  const [pengurusList, setPengurusList] = useState([]);
  const [loadingPengurus, setLoadingPengurus] = useState(false);
  const [editingPengurusId, setEditingPengurusId] = useState(null);
  const [formDataPengurus, setFormDataPengurus] = useState(emptyPengurus);
  const [previewPengurus, setPreviewPengurus] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchAllData();
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s) fetchAllData();
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAllData = () => {
    fetchLomba();
    fetchArtikel();
    fetchPrestasi();
    fetchGaleri();
    fetchPengurus();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) showAlert("Gagal masuk: " + error.message, "Autentikasi Gagal");
    else {
      setEmail("");
      setPassword("");
    }
    setAuthLoading(false);
  };

  const handleLogout = () =>
    setModalConfig({
      isOpen: true,
      type: "confirm",
      title: "Keluar dari Dashboard",
      message: "Anda akan keluar dari sesi administrator.",
      confirmText: "Keluar",
      cancelText: "Batal",
      onConfirm: async () => {
        closeModal();
        await supabase.auth.signOut();
      },
    });

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // ==================== LOMBA ====================
  const fetchLomba = async () => {
    setLoadingLomba(true);
    const { data, error } = await supabase.from("lomba").select("*").order("id", { ascending: false });
    if (!error && data) {
      // Otomatis hapus lomba dari Supabase jika batas akhir tanggal sudah terlewat
      const expired = data.filter((item) => isLombaExpired(item));
      if (expired.length > 0) {
        const expiredIds = expired.map((x) => x.id);
        await supabase.from("lomba").delete().in("id", expiredIds);
      }
      const activeLomba = data.filter((item) => !isLombaExpired(item));
      setLombaList(activeLomba);
    }
    setLoadingLomba(false);
  };

  const handleLombaSubmit = async (e) => {
    e.preventDefault();
    const calculatedTs = getLombaFinalTimestamp(formDataLomba);
    if (calculatedTs && calculatedTs < Date.now()) {
      return showAlert(
        "Tanggal deadline yang Anda masukkan sudah lewat dari hari ini. Silakan masukkan tanggal yang masih aktif.",
        "Deadline Sudah Lewat",
      );
    }
    const payload = {
      ...formDataLomba,
      deadline_timestamp:
        calculatedTs ||
        (formDataLomba.deadline_timestamp ? Number(formDataLomba.deadline_timestamp) : null),
    };
    const { error } = editingLombaId
      ? await supabase.from("lomba").update(payload).eq("id", editingLombaId)
      : await supabase.from("lomba").insert([payload]);
    if (error) return showAlert("Gagal menyimpan info lomba: " + error.message, "Kendala Sistem");
    showAlert(editingLombaId ? "Info lomba berhasil diperbarui." : "Info lomba baru berhasil ditambahkan.", "Berhasil");
    resetLombaForm();
    fetchLomba();
  };

  const handleLombaDelete = (id) =>
    showConfirm("Hapus info lomba ini secara permanen?", async () => {
      const { error } = await supabase.from("lomba").delete().eq("id", id);
      if (error) showAlert("Gagal menghapus: " + error.message, "Kendala Sistem");
      else setLombaList((p) => p.filter((x) => x.id !== id));
    });

  const resetLombaForm = () => {
    setEditingLombaId(null);
    setFormDataLomba(emptyLomba);
  };

  // ==================== ARTIKEL ====================
  const fetchArtikel = async () => {
    setLoadingArtikel(true);
    const { data, error } = await supabase.from("artikel").select("*");
    if (!error && data) {
      const normalized = sortArtikel(
        data.map((d) => {
          const fb =
            artikelData.find((a) => String(a.id) === String(d.id)) ||
            artikelData.find((a) => a.title === d.title);
          return { ...d, is_hot: d.is_hot === true, thumb: (d.image && d.image.trim()) || fb?.image || "" };
        }),
      );

      // Aturan: selalu tepat 1 berita hot. Kalau 0 atau lebih dari 1, rapikan otomatis.
      const hots = normalized.filter((a) => a.is_hot);
      if (normalized.length > 0 && hots.length !== 1) {
        const keep = hots[0] || normalized[0];
        normalized.forEach((a) => (a.is_hot = a.id === keep.id));
        await syncHot(keep.id);
      }
      setArtikelList(normalized);
    }
    setLoadingArtikel(false);
  };

  const syncHot = async (hotId) => {
    try {
      await supabase.from("artikel").update({ is_hot: false }).neq("id", hotId);
      await supabase.from("artikel").update({ is_hot: true }).eq("id", hotId);
    } catch (e) {
      console.warn("syncHot notice:", e);
    }
  };

  const handleSetHot = async (item) => {
    if (item.is_hot) {
      showAlert(
        "Artikel ini sudah menjadi Berita Hot di Beranda.\n\nBerita Hot selalu ada tepat 1. Untuk menggantinya, klik Set Hot pada artikel lain.",
        "Berita Hot",
      );
      return;
    }
    setArtikelList((prev) => prev.map((a) => ({ ...a, is_hot: a.id === item.id })));
    try {
      localStorage.setItem("himsika_hot_article_id", String(item.id));
    } catch {}

    try {
      await supabase.from("artikel").update({ is_hot: false }).neq("id", item.id);
      await supabase.from("artikel").update({ is_hot: true }).eq("id", item.id);
    } catch (e) {
      console.warn("syncHot notice:", e);
    }
    showAlert(`"${item.title}" sekarang aktif sebagai Berita Hot di Beranda.`, "Berita Hot Berhasil Diatur");
  };

  const handleArtikelSubmit = async (e) => {
    e.preventDefault();
    const editingItem = artikelList.find((a) => a.id === editingArtikelId);
    const tanggal =
      formDataArtikel.date ||
      new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

    const payload = {
      title: formDataArtikel.title,
      category: formDataArtikel.category,
      date: tanggal,
      // datetime mengikuti tanggal tampil supaya urutan terbaru tetap benar saat artikel lama diedit.
      datetime: parseTanggal(tanggal) || editingItem?.datetime || new Date().toISOString().slice(0, 10),
      author: formDataArtikel.author,
      image: formDataArtikel.image,
      excerpt: formDataArtikel.excerpt,
      content: editingItem?.content || [],
      is_hot: Boolean(formDataArtikel.is_hot),
    };

    let savedId = editingArtikelId;
    if (editingArtikelId) {
      let { error } = await supabase.from("artikel").update(payload).eq("id", editingArtikelId);
      // Fallback toleran jika kolom is_hot belum dieksekusi di database Supabase
      if (error && error.message && error.message.toLowerCase().includes("is_hot")) {
        const { is_hot: _ignored, ...payloadWithoutHot } = payload;
        const retry = await supabase.from("artikel").update(payloadWithoutHot).eq("id", editingArtikelId);
        error = retry.error;
      }
      if (error) return showAlert("Gagal memperbarui artikel: " + error.message, "Kendala Sistem");
    } else {
      let { data, error } = await supabase.from("artikel").insert([payload]).select();
      // Fallback toleran jika kolom is_hot belum dieksekusi di database Supabase
      if (error && error.message && error.message.toLowerCase().includes("is_hot")) {
        const { is_hot: _ignored, ...payloadWithoutHot } = payload;
        const retry = await supabase.from("artikel").insert([payloadWithoutHot]).select();
        data = retry.data;
        error = retry.error;
      }
      if (error) return showAlert("Gagal menambahkan artikel: " + error.message, "Kendala Sistem");
      savedId = data?.[0]?.id;
    }
    if (payload.is_hot && savedId) {
      await syncHot(savedId);
      try {
        localStorage.setItem("himsika_hot_article_id", String(savedId));
      } catch {}
    }

    showAlert(
      editingArtikelId
        ? "Data utama artikel berhasil diperbarui."
        : "Artikel baru berhasil ditambahkan! Silakan buka anak menu 'Penyusun Bagian & Dokum' untuk menambahkan dokumentasi dan sub-babnya.",
      "Berhasil",
    );
    resetArtikelForm();
    fetchArtikel();
  };

  const handleArtikelDelete = (item) =>
    showConfirm(
      item.is_hot
        ? "Artikel ini sedang menjadi Berita Hot. Setelah dihapus, status Hot otomatis pindah ke artikel terbaru berikutnya.\n\nLanjutkan hapus?"
        : "Hapus artikel ini secara permanen?",
      async () => {
        const { error } = await supabase.from("artikel").delete().eq("id", item.id);
        if (error) return showAlert("Gagal menghapus artikel: " + error.message, "Kendala Sistem");
        const remaining = sortArtikel(artikelList.filter((a) => a.id !== item.id));
        if (item.is_hot && remaining.length > 0) {
          const next = remaining[0];
          setArtikelList(remaining.map((a) => ({ ...a, is_hot: a.id === next.id })));
          await syncHot(next.id);
          showAlert(`Artikel dihapus. Berita Hot sekarang:\n${next.title}`, "Berita Hot Dipindahkan");
        } else {
          setArtikelList(remaining);
        }
        if (editingArtikelId === item.id) resetArtikelForm();
      },
    );

  const resetArtikelForm = () => {
    setEditingArtikelId(null);
    setFormDataArtikel(emptyArtikel);
    setBuilderGallery([]);
    setBuilderLead("");
    setBuilderSections([]);
    setNewGalleryInput("");
    setArticleEditorTab("visual");
    setArticlePreviewTab("card");
  };

  const editingArtikelIsHot = artikelList.find((a) => a.id === editingArtikelId)?.is_hot;

  // ==================== PRESTASI ====================
  const fetchPrestasi = async () => {
    setLoadingPrestasi(true);
    const { data, error } = await supabase.from("prestasi").select("*").order("id", { ascending: false });
    if (!error && data) {
      setPrestasiList(
        data.map((d) => {
          const fb = PRESTASI_DATA.find((p) => String(p.id) === String(d.id));
          return { ...d, pemenang: parsePemenang(d.pemenang), thumb: (d.gambar && d.gambar.trim()) || fb?.gambar || "" };
        }),
      );
    }
    setLoadingPrestasi(false);
  };

  const handlePrestasiSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      judul: formDataPrestasi.judul,
      peringkat: formDataPrestasi.peringkat,
      pemenang: formDataPrestasi.pemenang.split("\n").map((s) => s.trim()).filter(Boolean),
      gambar: formDataPrestasi.gambar,
      instagram_url: formDataPrestasi.instagram_url,
    };
    const { error } = editingPrestasiId
      ? await supabase.from("prestasi").update(payload).eq("id", editingPrestasiId)
      : await supabase.from("prestasi").insert([payload]);
    if (error) return showAlert("Gagal menyimpan prestasi: " + error.message, "Kendala Sistem");
    showAlert(editingPrestasiId ? "Data prestasi berhasil diperbarui." : "Prestasi baru berhasil ditambahkan.", "Berhasil");
    resetPrestasiForm();
    fetchPrestasi();
  };

  const handlePrestasiDelete = (id) =>
    showConfirm("Hapus data prestasi ini secara permanen?", async () => {
      const { error } = await supabase.from("prestasi").delete().eq("id", id);
      if (error) showAlert("Gagal menghapus: " + error.message, "Kendala Sistem");
      else setPrestasiList((p) => p.filter((x) => x.id !== id));
    });

  const resetPrestasiForm = () => {
    setEditingPrestasiId(null);
    setFormDataPrestasi(emptyPrestasi);
  };

  // ==================== GALERI ====================
  const fetchGaleri = async () => {
    setLoadingGaleri(true);
    const { data, error } = await supabase.from("galeri").select("*").order("id", { ascending: false });
    if (!error && data) {
      setGaleriList(
        data.map((d) => {
          const fb = galeriDefault.find((g) => String(g.id) === String(d.id)) || galeriDefault[Number(d.id) - 1];
          return { ...d, thumb: (d.foto && d.foto.trim()) || fb?.foto || "" };
        }),
      );
    }
    setLoadingGaleri(false);
  };

  const handleGaleriSubmit = async (e) => {
    e.preventDefault();
    if (!formDataGaleri.foto && !editingGaleriId) {
      return showAlert("Foto dokumentasi wajib diisi (upload atau URL).", "Validasi Form");
    }
    const payload = {
      album: formDataGaleri.album,
      album_slug: formDataGaleri.album.toLowerCase().replace(/\s+/g, "-"),
      foto: formDataGaleri.foto,
      caption: formDataGaleri.caption,
    };
    const { error } = editingGaleriId
      ? await supabase.from("galeri").update(payload).eq("id", editingGaleriId)
      : await supabase.from("galeri").insert([payload]);
    if (error) return showAlert("Gagal menyimpan foto: " + error.message, "Kendala Sistem");
    showAlert(editingGaleriId ? "Foto galeri berhasil diperbarui." : "Foto galeri baru berhasil ditambahkan.", "Berhasil");
    resetGaleriForm();
    fetchGaleri();
  };

  const handleGaleriDelete = (id) =>
    showConfirm("Hapus foto ini dari galeri?", async () => {
      const { error } = await supabase.from("galeri").delete().eq("id", id);
      if (error) showAlert("Gagal menghapus: " + error.message, "Kendala Sistem");
      else setGaleriList((p) => p.filter((x) => x.id !== id));
    });

  const resetGaleriForm = () => {
    setEditingGaleriId(null);
    setFormDataGaleri(emptyGaleri);
  };

  // ==================== PENGURUS ====================
  const fetchPengurus = async () => {
    setLoadingPengurus(true);
    const { data, error } = await supabase.from("pengurus").select("*").order("id", { ascending: true });
    if (!error && data) {
      setPengurusList(
        data.map((d) => {
          const fb =
            pengurusData.find((p) => String(p.id) === String(d.id)) ||
            pengurusData.find((p) => p.nama.toLowerCase() === String(d.nama).toLowerCase());
          return {
            ...d,
            thumb: (d.foto && d.foto.trim()) || fb?.foto || "",
            instagram: d.instagram || fb?.instagram || "",
            linkedin: d.linkedin || fb?.linkedin || "",
          };
        }),
      );
    }
    setLoadingPengurus(false);
  };

  const handlePengurusSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formDataPengurus };
    const { error } = editingPengurusId
      ? await supabase.from("pengurus").update(payload).eq("id", editingPengurusId)
      : await supabase.from("pengurus").insert([payload]);
    if (error) return showAlert("Gagal menyimpan pengurus: " + error.message, "Kendala Sistem");
    showAlert(editingPengurusId ? "Data pengurus berhasil diperbarui." : "Pengurus baru berhasil ditambahkan.", "Berhasil");
    resetPengurusForm();
    fetchPengurus();
  };

  const handlePengurusDelete = (id) =>
    showConfirm("Hapus data pengurus ini secara permanen?", async () => {
      const { error } = await supabase.from("pengurus").delete().eq("id", id);
      if (error) showAlert("Gagal menghapus: " + error.message, "Kendala Sistem");
      else setPengurusList((p) => p.filter((x) => x.id !== id));
    });

  const resetPengurusForm = () => {
    setEditingPengurusId(null);
    setFormDataPengurus(emptyPengurus);
  };

  const socialUrl = (val, base) => (val.startsWith("http") ? val : `${base}${val.replace(/^@/, "")}`);

  const modal = (
    <CustomModal
      isOpen={modalConfig.isOpen}
      type={modalConfig.type}
      title={modalConfig.title}
      message={modalConfig.message}
      confirmText={modalConfig.confirmText}
      cancelText={modalConfig.cancelText}
      onConfirm={modalConfig.onConfirm}
      onCancel={closeModal}
    />
  );

  // ==================== LOGIN ====================
  if (!session) {
    return (
      <main className="min-h-screen w-full relative flex items-center justify-center lg:justify-between p-4 sm:p-8 lg:p-14 xl:p-16 font-primary text-white overflow-hidden bg-[#02182b]">
        {/* Fullscreen Background Slideshow (Memenuhi Seluruh Layar) */}
        <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          {HERO_IMAGES.map((item, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
                currentHeroSlide === idx
                  ? "opacity-100 scale-100 z-10"
                  : "opacity-0 scale-105 z-0"
              }`}
            >
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}

          {/* Overlay gradient artistik tema HIMSIKA */}
          <div className="absolute inset-0 bg-[#02182b]/40 backdrop-blur-[0.5px]" />
          <div className="absolute inset-0 bg-linear-to-t from-[#02182b] via-transparent to-[#02182b]/60" />
          <div className="absolute inset-0 hidden lg:block bg-linear-to-r from-[#02182b]/25 via-[#02182b]/60 to-[#02182b]/95" />
          <div className="absolute inset-0 lg:hidden bg-[#02182b]/70" />
        </div>

        {/* Konten Sisi Kiri (Desktop): Identitas & Caption Foto Fullscreen */}
        <div className="relative z-10 hidden lg:flex flex-col justify-between h-[85vh] max-w-xl">
          {/* Header Brand */}
          <div className="flex items-center gap-3.5 bg-[#02182b]/60 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 w-fit shadow-xl">
            <div className="w-10 h-10 p-1.5 bg-white rounded-xl shadow-md flex items-center justify-center border border-white/20">
              <img src={LogoHimsika} alt="Logo HIMSIKA" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-accent">Himpunan Mahasiswa</span>
              <h2 className="text-sm font-extrabold text-white">Sistem Informasi UNSIKA</h2>
            </div>
          </div>

          {/* Caption & Navigasi Slide Foto */}
          <div className="space-y-3 bg-[#02182b]/60 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent text-xs font-semibold">
              Dokumentasi Himpunan
            </div>
            <h1 className="text-2xl xl:text-3xl font-black text-white leading-tight drop-shadow-md">
              {HERO_IMAGES[currentHeroSlide].title}
            </h1>
            <p className="text-xs sm:text-sm text-[#b3d2f5] drop-shadow leading-relaxed">
              {HERO_IMAGES[currentHeroSlide].subtitle}
            </p>

            <div className="flex items-center gap-2 pt-2">
              {HERO_IMAGES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentHeroSlide(idx)}
                  className={`transition-all duration-300 rounded-full h-2 cursor-pointer ${
                    currentHeroSlide === idx
                      ? "w-8 bg-accent shadow-md shadow-accent/50"
                      : "w-2 bg-white/40 hover:bg-white/75"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Konten Sisi Kanan: Kartu Login "Welcome Back" Mengambang */}
        <div className="relative z-10 w-full max-w-md lg:ml-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full bg-[#073969]/90 backdrop-blur-2xl border border-[#163b70] p-8 sm:p-10 rounded-[2.5rem] shadow-2xl relative"
          >
            {/* Header: Logo, Welcome Back, Subtitle */}
            <div className="text-center mb-7">
              <div className="w-16 h-16 mx-auto mb-4 p-2.5 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-white/20">
                <img src={LogoHimsika} alt="Logo HIMSIKA" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Welcome Back
              </h1>
              <p className="text-xs sm:text-sm text-[#b3d2f5] mt-1.5">
                Log in to continue your journey
              </p>
            </div>

            {/* Form Login */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#b3d2f5]/60">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    id="admin-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Email or Username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#001f54]/90 border border-[#163b70] rounded-2xl pl-12 pr-4 py-3.5 text-white text-sm placeholder:text-[#b3d2f5]/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#b3d2f5]/60">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    id="admin-pass"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#001f54]/90 border border-[#163b70] rounded-2xl pl-12 pr-12 py-3.5 text-white text-sm placeholder:text-[#b3d2f5]/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#b3d2f5]/60 hover:text-accent transition-colors cursor-pointer"
                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#b3d2f5] pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#001f54] border border-[#163b70] text-accent focus:ring-accent focus:ring-offset-0 cursor-pointer accent-[#ffc300]"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => showAlert("Silakan hubungi BPH atau Divisi Kominfo HIMSIKA untuk pemulihan akses akun.", "Bantuan Akses")}
                  className="text-accent hover:underline cursor-pointer font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3.5 px-6 bg-accent text-[#001f54] font-black rounded-2xl hover:bg-accent-hover active:scale-[0.98] transition-all duration-200 text-sm flex items-center justify-center gap-2 shadow-lg shadow-accent/20 cursor-pointer disabled:opacity-50 mt-2"
              >
                <span>{authLoading ? "Memverifikasi..." : "Log In"}</span>
                {!authLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#163b70]/60"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#073969] px-3 text-[#b3d2f5]/60 font-medium">Portal Pengurus</span>
              </div>
            </div>

            <p className="text-center text-xs text-[#b3d2f5]/70">
              Belum memiliki akun admin?{" "}
              <button
                type="button"
                onClick={() => showAlert("Permohonan akun admin silakan koordinasikan dengan Sekretaris Umum atau Divisi Kominfo HIMSIKA.", "Akun Pengurus")}
                className="text-accent hover:underline font-semibold cursor-pointer"
              >
                Hubungi Kominfo
              </button>
            </p>
          </motion.div>
        </div>
        {modal}
      </main>
    );
  }

  const counts = {
    lomba: lombaList.length,
    artikel: artikelList.length,
    prestasi: prestasiList.length,
    galeri: galeriList.length,
    pengurus: pengurusList.length,
  };

  const getActiveTitle = () => {
    if (activeMenu === "lomba") return "Kelola Lomba & Beasiswa";
    if (activeMenu === "artikel" || activeMenu === "artikel-utama") return "Kelola Artikel - Data Utama & Daftar";
    if (activeMenu === "artikel-bagian") return "Kelola Artikel - Penyusun Bagian & Dokumentasi";
    if (activeMenu === "prestasi") return "Kelola Prestasi Mahasiswa";
    if (activeMenu === "galeri") return "Kelola Galeri Kegiatan";
    if (activeMenu === "pengurus") return "Kelola Profil & Pengurus";
    return "Dashboard";
  };

  // ==================== DASHBOARD ====================
  return (
    <div className="min-h-screen bg-[#02182b] font-primary text-white flex flex-col lg:flex-row">
      {/* Sidebar Desktop (Fixed Left) - Desain Simple Sesuai Referensi Portal KKN */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#034078] border-r border-[#045091] fixed left-0 top-0 bottom-0 z-40">
        {/* Header Brand Simple Horizontal (Logo + Brand Text) */}
        <div className="p-5 border-b border-[#045091] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white p-1.5 shadow flex items-center justify-center shrink-0">
            <img src={LogoHimsika} alt="Logo HIMSIKA" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <span className="text-sm font-black tracking-wide text-white block truncate leading-tight">
              HIMSIKA UNSIKA
            </span>
            <span className="text-[10px] font-bold tracking-wider text-accent uppercase block mt-0.5">
              PORTAL DATABASE
            </span>
          </div>
        </div>

        {/* Menu Navigasi Berkelompok dengan Chevron Expand/Collapse Sesuai Referensi */}
        <nav className="p-3.5 flex-1 space-y-4 overflow-y-auto [scrollbar-width:thin]">
          {MENU_GROUPS.map((group) => {
            const isGroupOpen = openGroups[group.id] !== false;

            return (
              <div key={group.id} className="space-y-1">
                {/* Header Kategori dengan Chevron Dropdown */}
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-bold text-[#b3d2f5] hover:text-white transition-colors cursor-pointer select-none rounded-lg hover:bg-white/5"
                >
                  <span className="tracking-wide">{group.title}</span>
                  {isGroupOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-[#b3d2f5]" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-[#b3d2f5]" />
                  )}
                </button>

                {/* Daftar Item Kategori */}
                {isGroupOpen && (
                  <div className="space-y-1 pt-0.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isArtikelGroup = item.id === "artikel";
                      const isArtikelActive =
                        activeMenu === "artikel" ||
                        activeMenu === "artikel-utama" ||
                        activeMenu === "artikel-bagian";
                      const isActive = isArtikelGroup ? isArtikelActive : activeMenu === item.id;
                      const count = counts[item.countKey] ?? 0;

                      return (
                        <div key={item.id} className="space-y-1">
                          <button
                            type="button"
                            onClick={() => {
                              if (isArtikelGroup) {
                                if (!isArtikelActive) setActiveMenu("artikel-utama");
                              } else {
                                setActiveMenu(item.id);
                              }
                              scrollTop();
                            }}
                            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isActive
                                ? "bg-[#001f54] text-white border border-accent/40 shadow-sm"
                                : "text-white/85 hover:bg-[#045091] hover:text-white"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-accent" : "text-[#b3d2f5]"}`} />
                              <span className="truncate">{item.label}</span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                  isActive
                                    ? "bg-accent text-[#001f54]"
                                    : "bg-[#001f54]/60 text-[#b3d2f5] border border-white/10"
                                }`}
                              >
                                {count}
                              </span>
                              {item.children && (
                                <ChevronDown
                                  className={`w-3.5 h-3.5 transition-transform ${
                                    isArtikelActive ? "rotate-180 text-accent" : "text-[#b3d2f5]"
                                  }`}
                                />
                              )}
                            </div>
                          </button>

                          {/* Sub-menu jika memiliki anak menu (seperti Artikel) */}
                          {item.children && isArtikelActive && (
                            <div className="pl-6 pr-1 py-1 space-y-1">
                              {item.children.map((child) => {
                                const isChildActive =
                                  activeMenu === child.id ||
                                  (child.id === "artikel-utama" && activeMenu === "artikel");
                                return (
                                  <button
                                    key={child.id}
                                    type="button"
                                    onClick={() => {
                                      setActiveMenu(child.id);
                                      scrollTop();
                                    }}
                                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                      isChildActive
                                        ? "bg-[#001f54] text-accent font-bold border border-accent/30 shadow-xs"
                                        : "text-[#b3d2f5] hover:text-white hover:bg-[#045091]/50"
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                        isChildActive ? "bg-accent ring-2 ring-accent/30" : "bg-white/40"
                                      }`}
                                    />
                                    <span className="truncate">{child.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Profile Bar di Bawah Sidebar Persis Seperti Referensi */}
        <div className="p-3 border-t border-[#045091] mt-auto bg-[#034078]">
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileMenuOpen((prev) => !prev)}
              className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-[#001f54] hover:bg-[#001f54]/90 border border-[#163b70] transition-colors cursor-pointer text-left group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-accent text-[#001f54] font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                  HF
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate group-hover:text-accent transition-colors">
                    HABIB IQBAL FATUR...
                  </p>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>
              </div>
              <ChevronsUpDown className="w-4 h-4 text-[#b3d2f5] shrink-0" />
            </button>

            {/* Popover Menu Profil & Aksi Cepat */}
            <AnimatePresence>
              {profileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full left-0 right-0 mb-2 p-2 rounded-2xl bg-[#001f54] border border-[#163b70] shadow-2xl z-50 space-y-1"
                >
                  <div className="px-3 py-2 border-b border-white/10 text-xs">
                    <p className="font-bold text-white">Habib Iqbal Faturrahman</p>
                    <p className="text-[10px] text-[#b3d2f5]">Admin Portal HIMSIKA</p>
                  </div>
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#b3d2f5] hover:bg-[#034078] hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Lihat Web Publik</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-300 hover:bg-red-950/40 hover:text-red-200 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar Akun</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </aside>

      {/* Mobile Top Navbar (Layar Kecil) */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#034078] border-b border-[#045091] sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white p-1 shadow-sm">
            <img src={LogoHimsika} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="block text-xs font-black text-white leading-none">HIMSIKA UNSIKA</span>
            <span className="block text-[8px] font-bold text-accent uppercase tracking-wider mt-0.5">PORTAL DATABASE</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(true)}
          className="p-2 rounded-xl bg-[#001f54] border border-[#163b70] text-white cursor-pointer hover:bg-white/10"
        >
          <MenuIcon className="w-5 h-5" />
        </button>
      </header>

      {/* Mobile Drawer (Layar Kecil) Sesuai Referensi */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="relative w-72 max-w-[80vw] bg-[#034078] border-r border-[#045091] h-full flex flex-col z-10"
            >
              <div className="p-4 border-b border-[#045091] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white p-1 shadow-sm">
                    <img src={LogoHimsika} alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-white block">HIMSIKA UNSIKA</span>
                    <span className="text-[8px] font-bold text-accent uppercase tracking-wider block">PORTAL DATABASE</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 rounded-lg text-white/70 hover:text-white"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <nav className="p-3.5 flex-1 space-y-3.5 overflow-y-auto [scrollbar-width:thin]">
                {MENU_GROUPS.map((group) => {
                  const isGroupOpen = openGroups[group.id] !== false;

                  return (
                    <div key={group.id} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => toggleGroup(group.id)}
                        className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-bold text-[#b3d2f5] hover:text-white transition-colors cursor-pointer select-none rounded-lg hover:bg-white/5"
                      >
                        <span className="tracking-wide">{group.title}</span>
                        {isGroupOpen ? (
                          <ChevronDown className="w-3.5 h-3.5 text-[#b3d2f5]" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-[#b3d2f5]" />
                        )}
                      </button>

                      {isGroupOpen && (
                        <div className="space-y-1 pt-0.5">
                          {group.items.map((item) => {
                            const Icon = item.icon;
                            const isArtikelGroup = item.id === "artikel";
                            const isArtikelActive =
                              activeMenu === "artikel" ||
                              activeMenu === "artikel-utama" ||
                              activeMenu === "artikel-bagian";
                            const isActive = isArtikelGroup ? isArtikelActive : activeMenu === item.id;
                            const count = counts[item.countKey] ?? 0;

                            return (
                              <div key={item.id} className="space-y-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (isArtikelGroup) {
                                      if (!isArtikelActive) setActiveMenu("artikel-utama");
                                    } else {
                                      setActiveMenu(item.id);
                                      setMobileSidebarOpen(false);
                                    }
                                    scrollTop();
                                  }}
                                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    isActive
                                      ? "bg-[#001f54] text-white border border-accent/40 shadow-sm"
                                      : "text-white/85 hover:bg-[#045091] hover:text-white"
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-accent" : "text-[#b3d2f5]"}`} />
                                    <span className="truncate">{item.label}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <span
                                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                        isActive
                                          ? "bg-accent text-[#001f54]"
                                          : "bg-[#001f54]/60 text-[#b3d2f5] border border-white/10"
                                      }`}
                                    >
                                      {count}
                                    </span>
                                  </div>
                                </button>

                                {item.children && isArtikelActive && (
                                  <div className="pl-6 pr-1 py-1 space-y-1">
                                    {item.children.map((child) => {
                                      const isChildActive =
                                        activeMenu === child.id ||
                                        (child.id === "artikel-utama" && activeMenu === "artikel");
                                      return (
                                        <button
                                          key={child.id}
                                          type="button"
                                          onClick={() => {
                                            setActiveMenu(child.id);
                                            setMobileSidebarOpen(false);
                                            scrollTop();
                                          }}
                                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                            isChildActive
                                              ? "bg-[#001f54] text-accent font-bold border border-accent/30 shadow-xs"
                                              : "text-[#b3d2f5] hover:text-white hover:bg-[#045091]/50"
                                          }`}
                                        >
                                          <span
                                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                              isChildActive ? "bg-accent ring-2 ring-accent/30" : "bg-white/40"
                                            }`}
                                          />
                                          <span className="truncate">{child.label}</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-[#045091] space-y-2 bg-[#034078]">
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-[#b3d2f5] bg-[#001f54] hover:bg-[#001f54]/80 border border-[#163b70] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Lihat Web Publik</span>
                </a>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-red-300 bg-red-950/40 hover:bg-red-900/50 border border-red-500/20"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar Akun</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Konten Utama (Right Column) */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 min-h-screen bg-linear-to-b from-[#043761] via-[#02182b] to-[#001f54]">
        {/* Top Header Desktop (Biru #034078 Sesuai Permintaan) */}
        <header className="hidden lg:flex sticky top-0 z-30 bg-[#034078] border-b border-[#045091] px-8 py-4 items-center justify-between gap-4 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-[#b3d2f5]">
              <span>HIMSIKA</span>
              <span>/</span>
              <span className="text-accent">DATABASE CONTROL</span>
            </div>
            <h1 className="text-xl font-extrabold text-white mt-0.5">
              {getActiveTitle()}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live System
            </span>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-[#001f54] hover:bg-[#001f54]/80 border border-[#163b70] text-[#b3d2f5] hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat Web</span>
            </a>
            <div className="flex items-center gap-2 pl-2 border-l border-[#045091]">
              <div className="w-8 h-8 rounded-full bg-accent text-[#001f54] flex items-center justify-center text-xs font-black shadow-sm">
                HF
              </div>
              <button
                type="button"
                onClick={handleLogout}
                title="Keluar Akun"
                className="p-1.5 rounded-lg text-[#b3d2f5] hover:text-red-300 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Isi Menu */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto space-y-8">
          {/* Welcome Banner Modular seperti Referensi Gambar */}
          <section className="rounded-3xl p-6 sm:p-7 bg-linear-to-r from-[#034078] via-[#073969] to-[#001f54] border border-[#163b70] shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-xl space-y-1.5">
                <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-accent/20 text-accent border border-accent/30">
                  Selamat Datang, Admin HIMSIKA
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  Pusat Kontrol Database Website HIMSIKA
                </h2>
                <p className="text-xs sm:text-sm text-[#b3d2f5] leading-relaxed">
                  Kelola seluruh data lomba, artikel rilis pers, dokumentasi kegiatan berasio landscape 16:9, prestasi fungsionaris, hingga bagan kepengurusan.
                </p>
              </div>

              {/* Quick Stat Chips (Modular seperti di referensi) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 shrink-0">
                <div className="p-3 rounded-2xl bg-[#001f54]/90 border border-[#163b70] text-center min-w-[95px] shadow-sm">
                  <span className="block text-[10px] font-bold text-[#b3d2f5] uppercase tracking-wider">Lomba</span>
                  <span className="text-lg font-black text-white">{counts.lomba}</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#001f54]/90 border border-[#163b70] text-center min-w-[95px] shadow-sm">
                  <span className="block text-[10px] font-bold text-[#b3d2f5] uppercase tracking-wider">Artikel</span>
                  <span className="text-lg font-black text-accent">{counts.artikel}</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#001f54]/90 border border-[#163b70] text-center min-w-[95px] shadow-sm">
                  <span className="block text-[10px] font-bold text-[#b3d2f5] uppercase tracking-wider">Prestasi</span>
                  <span className="text-lg font-black text-white">{counts.prestasi}</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#001f54]/90 border border-[#163b70] text-center min-w-[95px] shadow-sm">
                  <span className="block text-[10px] font-bold text-[#b3d2f5] uppercase tracking-wider">Galeri</span>
                  <span className="text-lg font-black text-white">{counts.galeri}</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#001f54]/90 border border-[#163b70] text-center min-w-[95px] col-span-2 sm:col-span-1 shadow-sm">
                  <span className="block text-[10px] font-bold text-[#b3d2f5] uppercase tracking-wider">Pengurus</span>
                  <span className="text-lg font-black text-white">{counts.pengurus}</span>
                </div>
              </div>
            </div>
          </section>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="space-y-8"
            >
            {/* ================= LOMBA ================= */}
            {activeMenu === "lomba" && (
              <>
                <FormSection
                  title={editingLombaId ? "Edit Info Lomba" : "Tambah Info Lomba"}
                  editing={editingLombaId}
                  onCancel={resetLombaForm}
                  preview={
                    <div className="rounded-2xl bg-[#073969] border border-[#163b70] p-5 shadow-lg">
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-accent/15 text-accent border border-accent/25">
                          Lomba & Beasiswa
                        </span>
                        {formDataLomba.deadline_pendaftaran && (
                          <span className="text-[11px] font-semibold text-accent">
                            {formDataLomba.deadline_pendaftaran}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-white mb-1 line-clamp-2 leading-snug">
                        {formDataLomba.title || "Judul Kompetisi"}
                      </h3>
                      <p className="text-xs font-medium text-[#b3d2f5] mb-3">
                        {formDataLomba.organizer || "Penyelenggara"}
                      </p>
                      <p className="text-xs text-[#b3d2f5]/80 line-clamp-3 mb-3 leading-relaxed">
                        {formDataLomba.description || "Deskripsi kompetisi akan tampil di sini..."}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div className="p-2.5 rounded-xl bg-[#001f54] border border-[#163b70]">
                          <span className="block text-[10px] font-medium text-[#b3d2f5]/60 uppercase tracking-wider mb-0.5">Pendaftaran</span>
                          <span className="font-semibold text-white text-xs truncate block">{formDataLomba.deadline_pendaftaran || "-"}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#001f54] border border-[#163b70]">
                          <span className="block text-[10px] font-medium text-[#b3d2f5]/60 uppercase tracking-wider mb-0.5">Pengumpulan</span>
                          <span className="font-semibold text-white text-xs truncate block">{formDataLomba.deadline_pengumpulan || "-"}</span>
                        </div>
                      </div>

                      {formDataLomba.benefit && (
                        <div className="p-2.5 rounded-xl bg-accent/[0.08] border-l-2 border-accent text-xs text-white/85 mb-3 leading-relaxed">
                          <span className="font-bold text-accent mr-1">Hadiah/Benefit:</span>
                          {formDataLomba.benefit}
                        </div>
                      )}

                      <div className="flex gap-2 pt-2 border-t border-white/10">
                        <div className="flex-1 py-2 text-center text-xs font-bold rounded-lg bg-accent text-[#001f54]">
                          Daftar Sekarang
                        </div>
                        {formDataLomba.guidebook_url && (
                          <div className="px-3 py-2 text-center text-xs font-medium rounded-lg border border-[#163b70] text-[#b3d2f5]">
                            Guidebook
                          </div>
                        )}
                      </div>
                    </div>
                  }
                >
                  <form onSubmit={handleLombaSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Judul Lomba</label>
                      <input required value={formDataLomba.title} onChange={(e) => setFormDataLomba({ ...formDataLomba, title: e.target.value })} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Penyelenggara</label>
                      <input required value={formDataLomba.organizer} onChange={(e) => setFormDataLomba({ ...formDataLomba, organizer: e.target.value })} className={inputCls} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelCls}>Deskripsi</label>
                      <textarea rows="3" value={formDataLomba.description} onChange={(e) => setFormDataLomba({ ...formDataLomba, description: e.target.value })} className={textareaCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Deadline Pendaftaran</label>
                      <input placeholder="15 November 2026" value={formDataLomba.deadline_pendaftaran} onChange={(e) => setFormDataLomba({ ...formDataLomba, deadline_pendaftaran: e.target.value })} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Deadline Pengumpulan</label>
                      <input placeholder="20 November 2026" value={formDataLomba.deadline_pengumpulan} onChange={(e) => setFormDataLomba({ ...formDataLomba, deadline_pengumpulan: e.target.value })} className={inputCls} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelCls}>Benefit / Hadiah</label>
                      <input value={formDataLomba.benefit} onChange={(e) => setFormDataLomba({ ...formDataLomba, benefit: e.target.value })} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Link Pendaftaran</label>
                      <input type="url" value={formDataLomba.registration_url} onChange={(e) => setFormDataLomba({ ...formDataLomba, registration_url: e.target.value })} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Link Guidebook</label>
                      <input type="url" value={formDataLomba.guidebook_url} onChange={(e) => setFormDataLomba({ ...formDataLomba, guidebook_url: e.target.value })} className={inputCls} />
                    </div>
                    <SubmitBtn>{editingLombaId ? "Simpan Perubahan" : "Tambah Lomba"}</SubmitBtn>
                  </form>
                </FormSection>

                <ListSection
                  title="Daftar Lomba"
                  items={lombaList}
                  loading={loadingLomba}
                  emptyText="Belum ada data lomba."
                  searchText={(i) => `${i.title} ${i.organizer}`}
                  columns={[
                    {
                      header: "Judul & Penyelenggara",
                      render: (i) => (
                        <>
                          <p className="font-bold text-white line-clamp-1">{i.title}</p>
                          <p className="text-xs text-white/60">{i.organizer}</p>
                        </>
                      ),
                    },
                    { header: "Deadline", className: "whitespace-nowrap text-xs text-white/70", render: (i) => i.deadline_pendaftaran || "-" },
                    {
                      header: "Aksi",
                      className: "text-right whitespace-nowrap",
                      render: (i) => (
                        <>
                          <ActionBtn
                            onClick={() => {
                              setEditingLombaId(i.id);
                              setFormDataLomba({
                                ...emptyLomba,
                                ...Object.fromEntries(Object.keys(emptyLomba).map((k) => [k, i[k] ?? emptyLomba[k]])),
                                categories: parseCategories(i.categories),
                                contacts: Array.isArray(i.contacts) ? i.contacts : [],
                              });
                              scrollTop();
                            }}
                          >
                            Edit
                          </ActionBtn>
                          <ActionBtn tone="danger" onClick={() => handleLombaDelete(i.id)}>Hapus</ActionBtn>
                        </>
                      ),
                    },
                  ]}
                />
              </>
            )}

            {/* ================= ARTIKEL (ANAK MENU 1: DATA UTAMA & DAFTAR) ================= */}
            {(activeMenu === "artikel" || activeMenu === "artikel-utama") && (
              <>
                <FormSection
                  title={editingArtikelId ? "Edit Data Utama Artikel" : "Tulis Artikel Baru (Data Utama)"}
                  editing={editingArtikelId}
                  onCancel={resetArtikelForm}
                  preview={
                    <div className="rounded-2xl bg-[#073969] border border-[#163b70] overflow-hidden">
                      <div className="aspect-[16/10] relative bg-[#02182b]">
                        <Thumb
                          src={formDataArtikel.image || artikelList.find((a) => a.id === editingArtikelId)?.thumb}
                          alt="Sampul"
                          className="w-full h-full"
                          rounded="rounded-none"
                        />
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          <span className="px-3 py-1 bg-accent text-[#001f54] text-[10px] font-bold uppercase rounded-lg">
                            {formDataArtikel.category}
                          </span>
                          {formDataArtikel.is_hot && (
                            <span className="px-2.5 py-1 bg-[#001f54] text-accent border border-accent/50 text-[10px] font-extrabold uppercase rounded-lg">
                              Hot
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-5">
                        <span className="text-accent text-[11px] font-bold uppercase tracking-wider">
                          {formDataArtikel.date || "Tanggal terbit"}
                        </span>
                        <h3 className="text-base font-extrabold leading-snug line-clamp-2 mt-1.5 mb-2">
                          {formDataArtikel.title || "Judul Artikel"}
                        </h3>
                        <p className="text-xs text-[#b3d2f5]/80 line-clamp-3 leading-relaxed">
                          {formDataArtikel.excerpt || "Ringkasan artikel tampil di sini."}
                        </p>
                      </div>
                    </div>
                  }
                >
                  <form onSubmit={handleArtikelSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className={labelCls}>Judul Artikel</label>
                      <input required value={formDataArtikel.title} onChange={(e) => setFormDataArtikel({ ...formDataArtikel, title: e.target.value })} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Kategori</label>
                      <select value={formDataArtikel.category} onChange={(e) => setFormDataArtikel({ ...formDataArtikel, category: e.target.value })} className={selectCls}>
                        {ARTIKEL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Penulis</label>
                      <input value={formDataArtikel.author} onChange={(e) => setFormDataArtikel({ ...formDataArtikel, author: e.target.value })} className={inputCls} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelCls}>Tanggal Tampil</label>
                      <input placeholder="Contoh: 10 November 2026 (kosongkan untuk hari ini)" value={formDataArtikel.date} onChange={(e) => setFormDataArtikel({ ...formDataArtikel, date: e.target.value })} className={inputCls} />
                    </div>
                    <div className="md:col-span-2">
                      <ImageUploadField label="Foto Sampul Utama (Header)" value={formDataArtikel.image} onChange={(v) => setFormDataArtikel({ ...formDataArtikel, image: v })} onAlert={showAlert} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={`flex items-start gap-3 p-3.5 bg-[#001f54] border border-[#163b70] rounded-xl select-none ${editingArtikelIsHot ? "opacity-70" : "cursor-pointer hover:border-accent/40"}`}>
                        <input
                          type="checkbox"
                          disabled={editingArtikelIsHot}
                          checked={formDataArtikel.is_hot}
                          onChange={(e) => setFormDataArtikel({ ...formDataArtikel, is_hot: e.target.checked })}
                          className="mt-0.5 w-4 h-4 accent-[#ffc300]"
                        />
                        <span>
                          <span className="block text-xs font-bold text-white">Jadikan Berita Hot di Beranda</span>
                          <span className="block text-[11px] text-[#b3d2f5]/70 mt-0.5">
                            {editingArtikelIsHot
                              ? "Artikel ini sedang Hot. Ganti dengan klik Set Hot di artikel lain."
                              : "Hanya 1 artikel yang bisa Hot. Artikel Hot sebelumnya otomatis diganti."}
                          </span>
                        </span>
                      </label>
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelCls}>Ringkasan Singkat (Lead Excerpt)</label>
                      <textarea rows="2" placeholder="Ringkasan 1-2 kalimat yang tampil di kartu luar..." value={formDataArtikel.excerpt} onChange={(e) => setFormDataArtikel({ ...formDataArtikel, excerpt: e.target.value })} className={textareaCls} />
                    </div>

                    <div className="md:col-span-2 pt-2">
                      <SubmitBtn>{editingArtikelId ? "Simpan Perubahan Data Utama" : "Terbitkan Data Utama"}</SubmitBtn>
                    </div>
                  </form>
                </FormSection>

                <ListSection
                  title="Daftar Artikel (terbaru di atas)"
                  items={artikelList}
                  loading={loadingArtikel}
                  emptyText="Belum ada artikel."
                  searchText={(i) => `${i.title} ${i.excerpt || ""} ${i.author || ""}`}
                  filters={ARTIKEL_CATEGORIES}
                  filterOf={(i) => i.category}
                  columns={[
                    {
                      header: "Judul & Kategori",
                      render: (i) => (
                        <div className="flex items-center gap-3 min-w-0">
                          <Thumb src={i.thumb} alt={i.title} />
                          <div className="min-w-0">
                            <p className="font-bold text-white line-clamp-1">{i.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-bold text-accent uppercase">{i.category}</span>
                              {i.is_hot && (
                                <span className="px-2 py-px rounded-full text-[10px] font-black bg-accent text-[#001f54]">HOT</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ),
                    },
                    {
                      header: "Penulis & Tanggal",
                      className: "whitespace-nowrap text-xs",
                      render: (i) => (
                        <>
                          <p className="text-white/85">{i.author}</p>
                          <p className="text-[#b3d2f5]/60">{i.date}</p>
                        </>
                      ),
                    },
                    {
                      header: "Aksi",
                      className: "text-right whitespace-nowrap",
                      render: (i) => (
                        <>
                          <button
                            type="button"
                            onClick={() => handleSetHot(i)}
                            className={`text-xs px-2.5 py-1 rounded-lg font-bold mr-1.5 transition-colors cursor-pointer ${
                              i.is_hot
                                ? "bg-accent text-[#001f54]"
                                : "text-[#b3d2f5] border border-[#163b70] hover:border-accent hover:text-accent"
                            }`}
                          >
                            {i.is_hot ? "Hot Aktif" : "Set Hot"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenBagianBuilder(i)}
                            className="text-xs px-2.5 py-1 rounded-lg font-bold mr-1.5 bg-[#034078] text-accent border border-accent/40 hover:bg-accent hover:text-[#001f54] transition-all cursor-pointer"
                          >
                            Susun Bagian →
                          </button>
                          <ActionBtn
                            onClick={() => {
                              setEditingArtikelId(i.id);
                              setFormDataArtikel({
                                title: i.title || "",
                                category: i.category || "Berita",
                                date: i.date || "",
                                author: i.author || "Divisi Kominfo",
                                image: i.image || "",
                                excerpt: i.excerpt || "",
                                content: typeof i.content === "string" ? i.content : JSON.stringify(i.content, null, 2),
                                is_hot: i.is_hot,
                              });
                              scrollTop();
                            }}
                          >
                            Edit
                          </ActionBtn>
                          <ActionBtn tone="danger" onClick={() => handleArtikelDelete(i)}>Hapus</ActionBtn>
                        </>
                      ),
                    },
                  ]}
                />
              </>
            )}

            {/* ================= ARTIKEL (ANAK MENU 2: PENYUSUN BAGIAN & DOKUMENTASI) ================= */}
            {activeMenu === "artikel-bagian" && (
              <section className="bg-[#073969] border border-[#163b70] rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-accent">Anak Menu Artikel</span>
                    <h2 className="text-base sm:text-lg font-bold text-white">Penyusun Bagian & Dokumentasi Kegiatan</h2>
                    <p className="text-xs text-[#b3d2f5]/70 mt-0.5">
                      Kelola galeri dokumentasi kegiatan (landscape 16:9), paragraf pengantar, dan bagian-bagian sub-bab narasi.
                    </p>
                  </div>
                  {selectedArtikelForBuilder && (
                    <a
                      href={`/artikel/${selectedArtikelForBuilder.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-[#001f54] hover:bg-[#034078] border border-[#163b70] text-accent text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Buka Halaman Baca Publik</span>
                    </a>
                  )}
                </div>

                {artikelList.length === 0 ? (
                  <div className="p-8 text-center text-[#b3d2f5]/60 border border-dashed border-[#163b70] rounded-2xl bg-[#001f54]/60">
                    <p className="text-sm font-semibold mb-2">Belum ada artikel yang terdaftar.</p>
                    <button
                      type="button"
                      onClick={() => setActiveMenu("artikel-utama")}
                      className="px-4 py-2 bg-accent text-[#001f54] font-bold text-xs rounded-xl hover:bg-accent-hover transition-colors cursor-pointer"
                    >
                      Buat Artikel di Menu Data Utama
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Selector Artikel Aktif */}
                    <div className="bg-[#001f54] border border-[#163b70] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-accent uppercase tracking-wider mb-1.5">
                          Pilih Artikel yang Disusun:
                        </label>
                        <select
                          value={builderArtikelId || ""}
                          onChange={(e) => handleSelectArtikelForBuilder(e.target.value)}
                          className={`${selectCls} font-bold text-sm bg-[#02182b] border-accent/40`}
                        >
                          {artikelList.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.title} ({a.category} • {a.date})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="text-xs text-[#b3d2f5]/70 md:text-right shrink-0">
                        <span className="block font-semibold text-white">Status Artikel:</span>
                        <span className="text-accent">{selectedArtikelForBuilder?.category}</span> • {selectedArtikelForBuilder?.author || "HIMSIKA"}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
                      {/* Kolom Kiri: Form Penyusun (7 Kolom) */}
                      <div className="lg:col-span-7 space-y-6">
                        {/* 1. Galeri Dokumentasi Utama (Landscape) */}
                        <div className="p-4 sm:p-5 bg-[#001f54] border border-[#163b70] rounded-2xl space-y-3.5 shadow-sm">
                          <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <div>
                              <h4 className="text-xs font-black text-accent uppercase tracking-wider">
                                1. Dokumentasi Kegiatan Utama (Landscape 16:9)
                              </h4>
                              <p className="text-[11px] text-[#b3d2f5]/70">
                                Tampil dalam galeri foto landscape di bawah judul artikel.
                              </p>
                            </div>
                            <span className="text-xs font-bold text-accent bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-lg">
                              {builderGallery.length} Foto
                            </span>
                          </div>

                          {builderGallery.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                              {builderGallery.map((imgUrl, gIdx) => (
                                <div key={gIdx} className="relative group aspect-video rounded-xl overflow-hidden border border-[#163b70] bg-[#02182b]">
                                  <img src={imgUrl} alt={`Dokum ${gIdx + 1}`} className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                                    <button
                                      type="button"
                                      onClick={() => setBuilderGallery((prev) => prev.filter((_, idx) => idx !== gIdx))}
                                      className="px-2.5 py-1 bg-red-600/90 hover:bg-red-600 text-white font-bold text-[11px] rounded-lg transition-colors cursor-pointer shadow"
                                    >
                                      Hapus
                                    </button>
                                  </div>
                                  <span className="absolute bottom-1 left-1.5 px-1.5 py-0.5 bg-black/70 text-[9px] font-bold text-white/80 rounded">
                                    #{gIdx + 1}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="pt-2 border-t border-white/5">
                            <ImageUploadField
                              label="Tambah Foto ke Galeri Dokumentasi (Landscape)"
                              value={newGalleryInput}
                              onChange={(val) => {
                                if (val && val.trim()) {
                                  setBuilderGallery((prev) => [...prev, val.trim()]);
                                  setNewGalleryInput("");
                                }
                              }}
                              onAlert={showAlert}
                            />
                            <p className="text-[10px] text-[#b3d2f5]/50 mt-1 italic">
                              Upload atau tempel URL foto landscape di atas, otomatis masuk ke galeri kegiatan.
                            </p>
                          </div>
                        </div>

                        {/* 2. Paragraf Pengantar */}
                        <div className="p-4 sm:p-5 bg-[#001f54] border border-[#163b70] rounded-2xl space-y-2.5 shadow-sm">
                          <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <h4 className="text-xs font-black text-accent uppercase tracking-wider">
                              2. Paragraf Pengantar / Pembuka
                            </h4>
                            <span className="text-[11px] text-[#b3d2f5]/60 italic">Muncul sebelum sub-bab pertama</span>
                          </div>
                          <TextFormatToolbar
                            textareaRef={leadTextareaRef}
                            value={builderLead}
                            onChange={setBuilderLead}
                          />
                          <textarea
                            ref={leadTextareaRef}
                            rows="3"
                            placeholder="Tulis narasi pembuka artikel di sini. Gunakan tombol format di atas untuk tebal, miring, dsb..."
                            value={builderLead}
                            onChange={(e) => setBuilderLead(e.target.value)}
                            className={textareaCls}
                          />
                        </div>

                        {/* 3. Bagian-Bagian Sub-Bab */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between pt-1">
                            <div>
                              <h4 className="text-xs font-black text-accent uppercase tracking-wider">
                                3. Bagian-Bagian Artikel (Sub-Bab)
                              </h4>
                              <p className="text-[11px] text-[#b3d2f5]/70">
                                tiap sub-bab memiliki judul aksen kuning, dokumentasi landscape, dan narasi isi.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const nextNum = builderSections.length + 1;
                                setBuilderSections((prev) => [
                                  ...prev,
                                  {
                                    id: "sec_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
                                    title: `${nextNum}. `,
                                    image: "",
                                    caption: "",
                                    text: "",
                                  },
                                ]);
                              }}
                              className="px-3.5 py-2 bg-accent hover:bg-yellow-400 text-[#001f54] font-bold text-xs rounded-xl transition-all cursor-pointer shadow flex items-center gap-1.5"
                            >
                              + Tambah Bagian
                            </button>
                          </div>

                          {builderSections.map((sec, idx) => (
                            <SectionEditorItem
                              key={sec.id}
                              section={sec}
                              index={idx}
                              total={builderSections.length}
                              onChange={(field, val) => {
                                setBuilderSections((prev) =>
                                  prev.map((s, i) => (i === idx ? { ...s, [field]: val } : s)),
                                );
                              }}
                              onMoveUp={() => {
                                if (idx === 0) return;
                                setBuilderSections((prev) => {
                                  const copy = [...prev];
                                  const temp = copy[idx - 1];
                                  copy[idx - 1] = copy[idx];
                                  copy[idx] = temp;
                                  return copy;
                                });
                              }}
                              onMoveDown={() => {
                                if (idx === builderSections.length - 1) return;
                                setBuilderSections((prev) => {
                                  const copy = [...prev];
                                  const temp = copy[idx + 1];
                                  copy[idx + 1] = copy[idx];
                                  copy[idx] = temp;
                                  return copy;
                                });
                              }}
                              onDelete={() => {
                                setBuilderSections((prev) => prev.filter((_, i) => i !== idx));
                              }}
                              onAlert={showAlert}
                            />
                          ))}

                          {builderSections.length === 0 && (
                            <div className="p-6 text-center border-2 border-dashed border-[#163b70] rounded-2xl bg-[#001f54]/40 text-[#b3d2f5]/60 space-y-2">
                              <p className="text-xs">Belum ada bagian sub-bab yang ditambahkan.</p>
                              <button
                                type="button"
                                onClick={() => {
                                  setBuilderSections([
                                    {
                                      id: "sec_" + Date.now(),
                                      title: "1. ",
                                      image: "",
                                      caption: "",
                                      text: "",
                                    },
                                  ]);
                                }}
                                className="px-4 py-2 bg-accent/20 hover:bg-accent text-accent hover:text-[#001f54] border border-accent/40 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                              >
                                + Tambah Bagian Pertama
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Tombol Simpan Seluruh Bagian */}
                        <div className="pt-4 border-t border-white/10">
                          <button
                            type="button"
                            onClick={handleSaveBagianArtikel}
                            className="w-full py-3.5 bg-accent hover:bg-yellow-400 text-[#001f54] font-black rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
                          >
                            Simpan Seluruh Bagian & Dokumentasi
                          </button>
                        </div>
                      </div>

                      {/* Kolom Kanan: Live Reading Preview Web (5 Kolom) */}
                      <div className="lg:col-span-5 bg-[#001f54]/95 border border-[#163b70] rounded-2xl p-5 shadow-inner sticky top-24 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                          <span className="text-xs font-bold text-accent uppercase tracking-wider">
                            Live Reading Preview
                          </span>
                          <span className="text-[10px] text-[#b3d2f5]/60">Simulasi Halaman Baca</span>
                        </div>

                        <div className="rounded-xl bg-[#02182b] border border-[#163b70] p-4 text-white text-xs max-h-[600px] overflow-y-auto space-y-4 [scrollbar-width:thin]">
                          <div className="border-b border-white/10 pb-3">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2.5 py-0.5 bg-accent/15 border border-accent/30 text-accent font-bold text-[10px] rounded-full">
                                {selectedArtikelForBuilder?.category || "Berita"}
                              </span>
                              <span className="text-[#b3d2f5]/60 text-[10px]">{selectedArtikelForBuilder?.date || "Hari Ini"}</span>
                            </div>
                            <h2 className="text-base font-black text-white leading-snug break-words">
                              {selectedArtikelForBuilder?.title || "Judul Artikel"}
                            </h2>
                            <p className="text-[10px] text-[#b3d2f5]/60 mt-1">Penulis: {selectedArtikelForBuilder?.author || "HIMSIKA"}</p>
                          </div>

                          {/* Preview Galeri Dokumentasi Landscape */}
                          {builderGallery.length > 0 && (
                            <div className="space-y-1.5">
                              <span className="block text-[10px] font-black text-accent uppercase tracking-wider">
                                Dokumentasi Utama ({builderGallery.length} Foto Landscape):
                              </span>
                              <div className="grid grid-cols-2 gap-1.5">
                                {builderGallery.slice(0, 4).map((imgUrl, idx) => (
                                  <div key={idx} className="aspect-video rounded-lg overflow-hidden border border-white/10 bg-[#02182b]">
                                    <img src={imgUrl} alt="Dokum" className="w-full h-full object-cover" />
                                  </div>
                                ))}
                              </div>
                              {builderGallery.length > 4 && (
                                <p className="text-[10px] text-[#b3d2f5]/50 italic">+ {builderGallery.length - 4} foto lainnya di galeri</p>
                              )}
                            </div>
                          )}

                          {/* Preview Pengantar */}
                          {builderLead && (
                            <div
                              className="text-white/80 leading-relaxed text-[11px] break-words"
                              dangerouslySetInnerHTML={{ __html: builderLead.replace(/\n\n+/g, "<br/><br/>") }}
                            />
                          )}

                          {/* Preview Bagian-Bagian */}
                          {builderSections.map((sec, idx) => (
                            <div key={sec.id || idx} className="pt-2 border-t border-white/10 space-y-2">
                              {sec.title && (
                                <h4 className="text-xs font-black text-accent flex items-center gap-2 break-words">
                                  <span className="w-1.5 h-4 bg-accent rounded-full inline-block shrink-0"></span>
                                  {sec.title}
                                </h4>
                              )}
                              {sec.image && (
                                <div className="rounded-xl overflow-hidden border border-white/10 bg-[#02182b]">
                                  <div className="aspect-video">
                                    <img src={sec.image} alt={sec.title || "Dokum"} className="w-full h-full object-cover" />
                                  </div>
                                  {sec.caption && (
                                    <p className="text-[10px] text-[#b3d2f5]/60 italic text-center p-1.5 border-t border-white/5 break-words">
                                      {sec.caption}
                                    </p>
                                  )}
                                </div>
                              )}
                              {sec.text && (
                                <div
                                  className="text-white/80 leading-relaxed text-[11px] break-words"
                                  dangerouslySetInnerHTML={{ __html: sec.text.replace(/\n\n+/g, "<br/><br/>") }}
                                />
                              )}
                            </div>
                          ))}

                          {builderSections.length === 0 && !builderLead && builderGallery.length === 0 && (
                            <p className="text-[#b3d2f5]/50 text-center py-6 text-[11px] italic">
                              Tambahkan foto dokumentasi landscape, pengantar, atau bagian sub-bab untuk melihat live preview halaman baca.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </section>
            )}

            {/* ================= PRESTASI ================= */}
            {activeMenu === "prestasi" && (
              <>
                <FormSection
                  title={editingPrestasiId ? "Edit Prestasi" : "Tambah Prestasi"}
                  editing={editingPrestasiId}
                  onCancel={resetPrestasiForm}
                  preview={
                    <div className="rounded-2xl bg-[#073969] border border-[#163b70] overflow-hidden">
                      <div className="aspect-[16/10] relative bg-[#02182b]">
                        <Thumb
                          src={formDataPrestasi.gambar || prestasiList.find((p) => p.id === editingPrestasiId)?.thumb}
                          alt="Prestasi"
                          className="w-full h-full"
                          rounded="rounded-none"
                        />
                        <span className="absolute top-3 left-3 px-3 py-1 bg-accent text-[#001f54] text-[10px] font-black uppercase rounded-full">
                          {formDataPrestasi.peringkat || "Juara 1"}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className="text-base font-bold leading-snug mb-2">{formDataPrestasi.judul || "Nama Kompetisi"}</h3>
                        <div className="space-y-1 text-xs text-[#b3d2f5]/80">
                          {formDataPrestasi.pemenang
                            ? formDataPrestasi.pemenang.split("\n").filter(Boolean).map((n, idx) => <p key={idx}>{n}</p>)
                            : <p className="text-[#b3d2f5]/50">Nama pemenang</p>}
                        </div>
                      </div>
                    </div>
                  }
                >
                  <form onSubmit={handlePrestasiSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Judul Kompetisi</label>
                      <input required value={formDataPrestasi.judul} onChange={(e) => setFormDataPrestasi({ ...formDataPrestasi, judul: e.target.value })} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Peringkat</label>
                      <input required placeholder="Juara 1, Finalis, ..." value={formDataPrestasi.peringkat} onChange={(e) => setFormDataPrestasi({ ...formDataPrestasi, peringkat: e.target.value })} className={inputCls} />
                    </div>
                    <div className="md:col-span-2">
                      <ImageUploadField label="Foto / Poster" value={formDataPrestasi.gambar} onChange={(v) => setFormDataPrestasi({ ...formDataPrestasi, gambar: v })} onAlert={showAlert} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelCls}>Link Instagram Post</label>
                      <input type="url" placeholder="https://www.instagram.com/p/..." value={formDataPrestasi.instagram_url} onChange={(e) => setFormDataPrestasi({ ...formDataPrestasi, instagram_url: e.target.value })} className={inputCls} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelCls}>Nama Pemenang (satu per baris)</label>
                      <textarea rows="3" value={formDataPrestasi.pemenang} onChange={(e) => setFormDataPrestasi({ ...formDataPrestasi, pemenang: e.target.value })} className={textareaCls} />
                    </div>
                    <SubmitBtn>{editingPrestasiId ? "Simpan Perubahan" : "Simpan Prestasi"}</SubmitBtn>
                  </form>
                </FormSection>

                <ListSection
                  title="Daftar Prestasi"
                  items={prestasiList}
                  loading={loadingPrestasi}
                  emptyText="Belum ada data prestasi."
                  searchText={(i) => `${i.judul} ${i.peringkat} ${i.pemenang.join(" ")}`}
                  columns={[
                    {
                      header: "Kompetisi & Peringkat",
                      render: (i) => (
                        <div className="flex items-center gap-3 min-w-0">
                          <Thumb src={i.thumb} alt={i.judul} />
                          <div className="min-w-0">
                            <p className="font-bold text-white line-clamp-1">{i.judul}</p>
                            <span className="text-xs text-accent font-bold">{i.peringkat}</span>
                          </div>
                        </div>
                      ),
                    },
                    {
                      header: "Pemenang",
                      className: "text-xs text-[#b3d2f5]/70 max-w-xs",
                      render: (i) => <p className="line-clamp-2">{i.pemenang.join(", ")}</p>,
                    },
                    {
                      header: "Aksi",
                      className: "text-right whitespace-nowrap",
                      render: (i) => (
                        <>
                          <ActionBtn
                            onClick={() => {
                              setEditingPrestasiId(i.id);
                              setFormDataPrestasi({
                                judul: i.judul || "",
                                peringkat: i.peringkat || "Juara 1",
                                pemenang: i.pemenang.join("\n"),
                                gambar: i.gambar || "",
                                instagram_url: i.instagram_url || "",
                              });
                              scrollTop();
                            }}
                          >
                            Edit
                          </ActionBtn>
                          <ActionBtn tone="danger" onClick={() => handlePrestasiDelete(i.id)}>Hapus</ActionBtn>
                        </>
                      ),
                    },
                  ]}
                />
              </>
            )}

            {/* ================= GALERI ================= */}
            {activeMenu === "galeri" && (
              <>
                <FormSection
                  title={editingGaleriId ? "Edit Foto Galeri" : "Tambah Foto Galeri"}
                  editing={editingGaleriId}
                  onCancel={resetGaleriForm}
                  preview={
                    <div className="rounded-2xl border border-[#163b70] overflow-hidden aspect-[4/3] relative bg-[#02182b]">
                      <Thumb
                        src={formDataGaleri.foto || galeriList.find((g) => g.id === editingGaleriId)?.thumb}
                        alt="Dokumentasi"
                        className="w-full h-full"
                        rounded="rounded-none"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-[#02182b]/95 to-transparent p-4">
                        <span className="px-2.5 py-0.5 rounded-md bg-accent text-[#001f54] text-[10px] font-bold uppercase">
                          {formDataGaleri.album}
                        </span>
                        <p className="text-xs text-white/90 mt-1.5 line-clamp-2">{formDataGaleri.caption || "Keterangan foto"}</p>
                      </div>
                    </div>
                  }
                >
                  <form onSubmit={handleGaleriSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className={labelCls}>Album / Divisi</label>
                      <select value={formDataGaleri.album} onChange={(e) => setFormDataGaleri({ ...formDataGaleri, album: e.target.value })} className={selectCls}>
                        {ALBUM_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <ImageUploadField label="Foto Dokumentasi" value={formDataGaleri.foto} onChange={(v) => setFormDataGaleri({ ...formDataGaleri, foto: v })} onAlert={showAlert} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelCls}>Keterangan (opsional)</label>
                      <input value={formDataGaleri.caption} onChange={(e) => setFormDataGaleri({ ...formDataGaleri, caption: e.target.value })} className={inputCls} />
                    </div>
                    <SubmitBtn>{editingGaleriId ? "Simpan Perubahan" : "Simpan Foto"}</SubmitBtn>
                  </form>
                </FormSection>

                <ListSection
                  title="Daftar Foto Galeri"
                  items={galeriList}
                  loading={loadingGaleri}
                  emptyText="Belum ada foto galeri."
                  searchText={(i) => `${i.album} ${i.caption || ""}`}
                  filters={ALBUM_OPTIONS.filter((a) => galeriList.some((g) => g.album === a))}
                  filterOf={(i) => i.album}
                  columns={[
                    {
                      header: "Foto & Album",
                      render: (i) => (
                        <div className="flex items-center gap-3 min-w-0">
                          <Thumb src={i.thumb} alt={i.album} className="w-16 h-12" />
                          <div className="min-w-0">
                            <p className="font-bold text-white line-clamp-1">{i.album}</p>
                            <p className="text-xs text-[#b3d2f5]/60 line-clamp-1">{i.caption || "-"}</p>
                          </div>
                        </div>
                      ),
                    },
                    { header: "ID", className: "text-xs text-[#b3d2f5]/50 whitespace-nowrap", render: (i) => `#${i.id}` },
                    {
                      header: "Aksi",
                      className: "text-right whitespace-nowrap",
                      render: (i) => (
                        <>
                          <ActionBtn
                            onClick={() => {
                              setEditingGaleriId(i.id);
                              setFormDataGaleri({ album: i.album || "Divisi Kominfo", foto: i.foto || "", caption: i.caption || "" });
                              scrollTop();
                            }}
                          >
                            Edit
                          </ActionBtn>
                          <ActionBtn tone="danger" onClick={() => handleGaleriDelete(i.id)}>Hapus</ActionBtn>
                        </>
                      ),
                    },
                  ]}
                />
              </>
            )}

            {/* ================= PENGURUS ================= */}
            {activeMenu === "pengurus" && (
              <>
                <FormSection
                  title={editingPengurusId ? "Edit Pengurus" : "Tambah Pengurus"}
                  editing={editingPengurusId}
                  onCancel={resetPengurusForm}
                  preview={
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewPengurus({
                          ...formDataPengurus,
                          nama: formDataPengurus.nama || "Nama Pengurus",
                          jabatan: formDataPengurus.jabatan || "Jabatan",
                          thumb: formDataPengurus.foto || pengurusList.find((p) => p.id === editingPengurusId)?.thumb,
                        })
                      }
                      className="w-full max-w-[260px] mx-auto block rounded-2xl overflow-hidden bg-[#073969] border border-[#163b70] text-left hover:-translate-y-0.5 transition-transform cursor-pointer"
                    >
                      <div className="aspect-[4/5] relative bg-[#02182b]">
                        <Thumb
                          src={formDataPengurus.foto || pengurusList.find((p) => p.id === editingPengurusId)?.thumb}
                          alt="Pengurus"
                          className="w-full h-full"
                          rounded="rounded-none"
                        />
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-[#001f54]/90 text-[10px] font-bold text-accent uppercase">
                          {formDataPengurus.kelompok}
                        </span>
                      </div>
                      <div className="p-4">
                        <p className="text-sm font-bold">{formDataPengurus.nama || "Nama Pengurus"}</p>
                        <p className="mt-1 text-[11px] font-semibold uppercase text-accent">{formDataPengurus.jabatan || "Jabatan"}</p>
                        <p className="mt-2 text-[10px] text-[#b3d2f5]/60">Klik untuk uji popup detail</p>
                      </div>
                    </button>
                  }
                >
                  <form onSubmit={handlePengurusSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Nama Lengkap</label>
                      <input required value={formDataPengurus.nama} onChange={(e) => setFormDataPengurus({ ...formDataPengurus, nama: e.target.value })} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Jabatan</label>
                      <input required value={formDataPengurus.jabatan} onChange={(e) => setFormDataPengurus({ ...formDataPengurus, jabatan: e.target.value })} className={inputCls} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelCls}>Kelompok</label>
                      <select value={formDataPengurus.kelompok} onChange={(e) => setFormDataPengurus({ ...formDataPengurus, kelompok: e.target.value })} className={selectCls}>
                        {KELOMPOK_OPTIONS.map((k) => <option key={k.id} value={k.id}>{k.label}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <ImageUploadField label="Foto Profil" value={formDataPengurus.foto} onChange={(v) => setFormDataPengurus({ ...formDataPengurus, foto: v })} onAlert={showAlert} />
                    </div>
                    <div>
                      <label className={labelCls}>Instagram</label>
                      <input placeholder="username atau URL" value={formDataPengurus.instagram} onChange={(e) => setFormDataPengurus({ ...formDataPengurus, instagram: e.target.value })} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>LinkedIn</label>
                      <input placeholder="username atau URL" value={formDataPengurus.linkedin} onChange={(e) => setFormDataPengurus({ ...formDataPengurus, linkedin: e.target.value })} className={inputCls} />
                    </div>
                    <SubmitBtn>{editingPengurusId ? "Simpan Perubahan" : "Simpan Pengurus"}</SubmitBtn>
                  </form>
                </FormSection>

                <ListSection
                  title="Daftar Pengurus"
                  items={pengurusList}
                  loading={loadingPengurus}
                  emptyText="Belum ada data pengurus."
                  searchText={(i) => `${i.nama} ${i.jabatan}`}
                  filters={KELOMPOK_OPTIONS.map((k) => k.id.toUpperCase())}
                  filterOf={(i) => String(i.kelompok).toUpperCase()}
                  columns={[
                    {
                      header: "Nama & Jabatan",
                      render: (i) => (
                        <div className="flex items-center gap-3 min-w-0">
                          <Thumb src={i.thumb} alt={i.nama} className="w-11 h-11" rounded="rounded-full" />
                          <div className="min-w-0">
                            <p className="font-bold text-white line-clamp-1">{i.nama}</p>
                            <p className="text-xs text-accent font-semibold line-clamp-1">{i.jabatan}</p>
                          </div>
                        </div>
                      ),
                    },
                    { header: "Kelompok", className: "text-xs text-[#b3d2f5]/70 uppercase font-semibold whitespace-nowrap", render: (i) => i.kelompok },
                    {
                      header: "Aksi",
                      className: "text-right whitespace-nowrap",
                      render: (i) => (
                        <>
                          <ActionBtn tone="muted" onClick={() => setPreviewPengurus(i)}>Detail</ActionBtn>
                          <ActionBtn
                            onClick={() => {
                              setEditingPengurusId(i.id);
                              setFormDataPengurus({
                                nama: i.nama || "",
                                jabatan: i.jabatan || "",
                                kelompok: i.kelompok || "bph",
                                foto: i.foto || "",
                                instagram: i.instagram || "",
                                linkedin: i.linkedin || "",
                              });
                              scrollTop();
                            }}
                          >
                            Edit
                          </ActionBtn>
                          <ActionBtn tone="danger" onClick={() => handlePengurusDelete(i.id)}>Hapus</ActionBtn>
                        </>
                      ),
                    },
                  ]}
                />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Popup detail pengurus (sama seperti di web publik) */}
      <AnimatePresence>
        {previewPengurus && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-[#02182b]/85 backdrop-blur-sm"
            onClick={() => setPreviewPengurus(null)}
          >
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[340px] bg-[#073969] border border-[#163b70] rounded-2xl overflow-hidden shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setPreviewPengurus(null)}
                className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full bg-[#02182b]/80 text-[#b3d2f5] hover:text-white text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
              <div className="aspect-[4/5] bg-[#02182b]">
                <Thumb src={previewPengurus.thumb} alt={previewPengurus.nama} className="w-full h-full" rounded="rounded-none" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold leading-tight">{previewPengurus.nama}</h3>
                <p className="mt-1 text-xs font-semibold text-accent">
                  {previewPengurus.jabatan} <span className="text-[#b3d2f5]/70 font-normal uppercase">/ {previewPengurus.kelompok}</span>
                </p>
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/10">
                  {previewPengurus.instagram ? (
                    <a href={socialUrl(previewPengurus.instagram, "https://instagram.com/")} target="_blank" rel="noopener noreferrer" className="text-center px-3 py-2 rounded-xl bg-[#001f54] hover:bg-[#034078] border border-[#163b70] text-[#b3d2f5] hover:text-white text-xs font-semibold transition-colors">
                      Instagram
                    </a>
                  ) : (
                    <span className="text-center px-3 py-2 rounded-xl bg-[#001f54]/40 border border-[#163b70]/40 text-[#b3d2f5]/30 text-xs">Instagram -</span>
                  )}
                  {previewPengurus.linkedin ? (
                    <a href={socialUrl(previewPengurus.linkedin, "https://linkedin.com/in/")} target="_blank" rel="noopener noreferrer" className="text-center px-3 py-2 rounded-xl bg-[#001f54] hover:bg-[#034078] border border-[#163b70] text-[#b3d2f5] hover:text-white text-xs font-semibold transition-colors">
                      LinkedIn
                    </a>
                  ) : (
                    <span className="text-center px-3 py-2 rounded-xl bg-[#001f54]/40 border border-[#163b70]/40 text-[#b3d2f5]/30 text-xs">LinkedIn -</span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Penutup Kolom Konten Utama Kanan */}
      </div>

      {modal}
    </div>
  );
}
