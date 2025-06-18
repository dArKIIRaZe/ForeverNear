'use client';

import React, { useState } from 'react';

// Generate a secure random hash for guest links
function generateHash(length = 32): string {
  const array = new Uint8Array(length);
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(array);
  } else {
    // fallback if crypto not available
    for (let i = 0; i < length; i++) array[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('').slice(0, length);
}

// Attempt to login with email and password
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

// Attempt to register a new user and attach a random hash
async function registerUser(email: string, password: string) {
  const username = email.split('@')[0];
  const hash = generateHash(); // ← Unique user hash for guest page security

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/local/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      username,
      hash, // ← This field must exist in Strapi user model
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Registration failed');
  }

  return response.json();
}

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle login or registration when form is submitted
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Step 1: Try to log in
      const loginData = await loginUser(email, password);
      localStorage.setItem('token', loginData.jwt);
      localStorage.setItem('userEmail', email);

      // Step 2: Check onboarding status
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${loginData.jwt}` },
      });
      const user = await res.json();

      // Step 3: Redirect based on onboarding info
      if (
        user.firstnames &&
        user.surname &&
        user.dob &&
        user.origincountry &&
        user.residentcountry
      ) {
        window.location.href = '/watch'; // Onboarding complete
      } else {
        window.location.href = '/onboarding'; // Incomplete, redirect to form
      }
    } catch (loginError) {
      // If login fails, try to register
      try {
        const registerData = await registerUser(email, password);
        localStorage.setItem('token', registerData.jwt);
        localStorage.setItem('userEmail', email);
        window.location.href = '/onboarding'; // New users always start with onboarding
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

        {/* Show error message if login/register fails */}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* Login/Register form */}
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
