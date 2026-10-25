import type {
  Certification,
  ContactChannel,
  GalleryItem,
  ProfileData,
  Specialization,
  TimelineEntry
} from '../types/portfolio';

/**
 * Sumber tunggal konten situs.
 *
 * Aturan data:
 * - Hanya fakta yang diberikan pemilik data yang ditulis di sini.
 * - Bagian yang belum diketahui ditandai `// TODO` dan dirender sebagai
 *   "Menyusul" / slot placeholder di UI. Jangan mengganti dengan angka karangan.
 *
 * TODO yang masih terbuka:
 * - Nomor WhatsApp David.
 * - Alamat email David.
 * - Akun Instagram David.
 * - Tahun / bulan sertifikasi Elluna Gym Foundation.
 * - Latar belakang latihan sebelum Desember 2025.
 * - Testimoni klien (belum ada data).
 * - Harga / paket latihan (belum ada data).
 * - Jumlah klien (belum ada data).
 */

export const profileData: ProfileData = {
  name: 'David Andreas',
  shortName: 'David',
  role: 'Personal Trainer',
  gym: 'Elluna Gym & MMA',
  city: 'Pontianak',
  age: 19,
  startPeriod: 'Desember 2025',
  tagline: 'Teknik dulu. Beban kemudian.',
  intro:
    'Personal Trainer di Elluna Gym & MMA, Pontianak. Usia 19 tahun. Fokus pada muscle gain, fat loss, basic fitness, strength, dan functional training.',
  aboutParagraphs: [
    "Saya David Andreas, Personal Trainer di Elluna Gym & MMA, Pontianak. Saya bergabung sejak Desember 2025 dan hingga kini masih aktif mendampingi para member dalam mencapai target kebugaran mereka. Di usia 19 tahun, saya memilih untuk berfokus pada lima area latihan: muscle gain, fat loss, basic fitness training, strength training, dan functional training. Kelimanya saya jalankan dengan pendekatan yang terstruktur, bertahap, dan disesuaikan dengan kondisi serta tujuan masing-masing individu, karena saya meyakini bahwa setiap orang memiliki titik awal dan kebutuhan yang berbeda. Dalam setiap sesi, saya mengutamakan teknik yang benar, keamanan, dan konsistensi agar hasil yang diperoleh dapat bertahan dalam jangka panjang. Sebagai bentuk komitmen terhadap standar profesional, saya memegang sertifikasi Elluna Gym Foundation yang menjadi landasan dalam praktik kepelatihan saya. Saya terus berkomitmen untuk belajar, berkembang, dan memberikan pendampingan yang berkualitas bagi setiap klien."
  ],
  principles: ['Teknik sebelum beban.', 'Konsisten mengalahkan cepat.', 'Latihan mengikuti tujuan, bukan tren.'],
  avatar: {
    base: '/media/about-david',
    widths: [480, 800, 1200],
    width: 1200,
    height: 1600,
    alt: 'David Andreas berdiri di depan banner Elluna Gym & MMA pada malam hari'
  },
  whatsapp: {
    display: '081255854107',
    href: 'https://wa.me/6281255854107'
  },
  email: {
    display: 'davidandreas312@gmail.com',
    href: 'mailto:davidandreas312@gmail.com'
  },
  instagram: {
    display: '@davittt.dreas',
    href: 'https://instagram.com/davittt.dreas'
  },
  location: {
    label: 'Pontianak, Kalimantan Barat',
    place: 'Elluna Gym & MMA',
    mapsHref: null
  }
};

export const specializationsData: Specialization[] = [
  {
    id: 'muscle-gain',
    index: '01',
    title: 'Muscle Gain',
    englishTitle: 'Hipertrofi',
    description:
      'Latihan beban untuk membangun massa otot, dengan penekanan pada teknik gerakan dan beban yang naik bertahap.',
    points: ['Gerakan multi-sendi', 'Volume latihan', 'Beban bertahap'],
    icon: 'muscle'
  },
  {
    id: 'fat-loss',
    index: '02',
    title: 'Fat Loss',
    englishTitle: 'Komposisi tubuh',
    description:
      'Kombinasi latihan beban dan aktivitas kardio untuk menurunkan lemak tubuh tanpa kehilangan kekuatan.',
    points: ['Latihan beban', 'Kardio terarah', 'Kebiasaan harian'],
    icon: 'fatloss'
  },
  {
    id: 'basic-fitness',
    index: '03',
    title: 'Basic Fitness',
    englishTitle: 'Fondasi',
    description:
      'Fondasi latihan untuk pemula: teknik dasar, mobilitas, dan adaptasi bertahap sebelum menambah intensitas.',
    points: ['Teknik dasar', 'Mobilitas', 'Adaptasi bertahap'],
    icon: 'basic'
  },
  {
    id: 'strength',
    index: '04',
    title: 'Strength',
    englishTitle: 'Kekuatan',
    description:
      'Program kekuatan pada gerakan utama untuk meningkatkan kemampuan mengangkat beban secara aman.',
    points: ['Gerakan utama', 'Stabilitas inti', 'Progresi beban'],
    icon: 'strength'
  },
  {
    id: 'functional',
    index: '05',
    title: 'Functional',
    englishTitle: 'Gerak',
    description:
      'Latihan yang mengikuti pola gerak sehari-hari untuk keseimbangan, koordinasi, dan kebugaran menyeluruh.',
    points: ['Pola gerak', 'Keseimbangan', 'Seluruh tubuh'],
    icon: 'functional'
  }
];

