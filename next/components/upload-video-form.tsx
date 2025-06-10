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
  setUploading(true);
  setError('');
  setSuccess('');

  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('User not authenticated');

    // Step 1: Upload video to S3 via /upload
    const uploadData = new FormData();
    uploadData.append('files', file!);

    const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: uploadData,
    });

    const uploaded = await uploadRes.json();
    const videoPath = uploaded[0]?.url || '';

    // Step 2: Save the file path to user_videos
    const saveRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-videos`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          video_name: videoPath,
          title,
          description,
        }
      })
    });

    if (!saveRes.ok) throw new Error('Failed to save video metadata.');

    setSuccess('Upload complete!');
    setTitle('');
    setDescription('');
    setFile(null);
  } catch (err: any) {
    setError(err.message || 'Upload failed.');
  } finally {
    setUploading(false);
  }
};