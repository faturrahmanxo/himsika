import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { AnimatePresence } from "motion/react";

import Navbar from "./layouts/Navbar.jsx";
import Beranda from "./pages/Beranda";
import Edufair2026 from "./pages/events/Edufair.jsx";
import ISCT from "./pages/events/ISCT.jsx";
import MakeConnection from "./pages/events/MakeConnection";
import AAS from "./pages/events/AAS.jsx"; // Sesuaikan nama filemu
import Artikel from "./pages/Artikel";
import BusinessCompany from "./pages/BusinessCompany";
import DetailArtikel from "./pages/articles/makeconnection-artikel.jsx";
import StrukturOrganisasi from "./pages/profils/StrukturOrganisasi.jsx";
import Footer from "./layouts/Footer.jsx";

import Preloader from "./components/Preloader";

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
                <Route path="/education-fair" element={<Edufair2026 />} />
                <Route path="/isct" element={<ISCT />} />
                <Route path="/make-connection" element={<MakeConnection />} />
                <Route path="/aas" element={<AAS />} />
                <Route path="/artikel" element={<Artikel />} />
                <Route path="/business-company" element={<BusinessCompany />} />
                <Route
                  path="/struktur-organisasi"
                  element={<StrukturOrganisasi />}
                />
                <Route path="/artikel/:id" element={<DetailArtikel />} />
              </Routes>

              <Footer />
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default App;
