import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, MapPin, Calendar, Clock, Users, Ticket } from 'lucide-react';
import { supabase } from '../lib/supabase';
import MetalBackground from '../components/shared/MetalBackground';
import PromoBanner from '../components/public/PromoBanner';
import Sound from '../components/public/Sound';
import Gallery from '../components/public/Gallery';
import Testimonials from '../components/public/Testimonials';
import About from '../components/public/About';
import Vibes from '../components/public/Vibes';

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

function EventNav() {
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
            <a
              href="/#tour"
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
              Tour
            </a>
            <a
              href="/#sound"
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
              Sound
            </a>
            <a
              href="/#tour"
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
                background: 'linear-gradient(180deg, #cc0000 0%, #8b0000 100%)',
                color: '#ffffff',
                boxShadow: '0 3px 14px rgba(204,0,0,0.4)',
              }}
            >
              All Dates
            </a>
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

function formatEventDate(dateStr) {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

export default function EventPage() {
  const { slug } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [settings, setSettings] = useState({});
  const [showStickyBtn, setShowStickyBtn] = useState(false);
  const ticketBtnRef = useRef(null);

  useEffect(() => {
    supabase
      .from('shows')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
      .then(({ data }) => {
        setShow(data);
        setLoading(false);
      });

    supabase.from('gallery_images').select('*').order('sort_order', { ascending: true }).then(({ data }) => {
      setImages(data || []);
    });

    supabase.from('site_settings').select('*').then(({ data }) => {
      if (data) {
        const map = {};
        data.forEach(row => { map[row.key] = row.value; });
        setSettings(map);
      }
    });
  }, [slug]);

  useEffect(() => {
    const el = ticketBtnRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBtn(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [show]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
        <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '13px', letterSpacing: '6px', textTransform: 'uppercase', color: 'var(--chrome-dim)' }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!show) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '24px', background: '#000' }}>
        <h1 style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '48px', color: 'var(--red)', letterSpacing: '4px', textTransform: 'uppercase' }}>Event Not Found</h1>
        <Link to="/#tour" style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 700, fontSize: '14px', letterSpacing: '4px', textTransform: 'uppercase', color: '#ffffff', textDecoration: 'underline' }}>View all dates</Link>
      </div>
    );
  }

  const isSoldOut = show.status === 'sold_out';
  const isPast = show.status === 'past';
  const formattedDate = formatEventDate(show.date);
  const timeDisplay = [show.doors_time, show.end_time].filter(Boolean).join(' - ');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{ minHeight: '100vh', background: '#000000', position: 'relative' }}
    >
      <MetalBackground />
      <PromoBanner show={show} />
      <MarqueeTicker />
      <EventNav />

      {/* Back link */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1280px', margin: '0 auto', padding: '24px 28px 0' }}>
        <Link
          to="/#tour"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: "'Saira Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '13px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'var(--chrome-dim)',
            textDecoration: 'none',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--chrome-dim)')}
        >
          <ArrowLeft size={16} />
          Back to all dates
        </Link>
      </div>

      {/* Hero Section */}
      <section style={{ position: 'relative', zIndex: 1, maxWidth: '1280px', margin: '0 auto', padding: '32px 28px 48px' }}>
        <div className="event-hero-grid">
          {/* Left Column - Flyer */}
          <div>
            <div
              style={{
                width: '100%',
                aspectRatio: '3/4',
                borderRadius: '4px',
                overflow: 'hidden',
                boxShadow: '0 0 60px rgba(204,0,0,0.15), 0 20px 60px rgba(0,0,0,0.6)',
                position: 'relative',
                background: 'linear-gradient(135deg, #1a0000 0%, #0a0000 50%, #000000 100%)',
                border: '1px solid rgba(204,0,0,0.2)',
              }}
            >
              {show.flyer_image_url ? (
                <img
                  src={show.flyer_image_url}
                  alt={`${show.city}, ${show.state} event flyer`}
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
                    padding: '40px',
                    position: 'relative',
                  }}
                >
                  <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(204,0,0,0.06) 0%, transparent 70%)' }} />
                  <img
                    src="/Oxido.png"
                    alt="PERREO ELECTRICO"
                    style={{ height: '60px', marginBottom: '24px', filter: 'drop-shadow(0 0 20px rgba(204,0,0,0.4))', position: 'relative', zIndex: 1 }}
                  />
                  <span
                    style={{
                      fontFamily: "'Saira Condensed', sans-serif",
                      fontWeight: 900,
                      fontSize: 'clamp(36px, 6vw, 64px)',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.06)',
                      letterSpacing: '6px',
                      textAlign: 'center',
                      lineHeight: 1.1,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {show.city}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Saira Condensed', sans-serif",
                      fontWeight: 700,
                      fontSize: '13px',
                      letterSpacing: '6px',
                      textTransform: 'uppercase',
                      color: 'rgba(204,0,0,0.4)',
                      marginTop: '16px',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {formattedDate}
                  </span>
                </div>
              )}
            </div>

            {/* GET TICKETS button */}
            <div ref={ticketBtnRef} style={{ marginTop: '24px' }}>
              {isPast ? (
                <div
                  style={{
                    width: '100%',
                    padding: '18px',
                    textAlign: 'center',
                    fontFamily: "'Saira Condensed', sans-serif",
                    fontWeight: 900,
                    fontSize: '16px',
                    letterSpacing: '6px',
                    textTransform: 'uppercase',
                    color: 'var(--chrome-dim)',
                    background: 'rgba(136,136,136,0.08)',
                    border: '1px solid rgba(136,136,136,0.15)',
                    borderRadius: '4px',
                  }}
                >
                  EVENT PASSED
                </div>
              ) : isSoldOut ? (
                <div
                  style={{
                    width: '100%',
                    padding: '18px',
                    textAlign: 'center',
                    fontFamily: "'Saira Condensed', sans-serif",
                    fontWeight: 900,
                    fontSize: '16px',
                    letterSpacing: '6px',
                    textTransform: 'uppercase',
                    color: '#ffffff',
                    background: 'linear-gradient(180deg, #8b0000 0%, #4a0000 100%)',
                    border: '1px solid rgba(204,0,0,0.3)',
                    borderRadius: '4px',
                    opacity: 0.8,
                  }}
                >
                  SOLD OUT
                </div>
              ) : show.ticket_url ? (
                <a
                  href={show.ticket_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '18px',
                    textAlign: 'center',
                    fontFamily: "'Saira Condensed', sans-serif",
                    fontWeight: 900,
                    fontSize: '16px',
                    letterSpacing: '6px',
                    textTransform: 'uppercase',
                    color: '#000000',
                    background: 'linear-gradient(180deg, #cc0000 0%, #8b0000 100%)',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    boxShadow: '0 0 30px rgba(204,0,0,0.3)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    border: 'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 0 50px rgba(204,0,0,0.5)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(204,0,0,0.3)';
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#ffffff' }}>
                    <Ticket size={18} />
                    GET TICKETS
                  </span>
                </a>
              ) : (
                <div
                  style={{
                    width: '100%',
                    padding: '18px',
                    textAlign: 'center',
                    fontFamily: "'Saira Condensed', sans-serif",
                    fontWeight: 900,
                    fontSize: '16px',
                    letterSpacing: '6px',
                    textTransform: 'uppercase',
                    color: 'var(--red)',
                    background: 'rgba(204,0,0,0.06)',
                    border: '1px solid rgba(204,0,0,0.2)',
                    borderRadius: '4px',
                  }}
                >
                  TICKETS COMING SOON
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Info */}
          <div
            style={{
              background: 'rgba(6,0,0,0.8)',
              borderRadius: '4px',
              padding: 'clamp(24px, 4vw, 48px)',
              border: '1px solid rgba(204,0,0,0.1)',
            }}
          >
            {/* City heading */}
            <h1
              style={{
                fontFamily: "'Saira Condensed', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(48px, 6vw, 80px)',
                textTransform: 'uppercase',
                color: 'var(--red-bright)',
                letterSpacing: '4px',
                lineHeight: 1,
                marginBottom: '4px',
              }}
            >
              {show.city}, {show.state}
            </h1>

            {/* Venue link */}
            {show.venue && (
              <a
                href={show.address ? `https://maps.google.com/?q=${encodeURIComponent(show.address)}` : `https://maps.google.com/?q=${encodeURIComponent(show.venue + ' ' + show.city + ' ' + show.state)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: "'Saira', sans-serif",
                  fontWeight: 400,
                  fontSize: '18px',
                  color: '#ffffff',
                  textDecoration: 'underline',
                  textDecorationColor: 'rgba(255,255,255,0.3)',
                  textUnderlineOffset: '4px',
                  marginBottom: '20px',
                  marginTop: '8px',
                }}
              >
                {show.venue}
                <ExternalLink size={14} style={{ opacity: 0.5 }} />
              </a>
            )}

            {/* Date + Time */}
            <p
              style={{
                fontFamily: "'Saira', sans-serif",
                fontWeight: 400,
                fontSize: '20px',
                color: '#ffffff',
                marginBottom: '24px',
              }}
            >
              {formattedDate}{timeDisplay && ` \u2022 ${timeDisplay}`}
            </p>

            {/* Divider */}
            <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(204,0,0,0.4) 0%, rgba(204,0,0,0.05) 100%)', marginBottom: '24px' }} />

            {/* About */}
            {show.description && (
              <div style={{ marginBottom: '32px' }}>
                <span
                  style={{
                    fontFamily: "'Saira Condensed', sans-serif",
                    fontWeight: 900,
                    fontSize: '14px',
                    letterSpacing: '6px',
                    textTransform: 'uppercase',
                    color: 'var(--red)',
                    display: 'block',
                    marginBottom: '12px',
                  }}
                >
                  ABOUT
                </span>
                <p
                  style={{
                    fontFamily: "'Saira', sans-serif",
                    fontWeight: 300,
                    fontSize: '16px',
                    lineHeight: 1.7,
                    color: '#e0e0e0',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {show.description}
                </p>
              </div>
            )}

            {/* Event Details Block */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <MapPin size={18} style={{ color: 'var(--red)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <span style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 700, fontSize: '13px', letterSpacing: '3px', textTransform: 'uppercase', color: '#ffffff' }}>
                    Location
                  </span>
                  <p style={{ fontFamily: "'Saira', sans-serif", fontWeight: 300, fontSize: '15px', color: '#b0b0b0', marginTop: '2px' }}>
                    {show.venue} — {show.city}, {show.state}
                  </p>
                  {show.address && (
                    <p style={{ fontFamily: "'Saira', sans-serif", fontWeight: 300, fontSize: '13px', color: '#888', marginTop: '2px' }}>
                      {show.address}
                    </p>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Calendar size={18} style={{ color: 'var(--red)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <span style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 700, fontSize: '13px', letterSpacing: '3px', textTransform: 'uppercase', color: '#ffffff' }}>
                    Date
                  </span>
                  <p style={{ fontFamily: "'Saira', sans-serif", fontWeight: 300, fontSize: '15px', color: '#b0b0b0', marginTop: '2px' }}>
                    {formattedDate}
                  </p>
                </div>
              </div>

              {show.doors_time && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Clock size={18} style={{ color: 'var(--red)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 700, fontSize: '13px', letterSpacing: '3px', textTransform: 'uppercase', color: '#ffffff' }}>
                      Doors
                    </span>
                    <p style={{ fontFamily: "'Saira', sans-serif", fontWeight: 300, fontSize: '15px', color: '#b0b0b0', marginTop: '2px' }}>
                      {show.doors_time}{show.end_time && ` - ${show.end_time}`}
                    </p>
                  </div>
                </div>
              )}

              {show.age_restriction && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Users size={18} style={{ color: 'var(--red)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 700, fontSize: '13px', letterSpacing: '3px', textTransform: 'uppercase', color: '#ffffff' }}>
                      Ages
                    </span>
                    <p style={{ fontFamily: "'Saira', sans-serif", fontWeight: 300, fontSize: '15px', color: '#b0b0b0', marginTop: '2px' }}>
                      {show.age_restriction}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Second CTA on the right side for mobile */}
            {!isPast && !isSoldOut && show.ticket_url && (
              <a
                href={show.ticket_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  marginTop: '32px',
                  padding: '16px',
                  textAlign: 'center',
                  fontFamily: "'Saira Condensed', sans-serif",
                  fontWeight: 900,
                  fontSize: '14px',
                  letterSpacing: '5px',
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  background: 'rgba(204,0,0,0.15)',
                  border: '1px solid rgba(204,0,0,0.4)',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(204,0,0,0.3)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(204,0,0,0.15)')}
              >
                GET TICKETS
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Shared Sections */}
      <hr className="section-divider" />
      <About settings={settings} />
      <hr className="section-divider" />
      <Vibes />
      <hr className="section-divider" />
      <Sound />
      <hr className="section-divider" />
      <Gallery images={images} />
      <hr className="section-divider" />
      <Testimonials />

      {/* Footer */}
      <footer
        style={{
          position: 'relative',
          zIndex: 1,
          background: 'rgba(0,0,0,0.95)',
          borderTop: '1px solid rgba(180,0,0,0.2)',
          padding: '36px 24px 24px',
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
          <p style={{ fontFamily: "'Saira', sans-serif", fontWeight: 300, fontSize: '13px', color: 'var(--chrome-dim)', marginBottom: '24px' }}>
            The reggaeton rave on tour. Presented by Goza Entertainment.
          </p>
          <hr className="section-divider" style={{ marginBottom: '24px' }} />
          <div style={{ fontFamily: "'Saira', sans-serif", fontWeight: 300, fontSize: '12px', color: 'var(--chrome-dim)', opacity: 0.5 }}>
            \u00A9 2026 PERREO ELECTRICO. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Sticky bottom ticket bar */}
      {!isPast && !isSoldOut && show.ticket_url && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 200,
            padding: '12px 20px',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.92) 0%, rgba(10,0,0,0.98) 100%)',
            borderTop: '1px solid rgba(204,0,0,0.3)',
            backdropFilter: 'blur(12px)',
            transform: showStickyBtn ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.3s ease',
          }}
        >
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <a
              href={show.ticket_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                width: '100%',
                padding: '14px',
                fontFamily: "'Saira Condensed', sans-serif",
                fontWeight: 900,
                fontSize: '15px',
                letterSpacing: '6px',
                textTransform: 'uppercase',
                color: '#ffffff',
                background: 'linear-gradient(180deg, #cc0000 0%, #8b0000 100%)',
                borderRadius: '4px',
                textDecoration: 'none',
                boxShadow: '0 0 30px rgba(204,0,0,0.4)',
                border: 'none',
              }}
            >
              <Ticket size={18} />
              GET TICKETS
            </a>
          </div>
        </div>
      )}
    </motion.div>
  );
}
