import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

function getPublicUrl(storagePath) {
  const { data } = supabase.storage.from('gallery').getPublicUrl(storagePath);
  return data?.publicUrl;
}

const placeholderImages = [
  { id: '1', alt: 'Crowd energy', color: 'rgba(180,0,0,0.3)' },
  { id: '2', alt: 'DJ on stage', color: 'rgba(100,0,0,0.4)' },
  { id: '3', alt: 'Bass drop moment', color: 'rgba(140,0,0,0.25)' },
  { id: '4', alt: 'Night crowd', color: 'rgba(80,0,0,0.35)' },
  { id: '5', alt: 'Lights and people', color: 'rgba(160,0,0,0.2)' },
  { id: '6', alt: 'Full venue', color: 'rgba(120,0,0,0.3)' },
  { id: '7', alt: 'Stage lights', color: 'rgba(90,0,0,0.4)' },
  { id: '8', alt: 'Crowd movement', color: 'rgba(200,0,0,0.15)' },
];

const chainLinkSVG = `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'><path d='M0,24 L12,0 L24,24 L12,48 Z' stroke='%23ffffff' stroke-width='1' fill='none' opacity='0.4'/><path d='M24,24 L36,0 L48,24 L36,48 Z' stroke='%23ffffff' stroke-width='1' fill='none' opacity='0.4'/></svg>")`;

function GalleryCell({ image, index }) {
  const [hovered, setHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cellRef = useRef(null);
  const url = image.storage_path ? getPublicUrl(image.storage_path) : null;

  useEffect(() => {
    const el = cellRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={cellRef}
      whileHover={{ scale: 1.03 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(180,0,0,0.15)',
        cursor: 'crosshair',
        aspectRatio: index % 5 === 0 ? '16/9' : index % 3 === 0 ? '1/1' : '4/3',
      }}
    >
      {url && isVisible ? (
        <img
          src={url}
          alt={image.alt_text || ''}
          loading="lazy"
          decoding="async"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            minHeight: '180px',
            background: image.color || 'rgba(100,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '11px', letterSpacing: '4px', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>
            {image.alt_text || image.alt || 'Gallery'}
          </span>
        </div>
      )}

      {/* Hover overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(180,0,0,0.45)',
          backgroundImage: chainLinkSVG,
          backgroundSize: '48px 48px',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s',
          pointerEvents: 'none',
        }}
      />
    </motion.div>
  );
}

export default function Gallery({ images }) {
  const displayImages = images.length > 0 ? images : placeholderImages;

  return (
    <section
      id="gallery"
      style={{
        position: 'relative',
        zIndex: 1,
        background: 'rgba(6,0,0,0.85)',
        padding: '56px 24px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: '32px' }}
        >
          <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '11px', letterSpacing: '6px', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '12px' }}>
            // The Experience
          </div>
          <h2 style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(40px, 6vw, 72px)', textTransform: 'uppercase', color: 'var(--white)', lineHeight: 1 }}>
            Photo <span style={{ color: 'var(--red-bright)' }}>Gallery</span>
          </h2>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '8px',
          }}
        >
          {displayImages.map((image, i) => (
            <GalleryCell key={image.id} image={image} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
