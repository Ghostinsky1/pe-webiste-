import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import MetalBackground from '../components/shared/MetalBackground';
import Button from '../components/shared/Button';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/admin');
    });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (authError) {
      setError(authError.message);
    } else {
      navigate('/admin');
    }
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(0,0,0,0.7)',
    border: '1px solid rgba(192,192,192,0.15)',
    color: 'var(--white)',
    fontFamily: "'Saira', sans-serif",
    fontWeight: 300,
    fontSize: '14px',
    padding: '12px 16px',
    outline: 'none',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative' }}>
      <MetalBackground />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '380px',
          background: 'rgba(10,0,0,0.95)',
          border: '1px solid rgba(192,192,192,0.1)',
          padding: '40px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img
            src="/Oxido.png"
            alt="PERREO ELECTRICO"
            style={{
              height: '48px',
              width: 'auto',
              display: 'block',
              margin: '0 auto 12px',
              filter: 'drop-shadow(0 0 12px rgba(204,0,0,0.5)) drop-shadow(0 2px 8px rgba(0,0,0,0.8))',
            }}
          />
          <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 700, fontSize: '10px', letterSpacing: '6px', textTransform: 'uppercase', color: 'var(--chrome-dim)', opacity: 0.6 }}>
            Admin Access
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--chrome-dim)', display: 'block', marginBottom: '6px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'rgba(192,192,192,0.4)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(192,192,192,0.15)')}
            />
          </div>
          <div>
            <label style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--chrome-dim)', display: 'block', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'rgba(192,192,192,0.4)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(192,192,192,0.15)')}
            />
          </div>

          {error && (
            <div style={{ color: 'var(--red-bright)', fontFamily: "'Saira', sans-serif", fontSize: '13px', padding: '10px 14px', border: '1px solid rgba(204,0,0,0.3)', background: 'rgba(204,0,0,0.08)' }}>
              {error}
            </div>
          )}

          <Button type="submit" variant="chrome" disabled={loading} style={{ marginTop: '8px' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <a href="/" style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 700, fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--chrome-dim)', textDecoration: 'none', opacity: 0.5 }}>
            ← Back to Site
          </a>
        </div>
      </motion.div>
    </div>
  );
}
