import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../shared/Button';

export default function FinalCTA() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      style={{
        position: 'relative',
        zIndex: 1,
        background: 'rgba(80,0,0,0.22)',
        borderTop: '1px solid rgba(180,0,0,0.3)',
        borderBottom: '1px solid rgba(180,0,0,0.3)',
        padding: '56px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(32px, 5vw, 60px)', textTransform: 'uppercase', color: 'var(--white)', letterSpacing: '3px', lineHeight: 1, marginBottom: '16px' }}>
            Stay In The <span style={{ color: 'var(--red-bright)' }}>Loop</span>
          </h2>
          <p style={{ fontFamily: "'Saira', sans-serif", fontWeight: 300, fontSize: '15px', color: 'var(--text)', lineHeight: 1.6, marginBottom: '32px' }}>
            New dates, exclusive presales, and late-night announcements — first to email, first to know.
          </p>

          {submitted ? (
            <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '18px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--red-bright)' }}>
              You're In — See You On The Floor
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0', maxWidth: '420px', margin: '0 auto' }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  flex: 1,
                  background: 'rgba(0,0,0,0.6)',
                  border: '1px solid rgba(180,0,0,0.3)',
                  borderRight: 'none',
                  color: 'var(--white)',
                  fontFamily: "'Saira', sans-serif",
                  fontSize: '14px',
                  padding: '12px 16px',
                  outline: 'none',
                }}
              />
              <Button type="submit" variant="red">Join</Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
