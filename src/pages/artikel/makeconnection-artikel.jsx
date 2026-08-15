
import { useParams, Link } from "react-router-dom";

// Image
import ImageUtama from "../../assets/images/artikel&berita/mc-fgd.jpeg";
import ImageFGD from "../../assets/images/diskusi-fgd.jpeg";
import ImageFotbar from "../../assets/images/fotbar-unpad.jpeg";

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

        {/* Isi Artikel */}
        <div className="prose prose-lg prose-invert max-w-none prose-p:text-white/80 prose-p:leading-relaxed prose-headings:text-white prose-a:text-accent">
          
          <p>
            <strong>JATINANGOR</strong> — Dalam upaya memperluas cakrawala organisasi dan membangun jejaring akademis yang kuat, Himpunan Mahasiswa Sistem Informasi Universitas Singaperbangsa Karawang sukses menyelenggarakan salah satu program kerja unggulannya, "Make Connection" (MC). Pada kesempatan kali ini, kegiatan tersebut dilaksanakan melalui kolaborasi sinergis dengan program kerja milik Himpunan Mahasiswa Teknik Informatika (Himatif Unpad) yang bernama "Standing". Kolaborasi dua program kerja ini mengusung tajuk resmi "Make Connection × Standing" dengan tema kegiatan “Menjalin Relasi, Berbagi Inspirasi untuk Organisasi yang Berkualitas” dan berlangsung pada Sabtu, 9 Mei 2026.
          </p>

          <p className="text-justify">
            <br />Bertempat di Gedung Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA) Unpad, Jatinangor, pertemuan antara dua himpunan berbasis teknologi informasi ini berlangsung dengan hangat, interaktif, dan penuh semangat kolaboratif.
          </p>

          <h3 className="text-2xl font-bold mt-10 mb-4 text-accent">Sinergi Profil Organisasi dan Pertukaran Ide</h3>
          
          <p>Rangkaian acara "Make Connection × Standing" diawali dengan sesi pembukaan formal yang kemudian dilanjutkan dengan pemaparan profil masing-masing himpunan. Melalui sesi ini, baik Himsika maupun Himatif berkesempatan untuk mengenalkan visi, misi, struktur kepengurusan, serta program kerja unggulan yang menjadi fokus utama dalam periode kepengurusan masing-masing. Pemaparan ini membuka ruang diskusi awal mengenai perbedaan dan persamaan tantangan struktural yang dihadapi oleh kedua himpunan tersebut.</p>
          
            {/* FOTO DENGAN CAPTION */}
          <figure className="my-8">
            <div className="w-full rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-[#043761]/30">
              <img 
                src={ImageUtama} 
                alt="Foto Bersama Ketua Pelaksana" 
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" 
              />
            </div>
            <figcaption className="text-center text-sm text-white/60 italic mt-3">
              [Gambar 1. Foto bersama Ketua Pelaksana Make Connection & Ketua Himatif]
            </figcaption>
          </figure>

          <p>
            Setelah pengenalan struktural secara makro, agenda berlanjut ke inti kolaborasi, yaitu Focus Group Discussion (FGD). Dalam sesi FGD ini, para pengurus dari kedua himpunan dibagi ke dalam beberapa kelompok berdasarkan bidang kerja atau divisi yang setara (seperti divisi internal, eksternal, pengembangan sumber daya mahasiswa, hingga riset dan teknologi).
          </p>

          <p><br />Sesi diskusi kelompok ini berlangsung interaktif, di mana masing-masing himpunan saling bertukar pikiran mengenai efektivitas program kerja, pengelolaan konflik internal, hingga strategi adaptasi organisasi mahasiswa di tengah perkembangan teknologi yang dinamis.
</p>

            <figure className="my-8">
            <div className="w-full rounded-2xl overflow-hidden my-8 border border-white/10 shadow-xl bg-[#043761]/30">
            <img 
            src={ImageFGD} 
            alt="Suasana Diskusi FGD" 
            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <figcaption className="text-center text-sm text-white/60 italic mt-3">
              [Gambar 2. Sesi FGD yang berlangsung interaktif di sini]

            </figcaption>
          </figure>

          <h3 className="text-2xl font-bold mt-10 mb-4 text-accent">Mempererat Keakraban di Kampus Jatinangor</h3>
          
          <p>
            Setelah diskusi yang cukup mendalam dan produktif, rangkaian kegiatan ditutup dengan agenda yang lebih santai dan rekreatif, yaitu Campus Tour dimana kami mengelilingi kampus Unpad dipandu oleh teman-teman Himatif. Sembari menikmati suasana asri Jatinangor, momen ini dimanfaatkan oleh para peserta untuk saling berbincang secara informal, mempererat kedekatan personal, dan memperluas jaringan pertemanan antar-mahasiswa.
          </p>

          <p>
            <br />Kegiatan studi banding kolaboratif ini diakhiri dengan penyerahan plakat kenang-kenangan sebagai simbol dimulainya hubungan baik antara kedua belah pihak, diikuti dengan sesi foto bersama seluruh fungsionaris yang hadir.
          </p>

          <figure className="my-8">
            <div className="w-full rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-[#043761]/30">
              <img 
                src={ImageFotbar} 
                alt="Sesi foto bersama Himsika Unsika dan Himatif Unpad" 
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" 
              />
            </div>
            <figcaption className="text-center text-sm text-white/60 italic mt-3">
              [Gambar 3. Sesi foto bersama Himsika Unsika × Himatif Unpad]
            </figcaption>
          </figure>

          <p>Melalui kolaborasi "Make Connection × Standing" ini, Himsika Unsika tidak hanya membawa pulang perspektif baru dalam pengelolaan organisasi, tetapi juga berhasil meletakkan batu pertama bagi potensi kolaborasi akademis maupun non-akademis dengan Himatif Unpad di masa yang akan datang.
            </p>

          

        </div>
      </article>
    </main>
  );
}