import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../shared/Button';

export default function CitiesManager() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editCity, setEditCity] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    city: '',
    state: '',
    venue: '',
    date: '',
    attendance: '',
  });

  const fetchCities = async () => {
    setLoading(true);
    const { data } = await supabase.from('past_cities').select('*').order('sort_order', { ascending: true });
    setCities(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchCities(); }, []);

  const handleOpenForm = (city = null) => {
    if (city) {
      setEditCity(city);
      setFormData({
        city: city.city,
        state: city.state,
        venue: city.venue || '',
        date: city.date || '',
        attendance: city.attendance || '',
      });
    } else {
      setEditCity(null);
      setFormData({ city: '', state: '', venue: '', date: '', attendance: '' });
    }
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.city || !formData.state) return;

    if (editCity) {
      await supabase.from('past_cities').update(formData).eq('id', editCity.id);
    } else {
      await supabase.from('past_cities').insert({ ...formData, sort_order: cities.length });
    }

    setFormOpen(false);
    setEditCity(null);
    fetchCities();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await supabase.from('past_cities').delete().eq('id', deleteId);
    setDeleteId(null);
    setDeleting(false);
    fetchCities();
  };

  const handleMove = async (id, direction) => {
    const index = cities.findIndex(c => c.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === cities.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newCities = [...cities];
    [newCities[index], newCities[newIndex]] = [newCities[newIndex], newCities[index]];

    for (let i = 0; i < newCities.length; i++) {
      await supabase.from('past_cities').update({ sort_order: i }).eq('id', newCities[i].id);
    }

    fetchCities();
  };

  const inputStyle = {
    background: 'rgba(0,0,0,0.6)',
    border: '1px solid rgba(192,192,192,0.15)',
    color: 'var(--white)',
    fontFamily: "'Saira', sans-serif",
    fontWeight: 300,
    fontSize: '13px',
    padding: '10px 14px',
    outline: 'none',
    width: '100%',
  };

  const labelStyle = {
    fontFamily: "'Saira Condensed', sans-serif",
    fontWeight: 900,
    fontSize: '10px',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    color: 'var(--chrome-dim)',
    display: 'block',
    marginBottom: '6px',
  };

  const cellStyle = {
    padding: '12px 16px',
    fontFamily: "'Saira', sans-serif",
    fontWeight: 300,
    fontSize: '13px',
    color: 'var(--text)',
    borderBottom: '1px solid rgba(192,192,192,0.06)',
    verticalAlign: 'middle',
  };

  const thStyle = {
    padding: '10px 16px',
    fontFamily: "'Saira Condensed', sans-serif",
    fontWeight: 900,
    fontSize: '10px',
    letterSpacing: '4px',
    textTransform: 'uppercase',
    color: 'var(--chrome-dim)',
    textAlign: 'left',
    borderBottom: '1px solid rgba(192,192,192,0.1)',
    background: 'rgba(0,0,0,0.4)',
    whiteSpace: 'nowrap',
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '28px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--chrome)' }}>
            Past Cities
          </h1>
          <p style={{ fontFamily: "'Saira', sans-serif", fontWeight: 300, fontSize: '13px', color: 'var(--chrome-dim)', marginTop: '4px' }}>
            {cities.length} cities total · Shown in "We've Been There" section
          </p>
        </div>
        <Button variant="chrome" onClick={() => handleOpenForm()}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={14} /> Add City
          </span>
        </Button>
      </div>

      {loading ? (
        <div style={{ color: 'var(--chrome-dim)', fontFamily: "'Saira Condensed', sans-serif", letterSpacing: '4px', textTransform: 'uppercase', fontSize: '12px', padding: '40px 0' }}>
          Loading...
        </div>
      ) : cities.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', border: '1px dashed rgba(192,192,192,0.15)' }}>
          <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '13px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--chrome-dim)', marginBottom: '12px' }}>
            No cities added yet
          </div>
          <p style={{ fontFamily: "'Saira', sans-serif", fontWeight: 300, fontSize: '13px', color: 'var(--chrome-dim)', marginBottom: '20px' }}>
            Add past tour cities to display in the "We've Been There" section
          </p>
          <Button variant="chrome" onClick={() => handleOpenForm()}>Add First City</Button>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', border: '1px solid rgba(192,192,192,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr>
                <th style={thStyle}>Order</th>
                <th style={thStyle}>City, State</th>
                <th style={thStyle}>Venue</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Attendance</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((city, index) => (
                <tr key={city.id} style={{ transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(192,192,192,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={cellStyle}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => handleMove(city.id, 'up')}
                        disabled={index === 0}
                        style={{ background: 'none', border: '1px solid rgba(192,192,192,0.2)', color: 'var(--chrome-dim)', padding: '4px', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.3 : 1 }}
                      >
                        <ChevronUp size={12} />
                      </button>
                      <button
                        onClick={() => handleMove(city.id, 'down')}
                        disabled={index === cities.length - 1}
                        style={{ background: 'none', border: '1px solid rgba(192,192,192,0.2)', color: 'var(--chrome-dim)', padding: '4px', cursor: index === cities.length - 1 ? 'not-allowed' : 'pointer', opacity: index === cities.length - 1 ? 0.3 : 1 }}
                      >
                        <ChevronDown size={12} />
                      </button>
                    </div>
                  </td>
                  <td style={cellStyle}>
                    <span style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--white)' }}>
                      {city.city}, {city.state}
                    </span>
                  </td>
                  <td style={{ ...cellStyle, color: 'var(--chrome-dim)', fontSize: '12px' }}>{city.venue || '—'}</td>
                  <td style={{ ...cellStyle, color: 'var(--chrome-dim)', fontSize: '12px' }}>{city.date || '—'}</td>
                  <td style={{ ...cellStyle, color: 'var(--chrome)', fontSize: '13px', fontFamily: "'Saira Condensed', sans-serif", fontWeight: 700 }}>
                    {city.attendance || '—'}
                  </td>
                  <td style={cellStyle}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleOpenForm(city)}
                        style={{ background: 'none', border: '1px solid rgba(192,192,192,0.2)', color: 'var(--chrome-dim)', padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(city.id)}
                        style={{ background: 'none', border: '1px solid rgba(204,0,0,0.3)', color: 'var(--red)', padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}
          onClick={e => { if (e.target === e.currentTarget) setFormOpen(false); }}
        >
          <div style={{ background: '#0a0000', border: '1px solid rgba(192,192,192,0.2)', padding: '32px', maxWidth: '500px', width: '100%', marginTop: '20px' }}>
            <h2 style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '24px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--chrome)', marginBottom: '24px' }}>
              {editCity ? 'Edit City' : 'Add City'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  style={inputStyle}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>State (2-letter code) *</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={e => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                  style={inputStyle}
                  maxLength={2}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Venue</label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={e => setFormData({ ...formData, venue: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Date (e.g., "OCT 2025")</label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={labelStyle}>Attendance (e.g., "650+")</label>
                <input
                  type="text"
                  value={formData.attendance}
                  onChange={e => setFormData({ ...formData, attendance: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Button variant="chrome-outline" onClick={() => setFormOpen(false)} type="button">Cancel</Button>
                <Button variant="chrome" type="submit">{editCity ? 'Update' : 'Add'} City</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={e => { if (e.target === e.currentTarget) setDeleteId(null); }}
        >
          <div style={{ background: '#0a0000', border: '1px solid rgba(204,0,0,0.3)', padding: '32px', maxWidth: '380px', width: '100%', textAlign: 'center' }}>
            <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '20px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--white)', marginBottom: '12px' }}>
              Delete City?
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
