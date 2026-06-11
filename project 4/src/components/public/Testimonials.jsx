import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  if (testimonials.length === 0) {
    return null;
  }
  return (
    <section
      style={{
        position: 'relative',
        zIndex: 1,
        background: 'rgba(13,0,0,0.88)',
        padding: '56px 24px',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '36px' }}
        >
          <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '11px', letterSpacing: '6px', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '12px' }}>
            // Heard It From The Floor
          </div>
          <h2 style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: 'clamp(36px, 5vw, 64px)', textTransform: 'uppercase', color: 'var(--white)', lineHeight: 1 }}>
            From The <span style={{ color: 'var(--red-bright)' }}>Crowd</span>
          </h2>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              style={{
                border: '1px solid rgba(180,0,0,0.2)',
                padding: '32px',
                background: 'rgba(0,0,0,0.4)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-1px',
                  left: '24px',
                  width: '48px',
                  height: '2px',
                  background: 'var(--red)',
                }}
              />
              <div
                style={{
                  fontFamily: "'Saira Condensed', sans-serif",
                  fontWeight: 900,
                  fontSize: '48px',
                  lineHeight: 1,
                  color: 'var(--red)',
                  opacity: 0.3,
                  marginBottom: '8px',
                }}
              >
                "
              </div>
              <p style={{ fontFamily: "'Saira', sans-serif", fontWeight: 300, fontSize: '15px', lineHeight: 1.7, color: 'var(--text)', marginBottom: '24px' }}>
                {t.quote}
              </p>
              <div>
                <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '14px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--white)' }}>
                  {t.name}
                </div>
                <div style={{ fontFamily: "'Saira', sans-serif", fontSize: '12px', color: 'var(--chrome-dim)', marginTop: '2px' }}>
                  {t.city}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
