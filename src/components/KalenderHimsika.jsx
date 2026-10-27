import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Clock,
  Tag,
  Sparkles,
  ListFilter,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  EVENTS_HIMSIKA_2026,
  BULAN_LIST,
  KATEGORI_COLORS,
} from "../data/kalenderTahunan";

const HARI = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const CANVA_URL =
  "https://www.canva.com/design/DAG_nvg0Bb8/eEwmnf1uW9NTyH8C7I2isw/view?utm_content=DAG_nvg0Bb8&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h425fe41932#1";

/* ----------------------------------------------------------------
   Utilitas
----------------------------------------------------------------- */
function getEventsForDay(monthId, day) {
  return EVENTS_HIMSIKA_2026.filter(
    (ev) => ev.bulan === monthId && ev.dates.includes(day)
  );
}

function getEventsForMonth(monthId) {
  return EVENTS_HIMSIKA_2026.filter((ev) => ev.bulan === monthId);
}

/* Kategori unik yang benar-benar dipakai di data */
const KATEGORI_AKTIF = Object.keys(KATEGORI_COLORS).filter((k) =>
  EVENTS_HIMSIKA_2026.some((ev) => ev.kategori === k)
);

/* ----------------------------------------------------------------
   Sub-komponen: Kartu Detail Event
----------------------------------------------------------------- */
function EventCard({ event }) {
  const warna = KATEGORI_COLORS[event.kategori] || KATEGORI_COLORS.Organisasi;

  const inner = (
    <>
      <div
        className="absolute left-0 top-0 h-full w-1.5 rounded-l-2xl"
        style={{ backgroundColor: event.dotColor }}
      />
      <div className="pl-4">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${warna.badge} ${warna.border}`}
          >
            <Tag className="w-3 h-3" />
            {event.kategori}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/60">
            <Clock className="w-3 h-3 text-accent" />
            {event.tanggal}
          </span>
        </div>

        <h4 className="text-base sm:text-lg font-bold text-white leading-snug group-hover:text-accent transition-colors">
          {event.judul}
        </h4>

        <p className="text-xs sm:text-sm text-white/65 leading-relaxed mt-2">
          {event.deskripsi}
        </p>

        {event.link && (
          <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-accent group-hover:gap-2.5 transition-all">
            Lihat detail program
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        )}
      </div>
    </>
  );

  const base =
    "group relative block w-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-accent/40 rounded-2xl p-5 transition-all duration-300 overflow-hidden";

  if (event.link) {
    return (
      <Link to={event.link} className={base}>
        {inner}
      </Link>
    );
  }
  return <div className={base}>{inner}</div>;
}

/* ----------------------------------------------------------------
   Sub-komponen: Grid Satu Bulan
----------------------------------------------------------------- */
function MonthGrid({ month, onPickDay, selectedDay }) {
  const cells = [];
  for (let i = 0; i < month.startDay; i++) cells.push(null);
  for (let d = 1; d <= month.days; d++) cells.push(d);

  return (
    <div>
      {/* Header hari */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mb-1.5">
        {HARI.map((h) => (
          <div
            key={h}
            className={`text-center text-[10px] sm:text-[11px] font-bold uppercase tracking-wider py-1 ${
              h === "Min" ? "text-rose-400/70" : "text-white/40"
            }`}
          >
            {h}
          </div>
        ))}
      </div>

      {/* Sel tanggal */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {cells.map((day, idx) => {
          if (day === null)
            return <div key={`e-${idx}`} className="aspect-square" />;

          const dayEvents = getEventsForDay(month.id, day);
          const has = dayEvents.length > 0;
          const isActive = selectedDay === day;
          const first = dayEvents[0];

          return (
            <button
              key={day}
              type="button"
              onClick={() => has && onPickDay(day)}
              disabled={!has}
              title={has ? dayEvents.map((e) => e.judul).join(" • ") : ""}
              className={`relative aspect-square rounded-lg sm:rounded-xl flex flex-col items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-200 border ${
                has
                  ? "cursor-pointer border-transparent text-white hover:scale-[1.06]"
                  : "cursor-default border-white/[0.06] text-white/35"
              } ${isActive ? "ring-2 ring-accent ring-offset-1 ring-offset-[#043761]" : ""}`}
              style={
                has
                  ? {
                      backgroundColor: `${first.dotColor}26`,
                      borderColor: `${first.dotColor}80`,
                    }
                  : undefined
              }
            >
              <span className={has ? "font-bold" : ""}>{day}</span>

              {/* Dot indikator jumlah event */}
              {has && (
                <span className="absolute bottom-1 sm:bottom-1.5 flex gap-0.5">
                  {dayEvents.slice(0, 3).map((e, i) => (
                    <span
                      key={i}
                      className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full"
                      style={{ backgroundColor: e.dotColor }}
                    />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
   KOMPONEN UTAMA
----------------------------------------------------------------- */
export default function KalenderHimsika() {
  // Bulan pertama yang benar-benar punya agenda (biar tidak terbuka di bulan kosong)
  const bulanAwal = useMemo(() => {
    const first = BULAN_LIST.find((m) =>
      EVENTS_HIMSIKA_2026.some((ev) => ev.bulan === m.id)
    );
    return first ? first.id : 1;
  }, []);

  const [activeMonth, setActiveMonth] = useState(bulanAwal);
  const [selectedDay, setSelectedDay] = useState(null);
  const [view, setView] = useState("bulan"); // "bulan" | "semua"

  const month = BULAN_LIST.find((m) => m.id === activeMonth);
  const monthEvents = useMemo(() => getEventsForMonth(activeMonth), [activeMonth]);

  const dayEvents = useMemo(
    () => (selectedDay ? getEventsForDay(activeMonth, selectedDay) : []),
    [activeMonth, selectedDay]
  );

  const goMonth = (dir) => {
    setSelectedDay(null);
    setActiveMonth((prev) => {
      const next = prev + dir;
      if (next < 1) return 12;
      if (next > 12) return 1;
      return next;
    });
  };

  const pickDay = (day) => setSelectedDay((prev) => (prev === day ? null : day));

  const totalEvent = EVENTS_HIMSIKA_2026.length;

  return (
    <div className="w-full">
      {/* ---------- Legend Kategori ---------- */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
        {KATEGORI_AKTIF.map((k) => (
          <span
            key={k}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold border ${KATEGORI_COLORS[k].badge} ${KATEGORI_COLORS[k].border}`}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: KATEGORI_COLORS[k].dot }}
            />
            {k}
          </span>
        ))}
      </div>

      {/* ---------- Toolbar: Nav Bulan + Toggle View ---------- */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-white/[0.04] border border-white/10 rounded-2xl p-3 sm:p-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goMonth(-1)}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-accent hover:text-deep border border-white/10 flex items-center justify-center transition-all cursor-pointer"
            aria-label="Bulan sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="min-w-[9.5rem] text-center">
            <div className="text-base sm:text-lg font-black text-white leading-none">
              {month.nama}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent mt-1">
              Tahun 2026
            </div>
          </div>

          <button
            type="button"
            onClick={() => goMonth(1)}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-accent hover:text-deep border border-white/10 flex items-center justify-center transition-all cursor-pointer"
            aria-label="Bulan berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/50 mr-1">
            <CalendarDays className="w-3.5 h-3.5 text-accent" />
            {totalEvent} agenda sepanjang 2026
          </span>

          <div className="flex p-1 rounded-xl bg-deep/70 border border-white/10">
            <button
              type="button"
              onClick={() => setView("bulan")}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                view === "bulan"
                  ? "bg-accent text-deep"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Kalender
            </button>
            <button
              type="button"
              onClick={() => setView("semua")}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                view === "semua"
                  ? "bg-accent text-deep"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <ListFilter className="w-3 h-3" />
              Semua Agenda
            </button>
          </div>
        </div>
      </div>

      {/* ---------- Pilih Bulan Cepat ---------- */}
      <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-8">
        {BULAN_LIST.map((m) => {
          const count = getEventsForMonth(m.id).length;
          const isActive = m.id === activeMonth;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setActiveMonth(m.id);
                setSelectedDay(null);
                setView("bulan");
              }}
              className={`relative px-3 sm:px-3.5 py-2 rounded-xl text-[11px] sm:text-xs font-bold border transition-all cursor-pointer ${
                isActive
                  ? "bg-accent text-deep border-accent shadow-[0_0_18px_rgba(255,195,0,0.35)]"
                  : "bg-white/[0.04] text-white/70 border-white/10 hover:border-accent/50 hover:text-white"
              }`}
            >
              {m.short}
              {count > 0 && (
                <span
                  className={`ml-1.5 inline-flex items-center justify-center min-w-[1.05rem] h-[1.05rem] px-1 rounded-full text-[9px] font-black ${
                    isActive ? "bg-deep/20 text-deep" : "bg-accent/20 text-accent"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ---------- Konten ---------- */}
      <AnimatePresence mode="wait">
        {view === "bulan" ? (
          <motion.div
            key={`grid-${activeMonth}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8"
          >
            {/* Kalender */}
            <div className="lg:col-span-7">
              <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-4 sm:p-6 backdrop-blur-sm">
                <MonthGrid
                  month={month}
                  onPickDay={pickDay}
                  selectedDay={selectedDay}
                />

                <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-white/45">
                    Klik tanggal berwarna untuk melihat agenda.
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-accent">
                    <Sparkles className="w-3.5 h-3.5" />
                    {monthEvents.length} agenda di {month.nama}
                  </span>
                </div>
              </div>
            </div>

            {/* Daftar Agenda Bulan / Hari Terpilih */}
            <div className="lg:col-span-5">
              <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-4 sm:p-6 h-full backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">
                    {selectedDay
                      ? `Agenda ${selectedDay} ${month.nama}`
                      : `Agenda ${month.nama}`}
                  </h4>
                  {selectedDay && (
                    <button
                      type="button"
                      onClick={() => setSelectedDay(null)}
                      className="text-[10px] font-bold text-accent hover:underline cursor-pointer"
                    >
                      Lihat semua
                    </button>
                  )}
                </div>

                <div className="space-y-3 max-h-[32rem] overflow-y-auto pr-1 custom-scroll">
                  {(selectedDay ? dayEvents : monthEvents).length === 0 ? (
                    <div className="text-center py-14">
                      <CalendarDays className="w-10 h-10 text-white/15 mx-auto mb-3" />
                      <p className="text-xs text-white/45">
                        Tidak ada agenda pada periode ini.
                      </p>
                    </div>
                  ) : (
                    (selectedDay ? dayEvents : monthEvents).map((ev) => (
                      <EventCard key={ev.id} event={ev} />
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ---------- VIEW: SEMUA AGENDA (Grouped per Bulan) ---------- */
          <motion.div
            key="semua"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-10"
          >
            {BULAN_LIST.map((m) => {
              const evs = getEventsForMonth(m.id);
              if (evs.length === 0) return null;
              return (
                <div key={m.id}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-1.5 h-6 bg-accent rounded-full" />
                    <h4 className="text-lg sm:text-xl font-black text-white">
                      {m.nama}
                      <span className="text-accent ml-2 text-sm font-bold">
                        2026
                      </span>
                    </h4>
                    <span className="text-[10px] font-bold text-white/40 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                      {evs.length} agenda
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {evs.map((ev) => (
                      <EventCard key={ev.id} event={ev} />
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- Footer: Sumber / Canva ---------- */}
      <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href={CANVA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-accent text-deep font-bold text-xs sm:text-sm transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(255,195,0,0.45)]"
        >
          <CalendarDays className="w-4 h-4" />
          Lihat Kalender HIMSIKA (Canva)
          <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
        <Link
          to="/kontak"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/20 text-white/90 font-bold text-xs sm:text-sm hover:bg-white/10 hover:border-accent/50 transition-all"
        >
          Ada agenda kolaborasi? Hubungi Kami
        </Link>
      </div>
    </div>
  );
}
