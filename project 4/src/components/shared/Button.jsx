import { motion } from 'framer-motion';

export default function Button({
  children,
  variant = 'red',
  href,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  target,
  rel,
}) {
  const base = {
    display: 'inline-block',
    fontFamily: "'Saira Condensed', sans-serif",
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '5px',
    fontSize: '13px',
    padding: '10px 28px',
    clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'background 0.2s, color 0.2s',
  };

  const variants = {
    red: {
      background: 'var(--red)',
      color: 'var(--white)',
    },
    'red-outline': {
      background: 'transparent',
      color: 'var(--red-bright)',
      border: '1px solid var(--red)',
    },
    chrome: {
      background: 'var(--chrome)',
      color: 'var(--black)',
    },
    'chrome-outline': {
      background: 'transparent',
      color: 'var(--chrome)',
      border: '1px solid var(--chrome-dim)',
    },
    dark: {
      background: 'rgba(255,255,255,0.05)',
      color: 'var(--text)',
      border: '1px solid rgba(255,255,255,0.1)',
    },
  };

  const style = { ...base, ...variants[variant], ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}) };

  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        style={style}
        className={className}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={className}
      whileHover={!disabled ? { y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
    >
      {children}
    </motion.button>
  );
}
