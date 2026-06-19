import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../shared/Button';

export default function CityRequest() {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(0,0,0,0.5)',
    border: '1px solid rgba(180,0,0,0.25)',
    color: 'var(--white)',
    fontFamily: "'Saira', sans-serif",
    fontWeight: 300,
    fontSize: '14px',
    padding: '12px 16px',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <section
      id="request"
      style={{
        position: 'relative',
        zIndex: 1,
        background: 'rgba(13,0,0,0.9)',
        padding: '56px 24px',
      }}
    >
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '32px' }}
        >
          <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '11px', letterSpacing: '6px', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '12px' }}>
            // Don't See Your City?
          </div>
          <h2 style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(36px, 5vw, 64px)', textTransform: 'uppercase', color: 'var(--white)', lineHeight: 1 }}>
            Request <span style={{ color: 'var(--red-bright)' }}>Your City</span>
          </h2>
          <p style={{ fontFamily: "'Saira', sans-serif", fontWeight: 300, fontSize: '15px', color: 'var(--text)', marginTop: '16px', lineHeight: 1.6 }}>
            Tell us where you want DESENFOCADO next. We're listening.
          </p>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              textAlign: 'center',
              padding: '48px',
              border: '1px solid rgba(180,0,0,0.3)',
              background: 'rgba(0,0,0,0.4)',
            }}
          >
            <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '32px', textTransform: 'uppercase', color: 'var(--red-bright)', letterSpacing: '3px', marginBottom: '12px' }}>
              Request Received
            </div>
            <p style={{ fontFamily: "'Saira', sans-serif", fontWeight: 300, fontSize: '15px', color: 'var(--text)' }}>
              We'll keep you in the loop when we're heading to {city || 'your city'}.
            </p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--chrome-dim)', display: 'block', marginBottom: '6px' }}>City</label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="City name"
                  required
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'rgba(204,0,0,0.6)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(180,0,0,0.25)')}
                />
              </div>
              <div>
                <label style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--chrome-dim)', display: 'block', marginBottom: '6px' }}>State</label>
                <input
                  type="text"
                  value={state}
                  onChange={e => setState(e.target.value)}
                  placeholder="ST"
                  maxLength={2}
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'rgba(204,0,0,0.6)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(180,0,0,0.25)')}
                />
              </div>
            </div>
            <div>
              <label style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--chrome-dim)', display: 'block', marginBottom: '6px' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'rgba(204,0,0,0.6)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(180,0,0,0.25)')}
              />
            </div>
            <Button type="submit" variant="red">Submit Request</Button>
          </motion.form>
        )}
      </div>
    </section>
  );
}
