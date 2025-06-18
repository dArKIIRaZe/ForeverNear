'use client';

import React, { useEffect, useState } from 'react';
import { Container } from '@/components/container';

export default function WatchPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        window.location.href = '/';
        return;
      }

      try {
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = await userRes.json();
        if (!user.id || !user.email) throw new Error('Unable to get user info');

        setUserEmail(user.email);
        setUserId(user.id);

        const queryParams = {
          'filters[user_email][$eq]': user.email,
          'filters[user_id][$eq]': user.id,
          'sort': 'createdAt:desc',
          'populate': '*',
        };

        const queryURL = `${process.env.NEXT_PUBLIC_API_URL}/api/user-videos?${new URLSearchParams(queryParams)}`;

        const videoRes = await fetch(queryURL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!videoRes.ok) throw new Error(`Failed to fetch videos: ${videoRes.statusText}`);

        const data = await videoRes.json();
        setVideos(data.data || []);
      } catch (err: any) {
        console.error('WATCH ERROR:', err);
        setError(err.message || 'Error loading videos');
        setVideos([]);
      } finally {
        setLoading(false);
        setHasCheckedAuth(true);
      }
    };

    fetchVideos();
  }, []);

  const handleDelete = async (video: any) => {
    const confirmDelete = window.confirm(`Delete "${video.title}"? This cannot be undone.`);
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to delete.');
      return;
    }

    try {
      // Step 1: Get upload file ID from S3 (based on stored URL)
      const fileRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/upload/files?filters[url][$eq]=${video.video_name}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const fileData = await fileRes.json();
      const uploadId = fileData?.[0]?.id;

      // Step 2: Delete S3 file
      if (uploadId) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/files/${uploadId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      // Step 3: Delete database entry
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-videos/${video.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      // Step 4: Update UI
      setVideos((prev) => prev.filter((v: any) => v.id !== video.id));
      alert('Video deleted.');
    } catch (err: any) {
      console.error('DELETE ERROR:', err);
      alert('Failed to delete video.');
    }
  };

  if (!hasCheckedAuth) return null;

  return (
    <div className="bg-[#f7f3eb] min-h-screen">
      <Container className="pt-24 pb-12 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1A2A36] mb-2">Your Memories</h1>

        {userId && userEmail && (
          <p className="text-sm text-gray-500 mb-6">
            Logged in as: <strong>{userEmail}</strong> (ID: {userId})
          </p>
        )}
        
        {!loading && videos.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg mb-4">
              You haven&apos;t uploaded any videos yet.
            </p>
            <a
              href="/upload"
              className="inline-block bg-[#1A2A36] text-white px-6 py-2 rounded hover:bg-[#2e3e4c]"
            >
              Upload Your First Video
            </a>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {videos.map((video: any) => (
            <div key={video.id} className="bg-[#e6ddcd] shadow-md rounded-lg p-4 text-[#1A2A36]">
              <h2 className="text-xl font-semibold mb-2">{video.title}</h2>
              <p className="text-sm text-gray-600 mb-2">{video.description}</p>
              <video controls src={video.video_name} className="w-full rounded" />
              <p className="text-xs mt-2 text-gray-400">Uploaded as: {userEmail}</p>
              <button
                onClick={() => handleDelete(video)}
                className="mt-4 text-red-600 hover:underline text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
