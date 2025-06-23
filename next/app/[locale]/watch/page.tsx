'use client';

import React, { useEffect, useState } from 'react';

export default function WatchPage() {
  const [videos, setVideos] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    setUserEmail(email || '');

    if (!token) {
      window.location.href = '/';
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((user) => {
        setUserId(user.id);

        return fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user-videos?filters[user_id][$eq]=${user.id}&filters[user_email][$eq]=${user.email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      })
      .then((res) => res.json())
      .then((data) => {
        setVideos(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (video) => {
    const confirmed = window.confirm('Are you sure you want to delete this video?');
    if (!confirmed) return;

    const token = localStorage.getItem('token');
    if (!token) return alert('Not authenticated');

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-videos/${video.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      setVideos((prev) => prev.filter((v) => v.id !== video.id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete video.');
    }
  };

  const handleSave = async (videoId) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Not authenticated');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-videos/${videoId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            title: editTitle,
            description: editDescription,
          },
        }),
      });

      if (!res.ok) throw new Error('Update failed');

      setVideos((prev) =>
        prev.map((v) =>
          v.id === videoId ? { ...v, title: editTitle, description: editDescription } : v
        )
      );
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert('Failed to save changes.');
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f3eb] py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1A2A36] mb-6">Your Memories</h1>
        <p className="text-sm text-gray-500 mb-8">
          Logged in as: {userEmail} (ID: {userId})
        </p>
        {loading ? (
          <p>Loading...</p>
        ) : videos.length === 0 ? (
          <div>
            <p className="text-gray-600">You haven't uploaded any videos yet.</p>
            <a href="/upload" className="text-blue-600 underline text-sm mt-2 inline-block">
              Upload a memory
            </a>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {videos.map((video) => {
              const isEditing = video.id === editingId;
              return (
                <div
                  key={video.id}
                  className="bg-[#e6ddcd] shadow-md rounded-lg p-4 text-[#1A2A36]"
                >
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full p-2 border rounded mb-2"
                        placeholder="Title"
                      />
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full p-2 border rounded mb-2"
                        placeholder="Description"
                      />
                      <div className="flex gap-2">
                        <button
                          className="bg-green-600 text-white px-4 py-1 rounded"
                          onClick={() => handleSave(video.id)}
                        >
                          Save
                        </button>
                        <button
                          className="bg-gray-400 text-white px-4 py-1 rounded"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-xl font-semibold mb-2">{video.title}</h2>
                      <p className="text-sm text-gray-600 mb-2">{video.description}</p>
                      <video controls src={video.video_name} className="w-full rounded" />
                      <p className="text-xs mt-2 text-gray-400">Uploaded as: {userEmail}</p>
                      <div className="flex gap-4 mt-4">
                        <button
                          onClick={() => {
                            setEditingId(video.id);
                            setEditTitle(video.title);
                            setEditDescription(video.description);
                          }}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(video)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
