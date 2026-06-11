import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Calendar, Image, Settings, LogOut, Menu, X, MapPin, MessageSquareQuote } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const navItems = [
  { label: 'Tour Dates', href: '/admin/shows', icon: Calendar },
  { label: 'Gallery', href: '/admin/gallery', icon: Image },
  { label: 'Past Cities', href: '/admin/cities', icon: MapPin },
  { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
  { label: 'Site Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '20px 16px 18px', borderBottom: '1px solid rgba(192,192,192,0.08)', textAlign: 'center' }}>
        <img
          src="/Oxido.png"
          alt="PERREO ELECTRICO"
          style={{
            height: '34px',
            width: 'auto',
            display: 'block',
            margin: '0 auto 6px',
            filter: 'drop-shadow(0 0 8px rgba(204,0,0,0.4)) drop-shadow(0 1px 6px rgba(0,0,0,0.7))',
          }}
        />
        <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 700, fontSize: '9px', letterSpacing: '5px', textTransform: 'uppercase', color: 'var(--chrome-dim)', opacity: 0.5 }}>
          Admin Panel
        </div>
      </div>

      <nav style={{ flex: 1, padding: '16px 0' }}>
        {navItems.map(({ label, href, icon: Icon }) => (
          <NavLink
            key={href}
            to={href}
            onClick={() => setSidebarOpen(false)}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 20px',
              fontFamily: "'Saira Condensed', sans-serif",
              fontWeight: 900,
              fontSize: '13px',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              textDecoration: 'none',
              color: isActive ? 'var(--chrome)' : 'var(--chrome-dim)',
              borderLeft: isActive ? '3px solid var(--chrome)' : '3px solid transparent',
              background: isActive ? 'rgba(192,192,192,0.05)' : 'transparent',
              transition: 'all 0.2s',
            })}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(192,192,192,0.08)' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            background: 'none',
            border: 'none',
            padding: '10px 0',
            fontFamily: "'Saira Condensed', sans-serif",
            fontWeight: 900,
            fontSize: '13px',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color: 'var(--chrome-dim)',
            cursor: 'pointer',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--red)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--chrome-dim)')}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--dark)' }}>
      {/* Desktop Sidebar */}
      <aside
        className="admin-sidebar-desktop"
        style={{
          width: '220px',
          background: '#0a0000',
          borderRight: '1px solid rgba(192,192,192,0.08)',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className="admin-sidebar-mobile"
        style={{
          position: 'fixed',
          top: 0,
          left: sidebarOpen ? 0 : '-240px',
          width: '220px',
          height: '100vh',
          background: '#0a0000',
          borderRight: '1px solid rgba(192,192,192,0.08)',
          zIndex: 201,
          transition: 'left 0.3s',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 12px 0' }}>
          <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--chrome-dim)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>
        {sidebarContent}
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile header */}
        <header
          className="admin-mobile-header"
          style={{
            padding: '12px 20px',
            background: '#0a0000',
            borderBottom: '1px solid rgba(192,192,192,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--chrome-dim)', cursor: 'pointer' }}>
            <Menu size={20} />
          </button>
          <img src="/Oxido.png" alt="PERREO ELECTRICO" style={{ height: '30px', width: 'auto', filter: 'drop-shadow(0 0 8px rgba(204,0,0,0.4))' }} />
        </header>

        <main style={{
          flex: 1,
          padding: '32px',
          overflowX: 'auto',
          background: 'rgba(10, 0, 0, 0.95)',
          position: 'relative',
          zIndex: 10
        }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (min-width: 769px) {
          .admin-sidebar-mobile { display: none !important; }
          .admin-mobile-header { display: none !important; }
        }
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none !important; }
        }
      `}</style>
    </div>
  );
}
