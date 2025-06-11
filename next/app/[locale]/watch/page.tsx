'use client';Add commentMore actions

import React, { useEffect, useState } from 'react';
import { Container } from '@/components/container';

export default function WatchPage() {
  const [videos, setVideos] = useState([]);
@@ -10,23 +11,22 @@ export default function WatchPage() {

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
        if (!user.id || !user.email) throw new Error('Unable to get user info');

        setUserEmail(user.email);

        // Step 2: Fetch videos where user_id == current user
        const videoRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/user-videos?filters[user_id][$eq]=${user.id}&filters[user_email][$eq]=${encodeURIComponent(user.email)}&sort=createdAt:desc`,
          `${process.env.NEXT_PUBLIC_API_URL}/api/user-videos?filters[user_id][$eq]=${user.id}&sort=createdAt:desc`,
          //`${process.env.NEXT_PUBLIC_API_URL}/api/user-videos?filters[user_id][$eq]=${user.id}&filters[user_email][$eq]=${encodeURIComponent(user.email)}&sort=createdAt:desc`,

          {
            headers: { Authorization: `Bearer ${token}` },
          }
@@ -45,22 +45,24 @@ export default function WatchPage() {
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f3eb] p-6">
      <div className="max-w-4xl mx-auto">
    <div className="bg-[#f7f3eb] min-h-screen">
      <Container className="pt-24 pb-12 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1A2A36] mb-4">Your Memories</h1>
        {error && <p className="text-red-600">{error}</p>}
        {loading && <p>Loading...</p>}

        {!loading && videos.length === 0 && (
          <p className="text-gray-600">You haven&apos;t uploaded any videos yet.</p>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {loading && <p className="text-gray-500 mb-4">Loading...</p>}

        {!loading && videos.length === 0 && (
          <p className="text-gray-600 text-center py-10 text-lg">
            You haven&apos;t uploaded any videos yet.
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {videos.map((video: any) => (
            <div key={video.id} className="bg-white shadow-lg rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-1">{video.attributes.title}</h2>
              <p className="text-sm text-gray-700 mb-2">{video.attributes.description}</p>
            <div key={video.id} className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">{video.attributes.title}</h2>
              <p className="text-sm text-gray-600 mb-2">{video.attributes.description}</p>
              <video
                controls
                src={`${process.env.NEXT_PUBLIC_API_URL}${video.attributes.video_name}`}
@@ -70,7 +72,7 @@ export default function WatchPage() {
            </div>
          ))}
        </div>
      </div>
      </Container>
    </div>
  );
}