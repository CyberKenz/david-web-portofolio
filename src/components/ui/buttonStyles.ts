export type Variant = 'primary' | 'night' | 'paper' | 'outline' | 'outline-light';
export type Size = 'md' | 'lg';

const base =
  'inline-flex select-none items-center justify-center gap-2 rounded-full border-2 font-mono text-[11px] font-bold uppercase leading-none tracking-[0.12em] transition-[transform,box-shadow,background-color,color,border-color] duration-150 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:pointer-events-none disabled:opacity-40';

const variants: Record<Variant, string> = {
  primary:
    'border-night bg-brand text-night shadow-[4px_4px_0_0_#242323] hover:bg-brand-dark hover:text-paper',
  night:
    'border-night bg-night text-cream shadow-[4px_4px_0_0_#eb6b10] hover:bg-night-deep',
  paper:
    'border-night bg-paper text-night shadow-[4px_4px_0_0_#242323] hover:bg-brand-wash',
  outline:
    'border-night bg-transparent text-night shadow-[4px_4px_0_0_#eb6b10] hover:bg-paper',
  'outline-light':
    'border-cream bg-transparent text-cream shadow-[4px_4px_0_0_#242323] hover:bg-cream hover:text-night'
};

const sizes: Record<Size, string> = {
  md: 'min-h-12 px-5 py-3',
  lg: 'min-h-[3.35rem] px-6 py-3.5 text-[12px]'
};

export function buttonClass(variant: Variant = 'primary', size: Size = 'md', extra = ''): string {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}
