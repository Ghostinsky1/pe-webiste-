const chainLinkSVG = `<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'><path d='M0,24 L12,0 L24,24 L12,48 Z' stroke='%23aaa' stroke-width='0.8' fill='none'/><path d='M24,24 L36,0 L48,24 L36,48 Z' stroke='%23aaa' stroke-width='0.8' fill='none'/></svg>`;

const shimmerLines = [
  { left: '10%', delay: '0s', duration: '12s', width: '1px', opacity: 0.6 },
  { left: '35%', delay: '3s', duration: '14s', width: '1px', opacity: 0.45 },
  { left: '60%', delay: '1.5s', duration: '11s', width: '2px', opacity: 0.35 },
  { left: '85%', delay: '5s', duration: '13s', width: '1px', opacity: 0.5 },
];

export default function MetalBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        contain: 'strict',
      }}
    >
      {/* Base gunmetal surface */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: 'linear-gradient(160deg, #0a0404 0%, #040000 35%, #060202 65%, #020000 100%)',
      }} />

      {/* Chrome brushed-metal banding */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: `
          repeating-linear-gradient(
            180deg,
            rgba(255,255,255,0.012) 0px,
            rgba(255,255,255,0.012) 1px,
            transparent 1px,
            transparent 3px,
            rgba(192,192,192,0.008) 3px,
            rgba(192,192,192,0.008) 4px,
            transparent 4px,
            transparent 8px
          )
        `,
      }} />

      {/* Chain-Link Fence */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,${chainLinkSVG}")`,
          backgroundSize: '48px 48px',
          backgroundRepeat: 'repeat',
          opacity: 0.11,
          zIndex: 2,
        }}
      />

      {/* Chrome Shimmer Lines - reduced count */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 3 }}>
        {shimmerLines.map((line, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: line.left,
              top: 0,
              width: line.width,
              height: '120vh',
              background: `linear-gradient(180deg, transparent 0%, rgba(192,192,192,${line.opacity * 0.6}) 35%, rgba(255,255,255,${line.opacity}) 50%, rgba(192,192,192,${line.opacity * 0.6}) 65%, transparent 100%)`,
              willChange: 'transform',
              animation: `shimmer-line ${line.duration} linear ${line.delay} infinite`,
            }}
          />
        ))}
      </div>

      {/* Wide chrome sweep */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 4 }}>
        <div style={{
          position: 'absolute', top: '-30vh', left: '30%',
          width: '60px', height: '160vh',
          background: 'linear-gradient(180deg, transparent 0%, rgba(200,200,200,0.03) 30%, rgba(240,240,240,0.06) 50%, rgba(200,200,200,0.03) 70%, transparent 100%)',
          transform: 'rotate(-18deg)',
          willChange: 'transform',
          animation: 'shimmer-line 18s linear 2s infinite',
        }} />
      </div>

      {/* Red Ember Glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 5,
          animation: 'ember-pulse 7s ease-in-out infinite',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 700px 450px at 10% 8%, rgba(170,0,0,0.16), transparent)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 550px 380px at 88% 92%, rgba(110,0,0,0.13), transparent)' }} />
      </div>

      {/* Chrome centre highlight */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 6,
        background: 'radial-gradient(ellipse 75% 50% at 50% 30%, rgba(200,200,200,0.04) 0%, transparent 70%)',
      }} />

      {/* Film Grain - static, no animation */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 7,
          backgroundImage: `url("data:image/svg+xml,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23g)' opacity='1'/></svg>")`,
          backgroundSize: '200px 200px',
          opacity: 0.035,
        }}
      />

      {/* Scanlines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 8,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.055) 3px, rgba(0,0,0,0.055) 4px)',
        }}
      />

      {/* Chrome Horizontal Sweep */}
      <div
        style={{
          position: 'absolute',
          top: '38%',
          left: 0,
          right: 0,
          height: '1px',
          zIndex: 9,
          background: 'linear-gradient(90deg, transparent, rgba(192,192,192,0.12), rgba(255,255,255,0.28), rgba(192,192,192,0.12), transparent)',
          backgroundSize: '200% 100%',
          willChange: 'background-position',
          animation: 'ticker-band 5s linear infinite',
        }}
      />
    </div>
  );
}
