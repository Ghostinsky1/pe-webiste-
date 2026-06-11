import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Button from '../shared/Button';

const fields = [
  { key: 'hero_headline', label: 'Hero Headline', type: 'input', placeholder: 'Coming to a City Near You' },
  { key: 'hero_subline', label: 'Hero Subline', type: 'input', placeholder: 'The Reggaetón Rave on Tour' },
  { key: 'hero_desc', label: 'Hero Description', type: 'textarea', placeholder: 'Raw perreo, dembow, techno...' },
  { key: 'about_body', label: 'About Body Text', type: 'textarea', placeholder: 'Describe the event...' },
];

const inputStyle = {
  width: '100%',
  background: 'rgba(0,0,0,0.6)',
  border: '1px solid rgba(192,192,192,0.15)',
  color: 'var(--white)',
  fontFamily: "'Saira', sans-serif",
  fontWeight: 300,
  fontSize: '14px',
  padding: '12px 16px',
  outline: 'none',
  borderRadius: '2px',
  resize: 'vertical',
};

const labelStyle = {
  fontFamily: "'Saira Condensed', sans-serif",
  fontWeight: 900,
  fontSize: '10px',
  letterSpacing: '4px',
  textTransform: 'uppercase',
  color: 'var(--chrome-dim)',
  display: 'block',
  marginBottom: '8px',
};

function SettingField({ fieldKey, label, type, placeholder }) {
  const [value, setValue] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', fieldKey).maybeSingle().then(({ data }) => {
      if (data) setValue(data.value || '');
      setLoaded(true);
    });
  }, [fieldKey]);

  const handleSave = async () => {
    setSaving(true);
    await supabase.from('site_settings').upsert({ key: fieldKey, value });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div
      style={{
        border: '1px solid rgba(192,192,192,0.1)',
        padding: '24px',
        background: 'rgba(0,0,0,0.3)',
        marginBottom: '16px',
      }}
    >
      <label style={labelStyle}>{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder={placeholder}
          rows={4}
          style={inputStyle}
          disabled={!loaded}
          onFocus={e => (e.target.style.borderColor = 'rgba(192,192,192,0.4)')}
          onBlur={e => (e.target.style.borderColor = 'rgba(192,192,192,0.15)')}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder={placeholder}
          style={inputStyle}
          disabled={!loaded}
          onFocus={e => (e.target.style.borderColor = 'rgba(192,192,192,0.4)')}
          onBlur={e => (e.target.style.borderColor = 'rgba(192,192,192,0.15)')}
        />
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
        <Button variant="chrome" onClick={handleSave} disabled={saving || !loaded}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
        {saved && (
          <span style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--chrome-dim)' }}>
            Saved ✓
          </span>
        )}
      </div>
    </div>
  );
}

export default function SiteSettings() {
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '28px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--chrome)' }}>
          Site Settings
        </h1>
        <p style={{ fontFamily: "'Saira', sans-serif", fontWeight: 300, fontSize: '13px', color: 'var(--chrome-dim)', marginTop: '4px' }}>
          Edit public-facing text and content
        </p>
      </div>

      <div style={{ maxWidth: '700px' }}>
        {fields.map(field => (
          <SettingField
            key={field.key}
            fieldKey={field.key}
            label={field.label}
            type={field.type}
            placeholder={field.placeholder}
          />
        ))}
      </div>
    </div>
  );
}
