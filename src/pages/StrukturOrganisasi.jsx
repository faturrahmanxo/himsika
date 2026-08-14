import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function StrukturOrganisasi() {
  const [activeTab, setActiveTab] = useState("bph");

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2);
  };

  // --- TEMA WARNA PER DEPARTEMEN (VIBRANT GRADIENTS) ---
  const themes = {
    bph: {
      gradient: "from-indigo-500 to-purple-600",
      badge: "bg-indigo-100 text-indigo-700",
      borderHover: "hover:border-indigo-300",
      shadowHover: "hover:shadow-indigo-200/60",
    },
    internal: {
      gradient: "from-blue-400 to-cyan-500",
      badge: "bg-blue-100 text-blue-700",
      borderHover: "hover:border-blue-300",
      shadowHover: "hover:shadow-blue-200/60",
    },
    edukasi: {
      gradient: "from-amber-400 to-orange-500",
      badge: "bg-amber-100 text-amber-700",
      borderHover: "hover:border-amber-300",
      shadowHover: "hover:shadow-amber-200/60",
    },
    kominfo: {
      gradient: "from-emerald-400 to-teal-500",
      badge: "bg-emerald-100 text-emerald-700",
      borderHover: "hover:border-emerald-300",
      shadowHover: "hover:shadow-emerald-200/60",
    },
    relasi: {
      gradient: "from-pink-500 to-rose-500",
      badge: "bg-pink-100 text-pink-700",
      borderHover: "hover:border-pink-300",
      shadowHover: "hover:shadow-pink-200/60",
    },
  };

  // --- DATA ORGANISASI ---
  const bphData = {
    title: "Badan Pengurus Harian & SC",
    description: "Pucuk pimpinan dan dewan pengarah yang menahkodai arah gerak HIMSIKA secara keseluruhan.",
    inti: [{ name: "Ahmad Fadillah", position: "Ketua Himpunan" }],
    wakil: [
      { name: "Budi Santoso", position: "Wakil Ketua 1" },
      { name: "Citra Kirana", position: "Wakil Ketua 2" },
    ],
    sekretarisBendahara: [
      { name: "Nadia Utami", position: "Sekretaris Umum" },
      { name: "Putri Larasati", position: "Bendahara Umum" },
    ]
  };

  const departemenData = {
    internal: {
      id: "internal",
      title: "Departemen Internal",
      description: "Mengelola urusan administrasi, kesekretariatan, dan menjaga harmonisasi seluruh pengurus.",
      head: { name: "Dina Amelia", position: "Kepala Departemen" },
      expert: [{ name: "Eko Prasetyo", position: "Staff Ahli" }],
      staff: [
        { name: "Fani Rahma", position: "Staff" },
        { name: "Galih Raka", position: "Staff" },
        { name: "Hani Nurhaliza", position: "Staff" },
      ],
    },
    edukasi: {
      id: "edukasi",
      title: "Departemen Edukasi",
      description: "Memfasilitasi pengembangan akademik, pelatihan hardskill, serta keilmuan mahasiswa.",
      head: { name: "Gilang Ramadhan", position: "Kepala Departemen" },
      expert: [
        { name: "Hana Pertiwi", position: "Staff Ahli" },
        { name: "Irfan Hakim", position: "Staff Ahli" }
      ],
      staff: [
        { name: "Jihan Fahira", position: "Staff" },
        { name: "Kevin Sanjaya", position: "Staff" },
      ],
    },
    kominfo: {
      id: "kominfo",
      title: "Departemen Kominfo",
      description: "Pusat pengelolaan media sosial, branding, dokumentasi, dan desain komunikasi visual.",
      head: { name: "Joko Susilo", position: "Kepala Departemen" },
      expert: [{ name: "Kiki Amalia", position: "Staff Ahli" }],
      staff: [
        { name: "Lukman Nur", position: "Staff" },
        { name: "Mawar Eva", position: "Staff" },
        { name: "Nanda Syifa", position: "Staff" },
        { name: "Oman Rahman", position: "Staff" },
      ],
    },
    relasi: {
      id: "relasi",
      title: "Departemen Relasi",
      description: "Menjaga hubungan baik dengan pihak eksternal, alumni, masyarakat, maupun instansi lain.",
      head: { name: "Maya Sari", position: "Kepala Departemen" },
      expert: [{ name: "Niko Pratama", position: "Staff Ahli" }],
      staff: [
        { name: "Oki Setiawan", position: "Staff" },
        { name: "Panca Budi", position: "Staff" },
      ],
    },
  };

  const tabs = [
    { id: "bph", label: "BPH & SC", gradient: "from-indigo-500 to-purple-600" },
    { id: "internal", label: "Internal", gradient: "from-blue-400 to-cyan-500" },
    { id: "edukasi", label: "Edukasi", gradient: "from-amber-400 to-orange-500" },
    { id: "kominfo", label: "Kominfo", gradient: "from-emerald-400 to-teal-500" },
    { id: "relasi", label: "Relasi", gradient: "from-pink-500 to-rose-500" },
  ];

  // --- KOMPONEN KARTU KECIL (Colorful Reusable Card) ---
  const MemberCard = ({ member, type = "staff", themeId = "bph" }) => {
    const isLarge = type === "head";
    const theme = themes[themeId];
    
    return (
      <div className={`bg-white border-2 border-transparent rounded-[1.5rem] flex flex-col items-center text-center p-6 sm:p-8 shadow-sm hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2 ${theme.borderHover} ${theme.shadowHover} relative overflow-hidden ${isLarge ? 'w-full max-w-sm mx-auto' : 'w-full'}`}>
        
        {/* Glow Latar Belakang Kartu */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${theme.gradient} opacity-5 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}></div>

        {/* Avatar Gradasi */}
        <div className={`${isLarge ? 'w-28 h-28 sm:w-32 sm:h-32 text-4xl' : 'w-20 h-20 sm:w-24 sm:h-24 text-2xl'} bg-gradient-to-br ${theme.gradient} rounded-full mb-4 sm:mb-6 border-4 border-white shadow-lg flex items-center justify-center text-white font-black group-hover:scale-105 transition-transform duration-300 relative z-10`}>
           {getInitials(member.name)}
        </div>
        
        <h4 className={`${isLarge ? 'text-xl sm:text-2xl' : 'text-lg font-bold'} font-extrabold text-slate-900 mb-3 leading-tight relative z-10`}>
          {member.name}
        </h4>
        
        {/* Badge Berwarna */}
        <span className={`inline-block px-4 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-full relative z-10 transition-colors duration-300 ${theme.badge}`}>
          {member.position}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-primary text-slate-700 relative overflow-hidden">
      
      {/* Background Blobs (Colorful Ornaments) */}
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-purple-400/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-96 h-96 bg-amber-400/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="fixed top-[40%] left-[60%] w-64 h-64 bg-cyan-400/20 rounded-full blur-[80px] pointer-events-none"></div>

      {/* =========================================
          1. HEADER SECTION
          ========================================= */}
      <section className="relative pt-32 pb-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center z-10">
        <div className="inline-flex items-center space-x-2 px-5 py-2 rounded-full mb-6 bg-white border border-slate-200 shadow-md">
          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 animate-pulse shrink-0"></span>
          <span className="text-xs font-extrabold tracking-widest text-slate-800 uppercase">Kabinet Nawasena 2026</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-black tracking-tighter text-slate-900 mb-6 drop-shadow-sm leading-tight">
          Struktur <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500">Organisasi</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
          Kenali sosok-sosok penggerak penuh warna di balik layar yang menahkodai HIMSIKA untuk menciptakan kolaborasi nyata.
        </p>
      </section>

      {/* =========================================
          2. INTERACTIVE COLORFUL TABS
          ========================================= */}
      <section className="sticky top-20 z-40 py-4 px-4 sm:px-6 mb-12 backdrop-blur-xl bg-slate-50/80 border-b border-slate-200/50 shadow-sm">
        <div className="max-w-4xl mx-auto flex overflow-x-auto hide-scrollbar gap-3 justify-start sm:justify-center px-2 py-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 px-6 py-3 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-300 border-2 ${
                  isActive
                    ? `bg-gradient-to-r ${tab.gradient} text-white border-transparent shadow-lg scale-105 shadow-${tab.gradient.split('-')[2]}/30`
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-800 hover:border-slate-300"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* =========================================
          3. DYNAMIC CONTENT SECTION
          ========================================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-32 min-h-[50vh] relative z-10">
        
        {/* === KONDISI 1: JIKA TAB BPH AKTIF === */}
        {activeTab === "bph" && (
          <div className="animate-[fade-in_0.5s_ease-out]">
            <div className="text-center mb-16 relative">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-7xl opacity-5">👑</span>
              <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4 inline-block">
                {bphData.title}
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto font-medium">{bphData.description}</p>
            </div>
            
            {/* Hierarki BPH */}
            <div className="flex flex-col gap-10 sm:gap-14">
              {/* Top Level (Ketua) */}
              <div className="flex justify-center relative">
                <MemberCard member={bphData.inti[0]} type="head" themeId="bph" />
              </div>
              {/* Mid Level (Wakil) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto w-full relative">
                {bphData.wakil.map((member, idx) => (
                  <MemberCard key={idx} member={member} type="head" themeId="bph" />
                ))}
              </div>
              {/* Base Level (Sekretaris & Bendahara) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {bphData.sekretarisBendahara.map((member, idx) => (
                  <MemberCard key={idx} member={member} themeId="bph" />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === KONDISI 2: JIKA TAB DEPARTEMEN AKTIF === */}
        {activeTab !== "bph" && departemenData[activeTab] && (
          <div className="animate-[fade-in_0.5s_ease-out]">
            <div className="text-center mb-16">
              <h2 className={`text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${themes[activeTab].gradient} mb-4 inline-block`}>
                {departemenData[activeTab].title}
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto font-medium">
                {departemenData[activeTab].description}
              </p>
            </div>

            <div className="flex flex-col gap-12 sm:gap-16">
              {/* Kepala Departemen */}
              <div>
                <h3 className="text-center text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Kepala Departemen</h3>
                <MemberCard 
                  member={departemenData[activeTab].head} 
                  type="head" 
                  themeId={activeTab}
                />
              </div>

              {/* Staff Ahli */}
              <div>
                <h3 className="text-center text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Staff Ahli</h3>
                <div className="flex flex-wrap justify-center gap-6">
                  {departemenData[activeTab].expert.map((member, idx) => (
                     <div key={idx} className="w-full sm:w-[calc(50%-12px)] max-w-sm">
                       <MemberCard member={member} themeId={activeTab} />
                     </div>
                  ))}
                </div>
              </div>

              {/* Jajaran Staff */}
              <div>
                <h3 className="text-center text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Staff Departemen</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {departemenData[activeTab].staff.map((member, idx) => (
                    <MemberCard key={idx} member={member} themeId={activeTab} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* =========================================
          4. STYLE TAMBAHAN KHUSUS ANIMASI & SCROLLBAR
          ========================================= */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(15px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}