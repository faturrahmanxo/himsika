import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { AnimatePresence } from "motion/react";

// Layouts
import Navbar from "./layouts/Navbar.jsx";
import Footer from "./layouts/Footer.jsx";

// Pages
import Beranda from "./pages/Beranda";
import Artikel from "./pages/Artikel";
import BusinessCompany from "./pages/BusinessCompany";

// Profils
import StrukturOrganisasi from "./pages/profils/StrukturOrganisasi.jsx";
import Logo from "./pages/profils/Logo.jsx";
import DetailArtikel from "./pages/articles/makeconnection-artikel.jsx";

// Events
import Edufair from "./pages/events/Edufair.jsx";
import ISCT from "./pages/events/ISCT.jsx";
import MakeConnection from "./pages/events/MakeConnection.jsx";
import LKMMPD from "./pages/events/LKMMPD.jsx";
import Isgath from "./pages/events/Isgath.jsx";
import StudyClub from "./pages/events/StudyClub.jsx";
import Revoist from "./pages/events/Revoist.jsx";
import AAS from "./pages/events/AAS.jsx";

// Components
import Preloader from "./components/Preloader";
import ArrowToTop from "./components/ArrowToTop.jsx";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* INI KUNCINYA: Background gelap di layer paling mentok belakang (-z-[999]) */}
      {/* Agar saat preloader hilang, yang ngintip bukan warna putih bawaan browser, melainkan warna ini */}
      <div className="fixed inset-0 bg-[#043761] -z-[999] pointer-events-none"></div>

      <div className={isLoading ? "h-screen overflow-hidden" : ""}>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <Preloader key="preloader" />
          ) : (
            <div key="main-content">
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
                <Route path="/business-company" element={<BusinessCompany />} />
                <Route path="/logo" element={<Logo />} />
                <Route
                  path="/struktur-organisasi"
                  element={<StrukturOrganisasi />}
                />
                <Route path="/artikel/:id" element={<DetailArtikel />} />
              </Routes>

              <Footer />
              <ArrowToTop />
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default App;
