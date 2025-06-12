'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/container';

export default function WatchPage() {
  const router = useRouter();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setAuthChecked(true); // ✅ still mark as checked so fallback renders
        router.replace('/login');
        return;
      }

      try {
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = await userRes.json();
        if (!user.id || !user.email) throw new Error('Failed to fetch user info');

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

        if (!videoRes.ok) {
          throw new Error(`Failed to fetch videos: ${videoRes.statusText}`);
        }

        const data = await videoRes.json();
        setVideos(data.data || []);
      } catch (err: any) {
        console.error('WATCH ERROR:', err);
        setError(err.message || 'Error loading videos');
        setVideos([]);
      } finally {
        setLoading(false);
        setAuthChecked(true); // ✅ done checking
      }
    };

    fetchVideos();
  }, [router]);

  // 👀 Show a spinner while checking auth
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f3eb]">
        <p className="text-gray-600 text-lg">Checking authentication...</p>
      </div>
    );
  }

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
            <div key={video.id} className="bg-white shadow-md rounded-lg p-4 text-[#1A2A36]">
              <h2 className="text-xl font-semibold mb-2">{video.attributes.title}</h2>
              <p className="text-sm text-gray-600 mb-2">{video.attributes.description}</p>
              <video
                controls
                src={`${process.env.NEXT_PUBLIC_API_URL}${video.attributes.video_name}`}
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
