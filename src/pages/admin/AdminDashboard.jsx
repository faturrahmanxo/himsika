import React, { useState, useEffect } from "react";
import supabase from "../../supabase-client";

import LogoHimsika from "../../assets/logo/HIMSIKA.png";
import {
  LogOut,
  Plus,
  Edit3,
  ShieldAlert,
  X,
  Trophy,
  FileText,
  Gift,
  CheckCircle2,
  MessageCircle,
  Trash2,
  Sparkles,
  Code,
  Terminal,
  Cpu,
  Globe,
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

export default function AdminDashboard() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [activeMenu, setActiveMenu] = useState("lomba");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [lombaList, setLombaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
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
    contacts: [], // State untuk array Narahubung
  });

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
      if (session) fetchLomba();
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchLomba();
    });
    return () => subscription.unsubscribe();
  }, []);

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

  const fetchLomba = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("lomba")
      .select("*")
      .order("id", { ascending: false });
    if (error) console.error("Gagal memuat data:", error.message);
    else setLombaList(data || []);
    setLoading(false);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleToggleCategory = (categoryName) => {
    setFormData((prev) => {
      const isSelected = prev.categories.includes(categoryName);
      if (isSelected)
        return {
          ...prev,
          categories: prev.categories.filter((c) => c !== categoryName),
        };
      else return { ...prev, categories: [...prev.categories, categoryName] };
    });
  };

  // --- LOGIC UNTUK NARAHUBUNG ---
  const handleAddContact = () => {
    setFormData({
      ...formData,
      contacts: [...formData.contacts, { name: "", phone: "" }],
    });
  };

  const handleRemoveContact = (index) => {
    const newContacts = [...formData.contacts];
    newContacts.splice(index, 1);
    setFormData({ ...formData, contacts: newContacts });
  };

  const handleContactChange = (index, field, value) => {
    const newContacts = [...formData.contacts];
    newContacts[index][field] = value;
    setFormData({ ...formData, contacts: newContacts });
  };
  // ------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      organizer: formData.organizer,
      description: formData.description,
      deadline_pendaftaran: formData.deadline_pendaftaran,
      deadline_pengumpulan: formData.deadline_pengumpulan,
      benefit: formData.benefit,
      categories: formData.categories,
      deadline_timestamp: formData.deadline_timestamp
        ? Number(formData.deadline_timestamp)
        : null,
      registration_url: formData.registration_url,
      guidebook_url: formData.guidebook_url,
      instagram_url: formData.instagram_url,
      contacts: formData.contacts,
    };

    if (editingId) {
      const { error } = await supabase
        .from("lomba")
        .update(payload)
        .eq("id", editingId);
      if (error) alert("Gagal mengupdate data: " + error.message);
      else {
        alert("Data berhasil diperbarui!");
        resetForm();
        fetchLomba();
      }
    } else {
      const { error } = await supabase.from("lomba").insert([payload]);
      if (error) alert("Gagal menambah data: " + error.message);
      else {
        alert("Data lomba berhasil ditambahkan!");
        resetForm();
        fetchLomba();
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah kamu yakin ingin menghapus data lomba ini?"))
      return;
    const { error } = await supabase.from("lomba").delete().eq("id", id);
    if (error) alert("Gagal menghapus: " + error.message);
    else fetchLomba();
  };

  const handleEditTrigger = (item) => {
    setEditingId(item.id);
    const safeCategories = parseCategories(item.categories);
    const safeContacts = Array.isArray(item.contacts) ? item.contacts : [];

    setFormData({
      title: item.title || "",
      organizer: item.organizer || "",
      description: item.description || "",
      deadline_pendaftaran: item.deadline_pendaftaran || "",
      deadline_pengumpulan: item.deadline_pengumpulan || "",
      benefit: item.benefit || "",
      categories: safeCategories,
      deadline_timestamp: item.deadline_timestamp || "",
      registration_url: item.registration_url || "",
      guidebook_url: item.guidebook_url || "",
      instagram_url: item.instagram_url || "",
      contacts: safeContacts,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
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

  // Ambient background: pola grid + blob cahaya + ikon melayang (sebagian berputar pelan)
  // supaya halaman tidak terasa monoton/flat.
  const AmbientBackground = () => (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      <div className="absolute w-[30rem] h-[30rem] rounded-full blur-[120px] bg-accent/20 top-0 left-0 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <div
        className="absolute w-[24rem] h-[24rem] rounded-full blur-[130px] bg-emerald-400/10 bottom-0 right-0 translate-x-1/3 translate-y-1/3 animate-pulse"
        style={{ animationDuration: "6s" }}
      ></div>

      <Trophy className="absolute top-[10%] right-[8%] w-10 h-10 text-white/[0.03] -rotate-12" />
      <Code className="absolute top-[35%] left-[6%] w-8 h-8 text-white/[0.03] rotate-12" />
      <Terminal className="absolute bottom-[20%] left-[16%] w-12 h-12 text-white/[0.03] -rotate-12" />
      <Sparkles
        className="absolute top-[20%] right-[32%] w-6 h-6 text-accent/[0.15]"
        style={{ animation: "spin 9s linear infinite" }}
      />
      <Globe
        className="absolute bottom-[14%] right-[10%] w-16 h-16 text-white/[0.04]"
        style={{ animation: "spin 34s linear infinite" }}
      />
      <Cpu
        className="absolute top-[58%] right-[26%] w-10 h-10 text-white/[0.03]"
        style={{ animation: "spin 24s linear infinite reverse" }}
      />
    </div>
  );

  if (!session) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#043761] via-primary to-[#043761] flex items-center justify-center p-4 font-primary text-white relative overflow-hidden">
        <AmbientBackground />

        <div className="w-full max-w-sm bg-white/5 backdrop-blur-lg border border-white/10 p-8 sm:p-10 rounded-[2rem] shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="relative w-12 h-12 mx-auto mb-4">
              <div className="absolute -inset-2 rounded-full border-2 border-dashed border-accent/30 animate-[spin_18s_linear_infinite]"></div>
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
                Dashboard Admin
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
              className="w-full py-3.5 bg-accent text-[#043761] font-bold rounded-full hover:bg-[#ffcf33] transition-colors mt-2 text-sm shadow-[0_0_15px_rgba(255,195,0,0.2)]"
            >
              {authLoading ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#043761] via-primary to-[#043761] font-primary relative overflow-hidden">
      <AmbientBackground />

      {/* Overlay saat sidebar dibuka di mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        ></div>
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/5 backdrop-blur-2xl border-r border-white/10 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand: Logo + HIMSIKA + label Admin */}
        <div className="px-6 pt-10 pb-8 border-b border-white/10 flex flex-col items-center text-center relative">
          <div className="relative mb-4">
            <div className="absolute -inset-2 rounded-full border-2 border-dashed border-accent/30 animate-[spin_20s_linear_infinite]"></div>
            <div className="w-14 h-14 rounded-full bg-white shadow-[0_0_20px_rgba(255,195,0,0.25)] flex items-center justify-center relative z-10">
              <img
                src={LogoHimsika}
                alt="Logo HIMSIKA"
                className="w-full h-full object-contain"
              />
            </div>
            <Sparkles className="absolute -top-1.5 -right-1.5 w-4 h-4 text-accent animate-pulse z-20" />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight leading-none">
            HIMSIKA
          </h2>
          <div className="flex items-center gap-2 mt-3">
            <span className="w-4 h-[2px] bg-accent rounded-full"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              Admin
            </span>
            <span className="w-4 h-[2px] bg-accent rounded-full"></span>
          </div>
        </div>

        {/* Navigasi */}
        <nav className="flex-1 p-5 space-y-2.5 relative z-10">
          <button
            onClick={() => {
              setActiveMenu("lomba");
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 border ${
              activeMenu === "lomba"
                ? "bg-accent border-accent text-[#043761] shadow-[0_0_15px_rgba(255,195,0,0.4)]"
                : "bg-white/5 border-white/10 text-white/70 hover:border-accent/50 hover:text-accent hover:bg-white/10"
            }`}
          >
            <Trophy className="w-4 h-4" /> Kelola Lomba
          </button>
          <button
            onClick={() => {
              setActiveMenu("artikel");
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 border ${
              activeMenu === "artikel"
                ? "bg-accent border-accent text-[#043761] shadow-[0_0_15px_rgba(255,195,0,0.4)]"
                : "bg-white/5 border-white/10 text-white/70 hover:border-accent/50 hover:text-accent hover:bg-white/10"
            }`}
          >
            <FileText className="w-4 h-4" /> Kelola Artikel
          </button>
        </nav>

        {/* Logout */}
        <div className="p-5 border-t border-white/10 relative z-10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white font-bold rounded-full transition-all text-xs"
          >
            <LogOut className="w-3.5 h-3.5" /> Keluar Akun
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="md:pl-72 relative z-10 flex flex-col min-h-screen">
        {/* Top bar mobile */}
        <header className="h-16 px-4 sm:px-6 flex items-center justify-between md:hidden sticky top-0 z-30 bg-white/5 backdrop-blur-xl border-b border-white/10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <Menu className="w-4.5 h-4.5" />
          </button>
          <span className="text-sm font-bold text-white/80">
            {activeMenu === "lomba" ? "Kelola Lomba" : "Kelola Artikel"}
          </span>
          <div className="w-9 h-9"></div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-10 sm:py-14 max-w-6xl w-full mx-auto">
          {/* Judul halaman */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-[2px] bg-accent rounded-full"></span>
              <span className="text-accent font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
                Portal Control{" "}
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {activeMenu === "lomba" ? (
                <>
                  Kelola{" "}
                  <span className="text-accent drop-shadow-[0_0_15px_rgba(255,195,0,0.4)]">
                    Lomba
                  </span>
                </>
              ) : (
                <>
                  Kelola{" "}
                  <span className="text-accent drop-shadow-[0_0_15px_rgba(255,195,0,0.4)]">
                    Artikel
                  </span>
                </>
              )}
            </h1>
          </div>

          {activeMenu === "lomba" ? (
            <div className="space-y-10">
              {/* FORM CARD */}
              <section className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-[2rem] p-6 sm:p-10 shadow-2xl hover:border-accent/30 transition-colors duration-500">
                <div className="flex justify-between items-center mb-8 pb-5 border-b border-white/10">
                  <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20">
                      {editingId ? (
                        <Edit3 className="w-3.5 h-3.5" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                    </span>
                    {editingId ? "Edit Info Lomba" : "Tambah Info Lomba Baru"}
                  </h2>
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="text-xs font-bold text-white/50 hover:text-red-400 flex items-center gap-1.5 transition-colors bg-white/5 hover:bg-white/10 px-3 py-2 rounded-full"
                    >
                      <X className="w-3 h-3" /> Batal Edit
                    </button>
                  )}
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-5"
                >
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-2">
                      Judul Lomba
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-2">
                      Penyelenggara
                    </label>
                    <input
                      type="text"
                      name="organizer"
                      required
                      value={formData.organizer}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 text-sm transition-colors"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-2">
                      Deskripsi Lengkap
                    </label>
                    <textarea
                      name="description"
                      rows="4"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-accent/50 text-sm leading-relaxed transition-colors custom-scrollbar"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-2">
                      Jadwal Pendaftaran
                    </label>
                    <input
                      type="text"
                      name="deadline_pendaftaran"
                      value={formData.deadline_pendaftaran}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-2">
                      Jadwal Pengumpulan
                    </label>
                    <input
                      type="text"
                      name="deadline_pengumpulan"
                      value={formData.deadline_pengumpulan}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 text-sm transition-colors"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-2 flex items-center gap-1.5">
                      <Gift className="w-3 h-3 text-accent" /> Benefit / Hadiah
                      Lomba
                    </label>
                    <input
                      type="text"
                      name="benefit"
                      value={formData.benefit}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 text-sm transition-colors"
                    />
                  </div>

                  {/* FORM NARAHUBUNG DINAMIS */}
                  <div className="md:col-span-2 p-5 sm:p-6 bg-white/[0.03] border border-white/10 rounded-[1.5rem]">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5" /> Narahubung /
                        Contact Person
                      </label>
                      <button
                        type="button"
                        onClick={handleAddContact}
                        className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white px-4 py-2 rounded-full border border-emerald-500/20 transition-all flex items-center gap-1.5"
                      >
                        <Plus className="w-3 h-3" /> Tambah Narahubung
                      </button>
                    </div>

                    <div className="space-y-3">
                      {formData.contacts.map((contact, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row gap-3 items-start sm:items-center"
                        >
                          <input
                            type="text"
                            placeholder="Nama (Misal: Muhammad Faruqi)"
                            value={contact.name}
                            onChange={(e) =>
                              handleContactChange(index, "name", e.target.value)
                            }
                            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 text-sm transition-colors w-full"
                          />
                          <input
                            type="text"
                            placeholder="No WA (Misal: 082296331962)"
                            value={contact.phone}
                            onChange={(e) =>
                              handleContactChange(
                                index,
                                "phone",
                                e.target.value,
                              )
                            }
                            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 text-sm transition-colors w-full"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveContact(index)}
                            className="w-full sm:w-auto p-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-2xl transition-colors flex items-center justify-center shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {formData.contacts.length === 0 && (
                        <p className="text-xs text-white/30 italic text-center py-2">
                          Belum ada narahubung yang ditambahkan.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-3">
                      Kategori Lomba (Bisa pilih lebih dari satu)
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {AVAILABLE_CATEGORIES.map((cat) => {
                        const isSelected = formData.categories.includes(cat);
                        return (
                          <button
                            type="button"
                            key={cat}
                            onClick={() => handleToggleCategory(cat)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border backdrop-blur-sm transition-all duration-300 ${
                              isSelected
                                ? "bg-accent border-accent text-slate-900 shadow-[0_0_15px_rgba(255,195,0,0.4)]"
                                : "bg-white/5 border-white/10 text-white/60 hover:border-accent/50 hover:text-accent hover:bg-white/10"
                            }`}
                          >
                            {isSelected && <CheckCircle2 className="w-3 h-3" />}{" "}
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-2">
                      Deadline Timestamp (Sorting)
                    </label>
                    <input
                      type="number"
                      name="deadline_timestamp"
                      value={formData.deadline_timestamp}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-2">
                      Link Pendaftaran (URL)
                    </label>
                    <input
                      type="url"
                      name="registration_url"
                      value={formData.registration_url}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-2">
                      Link Guidebook (URL)
                    </label>
                    <input
                      type="url"
                      name="guidebook_url"
                      value={formData.guidebook_url}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-2">
                      Link Instagram (URL)
                    </label>
                    <input
                      type="url"
                      name="instagram_url"
                      value={formData.instagram_url}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 text-sm transition-colors"
                    />
                  </div>

                  <div className="md:col-span-2 flex justify-end pt-5 mt-3 border-t border-white/10">
                    <button
                      type="submit"
                      className="px-8 py-3.5 bg-accent text-[#043761] font-bold rounded-full hover:bg-[#ffcf33] transition-all text-sm shadow-[0_0_15px_rgba(255,195,0,0.2)] cursor-pointer"
                    >
                      {editingId ? "Simpan Perubahan" : "Simpan Data Baru"}
                    </button>
                  </div>
                </form>
              </section>

              {/* TABEL LOMBA */}
              <section className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
                <div className="p-6 sm:p-8 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                  <h2 className="text-base sm:text-lg font-extrabold text-white">
                    Database Lomba
                  </h2>
                  <span className="text-xs font-bold text-accent bg-accent/10 px-4 py-1.5 rounded-full border border-accent/20">
                    {lombaList.length} Entri
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-white/40">
                        <th className="p-5 font-bold">Info Lomba</th>
                        <th className="p-5 font-bold">Kategori</th>
                        <th className="p-5 font-bold text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {loading ? (
                        <tr>
                          <td
                            colSpan="3"
                            className="p-12 text-center text-white/30 text-xs"
                          >
                            Memuat data...
                          </td>
                        </tr>
                      ) : lombaList.length > 0 ? (
                        lombaList.map((item) => {
                          const safeCats = parseCategories(item.categories);
                          return (
                            <tr
                              key={item.id}
                              className="hover:bg-white/[0.04] transition-colors"
                            >
                              <td className="p-5 align-top">
                                <div className="font-bold text-white/90 text-sm mb-1">
                                  {item.title}
                                </div>
                                <div className="text-[11px] text-white/40">
                                  {item.organizer}
                                </div>
                              </td>
                              <td className="p-5 align-top">
                                <div className="flex flex-wrap gap-1.5">
                                  {safeCats.map((cat, i) => (
                                    <span
                                      key={i}
                                      className="text-[9px] font-bold text-accent/90 bg-accent/10 px-2.5 py-1 rounded-full border border-accent/20"
                                    >
                                      {cat}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="p-5 align-top text-right whitespace-nowrap">
                                <div className="inline-flex items-center gap-2">
                                  <button
                                    onClick={() => handleEditTrigger(item)}
                                    className="text-xs font-bold text-blue-400 hover:text-white hover:bg-blue-500/80 px-3 py-1.5 rounded-full transition-colors"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(item.id)}
                                    className="text-xs font-bold text-red-400 hover:text-white hover:bg-red-500/80 px-3 py-1.5 rounded-full transition-colors"
                                  >
                                    Hapus
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan="3"
                            className="p-12 text-center text-white/30 text-xs"
                          >
                            Belum ada data lomba tersimpan.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-[2rem] p-16 text-center shadow-2xl relative overflow-hidden">
              <Sparkles
                className="absolute top-8 right-10 w-5 h-5 text-accent/30"
                style={{ animation: "spin 7s linear infinite" }}
              />
              <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-accent relative z-10">
                <FileText className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-extrabold text-white mb-2 relative z-10">
                Manajemen Artikel
              </h2>
              <p className="text-white/50 text-sm max-w-md mx-auto relative z-10">
                Fitur pengelolaan artikel akan hadir di sini, mengikuti pola
                yang sama dengan Kelola Lomba.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
