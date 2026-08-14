import { Route, Routes } from "react-router-dom";
import Navbar from "./layout/Navbar";

import Beranda from "./pages/Beranda";
import Artikel from "./pages/Artikel";
import BusinessCompany from "./pages/BusinessCompany";
import DetailArtikel from "./pages/DetailArtikel"; // Sesuaikan lokasi foldernya
import StrukturOrganisasi from "./pages/StrukturOrganisasi";
import Footer from "./layout/Footer";

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Beranda />} />
        <Route path="/artikel" element={<Artikel />} />
        <Route path="/business-company" element={<BusinessCompany />} />
        <Route path="/struktur-organisasi" element={<StrukturOrganisasi />} />
        <Route path="/artikel/:id" element={<DetailArtikel />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
