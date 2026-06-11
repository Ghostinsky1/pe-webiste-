import { motion } from 'framer-motion';

const fallbackEvents = [
  { city: 'Chicago', state: 'IL', venue: 'Smart Bar', date: 'OCT 2025', attendance: '650+' },
  { city: 'Houston', state: 'TX', venue: 'Warehouse Live', date: 'NOV 2025', attendance: '800+' },
  { city: 'Phoenix', state: 'AZ', venue: 'Crescent Ballroom', date: 'DEC 2025', attendance: '500+' },
  { city: 'Atlanta', state: 'GA', venue: 'Masquerade', date: 'JAN 2026', attendance: '700+' },
];

export default function PastEvents({ cities = [] }) {
  const events = cities.length > 0 ? cities : fallbackEvents;
  return (
    <section
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
          style={{ marginBottom: '32px' }}
        >
          <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '11px', letterSpacing: '6px', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '12px' }}>
            // Previously
          </div>
          <h2 style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(36px, 5vw, 64px)', textTransform: 'uppercase', color: 'var(--white)', lineHeight: 1 }}>
            We've <span style={{ color: 'var(--red-bright)' }}>Been There</span>
          </h2>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          {events.map((event, i) => (
            <motion.div
              key={event.id || i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{
                border: '1px solid rgba(136,136,136,0.15)',
                padding: '28px 24px',
                background: 'rgba(0,0,0,0.3)',
                opacity: 0.7,
              }}
            >
              <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '11px', letterSpacing: '4px', color: 'var(--chrome-dim)', textTransform: 'uppercase', marginBottom: '8px' }}>
                {event.date || 'Past Event'}
              </div>
              <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '22px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text)', marginBottom: '4px' }}>
                {event.city}, {event.state}
              </div>
              <div style={{ fontFamily: "'Saira', sans-serif", fontWeight: 300, fontSize: '13px', color: 'var(--chrome-dim)', marginBottom: '16px' }}>
                {event.venue || '—'}
              </div>
              {event.attendance && (
                <>
                  <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '28px', color: 'var(--chrome-dim)', letterSpacing: '-1px' }}>
                    {event.attendance}
                  </div>
                  <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 700, fontSize: '10px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--chrome-dim)', opacity: 0.5 }}>
                    Attendees
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
