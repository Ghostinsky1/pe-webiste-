import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../shared/Button';
import StatusBadge from '../shared/StatusBadge';

function groupByMonth(shows) {
  const groups = {};
  for (const show of shows) {
    const date = new Date(show.date + 'T12:00:00');
    const key = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!groups[key]) groups[key] = [];
    groups[key].push(show);
  }
  return groups;
}

function formatDate(dateStr) {
  const date = new Date(dateStr + 'T12:00:00');
  return {
    day: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
    num: date.getDate(),
    month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
  };
}

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.4 },
  }),
};

function ShowRow({ show, index }) {
  const d = formatDate(show.date);
  const isPast = show.status === 'past';
  const isSoldOut = show.status === 'sold_out';

  return (
    <motion.div
      custom={index}
      variants={rowVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '14px 20px',
        borderBottom: '1px solid rgba(180,0,0,0.1)',
        opacity: isPast ? 0.35 : 1,
        transition: 'background 0.2s',
      }}
      onMouseEnter={e => { if (!isPast) e.currentTarget.style.background = 'rgba(180,0,0,0.06)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
    >
      {/* Date block */}
      <div style={{ textAlign: 'center', flexShrink: 0, width: '64px' }}>
        <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '10px', letterSpacing: '3px', color: 'var(--red)', marginBottom: '2px' }}>{d.day}</div>
        <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '26px', lineHeight: 1, color: 'var(--white)', textDecoration: isPast ? 'line-through' : 'none' }}>{d.num}</div>
        <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 700, fontSize: '11px', letterSpacing: '2px', color: 'var(--chrome-dim)' }}>{d.month}</div>
      </div>

      {/* City + Venue + Actions */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Link
          to={show.slug ? `/events/${show.slug}` : '#'}
          style={{
            fontFamily: "'Saira Condensed', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(15px, 3.5vw, 21px)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: 'var(--white)',
            textDecoration: isPast ? 'line-through' : 'none',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'block',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => { if (!isPast) e.currentTarget.style.color = 'var(--red-bright)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--white)'; }}
        >
          {show.city}, {show.state}
        </Link>
        <div
          style={{
            fontFamily: "'Saira', sans-serif",
            fontWeight: 300,
            fontSize: '12px',
            color: 'var(--chrome-dim)',
            marginTop: '1px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {show.venue}
        </div>

        {/* Badge + ticket — always below venue */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px', flexWrap: 'wrap' }}>
          <StatusBadge status={show.status} />
          {show.status === 'on_sale' && show.ticket_url && (
            <Button href={show.ticket_url} variant="red-outline" target="_blank" rel="noopener noreferrer">
              Tickets
            </Button>
          )}
          {isSoldOut && (
            <span
              style={{
                fontFamily: "'Saira Condensed', sans-serif",
                fontWeight: 900,
                fontSize: '11px',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: 'var(--red)',
              }}
            >
              SOLD OUT
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function TourDates({ shows }) {
  const [pastOpen, setPastOpen] = useState(false);

  const upcomingShows = shows.filter(s => s.status !== 'past').sort((a, b) => new Date(a.date) - new Date(b.date));
  const pastShows = shows.filter(s => s.status === 'past').sort((a, b) => new Date(b.date) - new Date(a.date));

  const upcomingGroups = groupByMonth(upcomingShows);
  const pastGroups = groupByMonth(pastShows);

  return (
    <section
      id="tour"
      style={{
        position: 'relative',
        zIndex: 1,
        background: 'rgba(6,0,0,0.85)',
        padding: '56px 24px',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '11px', letterSpacing: '6px', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '12px' }}>
            // On Tour Now
          </div>
          <h2 style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(40px, 6vw, 72px)', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--white)', lineHeight: 1, marginBottom: '32px' }}>
            Tour <span style={{ color: 'var(--red-bright)' }}>Dates</span>
          </h2>
        </motion.div>

        {Object.entries(upcomingGroups).map(([month, monthShows]) => (
          <div key={month} style={{ marginBottom: '32px' }}>
            <div
              style={{
                padding: '8px 20px',
                background: 'rgba(180,0,0,0.1)',
                borderLeft: '3px solid var(--red)',
                fontFamily: "'Saira Condensed', sans-serif",
                fontWeight: 900,
                fontSize: '13px',
                letterSpacing: '6px',
                textTransform: 'uppercase',
                color: 'var(--red)',
                marginBottom: '0',
              }}
            >
              {month}
            </div>
            <div style={{ border: '1px solid rgba(180,0,0,0.15)', borderTop: 'none' }}>
              {monthShows.map((show, i) => (
                <ShowRow key={show.id} show={show} index={i} />
              ))}
            </div>
          </div>
        ))}

        {/* Past Shows Accordion */}
        {pastShows.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <button
              onClick={() => setPastOpen(!pastOpen)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 20px',
                background: 'rgba(136,136,136,0.06)',
                border: '1px solid rgba(136,136,136,0.15)',
                cursor: 'pointer',
                fontFamily: "'Saira Condensed', sans-serif",
                fontWeight: 900,
                fontSize: '13px',
                letterSpacing: '5px',
                textTransform: 'uppercase',
                color: 'var(--chrome-dim)',
              }}
            >
              <span>Past Shows ({pastShows.length})</span>
              {pastOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <AnimatePresence>
              {pastOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                >
                  {Object.entries(pastGroups).map(([month, monthShows]) => (
                    <div key={month} style={{ marginTop: '12px' }}>
                      <div style={{ padding: '6px 20px', background: 'rgba(136,136,136,0.06)', fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '12px', letterSpacing: '5px', textTransform: 'uppercase', color: 'var(--chrome-dim)' }}>
                        {month}
                      </div>
                      <div style={{ border: '1px solid rgba(136,136,136,0.1)' }}>
                        {monthShows.map((show, i) => (
                          <ShowRow key={show.id} show={show} index={i} />
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {upcomingShows.length === 0 && pastShows.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--chrome-dim)', fontFamily: "'Saira Condensed', sans-serif", letterSpacing: '4px', fontSize: '14px' }}>
            NO SHOWS ANNOUNCED YET — CHECK BACK SOON
          </div>
        )}
      </div>
    </section>
  );
}
