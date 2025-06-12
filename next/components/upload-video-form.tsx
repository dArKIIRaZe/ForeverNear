'use client';

import React, { useEffect, useState } from 'react';

export const UploadVideoForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
    } else {
      setIsAuthChecked(true);
    }
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to upload.');
      return;
    }

    if (!videoFile) {
      setMessage('Please select a video file.');
      return;
    }

    setUploading(true);

    try {
      const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await userRes.json();

      const formData = new FormData();
      formData.append('files', videoFile);
      formData.append('ref', 'user-videos');
      formData.append('field', 'video_name');

      const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const uploaded = await uploadRes.json();
      const videoPath = uploaded[0]?.url || '';

      const entryRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            title,
            description,
            video_name: videoPath,
            user_email: user.email,
            user_id: user.id,
          },
        }),
      });

      if (!entryRes.ok) throw new Error('Failed to save video entry.');

      setMessage('Video uploaded successfully!');
      setTitle('');
      setDescription('');
      setVideoFile(null);
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || 'An error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

  if (!isAuthChecked) return null;

  return (
    <form onSubmit={handleUpload} className="space-y-6">
      <div>
        <label className="block font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>
      <div>
        <label className="block font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>
      <div>
        <label className="block font-medium">Video File</label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
          className="w-full"
          required
        />
      </div>
      <button
        type="submit"
        disabled={uploading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {message && <p className="text-sm mt-2">{message}</p>}
    </form>
  );
};
