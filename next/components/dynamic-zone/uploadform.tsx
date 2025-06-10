'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token || !file || !title) {
      alert('Missing required fields or login.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          data: {
            title,
            description,
            video_name: file.name,
          }
        })
      });

      if (!res.ok) throw new Error('Upload failed');

      alert('Upload successful!');
      router.push('/watch');
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '1rem' }}>
      <input
        type="text"
        placeholder="Video title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      /><br /><br />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
      /><br /><br />

      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        required
      /><br /><br />

      <button type="submit" disabled={loading}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
}
