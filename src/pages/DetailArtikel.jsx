
import { useParams, Link } from "react-router-dom";

// IMPORT GAMBAR YANG BARU KAMU UPLOAD
import ImageUtama from "../assets/images/mc-fgd.jpeg";

export default function DetailArtikel() {
  const { id } = useParams();

  return (
    <main className="min-h-screen bg-linear-to-b from-[#043761] via-primary to-[#043761] font-primary pt-32 pb-20 selection:bg-accent selection:text-slate-900">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
        
        {/* Tombol Kembali */}
        <Link 
          to="/artikel" 
          className="inline-flex items-center gap-2 text-white/70 hover:text-accent transition-colors mb-8 font-bold text-sm uppercase tracking-widest"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Berita
        </Link>

        {/* Header Artikel */}
        <header className="mb-10 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-4 text-sm font-bold uppercase tracking-widest text-accent/80">
            <span className="text-accent bg-accent/10 px-3 py-1 rounded-full">Kegiatan</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
            <time dateTime="2026-05-09" className="text-white/60">09 Mei 2026</time>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
            Pererat Hubungan dan Berbagi Inovasi, HIMSIKA UNSIKA Gelar Studi Banding "Make Connection × Standing" Bersama HIMATIF UNPAD
          </h1>
        </header>

        {/* Gambar Utama (Memanggil gambar mc-fjd.jpeg) */}
        <div className="w-full aspect-video rounded-3xl overflow-hidden border border-white/10 mb-12 shadow-2xl bg-[#043761]/50">
          <img src={ImageUtama} alt="Foto Kegiatan" className="w-full h-full object-cover" />
        </div>

        {/* Isi Artikel */}
        <div className="prose prose-lg prose-invert max-w-none prose-p:text-white/80 prose-p:leading-relaxed prose-headings:text-white prose-a:text-accent">
          
          <p>
            <strong>JATINANGOR</strong> — Dalam upaya memperluas cakrawala organisasi dan membangun jejaring akademis yang kuat, Himpunan Mahasiswa Sistem Informasi Universitas Singaperbangsa Karawang sukses menyelenggarakan salah satu program kerja unggulannya, "Make Connection" (MC). Pada kesempatan kali ini, kegiatan tersebut dilaksanakan melalui kolaborasi sinergis dengan program kerja milik Himpunan Mahasiswa Teknik Informatika (Himatif Unpad) yang bernama "Standing". Kolaborasi dua program kerja ini mengusung tajuk resmi "Make Connection × Standing" dengan tema kegiatan “Menjalin Relasi, Berbagi Inspirasi untuk Organisasi yang Berkualitas” dan berlangsung pada Sabtu, 9 Mei 2026.
          </p>

          <h3 className="text-2xl font-bold mt-10 mb-4 text-accent">Sinergi Profil Organisasi dan Pertukaran Ide</h3>
          <p>
            Rangkaian acara diawali dengan sesi pembukaan formal yang kemudian dilanjutkan dengan pemaparan profil masing-masing himpunan. Melalui sesi ini, baik pengurus dari Unsika maupun Unpad berkesempatan untuk mengenalkan visi, misi, struktur kepengurusan, serta program kerja unggulan.
          </p>

          <p>
            Setelah pengenalan struktural secara makro, agenda berlanjut ke inti kolaborasi, yaitu Focus Group Discussion (FGD). Dalam sesi FGD ini, para pengurus dibagi ke dalam beberapa kelompok berdasarkan bidang kerja atau divisi yang setara. Sesi diskusi ini berlangsung interaktif, di mana masing-masing pihak saling bertukar pikiran mengenai efektivitas program kerja dan strategi adaptasi organisasi mahasiswa.
          </p>

          <h3 className="text-2xl font-bold mt-10 mb-4 text-accent">Mempererat Keakraban di Kampus Jatinangor</h3>
          <p>
            Setelah diskusi yang cukup mendalam dan produktif, rangkaian kegiatan ditutup dengan agenda yang lebih santai dan rekreatif, yaitu Campus Tour di mana kami mengelilingi kampus dipandu oleh teman-teman Himatif. Sembari menikmati suasana asri Jatinangor, momen ini dimanfaatkan oleh para peserta untuk saling berbincang secara informal.
          </p>

          <p>
            Kegiatan studi banding kolaboratif ini diakhiri dengan penyerahan plakat kenang-kenangan sebagai simbol dimulainya hubungan baik antara kedua belah pihak. Melalui kolaborasi ini, diharapkan tidak hanya membawa pulang perspektif baru dalam pengelolaan organisasi, tetapi juga meletakkan batu pertama bagi potensi kolaborasi di masa yang akan datang.
          </p>

        </div>
      </article>
    </main>
  );
}