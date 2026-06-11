import { useEffect, useState } from 'react';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AdminLayout from '../components/admin/AdminLayout';
import ShowsTable from '../components/admin/ShowsTable';
import GalleryManager from '../components/admin/GalleryManager';
import CitiesManager from '../components/admin/CitiesManager';
import TestimonialsManager from '../components/admin/TestimonialsManager';
import SiteSettings from '../components/admin/SiteSettings';
import MetalBackground from '../components/shared/MetalBackground';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    supabase.auth.refreshSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/admin/login');
      } else {
        setAuthed(true);
      }
      setChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      (() => {
        if (!session) navigate('/admin/login');
      })();
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dark)' }}>
        <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '13px', letterSpacing: '6px', textTransform: 'uppercase', color: 'var(--chrome-dim)' }}>
          Authenticating...
        </div>
      </div>
    );
  }

  if (!authed) return null;

  return (
    <>
      <MetalBackground />
      <AdminLayout>
        <Routes>
          <Route index element={<Navigate to="shows" replace />} />
          <Route path="shows" element={<ShowsTable />} />
          <Route path="gallery" element={<GalleryManager />} />
          <Route path="cities" element={<CitiesManager />} />
          <Route path="testimonials" element={<TestimonialsManager />} />
          <Route path="settings" element={<SiteSettings />} />
        </Routes>
      </AdminLayout>
    </>
  );
}
