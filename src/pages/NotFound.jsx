import { Link } from "react-router-dom";
import { Home, Newspaper, Mail, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-primary text-white">
      {/* Background Motif Identitas (Sama dengan halaman Logo & Profil) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]"></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[32rem] w-[32rem] rounded-full bg-accent/10 blur-[150px]"></div>
      </div>

      <div className="relative z-10 max-w-xl mx-auto text-center">
        {/* Lencana Status */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-bold uppercase tracking-widest mb-6">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
          Error 404 // Halaman Tidak Ditemukan
        </div>

        {/* 404 Besar */}
        <div className="relative select-none my-2">
          <span className="text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white/90 via-white/40 to-white/10 tracking-tight">
            404
          </span>
        </div>

        {/* Pesan & Penjelasan */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
          Tautan yang Kamu Buka Tidak Tersedia
        </h1>
        <p className="text-sm sm:text-base text-white/70 max-w-md mx-auto leading-relaxed mb-8">
          Alamat URL yang kamu tuju mungkin salah ketik, sudah dipindahkan ke alamat baru, atau tidak lagi tersedia di sistem.
        </p>

        {/* Tombol Aksi Cepat */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-[#043761] hover:bg-[#ffcf33] font-bold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(255,195,0,0.25)] hover:scale-105"
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
          <Link
            to="/artikel"
            className="inline-flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/15 text-white/90 hover:text-white font-semibold text-sm rounded-xl transition-all"
          >
            <Newspaper className="w-4 h-4 text-accent" />
            Artikel & Berita
          </Link>
          <Link
            to="/kontak"
            className="inline-flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/15 text-white/90 hover:text-white font-semibold text-sm rounded-xl transition-all"
          >
            <Mail className="w-4 h-4 text-accent" />
            Hubungi Kami
          </Link>
        </div>
      </div>
    </main>
  );
}
