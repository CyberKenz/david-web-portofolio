# David Andreas — Portofolio Personal Trainer

Website portofolio satu halaman untuk **David Andreas**, Personal Trainer di **Elluna Gym & MMA, Pontianak**.
Gaya visual "gym logbook": charcoal hangat, aksen burnt orange tunggal, tipografi Barlow Condensed + Barlow, garis 1px, ruang kosong editorial, dan motion seperlunya. Token dan keputusan desain terdokumentasi di `DESIGN.md`.

Dibangun dari [template-porto-pantai](https://github.com/ryhndastra/template-porto-pantai) (MIT). Komponen bertema pantai diganti dengan elemen gym.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Framer Motion
- Lenis (smooth scroll, otomatis nonaktif saat `prefers-reduced-motion`)
- Lucide + Simple Icons

## Struktur

```
src/
├─ data/portfolioData.ts   # satu sumber konten + placeholder TODO
├─ types/portfolio.ts
├─ hooks/                  # Lenis, scroll spy, clipboard
└─ components/
   ├─ navigation/          # navbar + menu mobile
   ├─ hero/                # hero, video, rep counter canvas
   ├─ about/
   ├─ specialties/         # daftar 5 spesialisasi
   ├─ journey/             # timeline scroll
   ├─ certification/
   ├─ gallery/             # grid + lightbox img/video
   ├─ contact/             # kanal kontak + footer
   ├─ common/              # gambar responsif, floating WA, brand icon
   └─ ui/
```

## Aset

- Asli (jangan dihapus): `public/assets/img/1–7.jpeg`, `public/assets/video/david_hero.mp4`, `public/assets/video/david_video.mp4`.
- Optimasi: `public/media/` berisi WebP + JPEG responsif (`480/800/1200`), `hero-loop.mp4/webm`, `gallery-promo.mp4/webm`, dan poster.
- `david_video.mp4` dipakai untuk hero loop 8 detik (dipangkas + 24 fps + tanpa audio).
- `david_hero.mp4` dipakai untuk video galeri; bagian bawah yang memuat kontak gym dipotong.
- Font self-hosted di `public/fonts/`: Barlow 400/500/600 dan Barlow Condensed 600/700.

## Dokumen desain

- `PRODUCT.md` — audiens, tujuan, fakta, dan batasan konten.
- `DESIGN.md` — token warna/tipe/spacing/radius/shadow, aturan layout, motion, dan responsive.
- `EVIDENCE.md` — ledger klaim dan placeholder.

## Perintah

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

## TODO data

Isi nilai berikut di `src/data/portfolioData.ts` sebelum publikasi:

1. Nomor WhatsApp (`profileData.whatsapp`) — saat ini `https://wa.me/` generik dan label “Nomor menyusul”.
2. Email (`profileData.email`) — `href` masih `null`.
3. Instagram (`profileData.instagram`) — `href` masih `null`.
4. Bulan/tahun sertifikasi Elluna Gym Foundation (timeline + sertifikasi).
5. Latar belakang latihan sebelum Desember 2025 (entri timeline "Menyusul").
6. Sertifikasi tambahan, jika ada.
7. Domain final untuk `og:image` absolut dan `robots.txt`/sitemap.

Belum ada data untuk testimoni, harga/paket, jumlah klien, dan nomor kontak, jadi tidak ditampilkan atau dikarang.

## Catatan performa & aksesibilitas

- Gambar WebP + JPEG fallback, `srcset`, `loading="lazy"`, dimensi eksplisit.
- Video `muted`, `playsInline`, `preload="none"`, poster; putar/jeda saat masuk/keluar viewport.
- Canvas rep counter berhenti saat keluar viewport atau tab tidak aktif.
- Lenis dan animasi dimatikan saat `prefers-reduced-motion: reduce`.
- Target sentuh minimal 48px, `dvh`, `env(safe-area-inset-*)`.
- Uji Lighthouse mobile: Performance 95, Accessibility 100, Best Practices 100, SEO 100.

## Lisensi

Kode template asal berlisensi MIT (lihat `LICENSE`). Aset foto/video milik David Andreas.
