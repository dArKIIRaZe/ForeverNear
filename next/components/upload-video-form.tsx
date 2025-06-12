'use client';

import React, { useState } from 'react';
import { Container } from './container';
import { Button } from './elements/button';
import { Logo } from './logo';

export const UploadVideoForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploading(true);

    try {
      const token = localStorage.getItem('token');

        if (!token) {
          window.location.href = '/';
          return;
        }

      if (!token) throw new Error('You must be logged in to upload.');

      if (!file) throw new Error('Please select a video file.');

      // Step 1: Upload file to S3 via Strapi
      const uploadData = new FormData();
      uploadData.append('files', file);

      const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadData,
      });

      const uploaded = await uploadRes.json();
      const videoUrl = uploaded[0]?.url;

      if (!uploadRes.ok || !videoUrl) {
        console.error('Upload failed:', uploaded);
        throw new Error('Video upload failed.');
      }

      // Step 2: Get the current user ID from Strapi
      const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = await userRes.json();
      if (!user.id) throw new Error("Unable to get current user info.");

      // Step 3: Save metadata + user relation to user-videos
      const saveRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-videos`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            video_name: videoUrl,
            title,
            description,
            user_email: user.email,
            user_id: user.id,
          },
        }),
      });

      const result = await saveRes.json();

      if (!saveRes.ok) {
        console.error('Metadata save failed:', result);
        throw new Error('Failed to save video metadata.');
      }

      setSuccess('Upload complete!');
      setTitle('');
      setDescription('');
      setFile(null);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-[#deddce] relative overflow-hidden min-h-screen">
      <Container className="h-screen max-w-lg mx-auto flex flex-col items-center justify-center relative z-10">
        <div className="w-full rounded-2xl bg-[#e6ddcd] shadow-2xl p-8 flex flex-col items-center">
          <Logo />
          <h1 className="text-xl text-[#1A2A36] md:text-4xl font-bold my-4 whitespace-nowrap">
            Upload a Memory
          </h1>

          {error && (
            <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="w-full mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          <form className="w-full" onSubmit={handleUpload}>
            <input
              type="text"
              placeholder="Video title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="h-10 pl-4 w-full mb-4 rounded-md text-sm bg-dark-blue border border-neutral-800 text-[#0a0a0a]"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="pl-4 w-full mb-4 rounded-md text-sm bg-dark-blue border border-neutral-800 text-[#0a0a0a]"
            />
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
              className="w-full mb-4"
            />
            <Button
              type="submit"
              className="w-full py-3 bg-[#1A2A36] text-white shadow-lg hover:bg-[#16202a]"
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
};