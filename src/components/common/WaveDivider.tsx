interface WaveDividerProps {
  from: string;
  to: string;
  className?: string;
}

/**
 * Shoreline-style section transition borrowed from the reference template.
 * `from` is the previous section colour, `to` is the next section colour.
 */
export function WaveDivider({ from, to, className = '' }: WaveDividerProps) {
  return (
    <div aria-hidden="true" className={`-mb-px leading-none ${from} ${className}`}>
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className={`block h-12 w-full sm:h-20 ${to}`}
      >
        <path
          fill="currentColor"
          d="M0,64 C150,104 300,40 460,54 C620,68 760,112 920,88 C1080,64 1240,30 1440,56 L1440,120 L0,120 Z"
        />
      </svg>
    </div>
  );
}
