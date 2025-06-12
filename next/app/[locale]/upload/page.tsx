'use client';

import { useEffect, useState } from 'react';
import { AmbientColor } from '@/components/decorations/ambient-color';
import { UploadVideoForm } from '@/components/upload-video-form';

export default function UploadPage() {
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {

    const token = localStorage.getItem('token');

    if (!token) {
      window.location.href = '/';
    } else {
      setIsAuthChecked(true);
    }
  }, []);

  if (!isAuthChecked) {
    return null;
  }

  return (
    <div className="relative overflow-hidden">
      <AmbientColor />
      <UploadVideoForm />
    </div>
  );
}
