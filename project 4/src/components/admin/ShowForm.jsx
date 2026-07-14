import { useState, useRef } from 'react';
import { X, Upload, Link as LinkIcon, ToggleLeft, ToggleRight, Zap, Flame, Megaphone } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../shared/Button';

const emptyForm = {
  date: '',
  city: '',
  state: '',
  venue: '',
  ticket_url: '',
  status: 'on_sale',
  notes: '',
  sort_order: 0,
  description: '',
  flyer_image_url: '',
  doors_time: '',
  end_time: '',
  age_restriction: '18+',
  address: '',
  promo_active: false,
  promo_type: 'custom',
  promo_title: '',
  promo_message: '',
};

const inputStyle = {
  width: '100%',
  background: 'rgba(0,0,0,0.6)',
  border: '1px solid rgba(192,192,192,0.15)',
  color: 'var(--white)',
  fontFamily: "'Saira', sans-serif",
  fontWeight: 300,
  fontSize: '14px',
  padding: '10px 14px',
  outline: 'none',
  borderRadius: '2px',
};

const labelStyle = {
  fontFamily: "'Saira Condensed', sans-serif",
  fontWeight: 900,
  fontSize: '10px',
  letterSpacing: '4px',
  textTransform: 'uppercase',
  color: 'var(--chrome-dim)',
  display: 'block',
  marginBottom: '6px',
};

