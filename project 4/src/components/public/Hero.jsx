import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Button from '../shared/Button';

const beams = [
  { left: '12%', delay: '0s', duration: '7s' },
  { left: '35%', delay: '1.5s', duration: '9.5s' },
  { left: '58%', delay: '0.8s', duration: '8s' },
  { left: '80%', delay: '2.2s', duration: '6.5s' },
];

export default function Hero({ settings }) {
  const headline = settings?.hero_headline || 'Coming to a City Near You';
  const subline = settings?.hero_subline || 'The Reggaetón Rave on Tour';
  const desc = settings?.hero_desc || 'Raw perreo, dembow, techno, and club energy in one sweat-soaked night.';

  const sectionRef = useRef(null);
  const rafRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      rafRef.current = requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (!section) { ticking = false; return; }
        const { top, height } = section.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -top / (height * 0.75)));
        setScrollProgress(progress);
        ticking = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      style={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
        overflow: 'hidden',
      }}
    >
      {/* GIF Background - lazy loaded */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        overflow: 'hidden',
      }}>
        <img
          src="/1204.gif"
          alt=""
          loading="eager"
          decoding="async"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block',
            opacity: 0.55,
            filter: 'brightness(0.7) contrast(1.1)',
            willChange: 'transform',
            animation: 'slow-zoom 45s ease-in-out infinite alternate',
          }}
        />
      </div>

      {/* Dark gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0.92) 100%)',
      }} />

      {/* Chrome surface vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(192,192,192,0.04) 0%, transparent 70%)',
      }} />

      {/* Spotlight beams */}
      {beams.map((beam, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: '-20vh',
            left: beam.left,
            width: '3px',
            height: '140vh',
            background: 'linear-gradient(180deg, rgba(220,0,0,0.55) 0%, rgba(180,0,0,0.18) 55%, transparent 100%)',
            transformOrigin: 'top center',
            willChange: 'transform',
            animation: `beam-sweep ${beam.duration} ease-in-out ${beam.delay} infinite`,
            pointerEvents: 'none',
            filter: 'blur(1px)',
            zIndex: 2,
          }}
        />
      ))}

      {/* Wide chrome sweep beam */}
      <div style={{
        position: 'absolute', top: '-10vh', left: '45%', width: '120px', height: '130vh',
        background: 'linear-gradient(180deg, transparent 0%, rgba(192,192,192,0.04) 30%, rgba(255,255,255,0.07) 50%, rgba(192,192,192,0.04) 70%, transparent 100%)',
        transform: 'rotate(-15deg)', transformOrigin: 'top center',
        willChange: 'transform',
        animation: 'beam-sweep 11s ease-in-out 3s infinite', pointerEvents: 'none',
        zIndex: 2,
      }} />

      {/* Center content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '100px 24px 60px',
          width: '100%',
          maxWidth: '960px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 3,
        }}
      >
        {/* OXIDO LOGO */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, filter: 'brightness(0.4) blur(4px)' }}
          animate={{ scale: 1, opacity: 1, filter: 'brightness(1) blur(0px)' }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '8px', position: 'relative' }}
        >
          <img
            src="/Oxido.png"
            alt="DESENFOCADO"
            fetchPriority="high"
            style={{
              width: 'min(88vw, 760px)',
              height: 'auto',
              display: 'block',
              margin: '0 auto',
              filter: 'drop-shadow(0 0 30px rgba(204,0,0,0.55)) drop-shadow(0 0 60px rgba(192,192,192,0.2)) drop-shadow(0 8px 24px rgba(0,0,0,0.8))',
              animation: 'logo-glow-pulse 4s ease-in-out infinite',
            }}
          />
          {/* Liquid metal drip effect below logo */}
          <svg
            viewBox="0 0 760 40"
            preserveAspectRatio="none"
            style={{
              display: 'block',
              width: 'min(88vw, 760px)',
              height: '40px',
              margin: '-8px auto 0',
              overflow: 'visible',
              pointerEvents: 'none',
            }}
          >
            <defs>
              <linearGradient id="drip-chrome" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(180,180,180,0.35)" />
                <stop offset="60%" stopColor="rgba(120,120,120,0.15)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
              <linearGradient id="drip-red" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(200,0,0,0.4)" />
                <stop offset="70%" stopColor="rgba(140,0,0,0.1)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <ellipse cx="120" cy="2" rx="6" ry="18" fill="url(#drip-chrome)" />
            <ellipse cx="190" cy="2" rx="4" ry="26" fill="url(#drip-chrome)" />
            <ellipse cx="310" cy="2" rx="5" ry="20" fill="url(#drip-red)" />
            <ellipse cx="420" cy="2" rx="7" ry="15" fill="url(#drip-chrome)" />
            <ellipse cx="540" cy="2" rx="4" ry="22" fill="url(#drip-red)" />
            <ellipse cx="640" cy="2" rx="6" ry="18" fill="url(#drip-chrome)" />
            <circle cx="190" cy="29" r="3.5" fill="rgba(150,150,150,0.25)" />
            <circle cx="310" cy="24" r="3" fill="rgba(180,0,0,0.3)" />
            <circle cx="540" cy="26" r="3" fill="rgba(160,0,0,0.25)" />
          </svg>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{ width: '100%', maxWidth: '540px', marginBottom: '36px', marginTop: '20px' }}
        >
          <hr className="section-divider" />
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <h1
            style={{
              fontFamily: "'Saira Condensed', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(26px, 4.5vw, 50px)',
              textTransform: 'uppercase',
              letterSpacing: '6px',
              color: 'var(--white)',
              marginBottom: '12px',
              textShadow: '0 2px 20px rgba(0,0,0,0.9)',
            }}
          >
            {headline}
          </h1>
          <p
            style={{
              fontFamily: "'Saira Condensed', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(13px, 2vw, 18px)',
              letterSpacing: '7px',
              textTransform: 'uppercase',
              background: 'linear-gradient(90deg, var(--red-bright) 0%, var(--chrome) 45%, #ffffff 50%, var(--chrome) 55%, var(--red-bright) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '20px',
            }}
          >
            {subline}
          </p>
          <p
            style={{
              fontFamily: "'Saira', sans-serif",
              fontWeight: 300,
              fontSize: 'clamp(14px, 1.6vw, 16px)',
              lineHeight: 1.7,
              color: 'var(--text)',
              maxWidth: '580px',
              margin: '0 auto 36px',
              opacity: 0.85,
            }}
          >
            {desc}
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <motion.a
            href="#tour"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-block',
              fontFamily: "'Saira Condensed', sans-serif",
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '5px',
              fontSize: '13px',
              padding: '13px 36px',
              clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
              textDecoration: 'none',
              background: 'linear-gradient(180deg, #f2f2f2 0%, #ffffff 18%, #dedede 40%, #c2c2c2 65%, #a0a0a0 100%)',
              color: '#040000',
              boxShadow: '0 4px 20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.5)',
            }}
          >
            View All Dates
          </motion.a>
          <Button href="#request" variant="red-outline">Request Your City</Button>
        </motion.div>
      </div>

      {/* Status bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '48px',
          zIndex: 4,
          background: 'rgba(0,0,0,0.9)',
          borderTop: '1px solid rgba(180,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red-bright)', animation: 'dot-blink 1.2s ease-in-out infinite', display: 'inline-block' }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red-bright)', animation: 'dot-blink 1.2s ease-in-out 0.4s infinite', display: 'inline-block' }} />
        <span
          style={{
            fontFamily: "'Saira Condensed', sans-serif",
            fontWeight: 900,
            fontSize: '12px',
            letterSpacing: '8px',
            textTransform: 'uppercase',
            color: 'var(--chrome-dim)',
          }}
        >
          // LIVE TOUR 2026
        </span>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red-bright)', animation: 'dot-blink 1.2s ease-in-out 0.8s infinite', display: 'inline-block' }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red-bright)', animation: 'dot-blink 1.2s ease-in-out 1.2s infinite', display: 'inline-block' }} />
      </div>

      <style>{`
        @keyframes logo-glow-pulse {
          0%, 100% {
            filter: drop-shadow(0 0 20px rgba(204,0,0,0.4))
                    drop-shadow(0 0 40px rgba(192,192,192,0.15))
                    drop-shadow(0 8px 24px rgba(0,0,0,0.8));
            opacity: 0.95;
          }
          50% {
            filter: drop-shadow(0 0 45px rgba(220,0,0,0.75))
                    drop-shadow(0 0 85px rgba(255,50,50,0.4))
                    drop-shadow(0 0 120px rgba(192,192,192,0.25))
                    drop-shadow(0 12px 32px rgba(0,0,0,0.9));
            opacity: 1;
          }
        }
        @keyframes slow-zoom {
          0% { transform: scale(1.05); }
          100% { transform: scale(1.15); }
        }
      `}</style>
    </section>
  );
}
