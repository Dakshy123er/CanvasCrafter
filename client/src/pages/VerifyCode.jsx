import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VerifyCode = () => {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/v1/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      alert('✅ Email verified! Please log in to continue.');
      localStorage.removeItem('verifyEmail');
      navigate('/Login');
    } catch (err) {
      alert('❌ ' + err.message);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-[#f9fafe]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow max-w-md w-full"
      >
        <h2 className="text-2xl font-semibold mb-4">Verify Your Email</h2>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full mb-4 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Enter 6-digit code"
          className="w-full mb-4 p-2 border rounded"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Verify
        </button>
      </form>
    </section>
  );
};

export default VerifyCode;
