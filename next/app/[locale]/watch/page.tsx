'use client';

import React, { useEffect, useState } from 'react';
import { Container } from '@/components/container';

export default function WatchPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not logged in');

        const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = await userRes.json();
        if (!user.id || !user.email) throw new Error('Unable to get user info');

        setUserEmail(user.email);
        setUserId(user.id);

        // More explicit query parameters
        const queryParams = {
          'filters[user_email][$eq]': user.email,
          'filters[user_id][$eq]': user.id,
          'sort': 'createdAt:desc',
          'populate': '*'
        };
        
        const queryURL = `${process.env.NEXT_PUBLIC_API_URL}/api/user-videos?${new URLSearchParams(queryParams)}`;


        const videoRes = await fetch(queryURL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (videoRes.status === 204) {
          setVideos([]);
        } else if (!videoRes.ok) {
          throw new Error(`Failed to fetch videos: ${videoRes.status} ${videoRes.statusText}`);
        } else {
          const data = await videoRes.json();
          setVideos(data.data || []);
        }
      } catch (err: any) {
        console.error('WATCH ERROR:', err);
        setError(err.message || 'Error loading videos');
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="bg-[#f7f3eb] min-h-screen">
      <Container className="pt-24 pb-12 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1A2A36] mb-2">Your Memories</h1>

        {userId && userEmail && (
          <p className="text-sm text-gray-500 mb-6">
            Logged in as: <strong>{userEmail}</strong> (ID: {userId})
          </p>
        )}

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {loading && <p className="text-gray-500 mb-4">Loading...</p>}

        {!loading && videos.length === 0 && (
          <p className="text-gray-600 text-center py-10 text-lg">
            You haven&apos;t uploaded any videos yet.
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {videos.map((video: any) => (
            <div key={video.id} className="bg-[#e6ddcd] shadow-md rounded-lg p-4 text-[#1A2A36]">
              <h2 className="text-xl font-semibold mb-2">{video.title}</h2>
              <p className="text-sm text-gray-600 mb-2">{video.description}</p>
              <video
                controls
                src={video.video_name}
                className="w-full rounded"
              />
              <p className="text-xs mt-2 text-gray-400">Uploaded as: {userEmail}</p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
