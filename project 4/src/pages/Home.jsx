import { useEffect, useState, lazy, Suspense } from 'react';
import { supabase } from '../lib/supabase';
import MetalBackground from '../components/shared/MetalBackground';
import Nav from '../components/public/Nav';
import Hero from '../components/public/Hero';
import CityTicker from '../components/public/CityTicker';

const EmailSignup = lazy(() => import('../components/public/EmailSignup'));
const About = lazy(() => import('../components/public/About'));
const TourDates = lazy(() => import('../components/public/TourDates'));
const Sound = lazy(() => import('../components/public/Sound'));
const Gallery = lazy(() => import('../components/public/Gallery'));
const Vibes = lazy(() => import('../components/public/Vibes'));
const Testimonials = lazy(() => import('../components/public/Testimonials'));
const PastEvents = lazy(() => import('../components/public/PastEvents'));
const CityRequest = lazy(() => import('../components/public/CityRequest'));
const FinalCTA = lazy(() => import('../components/public/FinalCTA'));
const Footer = lazy(() => import('../components/public/Footer'));

const LazySection = ({ children }) => (
  <Suspense fallback={<div style={{ minHeight: '200px' }} />}>
    {children}
  </Suspense>
);

export default function Home() {
  const [shows, setShows] = useState([]);
  const [images, setImages] = useState([]);
  const [cities, setCities] = useState([]);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    Promise.all([
      supabase.from('shows').select('*').order('sort_order', { ascending: true }),
      supabase.from('gallery_images').select('*').order('sort_order', { ascending: true }),
      supabase.from('past_cities').select('*').order('sort_order', { ascending: true }),
      supabase.from('site_settings').select('*'),
    ]).then(([showsRes, imagesRes, citiesRes, settingsRes]) => {
      setShows(showsRes.data || []);
      setImages(imagesRes.data || []);
      setCities(citiesRes.data || []);
      if (settingsRes.data) {
        const map = {};
        settingsRes.data.forEach(row => { map[row.key] = row.value; });
        setSettings(map);
      }
    });
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <MetalBackground />
      <Nav />

      <div style={{ paddingTop: '64px' }}>
        <Hero settings={settings} />

        <hr className="section-divider" />
        <CityTicker cities={cities} />

        <hr className="section-divider" />
        <LazySection><About settings={settings} /></LazySection>

        <hr className="section-divider" />
        <LazySection><Vibes /></LazySection>

        <hr className="section-divider" />
        <LazySection><TourDates shows={shows} /></LazySection>

        <hr className="section-divider" />
        <LazySection><EmailSignup /></LazySection>

        <hr className="section-divider" />
        <LazySection><Sound /></LazySection>

        <hr className="section-divider" />
        <LazySection><Gallery images={images} /></LazySection>

        <hr className="section-divider" />
        <LazySection><Testimonials /></LazySection>

        <hr className="section-divider" />
        <LazySection><PastEvents cities={cities} /></LazySection>

        <hr className="section-divider" />
        <LazySection><CityRequest /></LazySection>

        <hr className="section-divider" />
        <LazySection><FinalCTA /></LazySection>

        <LazySection><Footer /></LazySection>
      </div>
    </div>
  );
}
