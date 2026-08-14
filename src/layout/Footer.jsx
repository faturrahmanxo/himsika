import React from "react";
import { Link } from "react-router-dom";
import logoHimsika from "../assets/logo/logo-himsika.png";

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Akan otomatis mengambil tahun 2026

  return (
    <footer className="bg-primary font-primary text-primary-foreground pt-16 pb-8 border-t-[6px] border-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Konten Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Kolom 1: Brand & Deskripsi (Makan 2 kolom di layar besar) */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="flex items-center gap-3 mb-6 group inline-flex"
            >
              <div className="w-12 h-12 bg-white rounded-full p-1 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <img
                  src={logoHimsika}
                  alt="Logo HIMSIKA"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-white group-hover:text-accent transition-colors">
                  HIMSIKA
                </h2>
                <p className="text-[10px] sm:text-xs font-bold text-accent tracking-widest uppercase">
                  Sistem Informasi UNSIKA
                </p>
              </div>
            </Link>

            <p className="text-primary-foreground/70 leading-relaxed max-w-md mb-8 text-sm sm:text-base">
              Wadah eksplorasi, inovasi, dan pengembangan karakter untuk
              membentuk talenta digital masa depan yang kompeten dan
              kolaboratif.
            </p>

            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-primary-foreground/80 hover:bg-accent hover:border-accent hover:text-accent-foreground hover:-translate-y-1 transition-all duration-300"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-primary-foreground/80 hover:bg-accent hover:border-accent hover:text-accent-foreground hover:-translate-y-1 transition-all duration-300"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-primary-foreground/80 hover:bg-accent hover:border-accent hover:text-accent-foreground hover:-translate-y-1 transition-all duration-300"
              >
                <span className="sr-only">YouTube</span>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Kolom 2: Tautan Cepat */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 border-b-2 border-accent inline-block pb-1">
              Tautan Cepat
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-primary-foreground/70 hover:text-accent transition-colors flex items-center group"
                >
                  <span className="mr-2 text-accent opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                    ›
                  </span>{" "}
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  to="/sejarah-himsika"
                  className="text-primary-foreground/70 hover:text-accent transition-colors flex items-center group"
                >
                  <span className="mr-2 text-accent opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                    ›
                  </span>{" "}
                  Profil Himpunan
                </Link>
              </li>
              <li>
                <Link
                  to="/event"
                  className="text-primary-foreground/70 hover:text-accent transition-colors flex items-center group"
                >
                  <span className="mr-2 text-accent opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                    ›
                  </span>{" "}
                  Program & Event
                </Link>
              </li>
              <li>
                <Link
                  to="/artikel"
                  className="text-primary-foreground/70 hover:text-accent transition-colors flex items-center group"
                >
                  <span className="mr-2 text-accent opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                    ›
                  </span>{" "}
                  Artikel & Berita
                </Link>
              </li>
              <li>
                <Link
                  to="/business-company"
                  className="text-primary-foreground/70 hover:text-accent transition-colors flex items-center group"
                >
                  <span className="mr-2 text-accent opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                    ›
                  </span>{" "}
                  Business Company
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Kontak Kami */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 border-b-2 border-accent inline-block pb-1">
              Hubungi Kami
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-accent mt-1 mr-3 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-primary-foreground/70 text-sm leading-relaxed">
                  Gedung Fakultas Ilmu Komputer,
                  <br />
                  Universitas Singaperbangsa Karawang,
                  <br />
                  Jl. HS.Ronggo Waluyo, Karawang
                </span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-accent mr-3 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:himsika@unsika.ac.id"
                  className="text-primary-foreground/70 text-sm hover:text-accent transition-colors"
                >
                  himsika@unsika.ac.id
                </a>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-accent mr-3 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="text-primary-foreground/70 text-sm">
                  +62 812-XXXX-XXXX (Humas)
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/60 text-center md:text-left">
            &copy; {currentYear} HIMSIKA UNSIKA. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-primary-foreground/60">
            <Link to="#" className="hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="#" className="hover:text-accent transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
