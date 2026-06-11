import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const artists = [
  'LATIN EDM', 'BASS', 'REGGAETÓN', 'GUARACHA', 'TRIBAL',
  'PERREO', 'LATIN TRAP', 'DEMBOW',
];

const sizes = ['text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl'];

export default function Sound() {
  const [glowing, setGlowing] = useState(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      const count = Math.floor(Math.random() * 3) + 2;
      const newSet = new Set();
      while (newSet.size < count) {
        newSet.add(Math.floor(Math.random() * artists.length));
      }
      setGlowing(newSet);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="sound"
      style={{
        position: 'relative',
        zIndex: 1,
        background: 'rgba(13,0,0,0.88)',
        padding: '56px 24px',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '36px' }}
        >
          <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '11px', letterSpacing: '6px', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '12px' }}>
            // The Sound
          </div>
          <h2 style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(40px, 6vw, 72px)', textTransform: 'uppercase', color: 'var(--white)', lineHeight: 1 }}>
            Real Latin <span style={{ color: 'var(--red-bright)' }}>Genres.</span>
            <br />
            One Night.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px 20px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {artists.map((artist, i) => {
            const sizeClass = sizes[Math.floor(Math.random() * sizes.length)];
            const isGlowing = glowing.has(i);
            return (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                style={{
                  fontFamily: "'Saira Condensed', sans-serif",
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '3px',
                  fontSize: `clamp(14px, ${1.2 + (i % 3) * 0.4}vw, ${18 + (i % 4) * 8}px)`,
                  color: isGlowing ? 'var(--red-bright)' : 'var(--chrome-dim)',
                  textShadow: isGlowing ? '0 0 20px rgba(255,26,26,0.8), 0 0 40px rgba(204,0,0,0.4)' : 'none',
                  transition: 'color 0.3s, text-shadow 0.3s',
                  cursor: 'default',
                  opacity: isGlowing ? 1 : 0.5 + (i % 4) * 0.12,
                }}
              >
                {artist}
              </motion.span>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
