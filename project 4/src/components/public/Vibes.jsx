import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

const videos = [
  { id: 'P6zy9rHWijE', title: 'DESENFOCADO Live' },
  { id: 'P6zy9rHWijE', title: 'DESENFOCADO Energy' },
  { id: 'lNsUsp_uvLo', title: 'DESENFOCADO Crowd' },
];

function getEmbedUrl(videoId) {
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`;
}

function getThumbnailUrl(videoId) {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export default function Vibes() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const goTo = (index) => {
    setActiveIndex(index);
    setPlaying(false);
  };

  const prev = () => goTo((activeIndex - 1 + videos.length) % videos.length);
  const next = () => goTo((activeIndex + 1) % videos.length);

  return (
    <section
      id="vibes"
      style={{
        position: 'relative',
        zIndex: 1,
        background: 'rgba(6,0,0,0.85)',
        padding: '56px 24px',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(180,0,0,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }} ref={containerRef}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: '32px' }}
        >
          <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '11px', letterSpacing: '6px', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '12px' }}>
            // Live Footage
          </div>
          <h2 style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(40px, 6vw, 72px)', textTransform: 'uppercase', color: 'var(--white)', lineHeight: 1 }}>
            The <span style={{ color: 'var(--red-bright)' }}>Vibes</span>
          </h2>
        </motion.div>

        {/* Video player area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '480px',
            margin: '0 auto',
            aspectRatio: '9/16',
            background: 'rgba(0,0,0,0.9)',
            border: '1px solid rgba(192,192,192,0.12)',
            boxShadow: '0 0 60px rgba(0,0,0,0.8), 0 0 30px rgba(180,0,0,0.1)',
            overflow: 'hidden',
          }}
        >
          {/* Chrome corner accents */}
          <div style={{ position: 'absolute', top: -1, left: -1, width: 32, height: 2, background: 'linear-gradient(90deg, rgba(192,192,192,0.7), transparent)', zIndex: 3 }} />
          <div style={{ position: 'absolute', top: -1, left: -1, width: 2, height: 32, background: 'linear-gradient(180deg, rgba(192,192,192,0.7), transparent)', zIndex: 3 }} />
          <div style={{ position: 'absolute', top: -1, right: -1, width: 32, height: 2, background: 'linear-gradient(270deg, rgba(192,192,192,0.7), transparent)', zIndex: 3 }} />
          <div style={{ position: 'absolute', top: -1, right: -1, width: 2, height: 32, background: 'linear-gradient(180deg, rgba(192,192,192,0.7), transparent)', zIndex: 3 }} />
          <div style={{ position: 'absolute', bottom: -1, left: -1, width: 32, height: 2, background: 'linear-gradient(90deg, rgba(180,0,0,0.7), transparent)', zIndex: 3 }} />
          <div style={{ position: 'absolute', bottom: -1, right: -1, width: 32, height: 2, background: 'linear-gradient(270deg, rgba(180,0,0,0.7), transparent)', zIndex: 3 }} />

          {playing ? (
            <iframe
              src={getEmbedUrl(videos[activeIndex].id)}
              title={videos[activeIndex].title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          ) : (
            <div
              onClick={() => setPlaying(true)}
              style={{ position: 'relative', width: '100%', height: '100%', cursor: 'pointer' }}
            >
              <img
                src={getThumbnailUrl(videos[activeIndex].id)}
                alt={videos[activeIndex].title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {/* Dark overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
              {/* Play button */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'rgba(180,0,0,0.9)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 30px rgba(180,0,0,0.5)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                <Play size={28} color="#fff" fill="#fff" style={{ marginLeft: '4px' }} />
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginTop: '32px' }}>
          <button
            onClick={prev}
            aria-label="Previous video"
            style={{
              width: '44px',
              height: '44px',
              background: 'rgba(0,0,0,0.6)',
              border: '1px solid rgba(192,192,192,0.2)',
              color: 'var(--chrome)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(180,0,0,0.6)'; e.currentTarget.style.color = 'var(--red-bright)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(192,192,192,0.2)'; e.currentTarget.style.color = 'var(--chrome)'; }}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Dot indicators */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {videos.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to video ${i + 1}`}
                style={{
                  width: i === activeIndex ? '24px' : '8px',
                  height: '8px',
                  background: i === activeIndex ? 'var(--red-bright)' : 'rgba(192,192,192,0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: i === activeIndex ? '0 0 8px rgba(180,0,0,0.6)' : 'none',
                }}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Next video"
            style={{
              width: '44px',
              height: '44px',
              background: 'rgba(0,0,0,0.6)',
              border: '1px solid rgba(192,192,192,0.2)',
              color: 'var(--chrome)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(180,0,0,0.6)'; e.currentTarget.style.color = 'var(--red-bright)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(192,192,192,0.2)'; e.currentTarget.style.color = 'var(--chrome)'; }}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Video counter */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <span style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 700, fontSize: '12px', letterSpacing: '4px', color: 'var(--chrome-dim)', textTransform: 'uppercase' }}>
            {String(activeIndex + 1).padStart(2, '0')} / {String(videos.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    </section>
  );
}
