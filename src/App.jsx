import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import supabase from "./supabase-client";

// Layouts
import Navbar from "./layouts/Navbar.jsx";
import Footer from "./layouts/Footer.jsx";

// Pages
import Beranda from "./pages/Beranda";
import Artikel from "./pages/Artikel";
import BusinessCompany from "./pages/BusinessCompany";
import Kontak from "./pages/Kontak.jsx";
import NotFound from "./pages/NotFound.jsx";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";

// Profils
import StrukturOrganisasi from "./pages/profils/StrukturOrganisasi.jsx";
import Logo from "./pages/profils/Logo.jsx";
import Sejarah from "./pages/profils/Sejarah.jsx";
import VisiMisi from "./pages/profils/VisiMisi.jsx";
import Galeri from "./pages/profils/Galeri.jsx";
import DetailArtikel from "./pages/articles/detail-artikel.jsx";
import Credit from "./pages/profils/Credit.jsx";

// Events
import Edufair from "./pages/events/Edufair.jsx";
import ISCT from "./pages/events/ISCT.jsx";
import MakeConnection from "./pages/events/MakeConnection.jsx";
import LKMMPD from "./pages/events/LKMMPD.jsx";
import Isgath from "./pages/events/Isgath.jsx";
import StudyClub from "./pages/events/StudyClub.jsx";
import Revoist from "./pages/events/Revoist.jsx";
import AAS from "./pages/events/AAS.jsx";
import LombaBeasiswa from "./pages/events/LombaBeasiswa.jsx";
import Prestasi from "./pages/events/Prestasi.jsx";
import SharingSession from "./pages/events/SharingSession.jsx";
import ArsipMateri from "./pages/events/ArsipMateri.jsx";

// Components
import Preloader from "./components/Preloader";
import ArrowToTop from "./components/ArrowToTop.jsx";

// Komponen otomatis untuk normalisasi URL (memperbaiki double slash seperti //portal-himsika-auth)
function PathNormalizer() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Jika ada double slash atau lebih (misal //portal-himsika-auth)
    if (location.pathname.includes("//")) {
      const cleanPath = location.pathname.replace(/\/+/g, "/");
      navigate(cleanPath + location.search + location.hash, { replace: true });
    }
  }, [location, navigate]);

  return null;
}

// Layout khusus halaman publik (agar Navbar & Footer tidak muncul di Admin)
function PublicLayout() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Beranda />} />
        <Route path="/education-fair" element={<Edufair />} />
        <Route path="/isct" element={<ISCT />} />
        <Route path="/make-connection" element={<MakeConnection />} />
        <Route path="/lkmmpd" element={<LKMMPD />} />
        <Route path="/isgath" element={<Isgath />} />
        <Route path="/study-club" element={<StudyClub />} />
        <Route path="/revoist" element={<Revoist />} />
        <Route path="/aas" element={<AAS />} />
        <Route path="/artikel" element={<Artikel />} />
        <Route path="/aas/lomba-beasiswa" element={<LombaBeasiswa />} />
        <Route path="/aas/prestasi" element={<Prestasi />} />
        <Route path="/aas/sharing-session" element={<SharingSession />} />
        <Route path="/aas/arsip-materi" element={<ArsipMateri />} />
        <Route path="/business-company" element={<BusinessCompany />} />
        <Route path="/logo" element={<Logo />} />
        <Route path="/sejarah-himsika" element={<Sejarah />} />
        <Route path="/visi-misi" element={<VisiMisi />} />
        <Route path="/galeri-kegiatan" element={<Galeri />} />
        <Route path="/struktur-organisasi" element={<StrukturOrganisasi />} />
        <Route path="/kontak" element={<Kontak />} />
        <Route path="/credit" element={<Credit />} />
        <Route path="/artikel/:id" element={<DetailArtikel />} />

        {/* Alias Rute yang sering salah ketik */}
        <Route path="/struktur" element={<Navigate to="/struktur-organisasi" replace />} />
        <Route path="/pengurus" element={<Navigate to="/struktur-organisasi" replace />} />
        <Route path="/galeri" element={<Navigate to="/galeri-kegiatan" replace />} />
        <Route path="/sejarah" element={<Navigate to="/sejarah-himsika" replace />} />
        <Route path="/visimisi" element={<Navigate to="/visi-misi" replace />} />
        <Route path="/visi" element={<Navigate to="/visi-misi" replace />} />
        <Route path="/misi" element={<Navigate to="/visi-misi" replace />} />
        <Route path="/lomba" element={<Navigate to="/aas/lomba-beasiswa" replace />} />
        <Route path="/beasiswa" element={<Navigate to="/aas/lomba-beasiswa" replace />} />
        <Route path="/prestasi" element={<Navigate to="/aas/prestasi" replace />} />
        <Route path="/berita" element={<Navigate to="/artikel" replace />} />
        <Route path="/contact" element={<Navigate to="/kontak" replace />} />

        {/* Halaman 404 jika rute tidak ditemukan */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <ArrowToTop />
    </>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Optimasi durasi preloader: 1.2 detik (cepat, responsif, dan animasi tetap mulus)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Background gelap di layer paling belakang */}
      <div className="fixed inset-0 bg-[#043761] -z-[999] pointer-events-none"></div>

      {/* Normalisasi URL otomatis */}
      <PathNormalizer />

      <div className={isLoading ? "h-screen overflow-hidden" : ""}>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <Preloader key="preloader" />
          ) : (
            <div key="main-content">
              <Routes>
                {/* Rute Rahasia Admin & Pengalihan /admin ke Beranda */}
                <Route
                  path="/portal-himsika-auth"
                  element={<AdminDashboard />}
                />
                <Route path="/admin" element={<Navigate to="/" replace />} />
                <Route path="/portal-admin" element={<Navigate to="/portal-himsika-auth" replace />} />
                <Route path="/portal-auth" element={<Navigate to="/portal-himsika-auth" replace />} />
                <Route path="/admin-portal" element={<Navigate to="/portal-himsika-auth" replace />} />

                {/* Halaman Pengunjung Website */}
                <Route path="/*" element={<PublicLayout />} />
              </Routes>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default App;
