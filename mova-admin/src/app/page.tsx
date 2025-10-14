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
      if (!res.ok) throw new Error('Identifiants invalides');
      window.location.href = '/homepage';
    } catch (err) {
      setError('Identifiants invalides');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9ff' }}>
      <form onSubmit={handleLogin} style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', minWidth: 320 }}>
        <MovaLogo size={120} />
        <h1 style={{ fontSize: 28, color: '#6746a8', marginBottom: 24, textAlign: 'center' }}>Connexion Admin</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #d1d5db', marginBottom: 18, fontSize: 16 }}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #d1d5db', marginBottom: 18, fontSize: 16 }}
        />
        {error && <div style={{ color: '#e53935', marginBottom: 18 }}>{error}</div>}
        <button
          type="submit"
          style={{ width: '100%', height: 44, borderRadius: 8, background: '#07b9ff', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', cursor: 'pointer' }}
        >
          Se connecter
        </button>
        {/* <button
          type="button"
          onClick={() => loginWithRedirect()} // Auth0 only
          style={{ width: '100%', height: 44, borderRadius: 8, background: '#07b9ff', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', cursor: 'pointer', marginTop: 12 }}
        >
          Se connecter avec Auth0
        </button> */}
        {/* // Backend only: après login, vérifier les permissions et rediriger selon le rôle */}
      </form>
    </div>
  );
}