import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import supabase from "../../supabase-client";
import pengurusData from "../../data/pengurusData";

import LogoHimsika from "../../assets/logo/HIMSIKA.png";
import {
  LogOut,
  Plus,
  Edit3,
  X,
  Trophy,
  FileText,
  Gift,
  CheckCircle2,
  MessageCircle,
  Trash2,
  Sparkles,
  Award,
  Image as ImageIcon,
  Users,
  Menu,
  Upload,
  Loader2,
  Eye,
  Grid,
  List,
  ExternalLink,
  Calendar,
  Flame,
  Search,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";

// Modal Popup Kustom (Sesuai Permintaan: Bersih, Tanpa Emoji dan Tanpa SVG)
function CustomModal({
  isOpen,
  type = "alert", // "alert" | "confirm"
  title,
  message,
  confirmText = "Mengerti",
  cancelText = "Batal",
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#02182b]/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#073969] border border-[#164a78] rounded-2xl p-6 sm:p-7 shadow-2xl text-white">
        <h3 className="text-base sm:text-lg font-bold tracking-tight mb-2 text-white">
          {title || (type === "confirm" ? "Konfirmasi Tindakan" : "Pemberitahuan Sistem")}
        </h3>
        <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-6 whitespace-pre-line">
          {message}
        </p>
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
          {type === "confirm" && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 text-xs font-semibold transition-all cursor-pointer"
            >
              {cancelText || "Batal"}
            </button>
          )}
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              type === "confirm"
                ? "bg-red-500 hover:bg-red-600 text-white shadow-sm"
                : "bg-accent hover:bg-[#ffcf33] text-[#043761] font-extrabold shadow-sm"
            }`}
          >
            {confirmText || "Mengerti"}
          </button>
        </div>
      </div>
    </div>
  );
}

const AVAILABLE_CATEGORIES = [
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

function ImageUploadField({ label, value, onChange, placeholder = "https://... atau klik Upload Foto", onAlert }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef(null);

  const notify = (msg, title) => {
    if (onAlert) onAlert(msg, title);
    else alert(msg);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      notify("Ukuran gambar maksimal adalah 5 MB. Silakan pilih berkas yang lebih kecil.", "Validasi Ukuran");
      return;
    }

    try {
      setUploading(true);
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filePath = `uploads/${Date.now()}-${cleanFileName}`;

      const { data, error } = await supabase.storage
        .from("himsika-assets")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        if (error.message?.toLowerCase().includes("bucket not found")) {
          try {
            await supabase.storage.createBucket("himsika-assets", { public: true });
            const retry = await supabase.storage
              .from("himsika-assets")
              .upload(filePath, file, { cacheControl: "3600", upsert: true });
            if (!retry.error) {
              const { data: retryUrl } = supabase.storage
                .from("himsika-assets")
                .getPublicUrl(filePath);
              if (retryUrl?.publicUrl) {
                onChange(retryUrl.publicUrl);
                return;
              }
            }
          } catch (_) {}
          notify(
            "Bucket 'himsika-assets' belum dibuat di menu Storage Supabase. Anda masih bisa memasukkan URL foto secara langsung di kolom teks!",
            "Pemberitahuan Penyimpanan"
          );
        } else {
          notify("Gagal mengunggah foto: " + error.message, "Gagal Unggah");
        }
        return;
      }

      const { data: urlData } = supabase.storage
        .from("himsika-assets")
        .getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        onChange(urlData.publicUrl);
      }
    } catch (err) {
      notify("Terjadi kesalahan saat upload: " + err.message, "Kesalahan Sistem");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-white/80 tracking-wide">
          {label}
        </label>
        <span className="text-[10px] text-accent font-semibold tracking-wider">
          Upload File atau Masukkan URL
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder={placeholder}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-[#04284d] border border-[#164a78] rounded-xl px-4 py-2.5 text-white text-xs sm:text-sm focus:border-accent focus:ring-1 focus:ring-accent/40 focus:outline-none transition-all placeholder:text-white/30"
        />

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />

        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2.5 bg-[#163b70] hover:bg-[#1f4e8f] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 border border-white/10 transition-all cursor-pointer shrink-0 disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
              <span>Mengunggah...</span>
            </>
          ) : (
            <>
              <Upload className="w-3.5 h-3.5 text-accent" />
              <span>Upload Foto</span>
            </>
          )}
        </button>
      </div>

      {value && (
        <div className="flex items-center gap-3 p-2.5 bg-[#04284d]/90 border border-[#164a78] rounded-xl max-w-full">
          <img
            src={value}
            alt="Preview"
            className="w-12 h-12 object-cover rounded-lg border border-white/10 shrink-0 bg-white/5"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-bold text-accent flex items-center gap-1 truncate">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              Foto Terhubung
            </span>
            <span className="text-[10px] text-white/50 block truncate">
              {value}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors cursor-pointer shrink-0"
            title="Hapus foto"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [activeMenu, setActiveMenu] = useState("lomba");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modal State & Handlers (Tanpa Emoji & Tanpa SVG)
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "alert",
    confirmText: "Mengerti",
    cancelText: "Batal",
    onConfirm: null,
  });

  const showAlert = (message, title = "Pemberitahuan Sistem") => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      type: "alert",
      confirmText: "Mengerti",
      cancelText: "",
      onConfirm: () => setModalConfig((prev) => ({ ...prev, isOpen: false })),
    });
  };

  const showConfirm = (message, onConfirmAction, title = "Konfirmasi Tindakan") => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      type: "confirm",
      confirmText: "Lanjutkan",
      cancelText: "Batal",
      onConfirm: () => {
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
        if (onConfirmAction) onConfirmAction();
      },
    });
  };

  // States Lomba
  const [lombaList, setLombaList] = useState([]);
  const [loadingLomba, setLoadingLomba] = useState(false);
  const [editingLombaId, setEditingLombaId] = useState(null);
  const [formDataLomba, setFormDataLomba] = useState({
    title: "",
    organizer: "",
    description: "",
    deadline_pendaftaran: "",
    deadline_pengumpulan: "",
    benefit: "",
    categories: [],
    deadline_timestamp: "",
    registration_url: "",
    guidebook_url: "",
    instagram_url: "",
    contacts: [],
  });

  // States Artikel (Pencarian, Filter, Pagination, & Hot Article)
  const [artikelList, setArtikelList] = useState([]);
  const [loadingArtikel, setLoadingArtikel] = useState(false);
  const [editingArtikelId, setEditingArtikelId] = useState(null);
  const [artikelSearch, setArtikelSearch] = useState("");
  const [artikelCategoryFilter, setArtikelCategoryFilter] = useState("Semua");
  const [artikelPage, setArtikelPage] = useState(1);
  const ARTIKEL_PER_PAGE = 8;

  const [formDataArtikel, setFormDataArtikel] = useState({
    title: "",
    category: "Berita",
    date: "",
    author: "Divisi Kominfo",
    image: "",
    excerpt: "",
    content: "",
    is_hot: false,
  });

  // States Prestasi
  const [prestasiList, setPrestasiList] = useState([]);
  const [loadingPrestasi, setLoadingPrestasi] = useState(false);
  const [editingPrestasiId, setEditingPrestasiId] = useState(null);
  const [formDataPrestasi, setFormDataPrestasi] = useState({
    judul: "",
    peringkat: "Juara 1",
    pemenang: "",
    gambar: "",
    instagram_url: "",
  });

  // States Galeri
  const [galeriList, setGaleriList] = useState([]);
  const [loadingGaleri, setLoadingGaleri] = useState(false);
  const [editingGaleriId, setEditingGaleriId] = useState(null);
  const [formDataGaleri, setFormDataGaleri] = useState({
    album: "Divisi Kominfo",
    foto: "",
    caption: "",
  });

  // States Pengurus
  const [pengurusList, setPengurusList] = useState([]);
  const [loadingPengurus, setLoadingPengurus] = useState(false);
  const [editingPengurusId, setEditingPengurusId] = useState(null);
  const [pengurusViewMode, setPengurusViewMode] = useState("cards");
  const [previewPengurusModal, setPreviewPengurusModal] = useState(null);
  const [formDataPengurus, setFormDataPengurus] = useState({
    nama: "",
    jabatan: "",
    kelompok: "bph",
    foto: "",
    instagram: "",
    linkedin: "",
  });

  // Helpers
  const parseCategories = (cat) => {
    if (Array.isArray(cat)) {
      return cat
        .map((c) => String(c).replace(/["']/g, "").replace(/\\/g, "").trim())
        .filter(Boolean);
    }
    if (typeof cat === "string") {
      return cat
        .replace(/[\[\]{}]/g, "")
        .split(",")
        .map((c) => c.replace(/["']/g, "").replace(/\\/g, "").trim())
        .filter(Boolean);
    }
    return [];
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchAllData();
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchAllData();
    });
    return () => subscription.unsubscribe();
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
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) showAlert("Gagal masuk: " + error.message, "Autentikasi Gagal");
    else {
      setEmail("");
      setPassword("");
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => await supabase.auth.signOut();

  // ==================== 1. CRUD LOMBA ====================
  const fetchLomba = async () => {
    setLoadingLomba(true);
    const { data, error } = await supabase
      .from("lomba")
      .select("*")
      .order("id", { ascending: false });
    if (!error && data) setLombaList(data);
    setLoadingLomba(false);
  };

  const handleLombaSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: formDataLomba.title,
      organizer: formDataLomba.organizer,
      description: formDataLomba.description,
      deadline_pendaftaran: formDataLomba.deadline_pendaftaran,
      deadline_pengumpulan: formDataLomba.deadline_pengumpulan,
      benefit: formDataLomba.benefit,
      categories: formDataLomba.categories,
      deadline_timestamp: formDataLomba.deadline_timestamp
        ? Number(formDataLomba.deadline_timestamp)
        : null,
      registration_url: formDataLomba.registration_url,
      guidebook_url: formDataLomba.guidebook_url,
      instagram_url: formDataLomba.instagram_url,
      contacts: formDataLomba.contacts,
    };

    if (editingLombaId) {
      const { error } = await supabase
        .from("lomba")
        .update(payload)
        .eq("id", editingLombaId);
      if (error) showAlert("Gagal memperbarui info lomba: " + error.message, "Kendala Sistem");
      else {
        showAlert("Data info lomba berhasil diperbarui.", "Berhasil");
        resetLombaForm();
        fetchLomba();
      }
    } else {
      const { error } = await supabase.from("lomba").insert([payload]);
      if (error) showAlert("Gagal menambahkan info lomba: " + error.message, "Kendala Sistem");
      else {
        showAlert("Data info lomba baru berhasil ditambahkan ke database.", "Berhasil");
        resetLombaForm();
        fetchLomba();
      }
    }
  };

  const handleLombaDelete = (id) => {
    showConfirm(
      "Apakah Anda yakin ingin menghapus data info lomba ini secara permanen dari database?",
      async () => {
        const { error } = await supabase.from("lomba").delete().eq("id", id);
        if (error) showAlert("Gagal menghapus data lomba: " + error.message, "Kendala Sistem");
        else fetchLomba();
      }
    );
  };

  const resetLombaForm = () => {
    setEditingLombaId(null);
    setFormDataLomba({
      title: "",
      organizer: "",
      description: "",
      deadline_pendaftaran: "",
      deadline_pengumpulan: "",
      benefit: "",
      categories: [],
      deadline_timestamp: "",
      registration_url: "",
      guidebook_url: "",
      instagram_url: "",
      contacts: [],
    });
  };

  // ==================== 2. CRUD ARTIKEL ====================
  const fetchArtikel = async () => {
    setLoadingArtikel(true);
    const { data, error } = await supabase
      .from("artikel")
      .select("*")
      .order("id", { ascending: false });
    if (!error && data) {
      setArtikelList(
        data.map((d) => ({
          ...d,
          is_hot: Boolean(d.is_hot || d.category === "Berita Utama"),
        }))
      );
    }
    setLoadingArtikel(false);
  };

  // ATURAN BERITA HOT: Tepat 1 Berita Hot (tidak boleh > 1, tidak boleh 0), tanpa reload flicker!
  const handleSetSingleHot = async (targetItem) => {
    // 1. Jika artikel ini sudah berstatus Hot, tidak boleh dihapus menjadi 0
    if (targetItem.is_hot) {
      showAlert(
        "Artikel ini sudah aktif sebagai Berita Hot Utama di Beranda.\n\nSistem memerlukan tepat 1 Berita Hot untuk ditampilkan di halaman Beranda. Untuk mengganti Berita Hot, silakan pilih tombol 'Set Hot' pada artikel lain yang Anda inginkan.",
        "Status Berita Hot"
      );
      return;
    }

    // 2. Pembaruan optimistik instan pada state React (Tanpa kedip loading / flicker unmount)
    setArtikelList((prev) =>
      prev.map((a) => ({
        ...a,
        is_hot: a.id === targetItem.id,
      }))
    );

    // 3. Sinkronisasi di latar belakang ke Supabase
    try {
      // Nonaktifkan hot di semua artikel selain yang dipilih
      await supabase
        .from("artikel")
        .update({ is_hot: false })
        .neq("id", targetItem.id);

      // Aktifkan hot pada artikel target
      let { error } = await supabase
        .from("artikel")
        .update({ is_hot: true })
        .eq("id", targetItem.id);

      if (error && error.message?.includes("is_hot")) {
        // Fallback untuk kolom category
        await supabase
          .from("artikel")
          .update({ category: "Berita" })
          .eq("category", "Berita Utama")
          .neq("id", targetItem.id);

        await supabase
          .from("artikel")
          .update({ category: "Berita Utama" })
          .eq("id", targetItem.id);
      }
    } catch (err) {
      console.warn("Gagal sinkronisasi Berita Hot ke Supabase:", err);
    }
  };

  const handleArtikelSubmit = async (e) => {
    e.preventDefault();
    let payload = {
      title: formDataArtikel.title,
      category: formDataArtikel.category,
      date: formDataArtikel.date || new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      datetime: new Date().toISOString().split("T")[0],
      author: formDataArtikel.author,
      image: formDataArtikel.image,
      excerpt: formDataArtikel.excerpt,
      content: formDataArtikel.content,
      is_hot: Boolean(formDataArtikel.is_hot),
    };

    if (editingArtikelId) {
      if (formDataArtikel.is_hot) {
        await supabase.from("artikel").update({ is_hot: false }).neq("id", editingArtikelId);
      }
      let { error } = await supabase
        .from("artikel")
        .update(payload)
        .eq("id", editingArtikelId);
      if (error && error.message?.includes("is_hot")) {
        delete payload.is_hot;
        if (formDataArtikel.is_hot) payload.category = "Berita Utama";
        const retry = await supabase.from("artikel").update(payload).eq("id", editingArtikelId);
        error = retry.error;
      }
      if (error) showAlert("Gagal memperbarui artikel: " + error.message, "Kendala Sistem");
      else {
        showAlert("Artikel berita berhasil diperbarui ke database.", "Berhasil");
        resetArtikelForm();
        fetchArtikel();
      }
    } else {
      let { error, data } = await supabase.from("artikel").insert([payload]).select();
      if (error && error.message?.includes("is_hot")) {
        delete payload.is_hot;
        if (formDataArtikel.is_hot) payload.category = "Berita Utama";
        const retry = await supabase.from("artikel").insert([payload]).select();
        error = retry.error;
        data = retry.data;
      }
      if (error) showAlert("Gagal menambahkan artikel baru: " + error.message, "Kendala Sistem");
      else {
        if (formDataArtikel.is_hot && data?.[0]?.id) {
          await supabase.from("artikel").update({ is_hot: false }).neq("id", data[0].id);
        }
        showAlert("Artikel berita baru berhasil diterbitkan ke database.", "Berhasil");
        resetArtikelForm();
        fetchArtikel();
      }
    }
  };

  const handleArtikelDelete = (id) => {
    showConfirm(
      "Apakah Anda yakin ingin menghapus artikel berita ini dari database secara permanen?",
      async () => {
        const itemToDelete = artikelList.find((a) => a.id === id);
        const { error } = await supabase.from("artikel").delete().eq("id", id);
        if (error) {
          showAlert("Gagal menghapus artikel: " + error.message, "Kendala Sistem");
        } else {
          // Jika artikel yang dihapus adalah Berita Hot, otomatis jadikan artikel berikutnya sebagai Hot
          if (itemToDelete?.is_hot && artikelList.length > 1) {
            const nextCandidate = artikelList.find((a) => a.id !== id);
            if (nextCandidate) {
              await supabase.from("artikel").update({ is_hot: true }).eq("id", nextCandidate.id);
            }
          }
          fetchArtikel();
        }
      }
    );
  };

  const resetArtikelForm = () => {
    setEditingArtikelId(null);
    setFormDataArtikel({
      title: "",
      category: "Berita",
      date: "",
      author: "Divisi Kominfo",
      image: "",
      excerpt: "",
      content: "",
      is_hot: false,
    });
  };

  // ==================== 3. CRUD PRESTASI ====================
  const fetchPrestasi = async () => {
    setLoadingPrestasi(true);
    const { data, error } = await supabase
      .from("prestasi")
      .select("*")
      .order("id", { ascending: false });
    if (!error && data) setPrestasiList(data);
    setLoadingPrestasi(false);
  };

  const handlePrestasiSubmit = async (e) => {
    e.preventDefault();
    const pemenangArray = formDataPrestasi.pemenang
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      judul: formDataPrestasi.judul,
      peringkat: formDataPrestasi.peringkat,
      pemenang: pemenangArray,
      gambar: formDataPrestasi.gambar,
      instagram_url: formDataPrestasi.instagram_url,
    };

    if (editingPrestasiId) {
      const { error } = await supabase
        .from("prestasi")
        .update(payload)
        .eq("id", editingPrestasiId);
      if (error) showAlert("Gagal memperbarui prestasi: " + error.message, "Kendala Sistem");
      else {
        showAlert("Data prestasi mahasiswa berhasil diperbarui.", "Berhasil");
        resetPrestasiForm();
        fetchPrestasi();
      }
    } else {
      const { error } = await supabase.from("prestasi").insert([payload]);
      if (error) showAlert("Gagal menambahkan prestasi: " + error.message, "Kendala Sistem");
      else {
        showAlert("Data prestasi baru berhasil ditambahkan.", "Berhasil");
        resetPrestasiForm();
        fetchPrestasi();
      }
    }
  };

  const handlePrestasiDelete = (id) => {
    showConfirm(
      "Apakah Anda yakin ingin menghapus data prestasi mahasiswa ini secara permanen?",
      async () => {
        const { error } = await supabase.from("prestasi").delete().eq("id", id);
        if (error) showAlert("Gagal menghapus prestasi: " + error.message, "Kendala Sistem");
        else fetchPrestasi();
      }
    );
  };

  const resetPrestasiForm = () => {
    setEditingPrestasiId(null);
    setFormDataPrestasi({
      judul: "",
      peringkat: "Juara 1",
      pemenang: "",
      gambar: "",
      instagram_url: "",
    });
  };

  // ==================== 4. CRUD GALERI ====================
  const fetchGaleri = async () => {
    setLoadingGaleri(true);
    const { data, error } = await supabase
      .from("galeri")
      .select("*")
      .order("id", { ascending: false });
    if (!error && data) setGaleriList(data);
    setLoadingGaleri(false);
  };

  const handleGaleriSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      album: formDataGaleri.album,
      album_slug: formDataGaleri.album.toLowerCase().replace(/\s+/g, "-"),
      foto: formDataGaleri.foto,
      caption: formDataGaleri.caption,
    };

    if (editingGaleriId) {
      const { error } = await supabase
        .from("galeri")
        .update(payload)
        .eq("id", editingGaleriId);
      if (error) showAlert("Gagal memperbarui foto galeri: " + error.message, "Kendala Sistem");
      else {
        showAlert("Foto galeri kegiatan berhasil diperbarui.", "Berhasil");
        resetGaleriForm();
        fetchGaleri();
      }
    } else {
      const { error } = await supabase.from("galeri").insert([payload]);
      if (error) showAlert("Gagal menambahkan foto galeri: " + error.message, "Kendala Sistem");
      else {
        showAlert("Foto galeri kegiatan baru berhasil ditambahkan.", "Berhasil");
        resetGaleriForm();
        fetchGaleri();
      }
    }
  };

  const handleGaleriDelete = (id) => {
    showConfirm(
      "Apakah Anda yakin ingin menghapus foto kegiatan ini dari galeri?",
      async () => {
        const { error } = await supabase.from("galeri").delete().eq("id", id);
        if (error) showAlert("Gagal menghapus foto galeri: " + error.message, "Kendala Sistem");
        else fetchGaleri();
      }
    );
  };

  const resetGaleriForm = () => {
    setEditingGaleriId(null);
    setFormDataGaleri({
      album: "Divisi Kominfo",
      foto: "",
      caption: "",
    });
  };

  // ==================== 5. CRUD PENGURUS ====================
  const fetchPengurus = async () => {
    setLoadingPengurus(true);
    const { data, error } = await supabase
      .from("pengurus")
      .select("*")
      .order("id", { ascending: true });
    if (!error && data) {
      const normalized = data.map((d) => {
        const fallback =
          pengurusData.find((p) => String(p.id) === String(d.id)) ||
          pengurusData.find(
            (p) => p.nama.toLowerCase() === d.nama.toLowerCase(),
          );
        return {
          ...d,
          foto: d.foto && d.foto.trim() ? d.foto.trim() : fallback?.foto || "",
          instagram: d.instagram || fallback?.instagram || "",
          linkedin: d.linkedin || fallback?.linkedin || "",
          angkatan: d.angkatan || fallback?.angkatan || "2023",
        };
      });
      setPengurusList(normalized);
    }
    setLoadingPengurus(false);
  };

  const handlePengurusSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      nama: formDataPengurus.nama,
      jabatan: formDataPengurus.jabatan,
      kelompok: formDataPengurus.kelompok,
      foto: formDataPengurus.foto,
      instagram: formDataPengurus.instagram,
      linkedin: formDataPengurus.linkedin,
    };

    if (editingPengurusId) {
      const { error } = await supabase
        .from("pengurus")
        .update(payload)
        .eq("id", editingPengurusId);
      if (error) showAlert("Gagal memperbarui data pengurus: " + error.message, "Kendala Sistem");
      else {
        showAlert("Data profil pengurus berhasil diperbarui.", "Berhasil");
        resetPengurusForm();
        fetchPengurus();
      }
    } else {
      const { error } = await supabase.from("pengurus").insert([payload]);
      if (error) showAlert("Gagal menambahkan pengurus baru: " + error.message, "Kendala Sistem");
      else {
        showAlert("Data pengurus baru berhasil ditambahkan ke database.", "Berhasil");
        resetPengurusForm();
        fetchPengurus();
      }
    }
  };

  const handlePengurusDelete = (id) => {
    showConfirm(
      "Apakah Anda yakin ingin menghapus data profil pengurus ini secara permanen?",
      async () => {
        const { error } = await supabase.from("pengurus").delete().eq("id", id);
        if (error) showAlert("Gagal menghapus pengurus: " + error.message, "Kendala Sistem");
        else fetchPengurus();
      }
    );
  };

  const resetPengurusForm = () => {
    setEditingPengurusId(null);
    setFormDataPengurus({
      nama: "",
      jabatan: "",
      kelompok: "bph",
      foto: "",
      instagram: "",
      linkedin: "",
    });
  };

  // Background
  const AmbientBackground = () => (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* Background polos elegan tanpa bulatan menyala */}
      <div className="absolute inset-0 bg-linear-to-b from-[#043761] via-[#032d52] to-[#02182b] opacity-90"></div>
    </div>
  );

  // LOGIN SCREEN
  if (!session) {
    return (
      <div className="min-h-screen bg-[#043761] flex items-center justify-center p-4 font-primary text-white relative overflow-hidden">
        <AmbientBackground />

        <div className="w-full max-w-md bg-[#073969] border border-[#164a78] p-8 sm:p-10 rounded-3xl shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center transition-transform hover:scale-105 duration-300 drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
              <img
                src={LogoHimsika}
                alt="Logo HIMSIKA"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent font-bold text-[11px] uppercase tracking-widest mb-3">
              Portal Resmi Administrator
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              HIMSIKA <span className="text-accent">Auth</span>
            </h1>
            <p className="text-xs text-white/60 mt-1.5">
              Masuk dengan akun email resmi pengurus HIMSIKA
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                Email Administrator
              </label>
              <input
                type="email"
                required
                placeholder="admin@himsika.unsika.ac.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#04284d] border border-[#164a78] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/40 text-sm transition-all placeholder:text-white/30"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                Kata Sandi
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#04284d] border border-[#164a78] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/40 text-sm transition-all placeholder:text-white/30"
              />
            </div>
            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 bg-accent text-[#043761] font-bold rounded-xl hover:bg-[#ffcf33] transition-all mt-3 text-sm shadow-[0_0_20px_rgba(255,195,0,0.25)] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Akun...</span>
                </>
              ) : (
                "Masuk ke Dashboard"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // DASHBOARD UTAMA
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-linear-to-b from-[#043761] via-[#032d52] to-[#02182b] font-primary relative text-white"
    >
      <AmbientBackground />

      {/* TOP HEADER BAR */}
      <header className="sticky top-0 z-40 bg-[#073969]/90 backdrop-blur-md border-b border-[#164a78] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center">
            <img
              src={LogoHimsika}
              alt="Logo HIMSIKA"
              className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-white tracking-tight">HIMSIKA</span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-accent/15 text-accent border border-accent/25">
                Admin Control
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-500/15 border border-red-500/30 text-red-300 hover:bg-red-600 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl w-full mx-auto pb-36">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-6 h-[2px] bg-accent rounded-full"></span>
            <span className="text-accent font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
              Database Management <Sparkles className="w-3.5 h-3.5" />
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight capitalize">
            Kelola <span className="text-accent">{activeMenu}</span>
          </h1>
        </div>

        {/* Quick Database Overview (Bersih, Rapi, Tanpa Status Koneksi / Akses) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {[
            { id: "lomba", label: "Lomba", count: lombaList.length, icon: Trophy },
            { id: "artikel", label: "Artikel", count: artikelList.length, icon: FileText },
            { id: "prestasi", label: "Prestasi", count: prestasiList.length, icon: Award },
            { id: "galeri", label: "Galeri", count: galeriList.length, icon: ImageIcon },
            { id: "pengurus", label: "Pengurus", count: pengurusList.length, icon: Users },
          ].map((item) => {
            const Icon = item.icon;
            const isCurrent = activeMenu === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                  isCurrent
                    ? "bg-[#0c4a85] border-accent/50 shadow-md scale-[1.02]"
                    : "bg-[#073969]/80 border-[#164a78] hover:border-white/20"
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isCurrent ? "bg-accent text-[#02182b]" : "bg-white/5 text-accent"
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-white/50 block truncate">
                    {item.label}
                  </span>
                  <span className="text-base sm:text-lg font-extrabold text-white">
                    {item.count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Animated Transition antar Modul CRUD */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMenu}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {/* ================= 1. MENU LOMBA ================= */}
            {activeMenu === "lomba" && (
            <div className="space-y-10">
              <section className="bg-[#073969] border border-[#164a78] rounded-3xl p-6 sm:p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
                    {editingLombaId ? <Edit3 className="w-4 h-4 text-accent" /> : <Plus className="w-4 h-4 text-accent" />}
                    {editingLombaId ? "Edit Info Lomba" : "Tambah Info Lomba Baru"}
                  </h2>
                  {editingLombaId && (
                    <button
                      type="button"
                      onClick={resetLombaForm}
                      className="text-xs font-bold text-white/60 hover:text-red-400 flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full cursor-pointer"
                    >
                      <X className="w-3 h-3" /> Batal
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Sisi Kiri: Form Input Lomba */}
                  <form onSubmit={handleLombaSubmit} className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-white/70 mb-1">Judul Lomba</label>
                      <input
                        type="text"
                        required
                        value={formDataLomba.title}
                        onChange={(e) => setFormDataLomba({ ...formDataLomba, title: e.target.value })}
                        className="w-full bg-[#04284d] border border-[#164a78] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/70 mb-1">Penyelenggara</label>
                      <input
                        type="text"
                        required
                        value={formDataLomba.organizer}
                        onChange={(e) => setFormDataLomba({ ...formDataLomba, organizer: e.target.value })}
                        className="w-full bg-[#04284d] border border-[#164a78] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-white/70 mb-1">Deskripsi</label>
                      <textarea
                        rows="3"
                        value={formDataLomba.description}
                        onChange={(e) => setFormDataLomba({ ...formDataLomba, description: e.target.value })}
                        className="w-full bg-[#04284d] border border-[#164a78] rounded-xl p-3 text-white text-sm focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/70 mb-1">Deadline Pendaftaran</label>
                      <input
                        type="text"
                        placeholder="Contoh: 15 November 2026"
                        value={formDataLomba.deadline_pendaftaran}
                        onChange={(e) => setFormDataLomba({ ...formDataLomba, deadline_pendaftaran: e.target.value })}
                        className="w-full bg-[#04284d] border border-[#164a78] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/70 mb-1">Deadline Pengumpulan</label>
                      <input
                        type="text"
                        placeholder="Contoh: 20 November 2026"
                        value={formDataLomba.deadline_pengumpulan}
                        onChange={(e) => setFormDataLomba({ ...formDataLomba, deadline_pengumpulan: e.target.value })}
                        className="w-full bg-[#04284d] border border-[#164a78] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-white/70 mb-1">Benefit / Hadiah</label>
                      <input
                        type="text"
                        value={formDataLomba.benefit}
                        onChange={(e) => setFormDataLomba({ ...formDataLomba, benefit: e.target.value })}
                        className="w-full bg-[#04284d] border border-[#164a78] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/70 mb-1">Link Pendaftaran (URL)</label>
                      <input
                        type="url"
                        value={formDataLomba.registration_url}
                        onChange={(e) => setFormDataLomba({ ...formDataLomba, registration_url: e.target.value })}
                        className="w-full bg-[#04284d] border border-[#164a78] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/70 mb-1">Link Guidebook (URL)</label>
                      <input
                        type="url"
                        value={formDataLomba.guidebook_url}
                        onChange={(e) => setFormDataLomba({ ...formDataLomba, guidebook_url: e.target.value })}
                        className="w-full bg-[#04284d] border border-[#164a78] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end pt-4 border-t border-white/10">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-accent text-[#02182b] font-bold rounded-full hover:bg-[#ffcf33] text-sm shadow-md cursor-pointer"
                      >
                        {editingLombaId ? "Simpan Perubahan Lomba" : "Tambah Lomba ke Database"}
                      </button>
                    </div>
                  </form>

                  {/* Sisi Kanan: Live Preview Card Lomba */}
                  <div className="lg:col-span-5 flex flex-col bg-[#04284d]/60 border border-[#164a78] rounded-2xl p-5 backdrop-blur-sm">
                    <div className="w-full flex items-center justify-between mb-3 px-1">
                      <span className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-accent" />
                        Live Preview Card
                      </span>
                    </div>

                    <div className="w-full rounded-2xl bg-[#073969] border border-[#164a78] p-5 shadow-lg flex flex-col text-left">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent/15 text-accent border border-accent/25">
                          Lomba & Beasiswa
                        </span>
                        {formDataLomba.deadline_pendaftaran && (
                          <span className="text-[11px] font-semibold text-white/60 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-accent" />
                            {formDataLomba.deadline_pendaftaran}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-white mb-1.5 line-clamp-2">
                        {formDataLomba.title || "Judul Kompetisi / Beasiswa Baru"}
                      </h3>
                      <p className="text-xs font-semibold text-accent mb-3">
                        {formDataLomba.organizer || "Penyelenggara Kegiatan"}
                      </p>

                      <p className="text-xs text-white/70 line-clamp-3 mb-4 leading-relaxed">
                        {formDataLomba.description || "Deskripsi lengkap mengenai lomba atau beasiswa akan tampil di sini secara terstruktur..."}
                      </p>

                      {formDataLomba.benefit && (
                        <div className="p-3 rounded-xl bg-[#04284d] border-l-2 border-accent text-xs text-white/85 mb-4">
                          <span className="font-bold text-accent mr-1">Hadiah/Benefit:</span>
                          {formDataLomba.benefit}
                        </div>
                      )}

                      <div className="mt-auto pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-accent">
                        <span>Lihat detail lomba →</span>
                        {formDataLomba.registration_url && (
                          <span className="text-[10px] text-white/40">Link Aktif</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Tabel Lomba */}
              <section className="bg-[#073969] border border-[#164a78] rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-5 border-b border-[#164a78] flex justify-between items-center">
                  <h3 className="font-bold text-white">Daftar Lomba di Database</h3>
                  <span className="text-xs text-accent font-bold px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                    {lombaList.length} Entri
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-white/50 text-xs">
                        <th className="p-4">Judul & Penyelenggara</th>
                        <th className="p-4">Deadline</th>
                        <th className="p-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {loadingLomba ? (
                        <tr><td colSpan="3" className="p-8 text-center text-white/40">Memuat data...</td></tr>
                      ) : lombaList.length === 0 ? (
                        <tr><td colSpan="3" className="p-8 text-center text-white/40">Belum ada data lomba di database.</td></tr>
                      ) : (
                        lombaList.map((item) => (
                          <tr key={item.id} className="hover:bg-white/[0.03]">
                            <td className="p-4">
                              <p className="font-bold text-white">{item.title}</p>
                              <p className="text-xs text-white/60">{item.organizer}</p>
                            </td>
                            <td className="p-4 text-xs text-white/75">{item.deadline_pendaftaran || "-"}</td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => {
                                  setEditingLombaId(item.id);
                                  setFormDataLomba({
                                    title: item.title || "",
                                    organizer: item.organizer || "",
                                    description: item.description || "",
                                    deadline_pendaftaran: item.deadline_pendaftaran || "",
                                    deadline_pengumpulan: item.deadline_pengumpulan || "",
                                    benefit: item.benefit || "",
                                    categories: parseCategories(item.categories),
                                    deadline_timestamp: item.deadline_timestamp || "",
                                    registration_url: item.registration_url || "",
                                    guidebook_url: item.guidebook_url || "",
                                    instagram_url: item.instagram_url || "",
                                    contacts: Array.isArray(item.contacts) ? item.contacts : [],
                                  });
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="text-xs text-accent hover:underline mr-3 font-semibold cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleLombaDelete(item.id)}
                                className="text-xs text-red-400 hover:underline font-semibold cursor-pointer"
                              >
                                Hapus
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* ================= 2. MENU ARTIKEL ================= */}
          {activeMenu === "artikel" && (
            <div className="space-y-10">
              <section className="bg-[#073969] border border-[#164a78] rounded-3xl p-6 sm:p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
                    {editingArtikelId ? <Edit3 className="w-4 h-4 text-accent" /> : <Plus className="w-4 h-4 text-accent" />}
                    {editingArtikelId ? "Edit Artikel" : "Tulis Artikel Baru"}
                  </h2>
                  {editingArtikelId && (
                    <button
                      type="button"
                      onClick={resetArtikelForm}
                      className="text-xs font-bold text-white/60 hover:text-red-400 flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full cursor-pointer"
                    >
                      <X className="w-3 h-3" /> Batal
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Sisi Kiri: Form Input Artikel */}
                  <form onSubmit={handleArtikelSubmit} className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-white/70 mb-1">Judul Artikel</label>
                      <input
                        type="text"
                        required
                        value={formDataArtikel.title}
                        onChange={(e) => setFormDataArtikel({ ...formDataArtikel, title: e.target.value })}
                        className="w-full bg-[#04284d] border border-[#164a78] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/70 mb-1">Kategori</label>
                      <select
                        value={formDataArtikel.category}
                        onChange={(e) => setFormDataArtikel({ ...formDataArtikel, category: e.target.value })}
                        className="w-full bg-[#04284d] border border-[#164a78] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                      >
                        <option value="Berita">Berita</option>
                        <option value="Kegiatan">Kegiatan</option>
                        <option value="Opini">Opini</option>
                        <option value="Prestasi">Prestasi</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/70 mb-1">Penulis</label>
                      <input
                        type="text"
                        value={formDataArtikel.author}
                        onChange={(e) => setFormDataArtikel({ ...formDataArtikel, author: e.target.value })}
                        className="w-full bg-[#04284d] border border-[#164a78] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/70 mb-1">Tanggal Tampil</label>
                      <input
                        type="text"
                        placeholder="Contoh: 10 November 2026"
                        value={formDataArtikel.date}
                        onChange={(e) => setFormDataArtikel({ ...formDataArtikel, date: e.target.value })}
                        className="w-full bg-[#04284d] border border-[#164a78] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <ImageUploadField
                        label="Foto Sampul Artikel (Cover Image)"
                        value={formDataArtikel.image}
                        onChange={(val) => setFormDataArtikel({ ...formDataArtikel, image: val })}
                        placeholder="https://... atau klik tombol Upload Foto"
                        onAlert={showAlert}
                      />
                    </div>

                    {/* Pengaturan Berita Hot / Sorotan Beranda */}
                    <div className="md:col-span-2">
                      <label className="flex items-center gap-3 p-3.5 bg-[#04284d] border border-[#164a78] rounded-xl cursor-pointer hover:border-accent/40 transition-all select-none">
                        <input
                          type="checkbox"
                          checked={formDataArtikel.is_hot || false}
                          onChange={(e) => setFormDataArtikel({ ...formDataArtikel, is_hot: e.target.checked })}
                          className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                        />
                        <div>
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            🔥 Jadikan Berita Hot / Sorotan Utama di Beranda
                          </span>
                          <span className="text-[11px] text-white/50 block">
                            Tepat 1 artikel akan diprioritaskan tampil di kartu besar sebelah kiri pada halaman Beranda
                          </span>
                        </div>
                      </label>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-white/70 mb-1">Ringkasan (Excerpt)</label>
                      <textarea
                        rows="2"
                        value={formDataArtikel.excerpt}
                        onChange={(e) => setFormDataArtikel({ ...formDataArtikel, excerpt: e.target.value })}
                        className="w-full bg-[#04284d] border border-[#164a78] rounded-xl p-3 text-white text-sm focus:border-accent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-white/70 mb-1">Konten Artikel (Teks atau HTML sederhana)</label>
                      <textarea
                        rows="5"
                        required
                        value={formDataArtikel.content}
                        onChange={(e) => setFormDataArtikel({ ...formDataArtikel, content: e.target.value })}
                        placeholder="Tuliskan isi artikel di sini..."
                        className="w-full bg-[#04284d] border border-[#164a78] rounded-xl p-3 text-white text-sm focus:border-accent"
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end pt-4 border-t border-white/10">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-accent text-[#02182b] font-bold rounded-full hover:bg-[#ffcf33] text-sm shadow-md cursor-pointer"
                      >
                        {editingArtikelId ? "Simpan Perubahan Artikel" : "Terbitkan Artikel ke Database"}
                      </button>
                    </div>
                  </form>

                  {/* Sisi Kanan: Live Preview Card Artikel */}
                  <div className="lg:col-span-5 flex flex-col bg-[#04284d]/60 border border-[#164a78] rounded-2xl p-5 backdrop-blur-sm">
                    <div className="w-full flex items-center justify-between mb-3 px-1">
                      <span className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-accent" />
                        Live Preview Card
                      </span>
                    </div>

                    <div className="w-full rounded-2xl bg-[#073969] border border-[#164a78] overflow-hidden shadow-lg flex flex-col text-left">
                      <div className="aspect-[16/10] w-full bg-[#03233f] relative overflow-hidden flex items-center justify-center">
                        {formDataArtikel.image ? (
                          <img
                            src={formDataArtikel.image}
                            alt="Cover"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-white/30">
                            <FileText className="w-10 h-10 mb-1" />
                            <span className="text-[11px]">Sampul Artikel</span>
                          </div>
                        )}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className="px-3 py-1 bg-accent/90 text-slate-900 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
                            {formDataArtikel.category || "Berita"}
                          </span>
                          {formDataArtikel.is_hot && (
                            <span className="px-2.5 py-1 bg-red-500 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-lg shadow-sm flex items-center gap-1">
                              <Flame className="w-3 h-3 fill-white" /> Hot
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-5 flex flex-col flex-1">
                        <span className="text-accent text-[11px] font-bold mb-2 block tracking-wider uppercase">
                          {formDataArtikel.date || "16 November 2026"} • {formDataArtikel.author || "Divisi Kominfo"}
                        </span>
                        <h3 className="text-base font-extrabold text-white leading-snug line-clamp-2 mb-2">
                          {formDataArtikel.title || "Judul Artikel atau Berita Baru HIMSIKA"}
                        </h3>
                        <p className="text-xs text-white/70 line-clamp-3 mb-4 leading-relaxed">
                          {formDataArtikel.excerpt || "Ringkasan pengantar artikel berita akan muncul di sini agar pembaca tertarik membaca selengkapnya..."}
                        </p>
                        <div className="mt-auto pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-accent">
                          <span>Baca Selengkapnya →</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Tabel Artikel (Rapi, Spotlight Berita Hot, Filter & Pagination) */}
              <section className="bg-[#073969] border border-[#164a78] rounded-3xl p-5 sm:p-7 shadow-2xl">
                {/* 1. Spotlight Card Berita Hot Aktif */}
                {(() => {
                  const currentHot = artikelList.find((a) => a.is_hot) || artikelList.find((a) => a.category === "Berita Utama");
                  if (!currentHot) return null;
                  return (
                    <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-linear-to-r from-[#0d3b66] via-[#073969] to-[#04284d] border border-accent/40 shadow-xl relative overflow-hidden">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-[#03233f] border border-white/10">
                            {currentHot.image ? (
                              <img
                                src={currentHot.image}
                                alt={currentHot.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white/30">
                                <FileText className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-500 text-white uppercase tracking-wider flex items-center gap-1 shadow-sm">
                                <Flame className="w-3 h-3 fill-white" /> Berita Hot Aktif
                              </span>
                              <span className="text-[10px] text-accent font-bold uppercase tracking-wider">
                                {currentHot.category} • Sedang Tayang di Headline Beranda Utama
                              </span>
                            </div>
                            <h4 className="text-sm sm:text-base font-extrabold text-white truncate" title={currentHot.title}>
                              {currentHot.title}
                            </h4>
                            <p className="text-xs text-white/60 line-clamp-1 mt-0.5">
                              {currentHot.date} • Ditulis oleh {currentHot.author}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingArtikelId(currentHot.id);
                            setFormDataArtikel({
                              title: currentHot.title || "",
                              category: currentHot.category || "Berita",
                              date: currentHot.date || "",
                              author: currentHot.author || "Divisi Kominfo",
                              image: currentHot.image || "",
                              excerpt: currentHot.excerpt || "",
                              content: typeof currentHot.content === "string" ? currentHot.content : JSON.stringify(currentHot.content),
                              is_hot: true,
                            });
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="px-4 py-2 rounded-xl bg-accent/20 hover:bg-accent text-accent hover:text-[#043761] border border-accent/40 text-xs font-bold transition-all shrink-0 cursor-pointer"
                        >
                          Edit Berita Hot
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* 2. Controls: Search Input & Category Pills */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-5">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari judul atau ringkasan berita..."
                      value={artikelSearch}
                      onChange={(e) => {
                        setArtikelSearch(e.target.value);
                        setArtikelPage(1);
                      }}
                      className="w-full pl-10 pr-9 py-2.5 bg-[#04284d] border border-[#164a78] rounded-xl text-xs sm:text-sm text-white placeholder:text-white/40 focus:border-accent focus:outline-none"
                    />
                    {artikelSearch && (
                      <button
                        type="button"
                        onClick={() => {
                          setArtikelSearch("");
                          setArtikelPage(1);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                    {["Semua", "Berita", "Kegiatan", "Opini", "Prestasi"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setArtikelCategoryFilter(cat);
                          setArtikelPage(1);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          artikelCategoryFilter === cat
                            ? "bg-accent text-[#043761]"
                            : "bg-[#04284d] text-white/70 hover:text-white border border-[#164a78]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Paginated Articles Table */}
                {(() => {
                  const searchLower = artikelSearch.toLowerCase();
                  const filtered = artikelList.filter((item) => {
                    const matchSearch =
                      !artikelSearch ||
                      item.title?.toLowerCase().includes(searchLower) ||
                      item.excerpt?.toLowerCase().includes(searchLower) ||
                      item.author?.toLowerCase().includes(searchLower);
                    const matchCat =
                      artikelCategoryFilter === "Semua" || item.category === artikelCategoryFilter;
                    return matchSearch && matchCat;
                  });

                  const totalPages = Math.ceil(filtered.length / ARTIKEL_PER_PAGE) || 1;
                  const currentPage = Math.min(artikelPage, totalPages);
                  const startIndex = (currentPage - 1) * ARTIKEL_PER_PAGE;
                  const currentItems = filtered.slice(startIndex, startIndex + ARTIKEL_PER_PAGE);

                  return (
                    <div>
                      <div className="overflow-x-auto rounded-2xl border border-[#164a78]">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="border-b border-white/10 bg-[#04284d]/60 text-white/50 text-xs">
                              <th className="p-3.5 sm:p-4">Judul & Kategori</th>
                              <th className="p-3.5 sm:p-4">Penulis & Tanggal</th>
                              <th className="p-3.5 sm:p-4 text-right">Aksi & Berita Hot</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 bg-[#073969]/50">
                            {loadingArtikel ? (
                              <tr>
                                <td colSpan="3" className="p-8 text-center text-white/40">
                                  Memuat daftar artikel...
                                </td>
                              </tr>
                            ) : currentItems.length === 0 ? (
                              <tr>
                                <td colSpan="3" className="p-8 text-center text-white/40">
                                  {artikelSearch || artikelCategoryFilter !== "Semua"
                                    ? "Tidak ada artikel yang cocok dengan pencarian atau filter."
                                    : "Belum ada artikel tersimpan di database."}
                                </td>
                              </tr>
                            ) : (
                              currentItems.map((item) => (
                                <tr key={item.id} className="hover:bg-white/[0.04] transition-colors">
                                  <td className="p-3.5 sm:p-4 max-w-xs sm:max-w-md">
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="font-bold text-white line-clamp-1">{item.title}</p>
                                      {item.is_hot && (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-500/20 text-red-300 border border-red-500/30 shrink-0 flex items-center gap-1">
                                          <Flame className="w-3 h-3 text-red-400 fill-red-400" /> HOT
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[10px] font-bold text-accent uppercase tracking-wider">
                                      {item.category}
                                    </span>
                                  </td>
                                  <td className="p-3.5 sm:p-4 text-xs text-white/70 whitespace-nowrap">
                                    <p className="font-medium text-white/90">{item.author}</p>
                                    <p className="text-white/40">{item.date}</p>
                                  </td>
                                  <td className="p-3.5 sm:p-4 text-right whitespace-nowrap">
                                    <button
                                      type="button"
                                      onClick={() => handleSetSingleHot(item)}
                                      title={item.is_hot ? "Artikel ini sudah berstatus Hot Utama" : "Jadikan satu-satunya Berita Hot di Beranda"}
                                      className={`text-xs px-3 py-1.5 rounded-xl font-bold mr-2 transition-all cursor-pointer ${
                                        item.is_hot
                                          ? "bg-red-500/25 text-red-300 border border-red-500/50 hover:bg-red-500/35 shadow-sm"
                                          : "bg-white/5 text-white/70 border border-white/10 hover:border-accent hover:text-accent"
                                      }`}
                                    >
                                      {item.is_hot ? "🔥 Hot Aktif" : "Set Hot"}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingArtikelId(item.id);
                                        setFormDataArtikel({
                                          title: item.title || "",
                                          category: item.category || "Berita",
                                          date: item.date || "",
                                          author: item.author || "Divisi Kominfo",
                                          image: item.image || "",
                                          excerpt: item.excerpt || "",
                                          content: typeof item.content === "string" ? item.content : JSON.stringify(item.content),
                                          is_hot: Boolean(item.is_hot || item.category === "Berita Utama"),
                                        });
                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                      }}
                                      className="text-xs text-accent hover:underline mr-3 font-semibold cursor-pointer"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleArtikelDelete(item.id)}
                                      className="text-xs text-red-400 hover:underline font-semibold cursor-pointer"
                                    >
                                      Hapus
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* 4. Pagination Navigation Bar */}
                      {filtered.length > ARTIKEL_PER_PAGE && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-white/10 text-xs">
                          <span className="text-white/60 text-[11px]">
                            Menampilkan {startIndex + 1} - {Math.min(startIndex + ARTIKEL_PER_PAGE, filtered.length)} dari {filtered.length} artikel
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              disabled={currentPage <= 1}
                              onClick={() => setArtikelPage((p) => Math.max(1, p - 1))}
                              className="px-2.5 py-1.5 rounded-lg bg-[#04284d] border border-[#164a78] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10 flex items-center gap-1 cursor-pointer"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Sebelumnya</span>
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                              <button
                                key={num}
                                type="button"
                                onClick={() => setArtikelPage(num)}
                                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  currentPage === num
                                    ? "bg-accent text-[#043761]"
                                    : "bg-[#04284d] text-white/70 hover:text-white border border-[#164a78]"
                                }`}
                              >
                                {num}
                              </button>
                            ))}

                            <button
                              type="button"
                              disabled={currentPage >= totalPages}
                              onClick={() => setArtikelPage((p) => Math.min(totalPages, p + 1))}
                              className="px-2.5 py-1.5 rounded-lg bg-[#04284d] border border-[#164a78] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10 flex items-center gap-1 cursor-pointer"
                            >
                              <span className="hidden sm:inline">Selanjutnya</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </section>
            </div>
          )}

          {/* ================= 3. MENU PRESTASI ================= */}
          {activeMenu === "prestasi" && (
            <div className="space-y-10">
              <section className="bg-[#073969] border border-[#164a78] rounded-3xl p-6 sm:p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
                    {editingPrestasiId ? <Edit3 className="w-4 h-4 text-accent" /> : <Plus className="w-4 h-4 text-accent" />}
                    {editingPrestasiId ? "Edit Prestasi" : "Tambah Prestasi Baru"}
                  </h2>
                  {editingPrestasiId && (
                    <button
                      type="button"
                      onClick={resetPrestasiForm}
                      className="text-xs font-bold text-white/60 hover:text-red-400 flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full cursor-pointer"
                    >
                      <X className="w-3 h-3" /> Batal
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Sisi Kiri: Form Input Prestasi */}
                  <form onSubmit={handlePrestasiSubmit} className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-white/70 mb-1">Judul Kompetisi / Penghargaan</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: COMPFAIR 2024 Bidang UI/UX"
                        value={formDataPrestasi.judul}
                        onChange={(e) => setFormDataPrestasi({ ...formDataPrestasi, judul: e.target.value })}
                        className="w-full bg-[#04284d] border border-[#164a78] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/70 mb-1">Peringkat</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Juara 1, Juara 2, atau Finalis"
                        value={formDataPrestasi.peringkat}
                        onChange={(e) => setFormDataPrestasi({ ...formDataPrestasi, peringkat: e.target.value })}
                        className="w-full bg-[#04284d] border border-[#164a78] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <ImageUploadField
                        label="Foto / Poster Prestasi Mahasiswa"
                        value={formDataPrestasi.gambar}
                        onChange={(val) => setFormDataPrestasi({ ...formDataPrestasi, gambar: val })}
                        placeholder="https://... atau klik tombol Upload Foto"
                        onAlert={showAlert}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-white/70 mb-1">Link Instagram Post</label>
                      <input
                        type="url"
                        placeholder="https://www.instagram.com/p/..."
                        value={formDataPrestasi.instagram_url}
                        onChange={(e) => setFormDataPrestasi({ ...formDataPrestasi, instagram_url: e.target.value })}
                        className="w-full bg-[#04284d] border border-[#164a78] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-white/70 mb-1">Nama Pemenang (Satu nama per baris)</label>
                      <textarea
                        rows="3"
                        placeholder="Nama Mahasiswa 1 (NIM)&#10;Nama Mahasiswa 2 (NIM)"
                        value={formDataPrestasi.pemenang}
                        onChange={(e) => setFormDataPrestasi({ ...formDataPrestasi, pemenang: e.target.value })}
                        className="w-full bg-[#04284d] border border-[#164a78] rounded-xl p-3 text-white text-sm focus:border-accent"
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end pt-4 border-t border-white/10">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-accent text-[#02182b] font-bold rounded-full hover:bg-[#ffcf33] text-sm shadow-md cursor-pointer"
                      >
                        {editingPrestasiId ? "Simpan Perubahan Prestasi" : "Simpan Prestasi ke Database"}
                      </button>
                    </div>
                  </form>

                  {/* Sisi Kanan: Live Preview Card Prestasi */}
                  <div className="lg:col-span-5 flex flex-col bg-[#04284d]/60 border border-[#164a78] rounded-2xl p-5 backdrop-blur-sm">
                    <div className="w-full flex items-center justify-between mb-3 px-1">
                      <span className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-accent" />
                        Live Preview Card
                      </span>
                    </div>

                    <div className="w-full rounded-2xl bg-[#073969] border border-[#164a78] overflow-hidden shadow-lg flex flex-col text-left">
                      <div className="aspect-[16/10] w-full bg-[#03233f] relative overflow-hidden flex items-center justify-center">
                        {formDataPrestasi.gambar ? (
                          <img
                            src={formDataPrestasi.gambar}
                            alt="Prestasi"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-white/30">
                            <Award className="w-10 h-10 mb-1 text-accent/60" />
                            <span className="text-[11px]">Foto Prestasi / Piagam</span>
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 bg-accent/20 border border-accent/50 text-accent text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm">
                            {formDataPrestasi.peringkat || "Juara 1"}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-base font-bold text-white leading-snug mb-2">
                          {formDataPrestasi.judul || "Nama Kompetisi / Ajang Penghargaan"}
                        </h3>
                        <div className="mt-1 space-y-1 text-xs text-white/75 mb-4">
                          {formDataPrestasi.pemenang ? (
                            formDataPrestasi.pemenang
                              .split("\n")
                              .filter(Boolean)
                              .map((nama, idx) => (
                                <p key={idx} className="leading-relaxed font-medium">
                                  • {nama}
                                </p>
                              ))
                          ) : (
                            <p className="text-white/40 italic">Nama Mahasiswa / Tim Pemenang</p>
                          )}
                        </div>
                        <div className="mt-auto pt-3 border-t border-white/10 flex items-center justify-between">
                          <span className="text-[11px] text-white/50">Sistem Informasi UNSIKA</span>
                          {formDataPrestasi.instagram_url && (
                            <span className="text-xs font-bold text-accent flex items-center gap-1">
                              Instagram Post <ExternalLink className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Tabel Prestasi */}
              <section className="bg-[#073969] border border-[#164a78] rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-5 border-b border-[#164a78] flex justify-between items-center">
                  <h3 className="font-bold text-white">Daftar Prestasi di Database</h3>
                  <span className="text-xs text-accent font-bold px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                    {prestasiList.length} Entri
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-white/50 text-xs">
                        <th className="p-4">Kompetisi & Peringkat</th>
                        <th className="p-4">Pemenang</th>
                        <th className="p-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {loadingPrestasi ? (
                        <tr><td colSpan="3" className="p-8 text-center text-white/40">Memuat prestasi...</td></tr>
                      ) : prestasiList.length === 0 ? (
                        <tr><td colSpan="3" className="p-8 text-center text-white/40">Belum ada data prestasi di database.</td></tr>
                      ) : (
                        prestasiList.map((item) => (
                          <tr key={item.id} className="hover:bg-white/[0.03]">
                            <td className="p-4">
                              <p className="font-bold text-white">{item.judul}</p>
                              <span className="text-xs text-accent font-bold">{item.peringkat}</span>
                            </td>
                            <td className="p-4 text-xs text-white/70">
                              {Array.isArray(item.pemenang)
                                ? item.pemenang.join(", ")
                                : String(item.pemenang || "")}
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => {
                                  setEditingPrestasiId(item.id);
                                  setFormDataPrestasi({
                                    judul: item.judul || "",
                                    peringkat: item.peringkat || "Juara 1",
                                    pemenang: Array.isArray(item.pemenang)
                                      ? item.pemenang.join("\n")
                                      : String(item.pemenang || ""),
                                    gambar: item.gambar || "",
                                    instagram_url: item.instagram_url || "",
                                  });
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="text-xs text-accent hover:underline mr-3 font-semibold cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handlePrestasiDelete(item.id)}
                                className="text-xs text-red-400 hover:underline font-semibold cursor-pointer"
                              >
                                Hapus
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* ================= 4. MENU GALERI ================= */}
          {activeMenu === "galeri" && (
            <div className="space-y-10">
              <section className="bg-[#073969] border border-[#164a78] rounded-3xl p-6 sm:p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
                    {editingGaleriId ? <Edit3 className="w-4 h-4 text-accent" /> : <Plus className="w-4 h-4 text-accent" />}
                    {editingGaleriId ? "Edit Foto Galeri" : "Upload Foto Galeri Baru"}
                  </h2>
                  {editingGaleriId && (
                    <button
                      type="button"
                      onClick={resetGaleriForm}
                      className="text-xs font-bold text-white/60 hover:text-red-400 flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full cursor-pointer"
                    >
                      <X className="w-3 h-3" /> Batal
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Sisi Kiri: Form Input Galeri */}
                  <form onSubmit={handleGaleriSubmit} className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-white/70 mb-1">Album / Divisi</label>
                      <select
                        value={formDataGaleri.album}
                        onChange={(e) => setFormDataGaleri({ ...formDataGaleri, album: e.target.value })}
                        className="w-full bg-[#04284d] border border-[#164a78] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                      >
                        {ALBUM_OPTIONS.map((a) => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <ImageUploadField
                        label="Foto Dokumentasi Kegiatan *"
                        value={formDataGaleri.foto}
                        onChange={(val) => setFormDataGaleri({ ...formDataGaleri, foto: val })}
                        placeholder="https://... atau klik tombol Upload Foto"
                        onAlert={showAlert}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-white/70 mb-1">Keterangan / Caption (Opsional)</label>
                      <input
                        type="text"
                        placeholder="Dokumentasi kegiatan..."
                        value={formDataGaleri.caption}
                        onChange={(e) => setFormDataGaleri({ ...formDataGaleri, caption: e.target.value })}
                        className="w-full bg-[#04284d] border border-[#164a78] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end pt-4 border-t border-white/10">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-accent text-[#02182b] font-bold rounded-full hover:bg-[#ffcf33] text-sm shadow-md cursor-pointer"
                      >
                        {editingGaleriId ? "Simpan Perubahan Foto" : "Simpan Foto ke Database"}
                      </button>
                    </div>
                  </form>

                  {/* Sisi Kanan: Live Preview Card Galeri */}
                  <div className="lg:col-span-5 flex flex-col bg-[#04284d]/60 border border-[#164a78] rounded-2xl p-5 backdrop-blur-sm">
                    <div className="w-full flex items-center justify-between mb-3 px-1">
                      <span className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-accent" />
                        Live Preview Card
                      </span>
                    </div>

                    <div className="w-full rounded-2xl bg-[#073969] border border-[#164a78] overflow-hidden shadow-lg flex flex-col text-left">
                      <div className="aspect-[4/3] w-full bg-[#03233f] relative overflow-hidden flex items-center justify-center group">
                        {formDataGaleri.foto ? (
                          <img
                            src={formDataGaleri.foto}
                            alt="Dokumentasi"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-white/30">
                            <ImageIcon className="w-10 h-10 mb-1" />
                            <span className="text-[11px]">Foto Dokumentasi</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                          <span className="px-2.5 py-0.5 rounded-md bg-accent/20 border border-accent/40 text-accent text-[10px] font-bold uppercase w-fit mb-1">
                            {formDataGaleri.album || "Divisi Kominfo"}
                          </span>
                          <p className="text-xs text-white/90 font-medium line-clamp-2">
                            {formDataGaleri.caption || "Keterangan foto kegiatan mahasiswa..."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Tabel Galeri */}
              <section className="bg-[#073969] border border-[#164a78] rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-5 border-b border-[#164a78] flex justify-between items-center">
                  <h3 className="font-bold text-white">Daftar Foto di Database</h3>
                  <span className="text-xs text-accent font-bold px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                    {galeriList.length} Foto
                  </span>
                </div>
                <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {loadingGaleri ? (
                    <div className="col-span-full py-8 text-center text-white/40">Memuat galeri...</div>
                  ) : galeriList.length === 0 ? (
                    <div className="col-span-full py-8 text-center text-white/40">Belum ada foto galeri di database.</div>
                  ) : (
                    galeriList.map((item) => (
                      <div key={item.id} className="group relative rounded-2xl overflow-hidden border border-[#164a78] bg-[#04284d]">
                        <div className="aspect-[4/3] overflow-hidden">
                          <img src={item.foto} alt={item.album} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="p-3">
                          <p className="text-xs font-bold text-white truncate">{item.album}</p>
                          <div className="mt-2 flex justify-between items-center pt-2 border-t border-white/10">
                            <button
                              onClick={() => {
                                setEditingGaleriId(item.id);
                                setFormDataGaleri({
                                  album: item.album || "Divisi Kominfo",
                                  foto: item.foto || "",
                                  caption: item.caption || "",
                                });
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="text-xs text-accent hover:underline font-semibold cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleGaleriDelete(item.id)}
                              className="text-xs text-red-400 hover:underline font-semibold cursor-pointer"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          )}

          {/* ================= 5. MENU PENGURUS ================= */}
          {activeMenu === "pengurus" && (
            <div className="space-y-10">
              <section className="bg-[#073969] border border-[#164a78] rounded-3xl p-6 sm:p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
                    {editingPengurusId ? <Edit3 className="w-4 h-4 text-accent" /> : <Plus className="w-4 h-4 text-accent" />}
                    {editingPengurusId ? "Edit Pengurus" : "Tambah Pengurus / Profil Baru"}
                  </h2>
                  {editingPengurusId && (
                    <button
                      type="button"
                      onClick={resetPengurusForm}
                      className="text-xs font-bold text-white/60 hover:text-red-400 flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full cursor-pointer"
                    >
                      <X className="w-3 h-3" /> Batal
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Sisi Kiri: Form Input Pengurus */}
                  <form onSubmit={handlePengurusSubmit} className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-white/70 mb-1">Nama Lengkap</label>
                      <input
                        type="text"
                        required
                        placeholder="Nama Pengurus"
                        value={formDataPengurus.nama}
                        onChange={(e) => setFormDataPengurus({ ...formDataPengurus, nama: e.target.value })}
                        className="w-full bg-[#04284d] border border-[#164a78] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/70 mb-1">Jabatan</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Ketua Himpunan, Sekretaris, dll"
                        value={formDataPengurus.jabatan}
                        onChange={(e) => setFormDataPengurus({ ...formDataPengurus, jabatan: e.target.value })}
                        className="w-full bg-[#04284d] border border-[#164a78] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-white/70 mb-1">Kelompok / Bagian</label>
                      <select
                        value={formDataPengurus.kelompok}
                        onChange={(e) => setFormDataPengurus({ ...formDataPengurus, kelompok: e.target.value })}
                        className="w-full bg-[#04284d] border border-[#164a78] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                      >
                        {KELOMPOK_OPTIONS.map((k) => (
                          <option key={k.id} value={k.id}>{k.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <ImageUploadField
                        label="Foto Profil Formal Pengurus"
                        value={formDataPengurus.foto}
                        onChange={(val) => setFormDataPengurus({ ...formDataPengurus, foto: val })}
                        placeholder="https://... atau klik tombol Upload Foto"
                        onAlert={showAlert}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/70 mb-1">Instagram (Username atau URL)</label>
                      <input
                        type="text"
                        placeholder="username atau https://instagram.com/..."
                        value={formDataPengurus.instagram}
                        onChange={(e) => setFormDataPengurus({ ...formDataPengurus, instagram: e.target.value })}
                        className="w-full bg-[#04284d] border border-[#164a78] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/70 mb-1">LinkedIn (Username, slug, atau URL)</label>
                      <input
                        type="text"
                        placeholder="username atau https://linkedin.com/in/..."
                        value={formDataPengurus.linkedin}
                        onChange={(e) => setFormDataPengurus({ ...formDataPengurus, linkedin: e.target.value })}
                        className="w-full bg-[#04284d] border border-[#164a78] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                      />
                    </div>
                    <div className="sm:col-span-2 flex justify-end pt-4 border-t border-white/10">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-accent text-[#043761] font-black rounded-xl hover:bg-[#ffcf33] text-sm shadow-md cursor-pointer transition-all"
                      >
                        {editingPengurusId ? "Simpan Perubahan Pengurus" : "Simpan Pengurus ke Database"}
                      </button>
                    </div>
                  </form>

                  {/* Sisi Kanan: Live Interactive Web Preview Card */}
                  <div className="lg:col-span-5 flex flex-col items-center bg-[#04284d]/60 border border-[#164a78] rounded-2xl p-5 backdrop-blur-sm">
                    <div className="w-full flex items-center justify-between mb-3 px-1">
                      <span className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-accent" />
                        Live Preview Card
                      </span>
                    </div>

                    <div
                      onClick={() => setPreviewPengurusModal({
                        nama: formDataPengurus.nama || "Nama Lengkap Pengurus",
                        jabatan: formDataPengurus.jabatan || "Jabatan Pengurus",
                        kelompok: formDataPengurus.kelompok || "bph",
                        foto: formDataPengurus.foto || (editingPengurusId ? pengurusList.find((p) => p.id === editingPengurusId)?.foto : ""),
                        instagram: formDataPengurus.instagram,
                        linkedin: formDataPengurus.linkedin,
                        angkatan: "2023",
                      })}
                      className="w-full max-w-[270px] rounded-2xl overflow-hidden bg-[#073969] border border-accent/60 shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-pointer hover:scale-102 transition-transform duration-300 text-left flex flex-col group"
                    >
                      <div className="aspect-[4/5] overflow-hidden bg-[#02182b] relative">
                        {formDataPengurus.foto || (editingPengurusId && pengurusList.find((p) => p.id === editingPengurusId)?.foto) ? (
                          <img
                            src={formDataPengurus.foto || pengurusList.find((p) => p.id === editingPengurusId)?.foto}
                            alt="Preview Pengurus"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-linear-to-b from-[#04284d] to-[#073969] text-white/50">
                            <div className="w-14 h-14 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent mb-2">
                              <Users className="w-7 h-7" />
                            </div>
                            <span className="text-xs font-bold text-white/80">Foto Formal Pengurus</span>
                            <span className="text-[10px] text-white/40 mt-1">Upload atau masukkan link foto</span>
                          </div>
                        )}
                        <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-[#04284d]/90 backdrop-blur-xs border border-white/15 text-[10px] font-bold text-accent uppercase tracking-wider shadow-sm">
                          {formDataPengurus.kelompok.toUpperCase()}
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between bg-[#073969]">
                        <div>
                          <p className="text-sm font-bold text-white leading-snug group-hover:text-accent transition-colors">
                            {formDataPengurus.nama || "Nama Lengkap Pengurus"}
                          </p>
                          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-accent leading-snug">
                            {formDataPengurus.jabatan || "Jabatan Pengurus"}
                          </p>
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px]">
                          <span className="text-white/50 text-[10px] font-medium">
                            Angkatan 2023 • S1 SI
                          </span>
                          <div className="flex items-center gap-1.5 text-xs font-bold">
                            <span className={formDataPengurus.instagram ? "text-pink-400" : "text-white/20"}>IG</span>
                            <span className="text-white/20">•</span>
                            <span className={formDataPengurus.linkedin ? "text-blue-400" : "text-white/20"}>LI</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-white/50 text-center mt-3">
                      Klik kartu di atas untuk menguji popup detail anggota sebelum disimpan.
                    </p>
                  </div>
                </div>
              </section>

              {/* Daftar Pengurus: Mendukung Mode Grid Kartu Web dan Mode Tabel */}
              <section className="bg-[#073969] border border-[#164a78] rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-5 border-b border-[#164a78] flex flex-wrap gap-3 justify-between items-center">
                  <div>
                    <h3 className="font-bold text-white text-base">Daftar Pengurus di Database</h3>
                    <p className="text-xs text-white/50 mt-0.5">Semua profil pengurus yang aktif tampil di halaman web</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Toggle View Mode */}
                    <div className="flex items-center bg-[#04284d] border border-[#164a78] p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setPengurusViewMode("cards")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          pengurusViewMode === "cards"
                            ? "bg-accent text-[#043761] shadow-sm"
                            : "text-white/70 hover:text-white"
                        }`}
                      >
                        <Grid className="w-3.5 h-3.5" />
                        <span>Grid Kartu</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPengurusViewMode("table")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          pengurusViewMode === "table"
                            ? "bg-accent text-[#043761] shadow-sm"
                            : "text-white/70 hover:text-white"
                        }`}
                      >
                        <List className="w-3.5 h-3.5" />
                        <span>Tabel</span>
                      </button>
                    </div>

                    <span className="text-xs text-accent font-bold px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                      {pengurusList.length} Pengurus
                    </span>
                  </div>
                </div>

                {/* Mode 1: Grid Kartu Web (Sesuai Tampilan Asli Website) */}
                {pengurusViewMode === "cards" && (
                  <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {loadingPengurus ? (
                      <div className="col-span-full py-12 text-center text-white/50">Memuat data pengurus...</div>
                    ) : pengurusList.length === 0 ? (
                      <div className="col-span-full py-12 text-center text-white/50">Belum ada data pengurus di database.</div>
                    ) : (
                      pengurusList.map((item) => (
                        <div
                          key={item.id}
                          className="group rounded-2xl overflow-hidden bg-[#04284d]/80 border border-[#164a78] hover:border-accent/60 transition-all duration-300 shadow-lg flex flex-col justify-between"
                        >
                          <div className="aspect-[4/5] overflow-hidden bg-[#02182b] relative">
                            {item.foto ? (
                              <img
                                src={item.foto}
                                alt={item.nama}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-linear-to-b from-[#04284d] to-[#073969] text-white/50">
                                <Users className="w-8 h-8 text-accent/50 mb-1" />
                                <span className="text-[11px] font-semibold text-white/70">Foto Belum Ada</span>
                              </div>
                            )}
                            <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-[#04284d]/90 backdrop-blur-xs border border-white/15 text-[10px] font-bold text-accent uppercase tracking-wider shadow-sm">
                              {item.kelompok?.toUpperCase()}
                            </div>
                          </div>

                          <div className="p-3.5 flex-1 flex flex-col justify-between">
                            <div>
                              <p className="text-sm font-bold text-white leading-snug line-clamp-1">
                                {item.nama}
                              </p>
                              <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent leading-snug line-clamp-1">
                                {item.jabatan}
                              </p>
                            </div>
                            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() => setPreviewPengurusModal(item)}
                                className="text-[11px] text-white/70 hover:text-white flex items-center gap-1 font-semibold cursor-pointer"
                              >
                                <Eye className="w-3 h-3 text-accent" /> Detail
                              </button>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingPengurusId(item.id);
                                    setFormDataPengurus({
                                      nama: item.nama || "",
                                      jabatan: item.jabatan || "",
                                      kelompok: item.kelompok || "bph",
                                      foto: item.foto || "",
                                      instagram: item.instagram || "",
                                      linkedin: item.linkedin || "",
                                    });
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                  }}
                                  className="text-[11px] text-accent hover:underline font-bold cursor-pointer"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handlePengurusDelete(item.id)}
                                  className="text-[11px] text-red-400 hover:underline font-bold cursor-pointer"
                                >
                                  Hapus
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Mode 2: Tabel Pengurus Responsif dengan Thumbnail Foto Asli */}
                {pengurusViewMode === "table" && (
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left text-sm min-w-[650px]">
                      <thead>
                        <tr className="border-b border-white/10 text-white/50 text-xs">
                          <th className="p-4">Foto & Nama</th>
                          <th className="p-4">Kelompok</th>
                          <th className="p-4">Media Sosial</th>
                          <th className="p-4 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {loadingPengurus ? (
                          <tr><td colSpan="4" className="p-8 text-center text-white/40">Memuat pengurus...</td></tr>
                        ) : pengurusList.length === 0 ? (
                          <tr><td colSpan="4" className="p-8 text-center text-white/40">Belum ada data pengurus di database.</td></tr>
                        ) : (
                          pengurusList.map((item) => (
                            <tr key={item.id} className="hover:bg-white/[0.03]">
                              <td className="p-4 flex items-center gap-3">
                                {item.foto ? (
                                  <img src={item.foto} alt={item.nama} className="w-10 h-10 rounded-xl object-cover shrink-0 border border-white/20 shadow-sm" />
                                ) : (
                                  <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent font-bold flex items-center justify-center shrink-0">
                                    {item.nama.charAt(0)}
                                  </div>
                                )}
                                <div>
                                  <p className="font-bold text-white">{item.nama}</p>
                                  <p className="text-xs text-accent font-semibold">{item.jabatan}</p>
                                </div>
                              </td>
                              <td className="p-4 text-xs text-white/70 uppercase font-semibold">
                                {item.kelompok}
                              </td>
                              <td className="p-4 text-xs text-white/60">
                                <p>IG: {item.instagram || "-"}</p>
                                <p>LI: {item.linkedin || "-"}</p>
                              </td>
                              <td className="p-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => setPreviewPengurusModal(item)}
                                  className="text-xs text-white/80 hover:text-white mr-3 font-semibold cursor-pointer inline-flex items-center gap-1"
                                >
                                  <Eye className="w-3 h-3 text-accent" /> Preview
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingPengurusId(item.id);
                                    setFormDataPengurus({
                                      nama: item.nama || "",
                                      jabatan: item.jabatan || "",
                                      kelompok: item.kelompok || "bph",
                                      foto: item.foto || "",
                                      instagram: item.instagram || "",
                                      linkedin: item.linkedin || "",
                                    });
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                  }}
                                  className="text-xs text-accent hover:underline mr-3 font-semibold cursor-pointer"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handlePengurusDelete(item.id)}
                                  className="text-xs text-red-400 hover:underline font-semibold cursor-pointer"
                                >
                                  Hapus
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              {/* POPUP MODAL PREVIEW DETAIL PENGURUS (Identik dengan Web Publik) */}
              {previewPengurusModal && (
                <div
                  className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
                  onClick={() => setPreviewPengurusModal(null)}
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-[340px] bg-[#073969] border border-accent/40 rounded-2xl overflow-hidden shadow-2xl"
                  >
                    <button
                      onClick={() => setPreviewPengurusModal(null)}
                      type="button"
                      className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white/80 hover:text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#04284d]">
                      {previewPengurusModal.foto ? (
                        <img
                          src={previewPengurusModal.foto}
                          alt={previewPengurusModal.nama}
                          className="w-full h-full object-cover block"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-linear-to-b from-[#04284d] to-[#073969] text-white/50">
                          <Users className="w-12 h-12 text-accent/50 mb-2" />
                          <span className="text-xs font-bold text-white/80">Foto Belum Ditambahkan</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 sm:p-5 bg-[#073969]">
                      <span className="text-[10px] font-bold text-accent uppercase tracking-wider block mb-1">
                        Preview Modal Pengurus
                      </span>
                      <h3 className="text-lg font-bold text-white leading-tight">
                        {previewPengurusModal.nama}
                      </h3>
                      <p className="mt-1 text-xs font-semibold text-accent leading-snug">
                        {previewPengurusModal.jabatan} • <span className="text-white/70 font-normal uppercase">{previewPengurusModal.kelompok}</span>
                      </p>
                      <p className="mt-1 text-[11px] text-white/50">
                        Angkatan 2023 • S1 Sistem Informasi
                      </p>

                      <div className="grid grid-cols-2 gap-2 mt-4 pt-3.5 border-t border-white/10">
                        {previewPengurusModal.instagram ? (
                          <a
                            href={previewPengurusModal.instagram.startsWith("http") ? previewPengurusModal.instagram : `https://instagram.com/${previewPengurusModal.instagram.replace(/^@/, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-semibold transition-all"
                          >
                            <span>Instagram</span>
                            <ExternalLink className="w-3 h-3 text-white/50" />
                          </a>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/30 text-xs font-medium cursor-not-allowed">
                            <span>Instagram (-)</span>
                          </div>
                        )}

                        {previewPengurusModal.linkedin ? (
                          <a
                            href={previewPengurusModal.linkedin.startsWith("http") ? previewPengurusModal.linkedin : `https://linkedin.com/in/${previewPengurusModal.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-semibold transition-all"
                          >
                            <span>LinkedIn</span>
                            <ExternalLink className="w-3 h-3 text-white/50" />
                          </a>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/30 text-xs font-medium cursor-not-allowed">
                            <span>LinkedIn (-)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </main>

    {/* FLOATING BOTTOM DOCK NAVIGATION (Sesuai Referensi Gambar 1: White Pill Dock & Elevated Center Button) */}
    <nav className="fixed bottom-3 sm:bottom-5 inset-x-0 z-50 flex justify-center px-3 sm:px-4 pointer-events-none select-none">
      <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_16px_40px_rgba(0,0,0,0.38)] rounded-[32px] sm:rounded-full py-2 px-3 sm:px-6 flex items-center justify-between gap-1 sm:gap-4 max-w-full">
        {/* Kiri: 2 Menu (Lomba & Artikel) */}
        <div className="flex items-center gap-1 sm:gap-2">
          {[
            { id: "lomba", label: "Lomba", icon: Trophy, count: lombaList.length },
            { id: "artikel", label: "Artikel", icon: FileText, count: artikelList.length },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = activeMenu === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveMenu(item.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl font-bold transition-all text-xs cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-blue-50 text-blue-600 font-extrabold shadow-xs"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-blue-600" : "text-slate-400"}`} />
                <span className="text-[11px] sm:text-xs">{item.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tengah: Elevated Floating Button (Prestasi) */}
        <div className="relative -mt-6 sm:-mt-8 px-1 sm:px-2 flex flex-col items-center">
          <button
            type="button"
            onClick={() => {
              setActiveMenu("prestasi");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-linear-to-tr from-blue-600 via-blue-500 to-indigo-600 text-white shadow-[0_10px_24px_rgba(37,99,235,0.48)] flex items-center justify-center border-4 border-[#032d52] sm:border-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer relative ${
              activeMenu === "prestasi"
                ? "ring-4 ring-blue-400/50 scale-105"
                : ""
            }`}
            title={`Prestasi Mahasiswa (${prestasiList.length})`}
          >
            <Award className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="absolute -top-1 -right-1 bg-amber-400 text-[#02182b] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-white">
              {prestasiList.length}
            </span>
          </button>
          <span className={`text-[10px] font-extrabold mt-1 tracking-tight ${
            activeMenu === "prestasi" ? "text-blue-600" : "text-slate-500"
          }`}>
            Prestasi
          </span>
        </div>

        {/* Kanan: 2 Menu (Galeri & Pengurus) */}
        <div className="flex items-center gap-1 sm:gap-2">
          {[
            { id: "galeri", label: "Galeri", icon: ImageIcon, count: galeriList.length },
            { id: "pengurus", label: "Pengurus", icon: Users, count: pengurusList.length },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = activeMenu === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveMenu(item.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl font-bold transition-all text-xs cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-blue-50 text-blue-600 font-extrabold shadow-xs"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-blue-600" : "text-slate-400"}`} />
                <span className="text-[11px] sm:text-xs">{item.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>

    {/* Custom Modal Popup (Validasi & Konfirmasi Semua CRUD - Tanpa Emoji dan Tanpa SVG) */}
    <CustomModal
      isOpen={modalConfig.isOpen}
      type={modalConfig.type}
      title={modalConfig.title}
      message={modalConfig.message}
      confirmText={modalConfig.confirmText}
      cancelText={modalConfig.cancelText}
      onConfirm={modalConfig.onConfirm}
      onCancel={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
    />
  </motion.div>
  );
}
