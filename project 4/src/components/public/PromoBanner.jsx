import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Flame, Megaphone } from 'lucide-react';

const typeIcons = {
  bogo: Zap,
  low_tickets: Flame,
  custom: Megaphone,
};

const typeColors = {
  bogo: { bg: 'linear-gradient(90deg, rgba(204,0,0,0.15) 0%, rgba(180,0,0,0.08) 100%)', border: 'rgba(204,0,0,0.4)', accent: '#ff3333' },
  low_tickets: { bg: 'linear-gradient(90deg, rgba(204,80,0,0.12) 0%, rgba(180,40,0,0.06) 100%)', border: 'rgba(204,80,0,0.4)', accent: '#ff6600' },
  custom: { bg: 'linear-gradient(90deg, rgba(204,0,0,0.15) 0%, rgba(180,0,0,0.08) 100%)', border: 'rgba(204,0,0,0.4)', accent: '#ff3333' },
};

export default function PromoBanner({ show }) {
  const [dismissed, setDismissed] = useState(false);

  if (!show || !show.promo_active || !show.promo_title) return null;
  if (dismissed) return null;

  const Icon = typeIcons[show.promo_type] || Megaphone;
  const colors = typeColors[show.promo_type] || typeColors.custom;

  return (
    <div style={{ position: 'relative', zIndex: 50 }}>
      <AnimatePresence>
        {!dismissed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                background: colors.bg,
                borderBottom: `1px solid ${colors.border}`,
                padding: '10px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                position: 'relative',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: colors.accent,
                  boxShadow: `0 0 8px ${colors.accent}`,
                  flexShrink: 0,
                  animation: 'promoPulse 2s infinite',
                }}
              />

              <Icon size={16} style={{ color: colors.accent, flexShrink: 0 }} />

              <span
                style={{
                  fontFamily: "'Saira Condensed', sans-serif",
                  fontWeight: 900,
                  fontSize: '12px',
                  letterSpacing: '4px',
                  textTransform: 'uppercase',
                  color: colors.accent,
                  flexShrink: 0,
                }}
              >
                {show.promo_title}
              </span>

              <span
                style={{
                  fontFamily: "'Saira', sans-serif",
                  fontWeight: 400,
                  fontSize: '13px',
                  color: '#e0e0e0',
                  letterSpacing: '0.5px',
                }}
              >
                {show.promo_message}
              </span>

              <button
                onClick={() => setDismissed(true)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--chrome-dim)',
                  opacity: 0.4,
                  transition: 'opacity 0.2s',
                  padding: '4px',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0.4')}
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes promoPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
}
