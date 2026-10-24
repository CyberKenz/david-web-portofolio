export interface ResponsiveImage {
  /** base path without width suffix, e.g. "/media/coaching-01" */
  base: string;
  /** available widths generated at build-asset time */
  widths: number[];
  width: number;
  height: number;
  alt: string;
}

export interface ProfileData {
  name: string;
  shortName: string;
  role: string;
  gym: string;
  city: string;
  age: number;
  startPeriod: string;
  tagline: string;
  intro: string;
  aboutParagraphs: string[];
  principles: string[];
  avatar: ResponsiveImage;
  /** TODO: nomor WhatsApp belum diberikan pemilik data. */
  whatsapp: {
    display: string;
    href: string;
  };
  /** TODO: email belum diberikan pemilik data. */
  email: {
    display: string;
    href: string | null;
  };
  /** TODO: akun Instagram belum diberikan pemilik data. */
  instagram: {
    display: string;
    href: string | null;
  };
  location: {
    label: string;
    place: string;
    mapsHref: string | null;
  };
}

export interface Specialization {
  id: string;
  index: string;
  title: string;
  englishTitle: string;
  description: string;
  points: string[];
  icon: 'muscle' | 'fatloss' | 'basic' | 'strength' | 'functional';
}

export interface TimelineEntry {
  id: string;
  period: string;
  title: string;
  organization: string;
  description: string;
  tags: string[];
  status: 'done' | 'current' | 'placeholder';
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
  description: string;
  status: 'verified' | 'placeholder';
}

export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  tag: string;
  caption: string;
  alt: string;
  image?: ResponsiveImage;
  video?: {
    mp4: string;
    webm: string;
    poster: string;
    width: number;
    height: number;
  };
}

export interface ContactChannel {
  id: string;
  label: string;
  value: string;
  href: string | null;
  note?: string;
  icon: 'whatsapp' | 'instagram' | 'mail' | 'pin';
  primary?: boolean;
  placeholder?: boolean;
}
