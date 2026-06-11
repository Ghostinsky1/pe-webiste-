export default function Footer() {
  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 1,
        background: 'rgba(0,0,0,0.95)',
        borderTop: '1px solid rgba(180,0,0,0.2)',
        padding: '48px 24px 32px',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            marginBottom: '40px',
          }}
        >
          {/* Brand */}
          <div>
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
            <p style={{ fontFamily: "'Saira', sans-serif", fontWeight: 300, fontSize: '13px', color: 'var(--chrome-dim)', lineHeight: 1.6 }}>
              The reggaetón rave on tour.
              <br />
              Presented by Goza Entertainment.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '11px', letterSpacing: '5px', textTransform: 'uppercase', color: 'var(--chrome-dim)', marginBottom: '16px' }}>
              Navigate
            </div>
            {[
              { label: 'Tour Dates', href: '#tour' },
              { label: 'Gallery', href: '#gallery' },
              { label: 'Sound', href: '#sound' },
              { label: 'Request City', href: '#request' },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  display: 'block',
                  fontFamily: "'Saira Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: '14px',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  color: 'var(--text)',
                  textDecoration: 'none',
                  marginBottom: '8px',
                  opacity: 0.7,
                  transition: 'opacity 0.2s, color 0.2s',
                }}
                onMouseEnter={e => { e.target.style.opacity = '1'; e.target.style.color = 'var(--white)'; }}
                onMouseLeave={e => { e.target.style.opacity = '0.7'; e.target.style.color = 'var(--text)'; }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '11px', letterSpacing: '5px', textTransform: 'uppercase', color: 'var(--chrome-dim)', marginBottom: '16px' }}>
              Booking
            </div>
            <p style={{ fontFamily: "'Saira', sans-serif", fontWeight: 300, fontSize: '13px', color: 'var(--text)', lineHeight: 1.8 }}>
              bookings@gozaentertainment.com
            </p>
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '11px', letterSpacing: '5px', textTransform: 'uppercase', color: 'var(--chrome-dim)', marginBottom: '8px' }}>
                Admin
              </div>
              <a
                href="/admin"
                style={{
                  fontFamily: "'Saira Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  color: 'var(--chrome-dim)',
                  textDecoration: 'none',
                  opacity: 0.5,
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => (e.target.style.opacity = '1')}
                onMouseLeave={e => (e.target.style.opacity = '0.5')}
              >
                Dashboard ›
              </a>
            </div>
          </div>
        </div>

        <hr className="section-divider" style={{ marginBottom: '24px' }} />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ fontFamily: "'Saira', sans-serif", fontWeight: 300, fontSize: '12px', color: 'var(--chrome-dim)', opacity: 0.5 }}>
            © 2026 Goza Entertainment. All rights reserved.
          </div>
          <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '11px', letterSpacing: '5px', textTransform: 'uppercase', color: 'var(--red)', opacity: 0.4 }}>
            // GOZA ENT.
          </div>
        </div>
      </div>
    </footer>
  );
}
