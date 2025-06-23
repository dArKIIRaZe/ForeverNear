'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container } from '@/components/container';

export default function GuestPage() {
  const searchParams = useSearchParams();
  const [dob, setDob] = useState('');
  const [surname, setSurname] = useState('');
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const userId = searchParams.get('userid');
  const hash = searchParams.get('hash');

  useEffect(() => {
    if (!userId || !hash) {
      setError('Missing user ID or hash from link.');
    }
  }, [userId, hash]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSubmitted(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`);
      const user = await res.json();

    //  console.log('Fetched user:', user);

      if (
        !user ||
        user.hash !== hash ||
        user.surname?.toLowerCase() !== surname.toLowerCase() ||
        user.dob !== dob
      ) {
        throw new Error('Verification failed. Please check your answers.');
      }

      // ✅ Fetch videos for this user
      const queryParams = new URLSearchParams({
        'filters[user_id][$eq]': userId || '',
        'sort': 'createdAt:desc',
        'populate': '*',
      });

      const videoRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user-videos?${queryParams}`
      );
      const videoData = await videoRes.json();

      setVideos(videoData.data || []);
      setVerified(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to verify or load videos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f7f3eb] min-h-screen">
      <Container className="pt-24 pb-12 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1A2A36] mb-4">ForeverNear Guest Access</h1>

        {!verified && (
          <>
            <p className="mb-6 text-gray-700">
              Please confirm your loved one&apos;s identity to continue.
            </p>

            <form onSubmit={handleVerify} className="space-y-4 mb-6">
              <div>
                <label className="block mb-1 text-[#1A2A36] font-medium">Their Surname</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded p-2 text-[#1A2A36]"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-[#1A2A36] font-medium">Their Date of Birth</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded p-2 text-[#1A2A36]"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#1A2A36] text-white px-6 py-2 rounded hover:bg-[#2e3e4c]"
              >
                {loading ? 'Verifying...' : 'Continue'}
              </button>
            </form>

           {<!-- <div className="text-center">
              <button className="text-blue-600 underline text-sm">
                I don&apos;t know the answers (Lost &amp; Found)
              </button>
            </div>
            --!}

            {submitted && error && (
              <p className="text-red-600 mt-4 text-sm">{error}</p>
            )}
          </>
        )}

        {verified && videos.length === 0 && (
          <p className="text-center text-gray-600">No videos found for this user.</p>
        )}

        {verified && videos.length > 0 && (
          <div className="mt-8 space-y-6">
            {videos.map((video: any) => (
              <div key={video.id} className="bg-[#e6ddcd] rounded shadow p-4">
                <h2 className="text-xl font-semibold mb-2 text-[#1A2A36]">{video.title}</h2>
                <p className="text-sm text-gray-600 mb-2">{video.description}</p>
                <video controls src={video.video_name} className="w-full rounded" />
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
