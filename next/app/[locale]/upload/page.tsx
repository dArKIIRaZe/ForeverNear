'use client';

import { useEffect, useState } from 'react';
import { AmbientColor } from '@/components/decorations/ambient-color';
import { UploadVideoForm } from '@/components/upload-video-form';

export default function UploadPage() {
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    console.log('[UploadPage] useEffect triggered');

    const token = localStorage.getItem('token');
    console.log('[UploadPage] token from localStorage:', token);

    if (!token) {
      console.log('[UploadPage] No token — redirecting to home');
      window.location.href = '/';
    } else {
      console.log('[UploadPage] Token found — rendering form');
      setIsAuthChecked(true);
    }
  }, []);

  if (!isAuthChecked) {
    console.log('[UploadPage] Waiting on auth check, not rendering yet...');
    return null;
  }

  console.log('[UploadPage] Auth checked, rendering UploadVideoForm');
  return (
    <div className="relative overflow-hidden">
      <AmbientColor />
      <UploadVideoForm />
    </div>
  );
}
