'use client';

import React, { useEffect, useState } from 'react';

export default function WatchPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not logged in');

        // Step 1: Get current user info
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = await userRes.json();
        if (!user.id) throw new Error('Unable to get user info');

        setUserEmail(user.email);

        // Step 2: Fetch videos where user_id == current user
        const videoRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/user-videos?filters[user_id][$eq]=${user.id}&filters[user_email][$eq]=${encodeURIComponent(user.email)}&sort=createdAt:desc`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await videoRes.json();
        setVideos(data.data || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error loading videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f3eb] p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1A2A36] mb-4">Your Memories</h1>
        {error && <p className="text-red-600">{error}</p>}
        {loading && <p>Loading...</p>}

        {!loading && videos.length === 0 && (
          <p className="text-gray-600">You haven&apos;t uploaded any videos yet.</p>

        )}

        <div className="grid md:grid-cols-2 gap-6">
          {videos.map((video: any) => (
            <div key={video.id} className="bg-white shadow-lg rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-1">{video.attributes.title}</h2>
              <p className="text-sm text-gray-700 mb-2">{video.attributes.description}</p>
              <video
                controls
                src={`${process.env.NEXT_PUBLIC_API_URL}${video.attributes.video_name}`}
                className="w-full rounded"
              />
              <p className="text-xs mt-2 text-gray-400">Uploaded as: {userEmail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
