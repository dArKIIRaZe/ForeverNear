'use client';

import React, { useState } from 'react';

function generateHash(length = 32): string {
  const array = new Uint8Array(length);
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < length; i++) array[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('').slice(0, length);
}

async function loginUser(email: string, password: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/local`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: email, password }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Login failed');
  }

  return response.json();
}

async function registerUser(email: string, password: string) {
  const username = email.split('@')[0];
  const hash = generateHash();

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/local/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      username,
      hash,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Registration failed');
  }

  return response.json();
}

// 👇 Named export so it works with: import { Register } ...
export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const loginData = await loginUser(email, password);
      localStorage.setItem('token', loginData.jwt);
      localStorage.setItem('userEmail', email);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${loginData.jwt}` },
      });
      const user = await res.json();

      if (
        user.firstnames &&
        user.surname &&
        user.dob &&
        user.origincountry &&
        user.residentcountry
      ) {
        window.location.href = '/watch';
      } else {
        window.location.href = '/onboarding';
      }
    } catch (loginError) {
      try {
        const registerData = await registerUser(email, password);
        localStorage.setItem('token', registerData.jwt);
        localStorage.setItem('userEmail', email);
        window.location.href = '/onboarding';
      } catch (registerError) {
        setError(
          registerError instanceof Error ? registerError.message : 'Registration failed'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f3eb] px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-[#1A2A36]">Login or Sign Up</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-[#1A2A36]">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded p-2 text-[#1A2A36]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-[#1A2A36]">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded p-2 text-[#1A2A36]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1A2A36] text-white py-2 rounded hover:bg-[#2e3e4c]"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