export const timelineData: TimelineEntry[] = [
  {
    id: 'awal',
    period: 'Usia 16',
    title: 'Awal perjalanan latihan',
    organization: 'SMA Santo Paulus Pontianak - Egg Gym',
    description:
      "Perjalanan saya di dunia kebugaran dimulai pada usia 16 tahun, ketika masih duduk di bangku SMA Santo Paulus Pontianak. Berawal dari ajakan seorang teman, saya mulai berlatih di Egg Gym Pontianak. Dari sana saya belajar dasar-dasar latihan beban, memahami teknik yang benar, dan membangun konsistensi yang menjadi fondasi disiplin saya. Seiring waktu, latihan yang semula sekadar ikut-ikutan berkembang menjadi komitmen jangka panjang dan arah karier. Pengalaman bertahun-tahun sebagai pelaku latihan inilah yang membentuk pemahaman saya tentang proses, ketekunan, dan tantangan yang dihadapi klien, sebelum akhirnya saya melangkah secara profesional sebagai Personal Trainer di Elluna Gym & MMA sejak Desember 2025.",
    tags: ['SMA Santo Paulus', 'Egg Gym', 'Personal Trainer'],
    status: 'done'
  },
  {
    id: 'sertifikasi',
    period: '2026',
    title: 'Sertifikasi Elluna Gym Foundation',
    organization: 'Elluna Gym & MMA',
    // TODO: isi bulan dan tahun sertifikasi.
    description:
      'Menyelesaikan sertifikasi Elluna Gym Foundation. Bulan dan tahun sertifikasi akan ditambahkan.',
    tags: ['Sertifikasi'],
    status: 'done'
  },
  {
    id: 'bergabung',
    period: 'Des 2025',
    title: 'Bergabung sebagai Personal Trainer',
    organization: 'Elluna Gym & MMA Pontianak',
    description:
      'Mulai menjalani peran sebagai Personal Trainer di Elluna Gym & MMA, Pontianak.',
    tags: ['Personal Trainer', 'Pontianak'],
    status: 'done'
  },
  {
    id: 'sekarang',
    period: 'Sekarang',
    title: 'Aktif Melatih',
    organization: 'Elluna Gym & MMA Pontianak',
    description:
      'Masih aktif sebagai Personal Trainer dengan fokus muscle gain, fat loss, basic fitness, strength, dan functional training.',
    tags: ['Aktif', '5 spesialisasi'],
    status: 'current'
  }
];

export const certificationsData: Certification[] = [
  {
    id: 'elluna-foundation',
    name: 'Elluna Gym Foundation',
    issuer: 'Elluna Gym & MMA',
    // TODO: isi tahun sertifikasi.
    year: '2026',
    description: 'Sertifikasi yang menjadi kredensial utama David sebagai Personal Trainer.',
    status: 'verified'
  },
  {
    id: 'next-cert',
    name: 'Sertifikasi berikutnya',
    issuer: 'Segera dilengkapi',
    // TODO: isi nama sertifikasi, penerbit, dan tahun jika sudah ada.
    year: 'Menyusul',
    description: 'Sertifikasi tambahan akan ditampilkan di sini jika sudah tersedia.',
    status: 'placeholder'
  }
];

