'use client';

// import { useAuth0 } from '@auth0/auth0-react'; // Auth0 only
// import { useEffect, useState } from 'react'; // Auth0 only
// import { useRouter } from 'next/navigation'; // Auth0 only

import { useState } from 'react';

export default function LoginPage() {
  // const { isAuthenticated, loginWithRedirect } = useAuth0(); // Auth0 only
  // const router = useRouter(); // Auth0 only

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     router.push('/homepage');
  //   }
  // }, [isAuthenticated, router]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Backend/Auth0 only: ici tu pourras appeler ton API d'authentification ou Auth0
    // loginWithRedirect();
    if (!email || !password) {
      setError('Email et mot de passe requis');
      return;
    }
    // Dev only: redirection locale
    window.location.href = '/homepage';
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9ff' }}>
      <form onSubmit={handleLogin} style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', minWidth: 320 }}>
        <h1 style={{ fontSize: 28, color: '#6746a8', marginBottom: 24 }}>Connexion Admin</h1>
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