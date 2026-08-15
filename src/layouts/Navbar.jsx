import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logoHimsika from "../assets/logo/HIMSIKA.png";

// Data Announcement diubah menjadi Array agar bisa menampung banyak event
export const announcementData = [
  {
    id: 1,
    text: "Pendaftaran Event ISCT 2026 telah dibuka, kuota terbatas!",
    linkText: "Daftar sekarang",
    linkTo: "/isct",
  },
  {
    id: 2,
    text: "Ikuti Education Fair dan persiapkan karier masa depanmu!",
    linkText: "Cek detailnya",
    linkTo: "/education-fair",
  },
  {
    id: 3,
    text: "Jangan lewatkan LKMMPD untuk mahasiswa baru.",
    linkText: "Info lengkap",
    linkTo: "/lkmmpd",
  },
];

export const navMenu = [
  { id: 1, label: "Beranda", to: "/", children: [] },
  {
    id: 2,
    label: "Profil",
    to: null,
    children: [
      { label: "Logo", to: "/logo-himsika" },
      { label: "Sejarah", to: "/sejarah-himsika" },
      { label: "Visi Misi", to: "/visi-misi" },
      { label: "Struktur Organisasi", to: "/struktur-organisasi" },
      { label: "Galeri Kegiatan", to: "/galeri-kegiatan" },
    ],
  },
  { id: 3, label: "Artikel & Berita", to: "/artikel", children: [] },
  {
    id: 4,
    label: "Events",
    to: null,
    children: [
      { label: "Education Fair", to: "/education-fair" },
      { label: "ISCT", to: "/isct" },
      { label: "Make Connection", to: "/make-connection" },
      { label: "LKMMPD", to: "/lkmmpd" },
      { label: "ISGATH", to: "/isgath" },
      { label: "Study Club", to: "/study-club" },
      { label: "Revoist", to: "/revoist" },
      { label: "AAS", to: "/aas" },
    ],
  },
  { id: 5, label: "Business Company", to: "/business-company", children: [] },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // State untuk Announcement Bar Carousel
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [fadeAnim, setFadeAnim] = useState(true);

  const location = useLocation();

  // Effect untuk mendeteksi scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Effect untuk Carousel Announcement (Ganti otomatis setiap 4 detik)
  useEffect(() => {
    if (announcementData.length <= 1) return;

    const interval = setInterval(() => {
      setFadeAnim(false);

      setTimeout(() => {
        setCurrentAnnouncementIndex(
          (prevIndex) => (prevIndex + 1) % announcementData.length,
        );
        setFadeAnim(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setActiveMobileDropdown(null);
  };

  const toggleMobileDropdown = (id) => {
    setActiveMobileDropdown(activeMobileDropdown === id ? null : id);
  };

  const currentAnnouncement = announcementData[currentAnnouncementIndex];

  return (
    <header className="fixed top-0 w-full z-50 font-primary flex flex-col">
      {/* Announcement Bar - Permanen, Tidak bisa di-close */}
      {announcementData.length > 0 && (
        <div className="bg-yellow-400 relative h-9 sm:h-10 flex items-center justify-center overflow-hidden z-50">
          <div
            className={`w-full max-w-7xl px-4 text-center text-xs sm:text-sm text-gray-900 font-semibold tracking-wide transition-all duration-300 ease-in-out ${
              fadeAnim
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2"
            }`}
          >
            {currentAnnouncement.text}{" "}
            <Link
              to={currentAnnouncement.linkTo}
              className="text-blue-700 hover:text-blue-900 underline decoration-blue-700/50 hover:decoration-blue-900 ml-1 transition-colors"
            >
              {currentAnnouncement.linkText}
            </Link>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <nav
        className={`w-full relative transition-all duration-400 ease-in-out border-b ${
          isScrolled
            ? "bg-primary/85 backdrop-blur-lg border-white/10 shadow-lg"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex justify-between items-center transition-all duration-400 ${
              isScrolled ? "h-16" : "h-18"
            }`}
          >
            {/* Logo / Brand (DIPERBAIKI: Anti push hamburger) */}
            <Link
              to="/"
              className="shrink-0 flex items-center group max-w-[70vw] lg:max-w-none pr-2"
            >
              <img
                src={logoHimsika}
                alt="Logo HIMSIKA"
                className="w-11 h-11 sm:w-12 sm:h-12 mr-2.5 transform group-hover:scale-105 transition-transform duration-300 shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-lg sm:text-xl transition-all duration-300 group-hover:translate-x-1 font-bold text-accent tracking-tight leading-tight">
                  HIMSIKA
                </span>
                <span className="text-xs font-medium transition-all duration-300 group-hover:translate-x-3 text-gray-300 whitespace-normal leading-tight">
                  Kembangkan Potensi Ciptakan Prestasi
                </span>
              </div>
            </Link>

            {/* Desktop Menu (DIPERBAIKI: lg:flex dan whitespace-nowrap) */}
            <div className="hidden lg:flex space-x-1 xl:space-x-2 items-center h-full">
              {navMenu.map((item) => {
                const isActive =
                  location.pathname === item.to ||
                  (item.children &&
                    item.children.some(
                      (child) => child.to === location.pathname,
                    ));

                return (
                  <div
                    key={item.id}
                    className="relative group h-full flex items-center px-0.5"
                  >
                    {item.children.length > 0 ? (
                      <button
                        className={`flex items-center px-3 xl:px-4 py-2 text-sm xl:text-base rounded-full font-medium transition-all duration-300 whitespace-nowrap ${
                          isActive
                            ? "bg-white/10 text-accent"
                            : "text-white/90 hover:bg-white/10 hover:text-accent"
                        }`}
                      >
                        {item.label}
                        <svg
                          className="ml-1.5 w-4 h-4 transform group-hover:-rotate-180 transition-transform duration-300 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    ) : (
                      <Link
                        to={item.to}
                        className={`px-3 xl:px-4 py-2 text-sm xl:text-base rounded-full font-medium transition-all duration-300 whitespace-nowrap ${
                          isActive
                            ? "bg-white/10 text-accent"
                            : "text-white/90 hover:bg-white/10 hover:text-accent"
                        }`}
                      >
                        {item.label}
                      </Link>
                    )}

                    {/* Dropdown Content (Desktop) */}
                    {item.children.length > 0 && (
                      <div className="absolute left-0 top-[85%] pt-4 w-56 opacity-0 invisible translate-y-3 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out z-50">
                        <div className="bg-primary/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2.5 overflow-hidden">
                          {item.children.map((child, index) => (
                            <Link
                              key={index}
                              to={child.to}
                              className={`block px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap overflow-hidden text-ellipsis ${
                                location.pathname === child.to
                                  ? "bg-white/10 text-accent"
                                  : "text-white/80 hover:bg-white/5 hover:text-accent hover:translate-x-1"
                              }`}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Hamburger Button (Mobile - DIPERBAIKI: lg:hidden dan shrink-0) */}
            <div className="flex items-center lg:hidden shrink-0">
              <button
                onClick={toggleMobileMenu}
                className="text-white hover:text-accent focus:outline-none p-2 bg-white/5 rounded-full border border-white/10"
                aria-label="Toggle Menu"
              >
                <div className="w-5 h-[14px] relative flex flex-col justify-between items-center mx-0.5">
                  <span
                    className={`block w-full h-[2px] bg-current rounded-full transition-transform duration-300 ease-in-out origin-center ${
                      isMobileMenuOpen ? "translate-y-[6px] rotate-45" : ""
                    }`}
                  />
                  <span
                    className={`block w-full h-[2px] bg-current rounded-full transition-opacity duration-300 ease-in-out ${
                      isMobileMenuOpen ? "opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`block w-full h-[2px] bg-current rounded-full transition-transform duration-300 ease-in-out origin-center ${
                      isMobileMenuOpen ? "-translate-y-[6px] -rotate-45" : ""
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden absolute top-full left-0 w-full overflow-hidden transition-all duration-500 ease-in-out shadow-2xl ${
            isMobileMenuOpen
              ? "max-h-[85vh] opacity-100" /* DIPERBAIKI: Hapus overflow-y-auto dari sini */
              : "max-h-0 opacity-0"
          }`}
        >
          {/* TAMBAHAN: Bungkus dengan div khusus untuk scroll agar scrollbar tidak berkedip saat animasi */}
          <div className="max-h-[85vh] overflow-y-auto">
            <div className="bg-primary/95 backdrop-blur-xl border-t border-white/10 px-4 pt-4 pb-6 space-y-2">
              {navMenu.map((item) => (
                <div key={item.id}>
                  {item.children.length > 0 ? (
                    <>
                      <button
                        onClick={() => toggleMobileDropdown(item.id)}
                        className="w-full flex justify-between items-center px-4 py-3 text-base font-medium text-white hover:text-accent bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                      >
                        {item.label}
                        <svg
                          className={`w-4 h-4 transform transition-transform duration-300 ${
                            activeMobileDropdown === item.id
                              ? "rotate-180 text-accent"
                              : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          activeMobileDropdown === item.id
                            ? "max-h-[400px] opacity-100 mt-2 mb-3"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="pl-4 pr-2 py-2 space-y-1 border-l-2 border-white/10 ml-6">
                          {item.children.map((child, index) => (
                            <Link
                              key={index}
                              to={child.to}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                                location.pathname === child.to
                                  ? "text-accent bg-white/10"
                                  : "text-white/80 hover:text-accent hover:bg-white/5"
                              }`}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      to={item.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                        location.pathname === item.to
                          ? "text-accent bg-white/10"
                          : "text-white hover:text-accent bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
