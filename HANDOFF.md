# HANDOFF.md — Website Portofolio David Andreas

## Sumber desain

Sistem desain berasal dari `/home/ken/Downloads/src` + `/home/ken/Downloads/public` (screenshots-v3). Palet: cream `#f7efe3`, night `#242323`, brand (oranye) `#eb6b10`. Font: Plus Jakarta Sans (200–800) + JetBrains Mono (100–800). Motion: Framer Motion + Lenis smooth scroll. Animasi khusus: HeroScene (canvas partikel/ripple), RepCounter (drag pelat interaktif), Gallery lightbox, FloatingWhatsApp.

## Cara menjalankan

```bash
cd ~/david_web_portofolio
npm install
cp .env.example .env.local   # lalu isi GEMINI_API_KEY
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build → dist/
npm run preview    # serve dist/ di http://localhost:4173
```

## Chatbot asisten (Gemini)

- Tombol robot di kiri bawah (`ChatWidget`) membuka panel chat.
- Frontend hanya memanggil `POST /api/chat`. API key **tidak pernah** dikirim ke browser.
- `GEMINI_API_KEY` dibaca dari `.env.local` (dev, lewat Vite `loadEnv`) atau env var dashboard hosting (production). Jangan pakai prefix `VITE_`.
- Handler production: `api/chat.ts` (serverless, streaming plain text). Dev: middleware di `vite.config.ts` dengan logika yang sama.
- Model: `gemini-3.5-flash` (konstan `MODEL` di `api/chat.ts` dan `vite.config.ts`). `gemini-2.5-flash` sudah ditolak untuk API key baru.
- Batas: 500 karakter/pesan, 10 pesan konteks terakhir, rate limit 10 request/menit per IP.
- Isi jawaban hanya berasal dari `src/data/david-knowledge.ts` (knowledge base + system prompt). Update file itu bila data David berubah.
- Retry otomatis sekali bila model merespons 503 (high demand).

## Struktur kode

```
api/
  chat.ts               ← proxy Gemini (serverless: Vercel/Netlify)
src/
  App.tsx               ← shell: NavigationBar, 7 section, FloatingWhatsApp, ChatWidget, WaveDivider
  main.tsx              ← entry (StrictMode)
  index.css             ← @theme (palet, font, radius, shadow, type, spacing)
  data/portfolioData.ts ← semua konten (sumber tunggal)
  data/david-knowledge.ts ← knowledge base + system prompt chatbot
  types/portfolio.ts    ← tipe data
  hooks/                ← useLenisSmoothScroll, useScrollPosition, useChat
  components/
    navigation/         ← NavigationBar, MobileMenu
    hero/               ← HeroSection, HeroScene, HeroReel, HeroVideo, RepCounter
    about/              ← AboutSection (tabs: Tentang/Prinsip/Data + RepCounter)
    specialties/        ← SpecialtiesSection (bento grid 5 program)
    journey/            ← JourneyTimeline (scroll progress + motion)
    certification/      ← CertificationSection (card + badge)
    gallery/            ← GallerySection (masonry + lightbox dialog)
    contact/            ← ContactSection (channels + footer)
    chat/               ← ChatWidget, ChatMessage
    common/             ← BrandIcons, FloatingWhatsApp, ResponsiveImage, WaveDivider
    ui/                 ← buttonStyles
public/
  fonts/                ← plus-jakarta-sans.woff2, jetbrains-mono.woff2
  media/                ← gambar responsif (WebP+JPEG, multi-ukuran) + video
  assets/img/           ← aset asli David (1.jpeg–7.jpeg, daf_logo.png)
  assets/video/         ← aset asli David (david_video.mp4, david_hero.mp4)
  favicon.*, icon-*.png, apple-touch-icon.png, og-image.jpg, site.webmanifest
```

## Cara ubah konten

Semua konten David ada di `src/data/portfolioData.ts`. Field kosong (`null`/`"Menyusul"`) = tidak dirender atau ditampilkan sebagai "Menyusul".

