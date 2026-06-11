import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../shared/Button';

export default function EmailSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                            'Content-Type': 'application/json',
                },
        body: JSON.stringify({ email, source: 'website' }),
      });

      const data = await response.json();
      console.log('Signup response:', { status: response.status, data });

      if (response.ok) {
        setSubmitted(true);
        setEmail('');
      } else {
        console.error('Signup failed:', data);
        setError(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      style={{
        position: 'relative',
        zIndex: 1,
        background: 'rgba(6,0,0,0.88)',
        padding: '48px 24px',
        borderTop: '1px solid rgba(180,0,0,0.15)',
      }}
    >
      <div style={{ maxWidth: '540px', margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '11px', letterSpacing: '6px', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '12px' }}>
            // Never Miss A Show
          </div>
          <h3 style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(28px, 4vw, 44px)', textTransform: 'uppercase', color: 'var(--white)', lineHeight: 1, marginBottom: '12px' }}>
            Get On The List
          </h3>
          <p style={{ fontFamily: "'Saira', sans-serif", fontWeight: 300, fontSize: '14px', color: 'var(--text)', marginBottom: '28px' }}>
            Presale codes, city announcements, and exclusive drops.
          </p>

          {submitted ? (
            <div style={{ color: 'var(--red-bright)', fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '16px', letterSpacing: '4px', textTransform: 'uppercase' }}>
              You're On The List
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 0, maxWidth: '380px', margin: '0 auto' }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  disabled={loading}
                  style={{
                    flex: 1,
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(180,0,0,0.25)',
                    borderRight: 'none',
                    color: 'var(--white)',
                    fontFamily: "'Saira', sans-serif",
                    fontSize: '14px',
                    padding: '11px 16px',
                    outline: 'none',
                    opacity: loading ? 0.6 : 1,
                  }}
                />
                <Button type="submit" variant="red" disabled={loading}>
                  {loading ? 'Signing Up...' : 'Sign Up'}
                </Button>
              </form>
              {error && (
                <div style={{ color: 'var(--red)', fontFamily: "'Saira', sans-serif", fontSize: '13px', marginTop: '12px' }}>
                  {error}
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
