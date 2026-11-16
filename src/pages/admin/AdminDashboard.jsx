import React, { useState, useEffect } from "react";
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
} from "lucide-react";

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

function ImageUploadField({ label, value, onChange, placeholder = "https://... atau klik Upload Foto" }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 5 MB!");
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
          alert("Bucket 'himsika-assets' belum aktif di Supabase Storage. Silakan buka menu Storage di Supabase dan buat bucket bernama 'himsika-assets' (centang Public), atau masukkan URL foto langsung!");
        } else {
          alert("Gagal mengunggah foto: " + error.message);
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
      alert("Terjadi kesalahan saat upload: " + err.message);
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

  // States Artikel
  const [artikelList, setArtikelList] = useState([]);
  const [loadingArtikel, setLoadingArtikel] = useState(false);
  const [editingArtikelId, setEditingArtikelId] = useState(null);
  const [formDataArtikel, setFormDataArtikel] = useState({
    title: "",
    category: "Berita",
    date: "",
    author: "Divisi Kominfo",
    image: "",
    excerpt: "",
    content: "",
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
    if (error) alert("Gagal Login: " + error.message);
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
      if (error) alert("Gagal update lomba: " + error.message);
      else {
        alert("Data lomba berhasil diperbarui!");
        resetLombaForm();
        fetchLomba();
      }
    } else {
      const { error } = await supabase.from("lomba").insert([payload]);
      if (error) alert("Gagal tambah lomba: " + error.message);
      else {
        alert("Data lomba berhasil ditambahkan!");
        resetLombaForm();
        fetchLomba();
      }
    }
  };

  const handleLombaDelete = async (id) => {
    if (!window.confirm("Hapus data lomba ini?")) return;
    const { error } = await supabase.from("lomba").delete().eq("id", id);
    if (error) alert("Gagal: " + error.message);
    else fetchLomba();
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
    if (!error && data) setArtikelList(data);
    setLoadingArtikel(false);
  };

  const handleArtikelSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: formDataArtikel.title,
      category: formDataArtikel.category,
      date: formDataArtikel.date || new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      datetime: new Date().toISOString().split("T")[0],
      author: formDataArtikel.author,
      image: formDataArtikel.image,
      excerpt: formDataArtikel.excerpt,
      content: formDataArtikel.content,
    };

    if (editingArtikelId) {
      const { error } = await supabase
        .from("artikel")
        .update(payload)
        .eq("id", editingArtikelId);
      if (error) alert("Gagal update artikel: " + error.message);
      else {
        alert("Artikel berhasil diperbarui!");
        resetArtikelForm();
        fetchArtikel();
      }
    } else {
      const { error } = await supabase.from("artikel").insert([payload]);
      if (error) alert("Gagal tambah artikel: " + error.message);
      else {
        alert("Artikel berhasil ditambahkan!");
        resetArtikelForm();
        fetchArtikel();
      }
    }
  };

  const handleArtikelDelete = async (id) => {
    if (!window.confirm("Hapus artikel ini?")) return;
    const { error } = await supabase.from("artikel").delete().eq("id", id);
    if (error) alert("Gagal: " + error.message);
    else fetchArtikel();
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
      if (error) alert("Gagal update prestasi: " + error.message);
      else {
        alert("Data prestasi berhasil diperbarui!");
        resetPrestasiForm();
        fetchPrestasi();
      }
    } else {
      const { error } = await supabase.from("prestasi").insert([payload]);
      if (error) alert("Gagal tambah prestasi: " + error.message);
      else {
        alert("Prestasi berhasil ditambahkan!");
        resetPrestasiForm();
        fetchPrestasi();
      }
    }
  };

  const handlePrestasiDelete = async (id) => {
    if (!window.confirm("Hapus entri prestasi ini?")) return;
    const { error } = await supabase.from("prestasi").delete().eq("id", id);
    if (error) alert("Gagal: " + error.message);
    else fetchPrestasi();
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
      if (error) alert("Gagal update foto: " + error.message);
      else {
        alert("Foto galeri berhasil diperbarui!");
        resetGaleriForm();
        fetchGaleri();
      }
    } else {
      const { error } = await supabase.from("galeri").insert([payload]);
      if (error) alert("Gagal tambah foto: " + error.message);
      else {
        alert("Foto galeri berhasil ditambahkan!");
        resetGaleriForm();
        fetchGaleri();
      }
    }
  };

  const handleGaleriDelete = async (id) => {
    if (!window.confirm("Hapus foto galeri ini?")) return;
    const { error } = await supabase.from("galeri").delete().eq("id", id);
    if (error) alert("Gagal: " + error.message);
    else fetchGaleri();
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
      if (error) alert("Gagal update pengurus: " + error.message);
      else {
        alert("Data pengurus berhasil diperbarui!");
        resetPengurusForm();
        fetchPengurus();
      }
    } else {
      const { error } = await supabase.from("pengurus").insert([payload]);
      if (error) alert("Gagal tambah pengurus: " + error.message);
      else {
        alert("Pengurus baru berhasil ditambahkan!");
        resetPengurusForm();
        fetchPengurus();
      }
    }
  };

  const handlePengurusDelete = async (id) => {
    if (!window.confirm("Hapus pengurus ini?")) return;
    const { error } = await supabase.from("pengurus").delete().eq("id", id);
    if (error) alert("Gagal: " + error.message);
    else fetchPengurus();
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
      {/* Soft Ambient Glows (Tanpa Kotak-Kotak Grid) */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] rounded-full bg-accent/10 blur-[150px]"></div>
      <div className="absolute bottom-1/4 right-10 w-[30rem] h-[30rem] rounded-full bg-blue-500/10 blur-[160px]"></div>

      {/* Star Sparkles */}
      <svg className="absolute bottom-1/3 right-16 w-8 h-8 text-accent/30" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
      </svg>
      <svg className="absolute top-20 left-1/3 w-6 h-6 text-accent/25" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
      </svg>
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
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
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
    <div className="min-h-screen bg-linear-to-b from-[#043761] via-primary to-[#043761] font-primary relative overflow-hidden">
      <AmbientBackground />

      {/* Overlay mobile & tablet */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden cursor-pointer"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-76 sm:w-80 bg-linear-to-b from-[#04284d]/98 via-[#043761]/98 to-[#03233f]/98 backdrop-blur-2xl border-r border-[#164a78] flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          type="button"
          className="lg:hidden absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:text-accent cursor-pointer z-30"
        >
          <X className="w-4 h-4 pointer-events-none" />
        </button>

        {/* Brand */}
        <div className="px-6 pt-8 pb-7 border-b border-[#164a78] flex flex-col items-center text-center relative">
          <div className="w-16 h-16 flex items-center justify-center mb-2.5 transition-transform duration-300 hover:scale-105">
            <img
              src={LogoHimsika}
              alt="Logo HIMSIKA"
              className="w-full h-full object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
            />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">HIMSIKA</h2>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mt-0.5">
            Database Control
          </span>
        </div>

        {/* Navigasi Menu CRUD */}
        <nav className="flex-1 p-4 space-y-2 relative z-10 overflow-y-auto">
          {[
            { id: "lomba", label: "Kelola Lomba & Beasiswa", icon: Trophy, count: lombaList.length },
            { id: "artikel", label: "Kelola Artikel & Berita", icon: FileText, count: artikelList.length },
            { id: "prestasi", label: "Kelola Prestasi Mahasiswa", icon: Award, count: prestasiList.length },
            { id: "galeri", label: "Kelola Galeri Kegiatan", icon: ImageIcon, count: galeriList.length },
            { id: "pengurus", label: "Kelola Profil & Pengurus", icon: Users, count: pengurusList.length },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.id);
                  setSidebarOpen(false);
                }}
                className={`group relative w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-bold transition-all border cursor-pointer ${
                  isSelected
                    ? "bg-linear-to-r from-[#0d4f8f] via-[#083c6d] to-[#052d53] border-accent text-white shadow-[0_0_20px_rgba(255,195,0,0.22)] ring-1 ring-accent/40"
                    : "bg-[#062c50]/50 border-white/10 text-white/80 hover:bg-[#084073] hover:text-white hover:border-accent/40"
                }`}
              >
                {isSelected && (
                  <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-accent rounded-r-full shadow-[0_0_10px_rgba(255,195,0,0.8)]" />
                )}
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${isSelected ? "text-accent" : "text-white/60 group-hover:text-accent"}`} />
                  <span className={`text-[13px] font-bold tracking-tight whitespace-nowrap ${isSelected ? "text-white" : "text-white/80 group-hover:text-white"}`}>
                    {item.label}
                  </span>
                </div>
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-black shrink-0 transition-all ${
                  isSelected
                    ? "bg-accent text-[#043761] shadow-sm shadow-black/30"
                    : "bg-white/10 text-white/70 group-hover:bg-white/20 group-hover:text-white"
                }`}>
                  {item.count}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[#164a78] relative z-10">
          <button
            onClick={handleLogout}
            type="button"
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/15 border border-red-500/30 text-red-300 hover:bg-red-600 hover:text-white hover:border-red-600 font-bold rounded-xl transition-all text-xs cursor-pointer shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5 pointer-events-none" /> Keluar Akun
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="lg:pl-80 relative z-10 flex flex-col min-h-screen">
        {/* Top bar mobile */}
        <header className="h-16 px-4 sm:px-6 flex items-center justify-between lg:hidden sticky top-0 z-30 bg-[#04284d]/95 backdrop-blur-xl border-b border-[#164a78]">
          <button
            onClick={() => setSidebarOpen(true)}
            type="button"
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:text-white cursor-pointer"
          >
            <Menu className="w-4 h-4 pointer-events-none" />
          </button>
          <span className="text-sm font-bold text-white capitalize">
            Kelola {activeMenu}
          </span>
          <div className="w-9 h-9"></div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl w-full mx-auto">
          {/* Header section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-[2px] bg-accent rounded-full"></span>
              <span className="text-accent font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
                Database Management <Sparkles className="w-3.5 h-3.5" />
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight capitalize">
              Kelola <span className="text-accent">{activeMenu}</span>
            </h1>
          </div>

          {/* Quick Stats Bar (Responsif di semua ukuran tanpa teks tertekan) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8">
            <div className="bg-linear-to-br from-[#073969]/90 to-[#04284d]/90 border border-[#164a78] rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 backdrop-blur-sm shadow-md min-w-0">
              <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider block">Total Data Aktif</span>
                <span className="text-xl sm:text-2xl font-extrabold text-white truncate block">
                  {activeMenu === "lomba" && `${lombaList.length} Lomba`}
                  {activeMenu === "artikel" && `${artikelList.length} Artikel`}
                  {activeMenu === "prestasi" && `${prestasiList.length} Prestasi`}
                  {activeMenu === "galeri" && `${galeriList.length} Foto`}
                  {activeMenu === "pengurus" && `${pengurusList.length} Pengurus`}
                </span>
              </div>
            </div>

            <div className="bg-linear-to-br from-[#073969]/90 to-[#04284d]/90 border border-[#164a78] rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 backdrop-blur-sm shadow-md min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider block">Status Koneksi</span>
                <span className="text-xs sm:text-sm font-extrabold text-emerald-400 flex items-center gap-1.5 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                  Supabase Live DB
                </span>
              </div>
            </div>

            <div className="col-span-1 sm:col-span-2 lg:col-span-1 bg-linear-to-br from-[#073969]/90 to-[#04284d]/90 border border-[#164a78] rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 backdrop-blur-sm shadow-md min-w-0">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider block">Akses Administrator</span>
                <span className="text-xs sm:text-sm font-bold text-white/90 truncate block" title={session?.user?.email}>
                  {session?.user?.email || "Admin Terautentikasi"}
                </span>
              </div>
            </div>
          </div>

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

                <form onSubmit={handleLombaSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <form onSubmit={handleArtikelSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    />
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
                      rows="6"
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
              </section>

              {/* Tabel Artikel */}
              <section className="bg-[#073969] border border-[#164a78] rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-5 border-b border-[#164a78] flex justify-between items-center">
                  <h3 className="font-bold text-white">Daftar Artikel di Database</h3>
                  <span className="text-xs text-accent font-bold px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                    {artikelList.length} Artikel
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-white/50 text-xs">
                        <th className="p-4">Judul & Kategori</th>
                        <th className="p-4">Penulis & Tanggal</th>
                        <th className="p-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {loadingArtikel ? (
                        <tr><td colSpan="3" className="p-8 text-center text-white/40">Memuat artikel...</td></tr>
                      ) : artikelList.length === 0 ? (
                        <tr><td colSpan="3" className="p-8 text-center text-white/40">Belum ada artikel tersimpan di database.</td></tr>
                      ) : (
                        artikelList.map((item) => (
                          <tr key={item.id} className="hover:bg-white/[0.03]">
                            <td className="p-4">
                              <p className="font-bold text-white">{item.title}</p>
                              <span className="text-[10px] font-bold text-accent uppercase">{item.category}</span>
                            </td>
                            <td className="p-4 text-xs text-white/70">
                              <p>{item.author}</p>
                              <p className="text-white/40">{item.date}</p>
                            </td>
                            <td className="p-4 text-right">
                              <button
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
                                  });
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="text-xs text-accent hover:underline mr-3 font-semibold cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
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

                <form onSubmit={handlePrestasiSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    />
                  </div>
                  <div>
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

                <form onSubmit={handleGaleriSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
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
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        Live Web Preview Card
                      </span>
                      <span className="text-[10px] text-white/60 bg-white/10 px-2.5 py-0.5 rounded-full font-medium">
                        Tampilan di Web
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
        </main>
      </div>
    </div>
  );
}