- **Nomor WhatsApp** → isi `profileData.whatsapp.display` dan `profileData.whatsapp.href`
- **Email** → isi `profileData.email.display` dan `profileData.email.href`
- **Instagram** → isi `profileData.instagram.display` dan `profileData.instagram.href`
- **Tahun sertifikasi** → isi `certificationsData[0].year`
- **Latar belakang latihan sebelum Des 2025** → isi `timelineData[0]` (period, title, organization, description, tags)
- **5 spesialisasi** → edit `specializationsData` (title, englishTitle, description, points, icon)
- **Galeri** → edit `galleryData` (tambah/kurang item, ganti src media)
- **Copy hero/about** → edit `profileData.tagline`, `profileData.intro`, `profileData.aboutParagraphs`, `profileData.principles`
- **Jawaban chatbot** → edit `src/data/david-knowledge.ts` (knowledge base + aturan di system prompt)
- **Latihan interaktif (RepCounter)** → logika rep ada di `src/components/hero/RepCounter.tsx`: satu rep dihitung saat pelat ditarik melewati `OUT_THRESHOLD` (72% jarak) lalu kembali ke `IN_THRESHOLD` (22%) di dalam satu tarikan. Tombol "Tambah rep" tetap ada sebagai cadangan manual.

Setelah edit, jalankan `npm run build` dan periksa hasilnya.

## Daftar TODO(Ken)

- [x] Nomor WhatsApp David (format `62…`)
- [x] Alamat email David
- [x] Akun Instagram David
- [ ] Tahun/bulan sertifikasi Elluna Gym Foundation
- [x] Latar belakang latihan sebelum Desember 2025
- [ ] Testimoni klien (belum ada data)
- [ ] Harga/paket latihan (belum ada data)
- [ ] Jumlah klien (belum ada data)
- [ ] Foto tambahan (potret hero, foto gym, izin member)
- [ ] Keputusan: situs akan publik? Jika ya, pertimbangkan izin pemilik desain referensi
- [ ] Lighthouse mobile (Slow 4G + 4× CPU) — target Performance ≥90, A11y ≥95, BP ≥95, SEO ≥95; LCP <2.5s; CLS <0.05
- [ ] Optimasi media lebih lanjut (AVIF/WebP multi-ukuran)
- [ ] Rotasi `GEMINI_API_KEY` (kunci lama sempat dibagikan lewat chat)

## Hasil audit

### Audit bersih merek (grep -ri)

| Pola | src/ | dist/ |
|---|---|---|
| `alief` | 0 | 0 |
| `fauzan` | 0 | 0 |
| `G-LNWNCKVCS3` | 0 | 0 |
| `alieffauzan` | 0 | 0 |
| `googletagmanager` | 0 | 0 |

### Matriks viewport (QA)

| Lebar | scrollWidth == viewport | tap target ≥48px | teks terpotong |
|---|---|---|---|
| 390 | ✓ | ✓ | ✓ |
| 1440 | ✓ | ✓ | ✓ |

### Kontras WCAG AA (skrip `tools/check-contrast-v2.cjs`)

11/14 lulus. 3 gagal = pasangan aksen dekoratif (brand on cream, cream on brand, brandDark on cream) — bukan teks utama; teks utama (ink/muted/mutedDark/brandDeep) semua lulus.

### Skor kemiripan sistem (DESIGN.md §12)

Sistem desain sekarang berasal dari `/home/ken/Downloads` (screenshots-v3). Semua komponen, token, dan motion disalin dari sumber tersebut. David Andreas content (nama, gym, kota, usia, spesialisasi, sertifikasi, galeri) diisi dari `portfolioData.ts`.

### Performa

- Bundle: 467 KB JS (gzip 142 KB), 117 KB CSS (gzip 19 KB)
- Media: ResponsiveImage dengan WebP/JPEG srcset (480/800/1200)
- Video: hero-loop (mp4+webm), gallery-promo (mp4+webm) dengan poster
- Lighthouse: **belum dijalankan**

## File referensi

- `src/` — sumber kode (React + TS + Tailwind v4 + Framer Motion + Lenis)
- `public/` — aset statis (fonts, media, icons, favicon, og-image)
- `src/data/portfolioData.ts` — sumber tunggal konten
- `src/index.css` — @theme (palet, font, radius, shadow, type, spacing)
- `tools/check-contrast-v2.cjs` — skrip kontras palet baru
- `.slim/deepwork/` — state deepwork (migrasi-screenshots-v3 tombstone)
