import { useState, useEffect } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../shared/Button';

export default function GalleryManager() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    const { data } = await supabase.from('gallery_images').select('*').order('sort_order', { ascending: true });
    setImages(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchImages(); }, []);

  const getPublicUrl = (storagePath) => {
    const { data } = supabase.storage.from('gallery').getPublicUrl(storagePath);
    return data?.publicUrl;
  };

  const compressImage = (file, maxWidth = 1200, quality = 0.75) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => resolve(blob),
          'image/webp',
          quality
        );
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleUpload = async (files) => {
    if (!files || !files.length) return;

    setUploading(true);
    setError('');
    setUploadProgress(`Uploading 0/${files.length} images...`);

    let uploaded = 0;
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError(`Skipped ${file.name}: Not an image file`);
        continue;
      }

      const compressed = await compressImage(file);
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;

      const { error: uploadError } = await supabase.storage.from('gallery').upload(path, compressed, { contentType: 'image/webp', upsert: false });
      if (uploadError) {
        setError(`Upload failed for ${file.name}: ${uploadError.message}`);
        continue;
      }

      await supabase.from('gallery_images').insert({
        storage_path: path,
        alt_text: file.name.replace(/\.[^.]+$/, ''),
        sort_order: images.length + uploaded
      });

      uploaded++;
      setUploadProgress(`Uploading ${uploaded}/${files.length} images...`);
    }

    setUploading(false);
    setUploadProgress('');
    fetchImages();
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files || []);
    handleUpload(files);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files || []);
    handleUpload(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleAltUpdate = async (id, altText) => {
    await supabase.from('gallery_images').update({ alt_text: altText }).eq('id', id);
  };

  const handleSortUpdate = async (id, sortOrder) => {
    await supabase.from('gallery_images').update({ sort_order: parseInt(sortOrder) || 0 }).eq('id', id);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const img = images.find(i => i.id === deleteId);
    if (img) {
      await supabase.storage.from('gallery').remove([img.storage_path]);
      await supabase.from('gallery_images').delete().eq('id', deleteId);
    }
    setDeleteId(null);
    setDeleting(false);
    fetchImages();
  };

  const inputStyle = {
    background: 'rgba(0,0,0,0.6)',
    border: '1px solid rgba(192,192,192,0.15)',
    color: 'var(--white)',
    fontFamily: "'Saira', sans-serif",
    fontWeight: 300,
    fontSize: '13px',
    padding: '7px 10px',
    outline: 'none',
    width: '100%',
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '28px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--chrome)' }}>
            Gallery
          </h1>
          <p style={{ fontFamily: "'Saira', sans-serif", fontWeight: 300, fontSize: '13px', color: 'var(--chrome-dim)', marginTop: '4px' }}>
            {images.length} images uploaded {uploadProgress && `· ${uploadProgress}`}
          </p>
        </div>
        <label style={{ cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.5 : 1, display: 'inline-block' }}>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={handleFileInput}
            disabled={uploading}
            style={{ display: 'none' }}
          />
          <div style={{ pointerEvents: 'none' }}>
            <Button variant="chrome" disabled={uploading}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload Images'}
              </span>
            </Button>
          </div>
        </label>
      </div>

      {error && (
        <div style={{ color: 'var(--red-bright)', fontFamily: "'Saira', sans-serif", fontSize: '13px', marginBottom: '16px', padding: '12px', border: '1px solid rgba(204,0,0,0.3)', background: 'rgba(204,0,0,0.08)' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ color: 'var(--chrome-dim)', fontFamily: "'Saira Condensed', sans-serif", letterSpacing: '4px', textTransform: 'uppercase', fontSize: '12px', padding: '40px 0' }}>
          Loading...
        </div>
      ) : images.length === 0 ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{
            textAlign: 'center',
            padding: '80px 20px',
            border: `2px dashed ${dragOver ? 'var(--chrome)' : 'rgba(192,192,192,0.15)'}`,
            background: dragOver ? 'rgba(192,192,192,0.03)' : 'transparent',
            transition: 'all 0.2s',
            cursor: 'pointer'
          }}
          onClick={() => document.querySelector('input[type="file"]').click()}
        >
          <Upload size={48} style={{ color: 'var(--chrome-dim)', marginBottom: '16px', opacity: 0.4, display: 'inline-block' }} />
          <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '15px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--chrome-dim)', marginBottom: '8px' }}>
            {dragOver ? 'Drop images here' : 'Drag & drop images here'}
          </div>
          <div style={{ fontFamily: "'Saira', sans-serif", fontWeight: 300, fontSize: '12px', color: 'var(--chrome-dim)', opacity: 0.6 }}>
            or click to browse
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px',
            padding: dragOver ? '16px' : '0',
            border: dragOver ? '2px dashed var(--chrome)' : '2px dashed transparent',
            background: dragOver ? 'rgba(192,192,192,0.03)' : 'transparent',
            transition: 'all 0.2s'
          }}
        >
          {images.map(img => (
            <div
              key={img.id}
              style={{
                border: '1px solid rgba(192,192,192,0.1)',
                background: 'rgba(0,0,0,0.4)',
                overflow: 'hidden',
              }}
            >
              <div style={{ aspectRatio: '4/3', overflow: 'hidden', position: 'relative', background: 'rgba(0,0,0,0.6)' }}>
                <img
                  src={getPublicUrl(img.storage_path)}
                  alt={img.alt_text || ''}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={e => { e.target.style.display = 'none'; }}
                />
              </div>
              <div style={{ padding: '12px' }}>
                <label style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--chrome-dim)', display: 'block', marginBottom: '4px' }}>
                  Alt Text
                </label>
                <input
                  type="text"
                  defaultValue={img.alt_text || ''}
                  onBlur={e => handleAltUpdate(img.id, e.target.value)}
                  style={{ ...inputStyle, marginBottom: '8px' }}
                />
                <label style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--chrome-dim)', display: 'block', marginBottom: '4px' }}>
                  Sort Order
                </label>
                <input
                  type="number"
                  defaultValue={img.sort_order || 0}
                  onBlur={e => handleSortUpdate(img.id, e.target.value)}
                  min={0}
                  style={{ ...inputStyle, marginBottom: '10px' }}
                />
                <button
                  onClick={() => setDeleteId(img.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: '1px solid rgba(204,0,0,0.3)', color: 'var(--red)', padding: '7px 12px', cursor: 'pointer', fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', width: '100%', justifyContent: 'center' }}
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteId && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={e => { if (e.target === e.currentTarget) setDeleteId(null); }}
        >
          <div style={{ background: '#0a0000', border: '1px solid rgba(204,0,0,0.3)', padding: '32px', maxWidth: '380px', width: '100%', textAlign: 'center' }}>
            <div style={{ fontFamily: "'Saira Condensed', sans-serif", fontWeight: 900, fontSize: '20px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--white)', marginBottom: '12px' }}>
              Delete Image?
            </div>
            <p style={{ fontFamily: "'Saira', sans-serif", fontWeight: 300, fontSize: '14px', color: 'var(--text)', marginBottom: '28px' }}>
              This will permanently remove the image and its file from storage.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Button variant="chrome-outline" onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button variant="red" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