export default function ShowForm({ show, onClose, onSaved }) {
  const [form, setForm] = useState(show ? {
    date: show.date || '',
    city: show.city || '',
    state: show.state || '',
    venue: show.venue || '',
    ticket_url: show.ticket_url || '',
    status: show.status || 'on_sale',
    notes: show.notes || '',
    sort_order: show.sort_order ?? 0,
    description: show.description || '',
    flyer_image_url: show.flyer_image_url || '',
    doors_time: show.doors_time || '',
    end_time: show.end_time || '',
    age_restriction: show.age_restriction || '18+',
    address: show.address || '',
    promo_active: show.promo_active || false,
    promo_type: show.promo_type || 'custom',
    promo_title: show.promo_title || '',
    promo_message: show.promo_message || '',
  } : emptyForm);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const generateSlug = (city, state, date) => {
    return `${city}-${state}-${date}`.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
  };

  const compressImage = (file, maxWidth = 1200, quality = 0.75) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => resolve(blob),
          'image/webp',
          quality
        );
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFlyerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const compressed = await compressImage(file);
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;

    const { error: uploadError } = await supabase.storage
      .from('flyers')
      .upload(fileName, compressed, { contentType: 'image/webp' });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('flyers').getPublicUrl(fileName);
    set('flyer_image_url', urlData.publicUrl);
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const slug = generateSlug(form.city, form.state, form.date);
    const data = { ...form, sort_order: parseInt(form.sort_order) || 0, slug };

    let result;
    if (show) {
      result = await supabase.from('shows').update(data).eq('id', show.id);
    } else {
      result = await supabase.from('shows').insert(data);
    }

    setLoading(false);
    if (result.error) {
      setError(result.error.message);
    } else {
      onSaved();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: '#0a0000',
          border: '1px solid rgba(192,192,192,0.12)',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '22px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--chrome)' }}>
            {show ? 'Edit Show' : 'Add Show'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--chrome-dim)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Date</label>
            <input type="date" value={form.date} onChange={e => set('date', e.target.value)} required style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>City</label>
              <input type="text" value={form.city} onChange={e => set('city', e.target.value)} required placeholder="City" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>State</label>
              <input type="text" value={form.state} onChange={e => set('state', e.target.value)} required maxLength={4} placeholder="ST" style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Venue</label>
            <input type="text" value={form.venue} onChange={e => set('venue', e.target.value)} required placeholder="Venue name" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Ticket URL</label>
            <input type="url" value={form.ticket_url} onChange={e => set('ticket_url', e.target.value)} placeholder="https://..." style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="on_sale">On Sale</option>
                <option value="sold_out">Sold Out</option>
                <option value="past">Past</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Sort Order</label>
              <input type="number" value={form.sort_order} onChange={e => set('sort_order', e.target.value)} min={0} style={inputStyle} />
            </div>
          </div>

          {/* Event Page Fields */}
          <div style={{ borderTop: '1px solid rgba(192,192,192,0.1)', paddingTop: '16px', marginTop: '8px' }}>
            <div style={{ ...labelStyle, color: 'var(--red)', fontSize: '11px', marginBottom: '12px' }}>Event Page Details</div>
          </div>

          <div>
            <label style={labelStyle}>Address (for maps)</label>
            <input type="text" value={form.address} onChange={e => set('address', e.target.value)} placeholder="123 Main St, City, State ZIP" style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Doors Time</label>
              <input type="text" value={form.doors_time} onChange={e => set('doors_time', e.target.value)} placeholder="9:00 PM" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>End Time</label>
              <input type="text" value={form.end_time} onChange={e => set('end_time', e.target.value)} placeholder="2:00 AM" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Ages</label>
              <input type="text" value={form.age_restriction} onChange={e => set('age_restriction', e.target.value)} placeholder="18+" style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Flyer Image</label>
            {form.flyer_image_url && (
              <div style={{ marginBottom: '10px', position: 'relative', display: 'inline-block' }}>
                <img
                  src={form.flyer_image_url}
                  alt="Flyer preview"
                  style={{ height: '120px', width: 'auto', borderRadius: '4px', border: '1px solid rgba(192,192,192,0.15)', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={() => set('flyer_image_url', '')}
                  style={{
                    position: 'absolute', top: '4px', right: '4px',
                    background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(204,0,0,0.4)',
                    color: 'var(--red-bright)', borderRadius: '50%',
                    width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', padding: 0,
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{
                  ...inputStyle,
                  flex: '0 0 auto',
                  width: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: uploading ? 'wait' : 'pointer',
                  border: '1px solid rgba(204,0,0,0.3)',
                  background: 'rgba(204,0,0,0.06)',
                  color: 'var(--red-bright)',
                  fontWeight: 700,
                  fontSize: '11px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontFamily: "'Saira Condensed', sans-serif",
                }}
              >
                <Upload size={14} />
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
              <input
                type="url"
                value={form.flyer_image_url}
                onChange={e => set('flyer_image_url', e.target.value)}
                placeholder="Or paste image URL..."
                style={{ ...inputStyle, flex: 1 }}
              />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFlyerUpload}
              style={{ display: 'none' }}
            />
          </div>

          <div>
            <label style={labelStyle}>Event Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="About this event..." rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          {/* Drop Mode Section */}
          <div style={{ borderTop: '1px solid rgba(192,192,192,0.1)', paddingTop: '16px', marginTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ ...labelStyle, color: 'var(--red)', fontSize: '11px', marginBottom: 0 }}>Drop Mode — event page becomes phone-capture landing</div>
              <button
                type="button"
                onClick={() => set('notes', (form.notes || '').includes('[DROP]') ? form.notes.replace('[DROP]', '').trim() : ('[DROP] ' + (form.notes || '')).trim())}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                  color: (form.notes || '').includes('[DROP]') ? 'var(--red-bright)' : 'var(--chrome-dim)',
                  fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase',
                }}
              >
                {(form.notes || '').includes('[DROP]') ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                {(form.notes || '').includes('[DROP]') ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Promo Banner Section */}
          <div style={{ borderTop: '1px solid rgba(192,192,192,0.1)', paddingTop: '16px', marginTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ ...labelStyle, color: 'var(--red)', fontSize: '11px', marginBottom: 0 }}>Promo Banner</div>
              <button
                type="button"
                onClick={() => set('promo_active', !form.promo_active)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: form.promo_active ? 'var(--red-bright)' : 'var(--chrome-dim)',
                  fontFamily: "'Saira Condensed', sans-serif",
                  fontWeight: 900,
                  fontSize: '11px',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                }}
              >
                {form.promo_active ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                {form.promo_active ? 'LIVE' : 'OFF'}
              </button>
            </div>

            {form.promo_active && (
              <div style={{
                background: 'rgba(204,0,0,0.04)',
                border: '1px solid rgba(204,0,0,0.2)',
                borderRadius: '2px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}>
                <div>
                  <label style={labelStyle}>Promo Type</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[
                      { value: 'bogo', label: 'BOGO', icon: Zap },
                      { value: 'low_tickets', label: 'Low Tickets', icon: Flame },
                      { value: 'custom', label: 'Custom', icon: Megaphone },
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          set('promo_type', value);
                          if (!form.promo_title) {
                            const defaults = { bogo: 'BOGO DEAL', low_tickets: 'SELLING FAST', custom: 'SPECIAL OFFER' };
                            set('promo_title', defaults[value]);
                          }
                        }}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '8px 12px',
                          fontFamily: "'Saira Condensed', sans-serif",
                          fontWeight: 900,
                          fontSize: '10px',
                          letterSpacing: '2px',
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          borderRadius: '2px',
                          border: form.promo_type === value ? '1px solid rgba(204,0,0,0.5)' : '1px solid rgba(192,192,192,0.15)',
                          background: form.promo_type === value ? 'rgba(204,0,0,0.15)' : 'rgba(0,0,0,0.4)',
                          color: form.promo_type === value ? 'var(--red-bright)' : 'var(--chrome-dim)',
                        }}
                      >
                        <Icon size={13} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Banner Title</label>
                  <input
                    type="text"
                    value={form.promo_title}
                    onChange={e => set('promo_title', e.target.value)}
                    placeholder="e.g. BOGO DEAL, SELLING FAST"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Banner Message</label>
                  <input
                    type="text"
                    value={form.promo_message}
                    onChange={e => set('promo_message', e.target.value)}
                    placeholder="e.g. Buy one ticket, get one FREE."
                    style={inputStyle}
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label style={labelStyle}>Notes (internal, optional)</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any notes..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          {error && (
            <div style={{ color: 'var(--red-bright)', fontFamily: "'Saira', sans-serif", fontSize: '13px' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <Button type="button" variant="chrome-outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="chrome" disabled={loading}>
              {loading ? 'Saving...' : show ? 'Save Changes' : 'Add Show'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
