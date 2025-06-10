const handleUpload = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setSuccess('');
  setUploading(true);

  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('You must be logged in to upload.');

    if (!file) throw new Error('Please select a video file.');

    // Step 1: Upload file to S3 via Strapi
    const uploadData = new FormData();
    uploadData.append('files', file);

    const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: uploadData,
    });

    const uploaded = await uploadRes.json();
    const videoUrl = uploaded[0]?.url;

    if (!uploadRes.ok || !videoUrl) {
      console.error('Upload failed:', uploaded);
      throw new Error('Video upload failed.');
    }

    // Step 2: Get current user email
    const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user = await userRes.json();
    if (!user.email) throw new Error("Unable to get current user email.");

    // Step 3: Save metadata + email to user-videos
    const saveRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-videos`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          video_name: videoUrl,
          title,
          description,
          user_email: user.email, // ✅ Save as plain text
        },
      }),
    });

    const result = await saveRes.json();

    if (!saveRes.ok) {
      console.error('Metadata save failed:', result);
      throw new Error('Failed to save video metadata.');
    }

    setSuccess('Upload complete!');
    setTitle('');
    setDescription('');
    setFile(null);
  } catch (err: any) {
    setError(err.message || 'Something went wrong.');
  } finally {
    setUploading(false);
  }
};
