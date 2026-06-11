import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Button from '../shared/Button';
import StatusBadge from '../shared/StatusBadge';
import { CreditCard as Edit2, Trash2, Plus, MoveUp, MoveDown } from 'lucide-react';

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    quote: '',
    name: '',
    city: '',
    is_active: true,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from('testimonials')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const maxSortOrder = testimonials.length > 0
          ? Math.max(...testimonials.map(t => t.sort_order))
          : 0;

        const { error } = await supabase
          .from('testimonials')
          .insert({
            ...formData,
            sort_order: maxSortOrder + 1,
          });

        if (error) throw error;
      }

      setFormData({ quote: '', name: '', city: '', is_active: true });
      setEditingId(null);
      fetchTestimonials();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      alert('Failed to save testimonial');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (testimonial) => {
    setEditingId(testimonial.id);
    setFormData({
      quote: testimonial.quote,
      name: testimonial.name,
      city: testimonial.city,
      is_active: testimonial.is_active,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Failed to delete testimonial');
    }
  };

  const handleMove = async (id, direction) => {
    const index = testimonials.findIndex(t => t.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === testimonials.length - 1)) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const swapWith = testimonials[newIndex];

    try {
      await supabase
        .from('testimonials')
        .update({ sort_order: swapWith.sort_order })
        .eq('id', id);

      await supabase
        .from('testimonials')
        .update({ sort_order: testimonials[index].sort_order })
        .eq('id', swapWith.id);

      fetchTestimonials();
    } catch (error) {
      console.error('Error reordering testimonials:', error);
      alert('Failed to reorder testimonials');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ quote: '', name: '', city: '', is_active: true });
  };

  if (loading && testimonials.length === 0) {
    return <div style={{ color: 'var(--text)', padding: '24px' }}>Loading...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '32px', padding: '24px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(180,0,0,0.2)' }}>
        <h3 style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '20px', textTransform: 'uppercase', color: 'var(--white)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={20} />
          {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontFamily: "'Saira', sans-serif", fontSize: '13px', color: 'var(--text)', marginBottom: '6px' }}>
              Quote *
            </label>
            <textarea
              value={formData.quote}
              onChange={e => setFormData({ ...formData, quote: e.target.value })}
              required
              rows={4}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(180,0,0,0.25)',
                color: 'var(--white)',
                fontFamily: "'Saira', sans-serif",
                fontSize: '14px',
                padding: '10px',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: "'Saira', sans-serif", fontSize: '13px', color: 'var(--text)', marginBottom: '6px' }}>
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(180,0,0,0.25)',
                  color: 'var(--white)',
                  fontFamily: "'Saira', sans-serif",
                  fontSize: '14px',
                  padding: '10px',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: "'Saira', sans-serif", fontSize: '13px', color: 'var(--text)', marginBottom: '6px' }}>
                City *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                required
                placeholder="e.g., Denver, CO"
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(180,0,0,0.25)',
                  color: 'var(--white)',
                  fontFamily: "'Saira', sans-serif",
                  fontSize: '14px',
                  padding: '10px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ fontFamily: "'Saira', sans-serif", fontSize: '14px', color: 'var(--text)' }}>
                Active (visible on website)
              </span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Button type="submit" variant="red" disabled={loading}>
              {loading ? 'Saving...' : editingId ? 'Update' : 'Add Testimonial'}
            </Button>
            {editingId && (
              <Button type="button" variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '18px', textTransform: 'uppercase', color: 'var(--white)' }}>
          All Testimonials ({testimonials.length})
        </h3>

        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(180,0,0,0.2)',
              padding: '20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h4 style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '16px', textTransform: 'uppercase', color: 'var(--white)' }}>
                    {testimonial.name}
                  </h4>
                  <StatusBadge status={testimonial.is_active ? 'active' : 'inactive'} />
                </div>
                <div style={{ fontFamily: "'Saira', sans-serif", fontSize: '13px', color: 'var(--chrome-dim)', marginBottom: '12px' }}>
                  {testimonial.city}
                </div>
                <p style={{ fontFamily: "'Saira', sans-serif", fontSize: '14px', color: 'var(--text)', lineHeight: 1.6, fontStyle: 'italic' }}>
                  "{testimonial.quote}"
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                <button
                  onClick={() => handleMove(testimonial.id, 'up')}
                  disabled={index === 0}
                  style={{
                    background: 'rgba(180,0,0,0.15)',
                    border: '1px solid rgba(180,0,0,0.3)',
                    color: 'var(--white)',
                    padding: '8px',
                    cursor: index === 0 ? 'not-allowed' : 'pointer',
                    opacity: index === 0 ? 0.3 : 1,
                  }}
                  title="Move up"
                >
                  <MoveUp size={16} />
                </button>
                <button
                  onClick={() => handleMove(testimonial.id, 'down')}
                  disabled={index === testimonials.length - 1}
                  style={{
                    background: 'rgba(180,0,0,0.15)',
                    border: '1px solid rgba(180,0,0,0.3)',
                    color: 'var(--white)',
                    padding: '8px',
                    cursor: index === testimonials.length - 1 ? 'not-allowed' : 'pointer',
                    opacity: index === testimonials.length - 1 ? 0.3 : 1,
                  }}
                  title="Move down"
                >
                  <MoveDown size={16} />
                </button>
                <button
                  onClick={() => handleEdit(testimonial)}
                  style={{
                    background: 'rgba(180,0,0,0.15)',
                    border: '1px solid rgba(180,0,0,0.3)',
                    color: 'var(--white)',
                    padding: '8px',
                    cursor: 'pointer',
                  }}
                  title="Edit"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  style={{
                    background: 'rgba(180,0,0,0.15)',
                    border: '1px solid rgba(180,0,0,0.3)',
                    color: 'var(--red-bright)',
                    padding: '8px',
                    cursor: 'pointer',
                  }}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {testimonials.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--chrome-dim)', fontFamily: "'Saira', sans-serif" }}>
            No testimonials yet. Add one above to get started.
          </div>
        )}
      </div>
    </div>
  );
}
