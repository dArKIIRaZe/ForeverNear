'use client';

import React, { useEffect, useState } from 'react';
import { Container } from '@/components/container';

const countries = [
  'United Kingdom',
  'United States',
  'Canada',
  'Australia',
  'India',
  'Germany',
  'France',
  'South Africa',
  'Other',
];

export default function OnboardingPage() {
  const [firstnames, setFirstnames] = useState('');
  const [surname, setSurname] = useState('');
  const [dob, setDob] = useState('');
  const [origincountry, setOrigincountry] = useState('');
  const [residentcountry, setResidentcountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
      return;
    }

    setHasCheckedAuth(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not logged in.');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstnames,
          surname,
          dob,
          origincountry,
          residentcountry,
        }),
      });

      if (!res.ok) throw new Error('Failed to update profile.');

      setSuccess('Your details have been saved.');
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (!hasCheckedAuth) return null;

  return (
    <div className="bg-[#f7f3eb] min-h-screen">
      <Container className="pt-24 pb-12 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1A2A36] mb-6">Onboarding</h1>

        <p className="block font-medium mb-1 text-[#1A2A36]">IMPORTANT: The below information will be used as part of the security system to allow people to view your content. <br />It's important that you enter the correct infomation</p>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium mb-1 text-[#1A2A36]">First name(s)</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded p-2 text-[#1A2A36]"
              value={firstnames}
              onChange={(e) => setFirstnames(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-[#1A2A36]">Surname</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded p-2 text-[#1A2A36]"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-[#1A2A36]">Date of Birth</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded p-2 text-[#1A2A36]"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-[#1A2A36]">Country of Residence</label>
            <select
              className="w-full border border-gray-300 rounded p-2 text-[#1A2A36]"
              value={residentcountry}
              onChange={(e) => setResidentcountry(e.target.value)}
              required
            >
              <option value="">Select a country</option>
              {countries.map((c) => (
                <option key={c} value={c} className="text-[#1A2A36]">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1 text-[#1A2A36]">Country of Origin</label>
            <select
              className="w-full border border-gray-300 rounded p-2 text-[#1A2A36]"
              value={origincountry}
              onChange={(e) => setOrigincountry(e.target.value)}
              required
            >
              <option value="">Select a country</option>
              {countries.map((c) => (
                <option key={c} value={c} className="text-[#1A2A36]">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-[#1A2A36] text-white px-6 py-2 rounded hover:bg-[#2e3e4c]"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Information'}
          </button>
        </form>
      </Container>
    </div>
  );
}
