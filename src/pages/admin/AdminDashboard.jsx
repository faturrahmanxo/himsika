import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import supabase from "../../supabase-client";
import pengurusData from "../../data/pengurusData";
import artikelData from "../../data/artikel";
import galeriDefault from "../../data/galeriData";
import { PRESTASI_DATA } from "../../data/prestasiData";
import LogoHimsika from "../../assets/logo/HIMSIKA.png";
// Ikon hanya dipakai untuk bottom menu bar.
import { Trophy, FileText, Award, Image as ImageIcon, Users } from "lucide-react";
import { isLombaExpired, getLombaFinalTimestamp } from "../../utils/lombaDeadline";

const MENU = [
  { id: "lomba", label: "Lomba", title: "Lomba & Beasiswa", icon: Trophy },
  { id: "artikel", label: "Artikel", title: "Artikel & Berita", icon: FileText },
  { id: "prestasi", label: "Prestasi", title: "Prestasi Mahasiswa", icon: Award },
  { id: "galeri", label: "Galeri", title: "Galeri Kegiatan", icon: ImageIcon },
  { id: "pengurus", label: "Pengurus", title: "Profil & Pengurus", icon: Users },
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
  "w-full bg-[#04284d] border border-[#164a78] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/40 transition-colors";
const textareaCls =
  "w-full bg-[#04284d] border border-[#164a78] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/40 transition-colors resize-none overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";
const labelCls = "block text-xs font-bold text-white/70 mb-1.5";

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
            className="w-full max-w-md bg-[#073969] border border-[#164a78] rounded-2xl p-6 shadow-2xl text-white"
          >
            <h3 className="text-base sm:text-lg font-bold mb-2">{title}</h3>
            <p className="text-sm text-white/80 leading-relaxed mb-6 whitespace-pre-line">{message}</p>
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
                    : "bg-accent hover:bg-accent-hover text-[#043761]"
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
      <div className={`${className} ${rounded} shrink-0 bg-[#04284d] border border-[#164a78] flex items-center justify-center text-[9px] font-bold text-white/30 uppercase`}>
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
      className={`${className} ${rounded} shrink-0 object-cover border border-[#164a78] bg-[#04284d]`}
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
        <div className="mt-2 flex items-center gap-3 p-2 bg-[#04284d] border border-[#164a78] rounded-xl">
          <Thumb src={value} alt="Pratinjau" className="w-10 h-10" />
          <span className="text-[11px] text-white/50 truncate flex-1">{value}</span>
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
    <section className="bg-[#073969] border border-[#164a78] rounded-3xl p-4 sm:p-6 shadow-xl">
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
                    ? "bg-accent text-[#043761]"
                    : "bg-[#04284d] text-white/70 hover:text-white border border-[#164a78]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#164a78]">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="bg-[#04284d]/70 text-white/50 text-xs">
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
                <td colSpan={columns.length} className="p-8 text-center text-white/40">
                  Memuat data...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-white/40">
                  {search || filter !== "Semua" ? "Tidak ada data yang cocok." : emptyText}
                </td>
              </tr>
            ) : (
              rows.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.03] transition-colors">
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
          <span className="text-white/50">
            {start + 1} - {Math.min(start + PAGE_SIZE, filtered.length)} dari {filtered.length}
          </span>
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <button
              type="button"
              disabled={current <= 1}
              onClick={() => setPage(current - 1)}
              className="px-3 py-1.5 rounded-lg bg-[#04284d] border border-[#164a78] text-white disabled:opacity-40 hover:bg-white/10 cursor-pointer disabled:cursor-not-allowed"
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
                    ? "bg-accent text-[#043761]"
                    : "bg-[#04284d] text-white/70 hover:text-white border border-[#164a78]"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              disabled={current >= totalPages}
              onClick={() => setPage(current + 1)}
              className="px-3 py-1.5 rounded-lg bg-[#04284d] border border-[#164a78] text-white disabled:opacity-40 hover:bg-white/10 cursor-pointer disabled:cursor-not-allowed"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function FormSection({ title, editing, onCancel, children, preview }) {
  return (
    <section className="bg-[#073969] border border-[#164a78] rounded-3xl p-5 sm:p-7 shadow-xl">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
        <h2 className="text-base sm:text-lg font-bold text-white">{title}</h2>
        {editing && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-bold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full cursor-pointer transition-colors"
          >
            Batal Edit
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        <div className="lg:col-span-7">{children}</div>
        <div className="lg:col-span-5 bg-[#04284d]/80 border border-[#164a78] rounded-2xl p-5 shadow-inner">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">Live Preview Card</span>
            <span className="text-[11px] text-white/50">Tampilan Web</span>
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
      tone === "danger" ? "text-red-300 hover:bg-red-500/15" : tone === "muted" ? "text-white/70 hover:bg-white/10" : "text-accent hover:bg-accent/10"
    }`}
  >
    {children}
  </button>
);

const SubmitBtn = ({ children }) => (
  <div className="md:col-span-2 flex justify-end pt-4 border-t border-white/10">
    <button
      type="submit"
      className="px-6 py-2.5 bg-accent text-[#043761] font-bold rounded-full hover:bg-accent-hover text-sm shadow-md cursor-pointer transition-colors"
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
  const [activeMenu, setActiveMenu] = useState("lomba");

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
      const res = await supabase.from("artikel").update({ is_hot: false }).neq("id", item.id);
      if (res.error && res.error.message?.toLowerCase().includes("is_hot")) {
        showAlert(
          "Kolom 'is_hot' belum terdaftar di database Supabase.\n\nSilakan salin dan jalankan script SQL berikut di Supabase SQL Editor:\nALTER TABLE public.artikel ADD COLUMN IF NOT EXISTS is_hot BOOLEAN DEFAULT false;\nNOTIFY pgrst, 'reload schema';",
          "Perlu Update Kolom Database",
        );
        fetchArtikel();
        return;
      }
      await supabase.from("artikel").update({ is_hot: true }).eq("id", item.id);
    } catch (err) {
      showAlert("Gagal menyimpan Berita Hot: " + err.message, "Kendala Sistem");
      fetchArtikel();
    }
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
      content: formDataArtikel.content,
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
    if (payload.is_hot && savedId) await syncHot(savedId);

    showAlert(editingArtikelId ? "Artikel berhasil diperbarui." : "Artikel baru berhasil diterbitkan.", "Berhasil");
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
      <main className="min-h-screen bg-linear-to-b from-[#043761] via-[#032d52] to-[#02182b] flex items-center justify-center p-4 font-primary text-white">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-md bg-[#073969] border border-[#164a78] p-8 sm:p-10 rounded-3xl shadow-2xl"
        >
          <div className="text-center mb-8">
            <img src={LogoHimsika} alt="Logo HIMSIKA" className="w-20 h-20 mx-auto mb-4 object-contain" />
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              HIMSIKA <span className="text-accent">Admin</span>
            </h1>
            <p className="text-xs text-white/60 mt-1.5">Masuk dengan akun email resmi pengurus HIMSIKA</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className={labelCls} htmlFor="admin-email">Email</label>
              <input id="admin-email" type="email" required autoComplete="email" placeholder="admin@himsika.unsika.ac.id" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls} htmlFor="admin-pass">Kata Sandi</label>
              <input id="admin-pass" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
            </div>
            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 bg-accent text-[#043761] font-bold rounded-xl hover:bg-accent-hover transition-colors mt-3 text-sm cursor-pointer disabled:opacity-50"
            >
              {authLoading ? "Memverifikasi..." : "Masuk ke Dashboard"}
            </button>
          </form>
        </motion.div>
        {modal}
      </main>
    );
  }

  const activeInfo = MENU.find((m) => m.id === activeMenu);

  // ==================== DASHBOARD ====================
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-linear-to-b from-[#043761] via-[#032d52] to-[#02182b] font-primary text-white"
    >
      {/* pb besar supaya konten tidak tertutup bottom bar */}
      <main className="px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-32 max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 min-w-0">
            <img src={LogoHimsika} alt="Logo HIMSIKA" className="w-10 h-10 object-contain shrink-0" />
            <div className="min-w-0">
              <span className="block text-[11px] font-bold uppercase tracking-widest text-accent">HIMSIKA Admin</span>
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight truncate">
                Kelola <span className="text-accent">{activeInfo?.title}</span>
              </h1>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="shrink-0 px-4 py-2 rounded-xl text-xs font-bold text-red-300 border border-red-400/30 hover:bg-red-500/15 transition-colors cursor-pointer"
          >
            Keluar
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeMenu}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
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
                    <div className="rounded-2xl bg-[#021f3f] border border-[#1b4e80] p-5 shadow-lg">
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-accent/15 text-accent border border-accent/25">
                          Lomba & Beasiswa
                        </span>
                        {formDataLomba.deadline_pendaftaran && (
                          <span className="text-[11px] font-semibold text-accent/90">
                            {formDataLomba.deadline_pendaftaran}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-white mb-1 line-clamp-2 leading-snug">
                        {formDataLomba.title || "Judul Kompetisi"}
                      </h3>
                      <p className="text-xs font-medium text-white/70 mb-3">
                        {formDataLomba.organizer || "Penyelenggara"}
                      </p>
                      <p className="text-xs text-white/60 line-clamp-3 mb-3 leading-relaxed">
                        {formDataLomba.description || "Deskripsi kompetisi akan tampil di sini..."}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div className="p-2.5 rounded-xl bg-[#032a50] border border-[#184877]">
                          <span className="block text-[10px] font-medium text-white/50 uppercase tracking-wider mb-0.5">Pendaftaran</span>
                          <span className="font-semibold text-white text-xs truncate block">{formDataLomba.deadline_pendaftaran || "-"}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#032a50] border border-[#184877]">
                          <span className="block text-[10px] font-medium text-white/50 uppercase tracking-wider mb-0.5">Pengumpulan</span>
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
                        <div className="flex-1 py-2 text-center text-xs font-semibold rounded-lg bg-accent text-[#043761]">
                          Daftar Sekarang
                        </div>
                        {formDataLomba.guidebook_url && (
                          <div className="px-3 py-2 text-center text-xs font-medium rounded-lg border border-[#1b4e80] text-white/80">
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

            {/* ================= ARTIKEL ================= */}
            {activeMenu === "artikel" && (
              <>
                <FormSection
                  title={editingArtikelId ? "Edit Artikel" : "Tulis Artikel Baru"}
                  editing={editingArtikelId}
                  onCancel={resetArtikelForm}
                  preview={
                    <div className="rounded-2xl bg-[#073969] border border-[#164a78] overflow-hidden">
                      <div className="aspect-[16/10] relative bg-[#03233f]">
                        <Thumb
                          src={formDataArtikel.image || artikelList.find((a) => a.id === editingArtikelId)?.thumb}
                          alt="Sampul"
                          className="w-full h-full"
                          rounded="rounded-none"
                        />
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          <span className="px-3 py-1 bg-accent text-[#043761] text-[10px] font-bold uppercase rounded-lg">
                            {formDataArtikel.category}
                          </span>
                          {formDataArtikel.is_hot && (
                            <span className="px-2.5 py-1 bg-[#043761] text-accent border border-accent/50 text-[10px] font-extrabold uppercase rounded-lg">
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
                        <p className="text-xs text-white/70 line-clamp-3 leading-relaxed">
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
                      <select value={formDataArtikel.category} onChange={(e) => setFormDataArtikel({ ...formDataArtikel, category: e.target.value })} className={inputCls}>
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
                      <ImageUploadField label="Foto Sampul" value={formDataArtikel.image} onChange={(v) => setFormDataArtikel({ ...formDataArtikel, image: v })} onAlert={showAlert} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={`flex items-start gap-3 p-3.5 bg-[#04284d] border border-[#164a78] rounded-xl select-none ${editingArtikelIsHot ? "opacity-70" : "cursor-pointer hover:border-accent/40"}`}>
                        <input
                          type="checkbox"
                          disabled={editingArtikelIsHot}
                          checked={formDataArtikel.is_hot}
                          onChange={(e) => setFormDataArtikel({ ...formDataArtikel, is_hot: e.target.checked })}
                          className="mt-0.5 w-4 h-4 accent-[#ffc300]"
                        />
                        <span>
                          <span className="block text-xs font-bold">Jadikan Berita Hot di Beranda</span>
                          <span className="block text-[11px] text-white/50 mt-0.5">
                            {editingArtikelIsHot
                              ? "Artikel ini sedang Hot. Ganti dengan klik Set Hot di artikel lain."
                              : "Hanya 1 artikel yang bisa Hot. Artikel Hot sebelumnya otomatis diganti."}
                          </span>
                        </span>
                      </label>
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelCls}>Ringkasan</label>
                      <textarea rows="2" value={formDataArtikel.excerpt} onChange={(e) => setFormDataArtikel({ ...formDataArtikel, excerpt: e.target.value })} className={textareaCls} />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelCls}>Konten Artikel</label>
                      <textarea rows="5" required value={formDataArtikel.content} onChange={(e) => setFormDataArtikel({ ...formDataArtikel, content: e.target.value })} className={textareaCls} />
                    </div>
                    <SubmitBtn>{editingArtikelId ? "Simpan Perubahan" : "Terbitkan Artikel"}</SubmitBtn>
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
                                <span className="px-2 py-px rounded-full text-[10px] font-black bg-accent text-[#043761]">HOT</span>
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
                          <p className="text-white/45">{i.date}</p>
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
                            className={`text-xs px-3 py-1 rounded-lg font-bold mr-1 transition-colors cursor-pointer ${
                              i.is_hot
                                ? "bg-accent text-[#043761]"
                                : "text-white/75 border border-white/15 hover:border-accent hover:text-accent"
                            }`}
                          >
                            {i.is_hot ? "Hot Aktif" : "Set Hot"}
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
                                content: typeof i.content === "string" ? i.content : JSON.stringify(i.content),
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

            {/* ================= PRESTASI ================= */}
            {activeMenu === "prestasi" && (
              <>
                <FormSection
                  title={editingPrestasiId ? "Edit Prestasi" : "Tambah Prestasi"}
                  editing={editingPrestasiId}
                  onCancel={resetPrestasiForm}
                  preview={
                    <div className="rounded-2xl bg-[#073969] border border-[#164a78] overflow-hidden">
                      <div className="aspect-[16/10] relative bg-[#03233f]">
                        <Thumb
                          src={formDataPrestasi.gambar || prestasiList.find((p) => p.id === editingPrestasiId)?.thumb}
                          alt="Prestasi"
                          className="w-full h-full"
                          rounded="rounded-none"
                        />
                        <span className="absolute top-3 left-3 px-3 py-1 bg-accent text-[#043761] text-[10px] font-black uppercase rounded-full">
                          {formDataPrestasi.peringkat || "Juara 1"}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className="text-base font-bold leading-snug mb-2">{formDataPrestasi.judul || "Nama Kompetisi"}</h3>
                        <div className="space-y-1 text-xs text-white/75">
                          {formDataPrestasi.pemenang
                            ? formDataPrestasi.pemenang.split("\n").filter(Boolean).map((n, idx) => <p key={idx}>{n}</p>)
                            : <p className="text-white/40">Nama pemenang</p>}
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
                      className: "text-xs text-white/70 max-w-xs",
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
                    <div className="rounded-2xl border border-[#164a78] overflow-hidden aspect-[4/3] relative bg-[#03233f]">
                      <Thumb
                        src={formDataGaleri.foto || galeriList.find((g) => g.id === editingGaleriId)?.thumb}
                        alt="Dokumentasi"
                        className="w-full h-full"
                        rounded="rounded-none"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-[#02182b]/90 to-transparent p-4">
                        <span className="px-2.5 py-0.5 rounded-md bg-accent text-[#043761] text-[10px] font-bold uppercase">
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
                      <select value={formDataGaleri.album} onChange={(e) => setFormDataGaleri({ ...formDataGaleri, album: e.target.value })} className={inputCls}>
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
                            <p className="text-xs text-white/55 line-clamp-1">{i.caption || "-"}</p>
                          </div>
                        </div>
                      ),
                    },
                    { header: "ID", className: "text-xs text-white/50 whitespace-nowrap", render: (i) => `#${i.id}` },
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
                      className="w-full max-w-[260px] mx-auto block rounded-2xl overflow-hidden bg-[#073969] border border-accent/50 text-left hover:-translate-y-0.5 transition-transform cursor-pointer"
                    >
                      <div className="aspect-[4/5] relative bg-[#02182b]">
                        <Thumb
                          src={formDataPengurus.foto || pengurusList.find((p) => p.id === editingPengurusId)?.thumb}
                          alt="Pengurus"
                          className="w-full h-full"
                          rounded="rounded-none"
                        />
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-[#04284d]/90 text-[10px] font-bold text-accent uppercase">
                          {formDataPengurus.kelompok}
                        </span>
                      </div>
                      <div className="p-4">
                        <p className="text-sm font-bold">{formDataPengurus.nama || "Nama Pengurus"}</p>
                        <p className="mt-1 text-[11px] font-semibold uppercase text-accent">{formDataPengurus.jabatan || "Jabatan"}</p>
                        <p className="mt-2 text-[10px] text-white/45">Klik untuk uji popup detail</p>
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
                      <select value={formDataPengurus.kelompok} onChange={(e) => setFormDataPengurus({ ...formDataPengurus, kelompok: e.target.value })} className={inputCls}>
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
                    { header: "Kelompok", className: "text-xs text-white/70 uppercase font-semibold whitespace-nowrap", render: (i) => i.kelompok },
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
              className="relative w-full max-w-[340px] bg-[#073969] border border-accent/40 rounded-2xl overflow-hidden shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setPreviewPengurus(null)}
                className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full bg-[#02182b]/80 text-white/85 hover:text-white text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
              <div className="aspect-[4/5] bg-[#04284d]">
                <Thumb src={previewPengurus.thumb} alt={previewPengurus.nama} className="w-full h-full" rounded="rounded-none" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold leading-tight">{previewPengurus.nama}</h3>
                <p className="mt-1 text-xs font-semibold text-accent">
                  {previewPengurus.jabatan} <span className="text-white/60 font-normal uppercase">/ {previewPengurus.kelompok}</span>
                </p>
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/10">
                  {previewPengurus.instagram ? (
                    <a href={socialUrl(previewPengurus.instagram, "https://instagram.com/")} target="_blank" rel="noopener noreferrer" className="text-center px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold">
                      Instagram
                    </a>
                  ) : (
                    <span className="text-center px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/30 text-xs">Instagram -</span>
                  )}
                  {previewPengurus.linkedin ? (
                    <a href={socialUrl(previewPengurus.linkedin, "https://linkedin.com/in/")} target="_blank" rel="noopener noreferrer" className="text-center px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold">
                      LinkedIn
                    </a>
                  ) : (
                    <span className="text-center px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/30 text-xs">LinkedIn -</span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom menu bar: menempel di bawah. Lingkaran hanya muncul saat hover atau di menu aktif. */}
      <nav
        aria-label="Menu admin"
        className="fixed bottom-0 inset-x-0 z-50 bg-[#073969]/95 backdrop-blur-md border-t border-[#164a78] pb-[env(safe-area-inset-bottom)]"
      >
        <ul className="mx-auto max-w-xl grid grid-cols-5">
          {MENU.map((m) => {
            const Icon = m.icon;
            const active = activeMenu === m.id;
            return (
              <li key={m.id}>
                <button
                  type="button"
                  aria-current={active ? "page" : undefined}
                  onClick={() => {
                    setActiveMenu(m.id);
                    scrollTop();
                  }}
                  className="group w-full flex flex-col items-center gap-0.5 py-2 cursor-pointer focus-visible:outline-none"
                >
                  <span
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
                      active
                        ? "bg-accent text-[#043761]"
                        : "text-white/60 group-hover:bg-white/10 group-hover:text-white group-focus-visible:bg-white/10"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className={`text-[11px] ${active ? "text-accent font-bold" : "text-white/60 group-hover:text-white"}`}>
                    {m.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {modal}
    </motion.div>
  );
}
