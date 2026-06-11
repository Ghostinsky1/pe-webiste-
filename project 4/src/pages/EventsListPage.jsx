import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import MetalBackground from '../components/shared/MetalBackground';

function MarqueeTicker() {
  const text = "TICKETS ON SALE NOW \u2022 NEW CITIES COMING SOON \u2022 PERREO ELECTRICO TOUR 2026 \u2022 ";
  const repeated = text.repeat(12);

  return (
    <div className="marquee-bar">
      <div className="marquee-track">
        <span>{repeated}</span>
        <span>{repeated}</span>
      </div>
    </div>
  );
}

function EventsNav() {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)',
        background: 'linear-gradient(180deg, rgba(2,0,0,0.97) 0%, rgba(6,0,0,0.92) 100%)',
        borderBottom: '1px solid rgba(192,192,192,0.1)',
        boxShadow: '0 2px 40px rgba(0,0,0,0.7)',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', pointerEvents: 'none', background: 'linear-gradient(90deg, transparent 0%, rgba(192,192,192,0.2) 20%, rgba(255,255,255,0.55) 50%, rgba(192,192,192,0.2) 80%, transparent 100%)' }} />
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <img
              src="/Oxido.png"
              alt="PERREO ELECTRICO"
              style={{
                height: '46px',
                width: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 10px rgba(204,0,0,0.55)) drop-shadow(0 0 22px rgba(192,192,192,0.18)) brightness(1.05)',
              }}
            />
          </Link>
          <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
            <Link
              to="/"
              style={{
                fontFamily: "'Saira Condensed', sans-serif",
                fontWeight: 900,
                fontSize: '12px',
                letterSpacing: '6px',
                textTransform: 'uppercase',
                color: 'var(--chrome-dim)',
                textDecoration: 'none',
              }}
            >
              Home
            </Link>
            <Link
              to="/events"
              style={{
                fontFamily: "'Saira Condensed', sans-serif",
                fontWeight: 900,
                fontSize: '12px',
                letterSpacing: '6px',
                textTransform: 'uppercase',
                color: '#e8e8e8',
                textDecoration: 'none',
              }}
            >
              Events
            </Link>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </nav>
  );
}

function formatCardDate(dateStr) {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function EventCard({ show, index }) {
  const isSoldOut = show.status === 'sold_out';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      style={{
        background: 'rgba(6,0,0,0.85)',
        borderRadius: '4px',
        overflow: 'hidden',
        border: '1px solid rgba(204,0,0,0.1)',
        transition: 'transform 0.3s, box-shadow 0.3s, border-color 0.3s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 20px 60px rgba(204,0,0,0.15)';
        e.currentTarget.style.borderColor = 'rgba(204,0,0,0.3)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'rgba(204,0,0,0.1)';
      }}
    >
      <div
        style={{
          width: '100%',
          aspectRatio: '4/3',
          position: 'relative',
          background: 'linear-gradient(135deg, #1a0000 0%, #0a0000 50%, #000000 100%)',
        }}
      >
        {show.flyer_image_url ? (
          <img
            src={show.flyer_image_url}
            alt={`${show.city} flyer`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(204,0,0,0.06) 0%, transparent 70%)' }} />
            <img src="/Oxido.png" alt="" style={{ height: '36px', marginBottom: '12px', opacity: 0.4 }} />
            <span
              style={{
                fontFamily: "'Saira Condensed', sans-serif",
                fontWeight: 900,
                fontSize: '36px',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.06)',
                letterSpacing: '4px',
              }}
            >
              {show.city}
            </span>
          </div>
        )}
        {isSoldOut && (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              fontFamily: "'Saira Condensed', sans-serif",
              fontWeight: 900,
              fontSize: '11px',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: '#ffffff',
              background: 'rgba(139,0,0,0.9)',
              padding: '6px 14px',
              borderRadius: '2px',
            }}
          >
            SOLD OUT
          </div>
        )}
      </div>

      <div style={{ padding: '24px' }}>
        <h3
          style={{
            fontFamily: "'Saira Condensed', sans-serif",
            fontWeight: 900,
            fontSize: '24px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: '#ffffff',
            marginBottom: '4px',
          }}
        >
          {show.city}, {show.state}
        </h3>
        <p style={{ fontFamily: "'Saira', sans-serif", fontWeight: 300, fontSize: '14px', color: '#b0b0b0', marginBottom: '4px' }}>
          {formatCardDate(show.date)}
        </p>
        <p style={{ fontFamily: "'Saira', sans-serif", fontWeight: 300, fontSize: '14px', color: '#888', marginBottom: '20px' }}>
          {show.venue || 'TBA'}
        </p>
        <Link
          to={`/events/${show.slug}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: "'Saira Condensed', sans-serif",
            fontWeight: 900,
            fontSize: '13px',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color: 'var(--red-bright)',
            textDecoration: 'none',
            transition: 'gap 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.gap = '14px')}
          onMouseLeave={e => (e.currentTarget.style.gap = '8px')}
        >
          VIEW EVENT <ArrowRight size={16} />
        </Link>
      </div>
    </motion.div>
  );
}

export default function EventsListPage() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('shows')
      .select('*')
      .neq('status', 'past')
      .order('sort_order', { ascending: true })
      .order('date', { ascending: true })
      .then(({ data }) => {
        setShows(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{ minHeight: '100vh', background: '#000000', position: 'relative' }}
    >
      <MetalBackground />
      <MarqueeTicker />
      <EventsNav />

      <section style={{ position: 'relative', zIndex: 1, maxWidth: '1280px', margin: '0 auto', padding: '64px 28px 96px' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h1
            style={{
              fontFamily: "'Saira Condensed', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(36px, 5vw, 56px)',
              textTransform: 'uppercase',
              letterSpacing: '6px',
              color: '#ffffff',
              marginBottom: '12px',
            }}
          >
            UPCOMING <span style={{ color: 'var(--red-bright)' }}>EVENTS</span>
          </h1>
          <p style={{ fontFamily: "'Saira', sans-serif", fontWeight: 300, fontSize: '16px', color: '#b0b0b0' }}>
            Find PERREO ELECTRICO in a city near you.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '13px', letterSpacing: '6px', textTransform: 'uppercase', color: 'var(--chrome-dim)' }}>
            Loading...
          </div>
        ) : shows.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '14px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--chrome-dim)' }}>
            No upcoming events — check back soon
          </div>
        ) : (
          <div className="events-grid">
            {shows.map((show, i) => (
              <EventCard key={show.id} show={show} index={i} />
            ))}
          </div>
        )}
      </section>

      <footer
        style={{
          position: 'relative',
          zIndex: 1,
          background: 'rgba(0,0,0,0.95)',
          borderTop: '1px solid rgba(180,0,0,0.2)',
          padding: '48px 24px 32px',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <div
            style={{
              fontFamily: "'Saira Condensed', sans-serif",
              fontWeight: 900,
              fontSize: '24px',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              color: 'var(--red-bright)',
              textShadow: '0 0 20px rgba(255,26,26,0.4)',
              marginBottom: '12px',
            }}
          >
            PERREO ELECTRICO
          </div>
          <hr className="section-divider" style={{ marginBottom: '24px' }} />
          <div style={{ fontFamily: "'Saira', sans-serif", fontWeight: 300, fontSize: '12px', color: 'var(--chrome-dim)', opacity: 0.5 }}>
            \u00A9 2026 PERREO ELECTRICO. All rights reserved.
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
