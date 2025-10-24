'use client';

import { useState } from 'react';
import MovaLogo from './components/MovaLogo'; // adapte le chemin si besoin

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email et mot de passe requis');
      return;
    }
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (!res.ok) {
        throw new Error('Identifiants invalides');
      }
      
      const data = await res.json();
      
      // Stocker les tokens
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      window.location.href = '/homepage';
    } catch {
      setError('Identifiants invalides');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'linear-gradient(135deg, #f8f9ff 0%, #e8e9ff 100%)' 
    }}>
      <form onSubmit={handleLogin} style={{ 
        background: 'var(--card-background)', 
        padding: 48, 
        borderRadius: 24, 
        boxShadow: '0 8px 32px rgba(73, 48, 163, 0.12)', 
        width: 400,
        maxWidth: 400,
        border: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <MovaLogo size={100} />
        </div>
        <h1 style={{ 
          fontSize: 32, 
          color: 'var(--primary)', 
          marginBottom: 8, 
          textAlign: 'center',
          fontWeight: 700
        }}>
          Connexion Admin
        </h1>
        <p style={{
          textAlign: 'center',
          color: 'var(--text-secondary)',
          marginBottom: 32,
          fontSize: 15
        }}>
          Accédez au panneau d&apos;administration
        </p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ 
            width: '100%', 
            padding: 14, 
            borderRadius: 12, 
            border: '2px solid var(--border)', 
            marginBottom: 16, 
            fontSize: 16,
            background: 'var(--card-background)',
            boxSizing: 'border-box'
          }}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ 
            width: '100%', 
            padding: 14, 
            borderRadius: 12, 
            border: '2px solid var(--border)', 
            marginBottom: 20, 
            fontSize: 16,
            background: 'var(--card-background)',
            boxSizing: 'border-box'
          }}
        />
        {error && (
          <div style={{ 
            color: 'var(--error)', 
            marginBottom: 20,
            padding: 12,
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: 8,
            fontSize: 14
          }}>
            {error}
          </div>
        )}
        <button
          type="submit"
          style={{ 
            width: '100%', 
            height: 52, 
            borderRadius: 12, 
            background: 'var(--primary)', 
            color: '#fff', 
            fontWeight: 600, 
            fontSize: 16, 
            border: 'none', 
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(73, 48, 163, 0.3)'
          }}
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}