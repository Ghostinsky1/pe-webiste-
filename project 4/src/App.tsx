import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const EventsListPage = lazy(() => import('./pages/EventsListPage'));
const EventPage = lazy(() => import('./pages/EventPage'));

declare global {
  interface Window {
    ttq?: { page: () => void };
    fbq?: (...args: unknown[]) => void;
  }
}

function PageTracker() {
  const location = useLocation();
  useEffect(() => {
    window.ttq?.page();
    window.fbq?.('track', 'PageView');
  }, [location.pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <PageTracker />
      <Suspense fallback={<div style={{ background: '#000', minHeight: '100vh' }} />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<EventsListPage />} />
          <Route path="/events/:slug" element={<EventPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
