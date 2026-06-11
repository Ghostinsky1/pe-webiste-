import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../shared/Button';
import StatusBadge from '../shared/StatusBadge';
import ShowForm from './ShowForm';

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getMonthYear(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function groupByMonth(shows) {
  const groups = {};
  shows.forEach(show => {
    const key = getMonthYear(show.date);
    if (!groups[key]) groups[key] = [];
    groups[key].push(show);
  });
  return groups;
}

export default function ShowsTable() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editShow, setEditShow] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [pastExpanded, setPastExpanded] = useState(false);

  const fetchShows = async () => {
    setLoading(true);
    const { data } = await supabase.from('shows').select('*').order('date', { ascending: true });
    setShows(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchShows(); }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    const { error } = await supabase.from('shows').update({ status: newStatus }).eq('id', id);
    if (error) {
      alert(`Failed to update status: ${error.message}`);
    }
    fetchShows();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await supabase.from('shows').delete().eq('id', deleteId);
    setDeleteId(null);
    setDeleting(false);
    fetchShows();
  };

  const activeShows = shows.filter(s => s.status !== 'past').sort((a, b) => new Date(a.date) - new Date(b.date));
  const pastShows = shows.filter(s => s.status === 'past').sort((a, b) => new Date(b.date) - new Date(a.date));

  const activeByMonth = groupByMonth(activeShows);
  const pastByMonth = groupByMonth(pastShows);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '28px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--chrome)' }}>
            Tour Dates
          </h1>
          <p style={{ fontFamily: "'Saira', sans-serif", fontWeight: 300, fontSize: '13px', color: 'var(--chrome-dim)', marginTop: '4px' }}>
            {activeShows.length} active &middot; {pastShows.length} past
          </p>
        </div>
        <Button variant="chrome" onClick={() => { setEditShow(null); setFormOpen(true); }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={14} /> Add Show
          </span>
        </Button>
      </div>

      {loading ? (
        <div style={{ color: 'var(--chrome-dim)', fontFamily: "'Saira Condensed', sans-serif", letterSpacing: '4px', textTransform: 'uppercase', fontSize: '12px', padding: '40px 0' }}>
          Loading...
        </div>
      ) : (
        <>
          {/* ACTIVE / UPCOMING SHOWS */}
          {Object.keys(activeByMonth).length > 0 && (
            <div style={{ marginBottom: '48px' }}>
              {Object.entries(activeByMonth).map(([month, monthShows]) => (
                <MonthGroup
                  key={month}
                  month={month}
                  shows={monthShows}
                  onEdit={show => { setEditShow(show); setFormOpen(true); }}
                  onDelete={id => setDeleteId(id)}
                  onStatusUpdate={handleStatusUpdate}
                />
              ))}
            </div>
          )}

          {/* PAST EVENTS - Collapsible */}
          {pastShows.length > 0 && (
            <div
              style={{
                border: '1px solid rgba(136,136,136,0.15)',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => setPastExpanded(!pastExpanded)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  background: 'rgba(20,10,10,0.5)',
                  border: 'none',
                  cursor: 'pointer',
                  borderBottom: pastExpanded ? '1px solid rgba(136,136,136,0.15)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {pastExpanded ? <ChevronDown size={18} style={{ color: 'var(--chrome-dim)' }} /> : <ChevronRight size={18} style={{ color: 'var(--chrome-dim)' }} />}
                  <span style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '14px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--chrome-dim)' }}>
                    Past Events
                  </span>
                  <span style={{ fontFamily: "'Saira', sans-serif", fontWeight: 300, fontSize: '12px', color: 'rgba(136,136,136,0.6)', marginLeft: '4px' }}>
                    ({pastShows.length})
                  </span>
                </div>
              </button>

              {pastExpanded && (
                <div style={{ padding: '16px 0' }}>
                  {Object.entries(pastByMonth).map(([month, monthShows]) => (
                    <MonthGroup
                      key={month}
                      month={month}
                      shows={monthShows}
                      onEdit={show => { setEditShow(show); setFormOpen(true); }}
                      onDelete={id => setDeleteId(id)}
                      onStatusUpdate={handleStatusUpdate}
                      isPast
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {formOpen && (
        <ShowForm
          show={editShow}
          onClose={() => { setFormOpen(false); setEditShow(null); }}
          onSaved={() => { setFormOpen(false); setEditShow(null); fetchShows(); }}
        />
      )}

      {deleteId && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={e => { if (e.target === e.currentTarget) setDeleteId(null); }}
        >
          <div style={{ background: '#0a0000', border: '1px solid rgba(204,0,0,0.3)', padding: '32px', maxWidth: '380px', width: '100%', textAlign: 'center' }}>
            <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '20px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--white)', marginBottom: '12px' }}>
              Delete Show?
            </div>
            <p style={{ fontFamily: "'Saira', sans-serif", fontWeight: 300, fontSize: '14px', color: 'var(--text)', marginBottom: '28px' }}>
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Button variant="chrome-outline" onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button variant="red" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MonthGroup({ month, shows, onEdit, onDelete, onStatusUpdate, isPast }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Month header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '0 20px',
          marginBottom: '12px',
        }}
      >
        <Calendar size={14} style={{ color: isPast ? 'var(--chrome-dim)' : 'var(--red)' }} />
        <span
          style={{
            fontFamily: "'Saira Condensed', sans-serif",
            fontWeight: 900,
            fontSize: '13px',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color: isPast ? 'var(--chrome-dim)' : 'var(--red-bright)',
          }}
        >
          {month}
        </span>
        <div style={{ flex: 1, height: '1px', background: isPast ? 'rgba(136,136,136,0.15)' : 'rgba(204,0,0,0.2)' }} />
      </div>

      {/* Show cards for this month */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '0 12px' }}>
        {shows.map(show => (
          <ShowCard
            key={show.id}
            show={show}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusUpdate={onStatusUpdate}
            isPast={isPast}
          />
        ))}
      </div>
    </div>
  );
}

function ShowCard({ show, onEdit, onDelete, onStatusUpdate, isPast }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '110px 1fr auto',
        gap: '16px',
        alignItems: 'center',
        padding: '14px 16px',
        background: isPast ? 'rgba(10,5,5,0.4)' : 'rgba(20,5,5,0.6)',
        border: isPast ? '1px solid rgba(136,136,136,0.1)' : '1px solid rgba(204,0,0,0.12)',
        borderRadius: '4px',
        transition: 'background 0.15s, border-color 0.15s',
        opacity: isPast ? 0.7 : 1,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = isPast ? 'rgba(20,10,10,0.5)' : 'rgba(40,10,10,0.6)';
        e.currentTarget.style.borderColor = isPast ? 'rgba(136,136,136,0.2)' : 'rgba(204,0,0,0.3)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = isPast ? 'rgba(10,5,5,0.4)' : 'rgba(20,5,5,0.6)';
        e.currentTarget.style.borderColor = isPast ? 'rgba(136,136,136,0.1)' : 'rgba(204,0,0,0.12)';
      }}
    >
      {/* Date */}
      <div>
        <span
          style={{
            fontFamily: "'Saira Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '13px',
            color: isPast ? '#888' : '#c0c0c0',
            whiteSpace: 'nowrap',
          }}
        >
          {formatDate(show.date)}
        </span>
      </div>

      {/* City + Venue + Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', minWidth: 0 }}>
        <span
          style={{
            fontFamily: "'Saira Condensed', sans-serif",
            fontWeight: 900,
            fontSize: '15px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: isPast ? '#aaa' : '#ffffff',
            whiteSpace: 'nowrap',
          }}
        >
          {show.city}, {show.state}
        </span>
        <span
          style={{
            fontFamily: "'Saira', sans-serif",
            fontWeight: 300,
            fontSize: '13px',
            color: '#888',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {show.venue || '—'}
        </span>
        <StatusBadge status={show.status} />
        {show.ticket_url && (
          <a
            href={show.ticket_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'Saira Condensed', sans-serif",
              fontWeight: 700,
              fontSize: '11px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: 'var(--chrome-dim)',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            }}
          >
            Tickets
          </a>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        {!isPast && show.status !== 'sold_out' && (
          <button
            onClick={() => onStatusUpdate(show.id, 'sold_out')}
            style={{
              fontFamily: "'Saira Condensed', sans-serif",
              fontWeight: 900,
              fontSize: '10px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              background: 'rgba(204,0,0,0.2)',
              border: '1px solid rgba(204,0,0,0.4)',
              color: 'var(--red-bright)',
              padding: '5px 10px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              borderRadius: '2px',
            }}
          >
            Sold Out
          </button>
        )}
        {!isPast && show.status === 'sold_out' && (
          <button
            onClick={() => onStatusUpdate(show.id, 'on_sale')}
            style={{
              fontFamily: "'Saira Condensed', sans-serif",
              fontWeight: 900,
              fontSize: '10px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              background: 'rgba(40,160,40,0.12)',
              border: '1px solid rgba(40,160,40,0.4)',
              color: '#4caf50',
              padding: '5px 10px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              borderRadius: '2px',
            }}
          >
            Undo Sold Out
          </button>
        )}
        {!isPast && show.status !== 'past' && (
          <button
            onClick={() => onStatusUpdate(show.id, 'past')}
            style={{
              fontFamily: "'Saira Condensed', sans-serif",
              fontWeight: 900,
              fontSize: '10px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              background: 'rgba(136,136,136,0.08)',
              border: '1px solid rgba(136,136,136,0.2)',
              color: 'var(--chrome-dim)',
              padding: '5px 10px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              borderRadius: '2px',
            }}
          >
            Mark Past
          </button>
        )}
        {isPast && show.status !== 'on_sale' && (
          <button
            onClick={() => onStatusUpdate(show.id, 'on_sale')}
            style={{
              fontFamily: "'Saira Condensed', sans-serif",
              fontWeight: 900,
              fontSize: '10px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              background: 'rgba(204,0,0,0.1)',
              border: '1px solid rgba(204,0,0,0.3)',
              color: 'var(--red-bright)',
              padding: '5px 10px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              borderRadius: '2px',
            }}
          >
            Reactivate
          </button>
        )}
        <button
          onClick={() => onEdit(show)}
          style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(192,192,192,0.3)', color: '#c0c0c0', padding: '7px 9px', cursor: 'pointer', display: 'flex', alignItems: 'center', borderRadius: '2px', transition: 'all 0.15s' }}
          title="Edit"
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(192,192,192,0.15)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.5)'; e.currentTarget.style.color = '#c0c0c0'; }}
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onDelete(show.id)}
          style={{ background: 'rgba(204,0,0,0.15)', border: '1px solid rgba(204,0,0,0.4)', color: '#ff4444', padding: '7px 9px', cursor: 'pointer', display: 'flex', alignItems: 'center', borderRadius: '2px', transition: 'all 0.15s' }}
          title="Delete"
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(204,0,0,0.35)'; e.currentTarget.style.color = '#ff6666'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(204,0,0,0.15)'; e.currentTarget.style.color = '#ff4444'; }}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
