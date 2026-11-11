import React, { useState, useEffect } from "react";
import supabase from "../../supabase-client";

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
    if (!error && data) setPengurusList(data);
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
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      <div className="absolute w-[30rem] h-[30rem] rounded-full blur-[120px] bg-accent/20 top-0 left-0 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute w-[24rem] h-[24rem] rounded-full blur-[130px] bg-emerald-400/10 bottom-0 right-0 translate-x-1/3 translate-y-1/3"></div>
    </div>
  );

  // LOGIN SCREEN
  if (!session) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#043761] via-primary to-[#043761] flex items-center justify-center p-4 font-primary text-white relative overflow-hidden">
        <AmbientBackground />

        <div className="w-full max-w-sm bg-white/5 backdrop-blur-lg border border-white/10 p-8 sm:p-10 rounded-[2rem] shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="relative w-12 h-12 mx-auto mb-4">
              <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center text-accent relative z-10">
                <img
                  src={LogoHimsika}
                  alt="Logo HIMSIKA"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="w-6 h-[2px] bg-accent rounded-full"></span>
              <span className="text-accent font-bold text-[11px] uppercase tracking-widest">
                Dashboard Database
              </span>
              <span className="w-6 h-[2px] bg-accent rounded-full"></span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Admin <span className="text-accent">Login</span>
            </h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 text-sm transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 text-sm transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 bg-accent text-[#043761] font-bold rounded-full hover:bg-[#ffcf33] transition-colors mt-2 text-sm shadow-[0_0_15px_rgba(255,195,0,0.2)] cursor-pointer"
            >
              {authLoading ? "Memproses..." : "Masuk"}
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

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden cursor-pointer"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#02182b]/95 backdrop-blur-2xl border-r border-[#1b4e80] flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          type="button"
          className="md:hidden absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:text-accent cursor-pointer z-30"
        >
          <X className="w-4 h-4 pointer-events-none" />
        </button>

        {/* Brand */}
        <div className="px-6 pt-10 pb-8 border-b border-[#1b4e80] flex flex-col items-center text-center relative">
          <div className="w-14 h-14 rounded-full bg-white shadow-[0_0_20px_rgba(255,195,0,0.25)] flex items-center justify-center mb-3">
            <img
              src={LogoHimsika}
              alt="Logo HIMSIKA"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">HIMSIKA</h2>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mt-1">
            Database Control
          </span>
        </div>

        {/* Navigasi Menu CRUD */}
        <nav className="flex-1 p-4 space-y-2 relative z-10 overflow-y-auto">
          {[
            { id: "lomba", label: "Kelola Lomba & Beasiswa", icon: Trophy },
            { id: "artikel", label: "Kelola Artikel & Berita", icon: FileText },
            { id: "prestasi", label: "Kelola Prestasi Mahasiswa", icon: Award },
            { id: "galeri", label: "Kelola Galeri Kegiatan", icon: ImageIcon },
            { id: "pengurus", label: "Kelola Profil & Pengurus", icon: Users },
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all border cursor-pointer ${
                  isSelected
                    ? "bg-accent border-accent text-[#02182b] shadow-[0_0_15px_rgba(255,195,0,0.4)]"
                    : "bg-white/5 border-white/10 text-white/70 hover:border-accent/50 hover:text-accent hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[#1b4e80] relative z-10">
          <button
            onClick={handleLogout}
            type="button"
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white font-bold rounded-xl transition-all text-xs cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 pointer-events-none" /> Keluar Akun
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="md:pl-72 relative z-10 flex flex-col min-h-screen">
        {/* Top bar mobile */}
        <header className="h-16 px-4 flex items-center justify-between md:hidden sticky top-0 z-30 bg-[#02182b]/90 backdrop-blur-xl border-b border-[#1b4e80]">
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

        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-10 max-w-6xl w-full mx-auto">
          {/* Header section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-[2px] bg-accent rounded-full"></span>
              <span className="text-accent font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
                Database Management <Sparkles className="w-3.5 h-3.5" />
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight capitalize">
              Kelola <span className="text-accent">{activeMenu}</span>
            </h1>
          </div>

          {/* ================= 1. MENU LOMBA ================= */}
          {activeMenu === "lomba" && (
            <div className="space-y-10">
              <section className="bg-[#021f3f] border border-[#1b4e80] rounded-3xl p-6 sm:p-8 shadow-2xl">
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
                      className="w-full bg-[#02182b] border border-[#1b4e80] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/70 mb-1">Penyelenggara</label>
                    <input
                      type="text"
                      required
                      value={formDataLomba.organizer}
                      onChange={(e) => setFormDataLomba({ ...formDataLomba, organizer: e.target.value })}
                      className="w-full bg-[#02182b] border border-[#1b4e80] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-white/70 mb-1">Deskripsi</label>
                    <textarea
                      rows="3"
                      value={formDataLomba.description}
                      onChange={(e) => setFormDataLomba({ ...formDataLomba, description: e.target.value })}
                      className="w-full bg-[#02182b] border border-[#1b4e80] rounded-xl p-3 text-white text-sm focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/70 mb-1">Deadline Pendaftaran</label>
                    <input
                      type="text"
                      placeholder="Contoh: 15 November 2026"
                      value={formDataLomba.deadline_pendaftaran}
                      onChange={(e) => setFormDataLomba({ ...formDataLomba, deadline_pendaftaran: e.target.value })}
                      className="w-full bg-[#02182b] border border-[#1b4e80] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/70 mb-1">Deadline Pengumpulan</label>
                    <input
                      type="text"
                      placeholder="Contoh: 20 November 2026"
                      value={formDataLomba.deadline_pengumpulan}
                      onChange={(e) => setFormDataLomba({ ...formDataLomba, deadline_pengumpulan: e.target.value })}
                      className="w-full bg-[#02182b] border border-[#1b4e80] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-white/70 mb-1">Benefit / Hadiah</label>
                    <input
                      type="text"
                      value={formDataLomba.benefit}
                      onChange={(e) => setFormDataLomba({ ...formDataLomba, benefit: e.target.value })}
                      className="w-full bg-[#02182b] border border-[#1b4e80] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/70 mb-1">Link Pendaftaran (URL)</label>
                    <input
                      type="url"
                      value={formDataLomba.registration_url}
                      onChange={(e) => setFormDataLomba({ ...formDataLomba, registration_url: e.target.value })}
                      className="w-full bg-[#02182b] border border-[#1b4e80] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/70 mb-1">Link Guidebook (URL)</label>
                    <input
                      type="url"
                      value={formDataLomba.guidebook_url}
                      onChange={(e) => setFormDataLomba({ ...formDataLomba, guidebook_url: e.target.value })}
                      className="w-full bg-[#02182b] border border-[#1b4e80] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
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
              <section className="bg-[#021f3f] border border-[#1b4e80] rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-5 border-b border-[#1b4e80] flex justify-between items-center">
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
              <section className="bg-[#021f3f] border border-[#1b4e80] rounded-3xl p-6 sm:p-8 shadow-2xl">
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
                      className="w-full bg-[#02182b] border border-[#1b4e80] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/70 mb-1">Kategori</label>
                    <select
                      value={formDataArtikel.category}
                      onChange={(e) => setFormDataArtikel({ ...formDataArtikel, category: e.target.value })}
                      className="w-full bg-[#02182b] border border-[#1b4e80] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
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
                      className="w-full bg-[#02182b] border border-[#1b4e80] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/70 mb-1">Tanggal Tampil</label>
                    <input
                      type="text"
                      placeholder="Contoh: 10 November 2026"
                      value={formDataArtikel.date}
                      onChange={(e) => setFormDataArtikel({ ...formDataArtikel, date: e.target.value })}
                      className="w-full bg-[#02182b] border border-[#1b4e80] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/70 mb-1">URL Gambar Sampul</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={formDataArtikel.image}
                      onChange={(e) => setFormDataArtikel({ ...formDataArtikel, image: e.target.value })}
                      className="w-full bg-[#02182b] border border-[#1b4e80] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-white/70 mb-1">Ringkasan (Excerpt)</label>
                    <textarea
                      rows="2"
                      value={formDataArtikel.excerpt}
                      onChange={(e) => setFormDataArtikel({ ...formDataArtikel, excerpt: e.target.value })}
                      className="w-full bg-[#02182b] border border-[#1b4e80] rounded-xl p-3 text-white text-sm focus:border-accent"
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
                      className="w-full bg-[#02182b] border border-[#1b4e80] rounded-xl p-3 text-white text-sm focus:border-accent"
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
              <section className="bg-[#021f3f] border border-[#1b4e80] rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-5 border-b border-[#1b4e80] flex justify-between items-center">
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
              <section className="bg-[#021f3f] border border-[#1b4e80] rounded-3xl p-6 sm:p-8 shadow-2xl">
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
                      className="w-full bg-[#02182b] border border-[#1b4e80] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
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
                      className="w-full bg-[#02182b] border border-[#1b4e80] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/70 mb-1">URL Foto Dokumentasi</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={formDataPrestasi.gambar}
                      onChange={(e) => setFormDataPrestasi({ ...formDataPrestasi, gambar: e.target.value })}
                      className="w-full bg-[#02182b] border border-[#1b4e80] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/70 mb-1">Link Instagram Post</label>
                    <input
                      type="url"
                      placeholder="https://www.instagram.com/p/..."
                      value={formDataPrestasi.instagram_url}
                      onChange={(e) => setFormDataPrestasi({ ...formDataPrestasi, instagram_url: e.target.value })}
                      className="w-full bg-[#02182b] border border-[#1b4e80] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-white/70 mb-1">Nama Pemenang (Satu nama per baris)</label>
                    <textarea
                      rows="3"
                      placeholder="Nama Mahasiswa 1 (NIM)&#10;Nama Mahasiswa 2 (NIM)"
                      value={formDataPrestasi.pemenang}
                      onChange={(e) => setFormDataPrestasi({ ...formDataPrestasi, pemenang: e.target.value })}
                      className="w-full bg-[#02182b] border border-[#1b4e80] rounded-xl p-3 text-white text-sm focus:border-accent"
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
              <section className="bg-[#021f3f] border border-[#1b4e80] rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-5 border-b border-[#1b4e80] flex justify-between items-center">
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
              <section className="bg-[#021f3f] border border-[#1b4e80] rounded-3xl p-6 sm:p-8 shadow-2xl">
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
                      className="w-full bg-[#02182b] border border-[#1b4e80] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                    >
                      {ALBUM_OPTIONS.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/70 mb-1">URL Foto (Direct Image Link)</label>
                    <input
                      type="url"
                      required
                      placeholder="https://..."
                      value={formDataGaleri.foto}
                      onChange={(e) => setFormDataGaleri({ ...formDataGaleri, foto: e.target.value })}
                      className="w-full bg-[#02182b] border border-[#1b4e80] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-white/70 mb-1">Keterangan / Caption (Opsional)</label>
                    <input
                      type="text"
                      placeholder="Dokumentasi kegiatan..."
                      value={formDataGaleri.caption}
                      onChange={(e) => setFormDataGaleri({ ...formDataGaleri, caption: e.target.value })}
                      className="w-full bg-[#02182b] border border-[#1b4e80] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
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
              <section className="bg-[#021f3f] border border-[#1b4e80] rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-5 border-b border-[#1b4e80] flex justify-between items-center">
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
                      <div key={item.id} className="group relative rounded-2xl overflow-hidden border border-[#1b4e80] bg-[#02182b]">
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
              <section className="bg-[#021f3f] border border-[#1b4e80] rounded-3xl p-6 sm:p-8 shadow-2xl">
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

                <form onSubmit={handlePengurusSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/70 mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      placeholder="Nama Pengurus"
                      value={formDataPengurus.nama}
                      onChange={(e) => setFormDataPengurus({ ...formDataPengurus, nama: e.target.value })}
                      className="w-full bg-[#02182b] border border-[#1b4e80] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
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
                      className="w-full bg-[#02182b] border border-[#1b4e80] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/70 mb-1">Kelompok / Bagian</label>
                    <select
                      value={formDataPengurus.kelompok}
                      onChange={(e) => setFormDataPengurus({ ...formDataPengurus, kelompok: e.target.value })}
                      className="w-full bg-[#02182b] border border-[#1b4e80] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                    >
                      {KELOMPOK_OPTIONS.map((k) => (
                        <option key={k.id} value={k.id}>{k.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/70 mb-1">URL Foto Profil</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={formDataPengurus.foto}
                      onChange={(e) => setFormDataPengurus({ ...formDataPengurus, foto: e.target.value })}
                      className="w-full bg-[#02182b] border border-[#1b4e80] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/70 mb-1">Instagram (Username atau URL)</label>
                    <input
                      type="text"
                      placeholder="username atau https://instagram.com/..."
                      value={formDataPengurus.instagram}
                      onChange={(e) => setFormDataPengurus({ ...formDataPengurus, instagram: e.target.value })}
                      className="w-full bg-[#02182b] border border-[#1b4e80] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/70 mb-1">LinkedIn (Username, slug, atau URL)</label>
                    <input
                      type="text"
                      placeholder="username atau https://linkedin.com/in/..."
                      value={formDataPengurus.linkedin}
                      onChange={(e) => setFormDataPengurus({ ...formDataPengurus, linkedin: e.target.value })}
                      className="w-full bg-[#02182b] border border-[#1b4e80] rounded-xl px-4 py-2.5 text-white text-sm focus:border-accent"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end pt-4 border-t border-white/10">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-accent text-[#02182b] font-bold rounded-full hover:bg-[#ffcf33] text-sm shadow-md cursor-pointer"
                    >
                      {editingPengurusId ? "Simpan Perubahan Pengurus" : "Simpan Pengurus ke Database"}
                    </button>
                  </div>
                </form>
              </section>

              {/* Tabel Pengurus */}
              <section className="bg-[#021f3f] border border-[#1b4e80] rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-5 border-b border-[#1b4e80] flex justify-between items-center">
                  <h3 className="font-bold text-white">Daftar Pengurus di Database</h3>
                  <span className="text-xs text-accent font-bold px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                    {pengurusList.length} Pengurus
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-white/50 text-xs">
                        <th className="p-4">Nama & Jabatan</th>
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
                                <img src={item.foto} alt={item.nama} className="w-9 h-9 rounded-full object-cover shrink-0 border border-white/20" />
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center shrink-0">
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
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
