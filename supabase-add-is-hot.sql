-- ============================================================
-- SQL UNTUK MENAMBAHKAN KOLOM IS_HOT PADA TABEL ARTIKEL
-- Jalankan di: https://supabase.com/dashboard/project/biobgsgvviddroqskway/sql
-- ============================================================

-- 1. Tambahkan kolom is_hot jika belum ada
ALTER TABLE public.artikel ADD COLUMN IF NOT EXISTS is_hot BOOLEAN DEFAULT false;

-- 2. Jadikan artikel dengan ID 6 (atau artikel terbaru) sebagai Berita Hot awal
UPDATE public.artikel SET is_hot = false;
UPDATE public.artikel SET is_hot = true WHERE id = 6;

-- 3. Muat ulang (reload) schema cache PostgREST agar API langsung mengenali kolom baru
NOTIFY pgrst, 'reload schema';
