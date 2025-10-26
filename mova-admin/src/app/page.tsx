'use client';

import { useState } from 'react';
import MovaLogo from './components/MovaLogo';

// Login page component - handles admin authentication
export default function LoginPage() {
  // Form state management
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Handle form submission and authentication
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate required fields
    if (!email || !password) {
      setError('Email et mot de passe requis');
      return;
    }
    
    try {
      // Call login API endpoint
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (!res.ok) {
        throw new Error('Identifiants invalides');
      }
      
      const data = await res.json();
      
      // Store JWT tokens in localStorage
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      // Redirect to homepage after successful login
      window.location.href = '/homepage';
    } catch {
      setError('Identifiants invalides');
    }
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9ff 0%, #e8e9ff 100%)',
      padding: '40px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: 500,
        width: '100%',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(73, 48, 163, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Header section with logo and title */}
        <div style={{
          background: '#fff',
          padding: '32px 48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          borderBottom: '3px solid #4930a3'
        }}>
          <MovaLogo size={70} />
          <div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#4930a3', textAlign: 'center', marginBottom: 4 }}>
              Connexion Admin
            </div>
            <div style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>
              Accédez au panneau d&apos;administration Mova
            </div>
          </div>
        </div>

        {/* Login form */}
        <form onSubmit={handleLogin} style={{ padding: '48px' }}>
          {/* Email input field */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ 
              display: 'block', 
              marginBottom: 8, 
              fontSize: 14, 
              fontWeight: 600, 
              color: '#4930a3' 
            }}>
              Email
            </label>
            <input
              type="email"
              placeholder="admin@mova.app"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '14px 16px', 
                borderRadius: 8, 
                border: '2px solid #e0e0ff', 
                fontSize: 15,
                background: '#fff',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#4930a3'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0ff'}
            />
          </div>

          {/* Password input field */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ 
              display: 'block', 
              marginBottom: 8, 
              fontSize: 14, 
              fontWeight: 600, 
              color: '#4930a3' 
            }}>
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '14px 16px', 
                borderRadius: 8, 
                border: '2px solid #e0e0ff', 
                fontSize: 15,
                background: '#fff',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#4930a3'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0ff'}
            />
          </div>

          {/* Error message display */}
          {error && (
            <div style={{ 
              color: '#e53935',
              marginBottom: 24,
              padding: 12,
              background: 'rgba(229, 57, 53, 0.1)',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            style={{ 
              width: '100%', 
              height: 52, 
              borderRadius: 8, 
              background: '#4930a3', 
              color: '#fff', 
              fontWeight: 600, 
              fontSize: 16, 
              border: 'none', 
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(73, 48, 163, 0.3)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#6746a8'}
            onMouseOut={(e) => e.currentTarget.style.background = '#4930a3'}
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}