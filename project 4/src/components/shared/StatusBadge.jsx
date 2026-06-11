export default function StatusBadge({ status }) {
  const configs = {
    on_sale: {
      label: 'ON SALE',
      style: {
        background: 'rgba(204,0,0,0.15)',
        border: '1px solid var(--red)',
        color: 'var(--red-bright)',
      },
    },
    sold_out: {
      label: 'SOLD OUT',
      style: {
        background: 'var(--red)',
        border: '1px solid var(--red)',
        color: 'var(--white)',
      },
    },
    past: {
      label: 'PAST',
      style: {
        background: 'rgba(136,136,136,0.1)',
        border: '1px solid rgba(136,136,136,0.3)',
        color: 'var(--chrome-dim)',
      },
    },
  };

  const config = configs[status] || configs.on_sale;

  return (
    <span
      style={{
        ...config.style,
        display: 'inline-block',
        padding: '3px 10px',
        fontFamily: "'Saira Condensed', sans-serif",
        fontWeight: 900,
        fontSize: '10px',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        clipPath: 'polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)',
        whiteSpace: 'nowrap',
      }}
    >
      {config.label}
    </span>
  );
}
