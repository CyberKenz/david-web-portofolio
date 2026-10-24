interface HeroReelProps {
  className?: string;
  src?: string;
  caption?: string;
}

export function HeroReel({ className = '', src = '/assets/img/david_no_outfit.jpeg', caption = 'Reel / 01' }: HeroReelProps) {
  return (
    <div className={`mx-auto w-[clamp(190px,58vw,230px)] rotate-[3deg] ${className}`}>
      <div className="rounded-[1.75rem] border-2 border-night bg-paper p-2 shadow-[7px_7px_0_0_#242323]">
        <div className="aspect-[4/5] overflow-hidden rounded-[1.15rem] border-2 border-night">
          <img
            src={src}
            alt="David Andreas"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex items-center justify-between gap-2 px-1 pt-2 pb-0.5 font-mono text-[8px] font-bold uppercase tracking-[0.08em] text-night">
          <span>Elluna Gym &amp; MMA</span>
          <span className="text-brand-deep">{caption}</span>
        </div>
      </div>
    </div>
  );
}