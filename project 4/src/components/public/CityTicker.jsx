export default function CityTicker({ cities = [] }) {
  const fallbackCities = ['St. Louis', 'Denver', 'Salt Lake City', 'Kansas City', 'Nashville', 'Portland', 'Seattle', 'Pasco'];

  const cityNames = cities.length > 0
    ? cities.map(c => `${c.city}, ${c.state}`)
    : fallbackCities;

  const repeated = [...cityNames, ...cityNames, ...cityNames, ...cityNames];

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        background: 'rgba(120,0,0,0.25)',
        borderTop: '1px solid rgba(180,0,0,0.4)',
        borderBottom: '1px solid rgba(180,0,0,0.4)',
        overflow: 'hidden',
        padding: '14px 0',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: 'max-content',
          animation: 'ticker-scroll 40s linear infinite',
          whiteSpace: 'nowrap',
        }}
      >
        {repeated.map((city, i) => (
          <span
            key={i}
            style={{
              fontFamily: "'Saira Condensed', sans-serif",
              fontWeight: 700,
              fontSize: '15px',
              letterSpacing: '6px',
              textTransform: 'uppercase',
              color: 'var(--white)',
              padding: '0 32px',
              opacity: 0.85,
            }}
          >
            {city}
            <span style={{ color: 'var(--red)', marginLeft: '32px', marginRight: '-16px' }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