export const galleryData: GalleryItem[] = [
  {
    id: 'teaching-exercise',
    type: 'video',
    tag: 'Video',
    caption: 'Sesi latihan',
    alt: 'David Andreas mengajar gerakan latihan di Elluna Gym & MMA',
    video: {
      mp4: '/media/david_teaching_exercise.mp4',
      webm: '/media/david_teaching_exercise.mp4',
      poster: '/media/teaching-poster.webp',
      width: 464,
      height: 832
    }
  },

  {
    id: 'david-deadlift',
    type: 'image',
    tag: 'Latihan',
    caption: 'Deadlift',
    alt: 'David Andreas melakukan deadlift',
    image: {
      base: '/media/david_deadlift',
      widths: [480, 800, 1200],
      width: 1200,
      height: 1800,
      alt: 'David Andreas melakukan deadlift'
    }
  },
  {
    id: 'david-pullup',
    type: 'image',
    tag: 'Latihan',
    caption: 'Pull-up',
    alt: 'David Andreas melakukan pull-up',
    image: {
      base: '/media/david_pullup',
      widths: [480, 800, 1200],
      width: 1200,
      height: 1800,
      alt: 'David Andreas melakukan pull-up'
    }
  },
  {
    id: 'client-david',
    type: 'image',
    tag: 'Sesi',
    caption: 'Pendampingan klien',
    alt: 'David Andreas mendampingi klien latihan',
    image: {
      base: '/media/client_david',
      widths: [480, 800, 1200],
      width: 800,
      height: 1422,
      alt: 'David Andreas mendampingi klien latihan'
    }
  },
  {
    id: 'david-suwardi',
    type: 'image',
    tag: 'Latihan',
    caption: 'Mengajar klien',
    alt: 'David Andreas latihan bersama',
    image: {
      base: '/media/david_suwardi',
      widths: [480, 800, 1200],
      width: 1200,
      height: 2100,
      alt: 'David Andreas latihan bersama'
    }
  },
  {
    id: 'david-train',
    type: 'image',
    tag: 'Latihan',
    caption: 'Sesi latihan',
    alt: 'David Andreas sesi latihan',
    image: {
      base: '/media/david_train',
      widths: [480, 800, 1200],
      width: 1200,
      height: 1800,
      alt: 'David Andreas sesi latihan'
    }
  },
  {
    id: 'progress-03',
    type: 'image',
    tag: 'Progres',
    caption: 'Dokumentasi perjalanan',
    alt: 'Kolase foto David Andreas di gym dan di tepi air',
    image: {
      base: '/media/progress-03',
      widths: [480, 800],
      width: 800,
      height: 1422,
      alt: 'Kolase foto David Andreas di gym dan di tepi air'
    }
  },
  {
    id: 'running-06',
    type: 'image',
    tag: 'Kardio',
    caption: 'Sesi lari',
    alt: 'David Andreas berlari dalam sebuah event lari',
    image: {
      base: '/media/running-06',
      widths: [480, 800, 1200],
      width: 1200,
      height: 1804,
      alt: 'David Andreas berlari dalam sebuah event lari'
    }
  },
  {
    id: 'doc-2026-10-21',
    type: 'image',
    tag: 'Dokumentasi',
    caption: 'David Andreas',
    alt: 'Foto dokumentasi proyek David, Oktober 2026',
    image: {
      base: '/media/david_doc_2026_10_21',
      widths: [480, 800, 1200],
      width: 3024,
      height: 4032,
      alt: 'Foto dokumentasi proyek David, Oktober 2026'
    }
  },
  {
    id: 'doc-2026-10-24',
    type: 'video',
    tag: 'Video',
    caption: 'Sesi latihan',
    alt: 'Video dokumentasi proyek David, Oktober 2026',
    video: {
      mp4: '/media/david_doc_2026_10_24.mp4',
      webm: '/media/david_doc_2026_10_24.mp4',
      poster: '/media/david_doc_2026_10_24-poster.webp',
      width: 720,
      height: 1280
    }
  }
];


export const contactChannels: ContactChannel[] = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    value: profileData.whatsapp.display,
    href: profileData.whatsapp.href,
    note: 'Untuk konsultasi dan jadwal latihan.',
    icon: 'whatsapp',
    primary: true,
    placeholder: true
  },
  {
    id: 'instagram',
    label: 'Instagram',
    value: profileData.instagram.display,
    href: profileData.instagram.href,
    icon: 'instagram',
    placeholder: true
  },
  {
    id: 'email',
    label: 'Email',
    value: profileData.email.display,
    href: profileData.email.href,
    icon: 'mail',
    placeholder: true
  }
];


export const navItems = [
  { label: 'Tentang', id: 'tentang' },
  { label: 'Spesialisasi', id: 'spesialisasi' },
  { label: 'Perjalanan', id: 'perjalanan' },
  { label: 'Galeri', id: 'galeri' },
  { label: 'Kontak', id: 'kontak' }
] as const;
