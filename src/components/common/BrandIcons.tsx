import { SiInstagram, SiWhatsapp } from '@icons-pack/react-simple-icons';

interface BrandIconProps {
  size?: number;
  className?: string;
}

export function WhatsAppIcon({ size = 22, className = '' }: BrandIconProps) {
  return <SiWhatsapp size={size} className={className} aria-hidden="true" focusable="false" />;
}

export function InstagramIcon({ size = 22, className = '' }: BrandIconProps) {
  return <SiInstagram size={size} className={className} aria-hidden="true" focusable="false" />;
}
