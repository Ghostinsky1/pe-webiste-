import { motion } from 'framer-motion';

export default function About({ settings }) {
  const body = settings?.about_body || 'DESENFOCADO is the fusion of raw reggaetón energy and underground electronic music culture. We tour without barriers — no velvet ropes, no bottle service, just a room full of people who came to move. Born in St. Louis, grown nationwide, we bring the rave to your city.';

  return (
    <section
      id="about"
      style={{
        position: 'relative',
        zIndex: 1,
        background: 'rgba(6,0,0,0.82)',
        padding: '56px 24px',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '64px',
            alignItems: 'center',
          }}
        >
          {/* Left — Oxido logo with chrome frame */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                position: 'relative',
                display: 'inline-block',
                padding: '28px 32px 20px',
                background: 'linear-gradient(180deg, rgba(12,2,2,0.7) 0%, rgba(4,0,0,0.9) 100%)',
                border: '1px solid rgba(192,192,192,0.15)',
                boxShadow: '0 0 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.5)',
              }}
            >
              {/* Chrome corner accents */}
              <div style={{ position: 'absolute', top: -1, left: -1, width: 24, height: 2, background: 'linear-gradient(90deg, rgba(192,192,192,0.7), transparent)' }} />
              <div style={{ position: 'absolute', top: -1, left: -1, width: 2, height: 24, background: 'linear-gradient(180deg, rgba(192,192,192,0.7), transparent)' }} />
              <div style={{ position: 'absolute', top: -1, right: -1, width: 24, height: 2, background: 'linear-gradient(270deg, rgba(192,192,192,0.7), transparent)' }} />
              <div style={{ position: 'absolute', top: -1, right: -1, width: 2, height: 24, background: 'linear-gradient(180deg, rgba(192,192,192,0.7), transparent)' }} />
              <div style={{ position: 'absolute', bottom: -1, left: -1, width: 24, height: 2, background: 'linear-gradient(90deg, rgba(180,0,0,0.7), transparent)' }} />
              <div style={{ position: 'absolute', bottom: -1, right: -1, width: 24, height: 2, background: 'linear-gradient(270deg, rgba(180,0,0,0.7), transparent)' }} />

              <img
                src="/Oxido.png"
                alt="DESENFOCADO"
                style={{
                  width: 'min(260px, 72vw)',
                  height: 'auto',
                  display: 'block',
                  filter: 'drop-shadow(0 0 18px rgba(204,0,0,0.5)) drop-shadow(0 4px 16px rgba(0,0,0,0.7))',
                }}
              />
              {/* Liquid drips */}
              <svg viewBox="0 0 260 24" style={{ display: 'block', width: 'min(260px, 72vw)', height: '24px', margin: '-4px 0 0' }} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="about-drip-c" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(160,160,160,0.3)" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                  <linearGradient id="about-drip-r" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(180,0,0,0.35)" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                <ellipse cx="55" cy="1" rx="5" ry="14" fill="url(#about-drip-c)" />
                <ellipse cx="110" cy="1" rx="4" ry="18" fill="url(#about-drip-r)" />
                <ellipse cx="180" cy="1" rx="5" ry="12" fill="url(#about-drip-c)" />
                <ellipse cx="220" cy="1" rx="4" ry="16" fill="url(#about-drip-r)" />
                <circle cx="110" cy="20" r="2.5" fill="rgba(160,0,0,0.2)" />
                <circle cx="55" cy="16" r="2" fill="rgba(140,140,140,0.2)" />
              </svg>
            </div>
            <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '10px', letterSpacing: '6px', textTransform: 'uppercase', color: 'var(--chrome-dim)', opacity: 0.5 }}>
              GOZA ENTERTAINMENT
            </div>
          </div>

          {/* Right — Text */}
          <div>
            <div
              style={{
                fontFamily: "'Saira Condensed', sans-serif",
                fontWeight: 900,
                fontSize: '11px',
                letterSpacing: '6px',
                textTransform: 'uppercase',
                color: 'var(--red)',
                marginBottom: '16px',
              }}
            >
              // About The Event
            </div>
            <h2
              style={{
                fontFamily: "'Saira Condensed', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(36px, 5vw, 56px)',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                color: 'var(--white)',
                lineHeight: 1,
                marginBottom: '24px',
              }}
            >
              Perreo.
              <br />
              <span style={{ color: 'var(--red-bright)' }}>EDM.</span>
              <br />
              Latin Rave.
            </h2>
            <p
              style={{
                fontFamily: "'Saira', sans-serif",
                fontWeight: 300,
                fontSize: '16px',
                lineHeight: 2.1,
                color: 'var(--text)',
                letterSpacing: '0.3px',
              }}
            >
              {body}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
