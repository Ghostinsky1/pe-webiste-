import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Button from '../shared/Button';

const navLinks = [
  { label: 'Tour', href: '#tour' },
  { label: 'Sound', href: '#sound' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Request City', href: '#request' },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)',
        background: 'linear-gradient(180deg, rgba(2,0,0,0.97) 0%, rgba(6,0,0,0.92) 100%)',
        borderBottom: '1px solid rgba(192,192,192,0.1)',
        boxShadow: '0 2px 40px rgba(0,0,0,0.7)',
      }}
    >
      {/* Chrome top edge specular */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', pointerEvents: 'none', background: 'linear-gradient(90deg, transparent 0%, rgba(192,192,192,0.2) 20%, rgba(255,255,255,0.55) 50%, rgba(192,192,192,0.2) 80%, transparent 100%)' }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <img
              src="/Oxido.png"
              alt="DESENFOCADO"
              style={{
                height: '46px',
                width: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 10px rgba(204,0,0,0.55)) drop-shadow(0 0 22px rgba(192,192,192,0.18)) brightness(1.05)',
                transition: 'filter 0.35s, transform 0.35s',
              }}
              onMouseEnter={e => {
                e.target.style.filter = 'drop-shadow(0 0 18px rgba(255,26,26,0.75)) drop-shadow(0 0 36px rgba(192,192,192,0.3)) brightness(1.15)';
                e.target.style.transform = 'scale(1.04)';
              }}
              onMouseLeave={e => {
                e.target.style.filter = 'drop-shadow(0 0 10px rgba(204,0,0,0.55)) drop-shadow(0 0 22px rgba(192,192,192,0.18)) brightness(1.05)';
                e.target.style.transform = 'scale(1)';
              }}
            />
          </a>

          {/* Desktop Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }} className="hidden-mobile">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  fontFamily: "'Saira Condensed', sans-serif",
                  fontWeight: 900,
                  fontSize: '12px',
                  letterSpacing: '6px',
                  textTransform: 'uppercase',
                  color: 'var(--chrome-dim)',
                  textDecoration: 'none',
                  transition: 'color 0.25s, text-shadow 0.25s',
                }}
                onMouseEnter={e => {
                  e.target.style.color = '#e8e8e8';
                  e.target.style.textShadow = '0 0 14px rgba(220,220,220,0.55), 0 0 28px rgba(192,192,192,0.2)';
                }}
                onMouseLeave={e => {
                  e.target.style.color = 'var(--chrome-dim)';
                  e.target.style.textShadow = 'none';
                }}
              >
                {link.label}
              </a>
            ))}
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
                fontSize: '12px',
                padding: '10px 28px',
                clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                textDecoration: 'none',
                background: 'linear-gradient(180deg, #f2f2f2 0%, #ffffff 18%, #dedede 40%, #c2c2c2 65%, #a0a0a0 100%)',
                color: '#060000',
                boxShadow: '0 3px 14px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.45)',
              }}
            >
              Get Tickets
            </motion.a>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="show-mobile"
            style={{ background: 'none', border: 'none', color: 'var(--chrome)', padding: '8px' }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden', background: 'rgba(3,0,0,0.98)', borderTop: '1px solid rgba(192,192,192,0.1)' }}
          >
            <div style={{ padding: '20px 24px 28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(192,192,192,0.08)' }}>
                <img src="/Oxido.png" alt="DESENFOCADO" style={{ height: '40px', width: 'auto', filter: 'drop-shadow(0 0 12px rgba(204,0,0,0.5))' }} />
              </div>
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontFamily: "'Saira Condensed', sans-serif",
                    fontWeight: 900,
                    fontSize: '20px',
                    letterSpacing: '6px',
                    textTransform: 'uppercase',
                    color: 'var(--chrome)',
                    textDecoration: 'none',
                  }}
                >
                  {link.label}
                </a>
              ))}
              <Button href="#tour" variant="chrome">Get Tickets</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </motion.nav>
  );
}
