import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// ── Laylo-style "drop your number" city landing page ──
// Routes: /drop/:key and /:key  (key = city shortcode or show slug)
// Phone -> /api/drop -> ClickFunnels (drop_signup + city tag)

const ALIASES = {
  stl: 'st-louis', 'saint-louis': 'st-louis', 'st-louis': 'st-louis',
  kc: 'kansas-city', kansascity: 'kansas-city', 'kansas-city': 'kansas-city',
  slc: 'salt-lake', saltlake: 'salt-lake', 'salt-lake-city': 'salt-lake', 'salt-lake': 'salt-lake',
  denver: 'denver', chicago: 'chicago', milwaukee: 'milwaukee', seattle: 'seattle',
  portland: 'portland', pasco: 'pasco', greensboro: 'greensboro', nashville: 'nashville',
};

const CITY_TAGS = {
  'denver': 'city_denver', 'chicago': 'city_chicago', 'milwaukee': 'city_milwaukee',
  'seattle': 'city_seattle', 'portland': 'city_portland', 'pasco': 'city_pasco',
  'greensboro': 'city_greensboro', 'salt-lake': 'city_saltlakecity',
  'kansas-city': 'city_kansascity', 'st-louis': 'city_stlouis', 'nashville': 'city_nashville',
};

export default function DropPage() {
  const { key = '' } = useParams();
  const [show, setShow] = useState(null);
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);

  const k = key.toLowerCase();
  const cityKey = ALIASES[k] || Object.values(ALIASES).find(a => k.includes(a)) || null;

  useEffect(() => {
    supabase
      .from('shows')
      .select('*')
      .neq('status', 'past')
      .order('date', { ascending: true })
      .then(({ data }) => {
        if (!data) return;
        const match = data.find(s => s.slug === k)
          || (cityKey && data.find(s => (s.slug || '').includes(cityKey)))
          || (cityKey && data.find(s => (s.city || '').toLowerCase().replace(/\s+/g, '-').includes(cityKey)));
        setShow(match || null);
      });
  }, [k, cityKey]);

  const cityLabel = show ? `${show.city}` : (cityKey || key).replace(/-/g, ' ').toUpperCase();
  const cityShort = (cityKey === 'st-louis' ? 'STL' : cityKey === 'kansas-city' ? 'KC'
    : cityKey === 'salt-lake' ? 'SLC' : (show?.state || cityLabel.slice(0, 3))).toUpperCase();
  const dateStr = show
    ? new Date(show.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()
    : '[DATE DROPS SOON]';
  const cityTag = (cityKey && CITY_TAGS[cityKey]) || 'city_unknown';

  const submit = (e) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) { setErr(true); return; }
    setErr(false);
    setBusy(true);
    if (typeof window.fbq === 'function') window.fbq('track', 'Lead');
    if (window.ttq && window.ttq.track) window.ttq.track('SubmitForm');
    fetch('/api/drop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: phone.trim(),
        city_tag: cityTag,
        city_label: cityLabel,
        show_slug: show?.slug || '',
        page_url: window.location.href,
      }),
    }).catch(() => {}).finally(() => { setBusy(false); setSent(true); });
  };

  const mono = { fontFamily: "'Courier New', monospace", textTransform: 'uppercase' };
  const bebas = { fontFamily: "'Bebas Neue', 'Saira Condensed', sans-serif" };

  return (
    <div style={{
      minHeight: '100vh', background: '#050203', color: '#fff', display: 'flex',
      alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden',
    }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" />
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(204,0,0,0.22), transparent 60%), radial-gradient(ellipse 60% 40% at 50% 110%, rgba(232,96,26,0.12), transparent 60%)',
      }} />
      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 430, padding: '44px 24px 56px', textAlign: 'center' }}>
        <div style={{ ...mono, fontSize: 11, letterSpacing: '0.35em', color: '#6b5a5a', marginBottom: 26 }}>You found it</div>
        <img src="/Oxido.png" alt="Perreo Electrico" style={{ width: '100%', maxWidth: 250, margin: '0 auto 18px', display: 'block', filter: 'drop-shadow(0 0 14px rgba(220,30,80,0.5)) drop-shadow(0 0 30px rgba(180,100,0,0.25))' }} />
        <h1 style={{ ...bebas, fontSize: 'clamp(2.6rem, 11vw, 3.6rem)', lineHeight: 0.95, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 12, background: 'linear-gradient(135deg,#fff 30%,#e8a020 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Underground<br />Latin Rave<br /><span style={{ WebkitTextFillColor: '#dc1e50' }}>· {cityShort} ·</span>
        </h1>
        <p style={{ fontSize: 15, color: '#c9b8b8', opacity: 0.9, marginBottom: 6 }}>Perreo Eléctrico — {cityLabel}</p>
        <p style={{ ...mono, fontSize: 12, letterSpacing: '0.2em', color: '#6b5a5a', marginBottom: 34 }}>{dateStr} · VENUE REVEALED BY TEXT</p>

        {!sent ? (
          <div>
            <form onSubmit={submit} style={{ background: '#0b0607', border: '1px solid #2a1418', padding: '24px 20px', textAlign: 'left' }}>
              <label htmlFor="drop-phone" style={{ ...mono, display: 'block', fontSize: 10, letterSpacing: '0.3em', color: '#7a5f5f', marginBottom: 10 }}>
                Your number — address + presale hits your phone
              </label>
              <input
                id="drop-phone" type="tel" inputMode="tel" placeholder="(314) 555-0199"
                value={phone} onChange={e => setPhone(e.target.value)}
                style={{
                  width: '100%', boxSizing: 'border-box', background: '#070304',
                  border: `1px solid ${err ? '#dc1e50' : '#2a1418'}`, color: '#fff', fontSize: 18,
                  padding: '16px 14px', outline: 'none', letterSpacing: '0.05em', marginBottom: 14, borderRadius: 0,
                }}
              />
              <button type="submit" disabled={busy} style={{
                ...bebas, width: '100%', background: 'linear-gradient(135deg,#dc1e50,#e8601a,#e8a020)',
                color: '#000', border: 'none', fontSize: 17, letterSpacing: '0.2em', textTransform: 'uppercase',
                padding: '16px 0', cursor: 'pointer', opacity: busy ? 0.6 : 1,
              }}>
                {busy ? 'SENDING…' : 'SEND ME THE ADDRESS →'}
              </button>
              <p style={{ fontSize: 10.5, color: '#5a4646', lineHeight: 1.5, marginTop: 12, textAlign: 'center' }}>
                By submitting you agree to receive texts from Perreo Eléctrico. Msg &amp; data rates may apply. Reply STOP to opt out.
              </p>
            </form>
          </div>
        ) : (
          <div>
            <h2 style={{ ...bebas, fontSize: '2rem', textTransform: 'uppercase', letterSpacing: '2px', background: 'linear-gradient(135deg,#fff 30%,#e8a020 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 12 }}>
              You're in 🔥
            </h2>
            <p style={{ fontSize: 14, color: '#c9b8b8', marginBottom: 20, lineHeight: 1.6 }}>
              Watch your texts — address + presale drops there first.<br />Don't wait on the door price:
            </p>
            {show?.ticket_url ? (
              <a href={show.ticket_url} style={{ ...bebas, display: 'inline-block', background: 'linear-gradient(135deg,#dc1e50,#e8601a,#e8a020)', color: '#000', textDecoration: 'none', fontSize: 15, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '16px 36px' }}>
                Get Tickets →
              </a>
            ) : (
              <p style={{ ...mono, fontSize: 11, letterSpacing: '0.25em', color: '#7a5f5f' }}>PRESALE LINK COMING BY TEXT</p>
            )}
          </div>
        )}

        <div style={{ ...mono, marginTop: 34, fontSize: 10, letterSpacing: '0.3em', color: '#3d2f2f' }}>
          Goza Entertainment · Perreo Eléctrico
        </div>
      </div>
    </div>
  );
}
