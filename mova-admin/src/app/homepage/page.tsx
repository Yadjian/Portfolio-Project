'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import MovaLogo from '../components/MovaLogo';

export default function HomePage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/');
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9ff 0%, #e8e9ff 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(73, 48, 163, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: '#fff',
          padding: '32px 48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '3px solid #4930a3'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <MovaLogo size={60} />
            <div>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#4930a3', marginBottom: 4 }}>
                Portail Administrateur
              </div>
              <div style={{ fontSize: 14, color: '#666' }}>
                Bienvenue sur le panneau d&apos;administration Mova
              </div>
            </div>
          </div>
          <button
            style={{ 
              background: '#e53935', 
              color: '#fff',
              border: 'none', 
              borderRadius: 8, 
              padding: '10px 24px', 
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 14,
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#c62828'}
            onMouseOut={(e) => e.currentTarget.style.background = '#e53935'}
            onClick={handleLogout}
          >
            Déconnexion
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '48px' }}>
          <div style={{ 
            fontSize: 24, 
            fontWeight: 700, 
            color: '#4930a3', 
            marginBottom: 32,
            textAlign: 'center'
          }}>
            Services disponibles
          </div>

          {/* Liste de services */}
          <div style={{ 
            display: 'flex',
            flexDirection: 'row',
            gap: 20,
            marginBottom: 48,
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {/* Utilisateurs */}
            <div
              style={{
                background: '#f8f9ff',
                border: '2px solid #e0e0ff',
                borderRadius: 12,
                padding: '24px 32px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                color: '#4930a3',
                fontWeight: 600,
                fontSize: 16,
                minWidth: 200,
                maxWidth: 250
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#e8e9ff';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#f8f9ff';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onClick={() => router.push('/services/users')}
            >
              <div style={{ fontSize: 48 }}>👥</div>
              <div>Utilisateurs</div>
            </div>

            {/* Offres d'emploi */}
            <div
              style={{
                background: '#f8f9ff',
                border: '2px solid #e0e0ff',
                borderRadius: 12,
                padding: '24px 32px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                color: '#4930a3',
                fontWeight: 600,
                fontSize: 16,
                minWidth: 200,
                maxWidth: 250
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#e8e9ff';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#f8f9ff';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onClick={() => router.push('/services/joboffers')}
            >
              <div style={{ fontSize: 48 }}>💼</div>
              <div>Offres d&apos;emploi</div>
            </div>
          </div>

          {/* Services à venir */}
          <div style={{ 
            fontSize: 14, 
            fontWeight: 700, 
            color: '#999', 
            marginBottom: 20,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            textAlign: 'center'
          }}>
            Prochainement
          </div>

          <div style={{ 
            display: 'flex',
            flexDirection: 'row',
            gap: 20,
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {/* CVs */}
            <div
              style={{
                background: '#f5f5f5',
                borderRadius: 12,
                padding: '24px 32px',
                opacity: 0.5,
                cursor: 'not-allowed',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                fontSize: 16,
                fontWeight: 600,
                minWidth: 200,
                maxWidth: 250
              }}
            >
              <div style={{ fontSize: 48 }}>📄</div>
              <div style={{ color: '#999' }}>CVs</div>
            </div>

            {/* Matchs */}
            <div
              style={{
                background: '#f5f5f5',
                borderRadius: 12,
                padding: '24px 32px',
                opacity: 0.5,
                cursor: 'not-allowed',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                fontSize: 16,
                fontWeight: 600,
                minWidth: 200,
                maxWidth: 250
              }}
            >
              <div style={{ fontSize: 48 }}>🤝</div>
              <div style={{ color: '#999' }}>Matchs</div>
            </div>

            {/* Swipes */}
            <div
              style={{
                background: '#f5f5f5',
                borderRadius: 12,
                padding: '24px 32px',
                opacity: 0.5,
                cursor: 'not-allowed',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                fontSize: 16,
                fontWeight: 600,
                minWidth: 200,
                maxWidth: 250
              }}
            >
              <div style={{ fontSize: 48 }}>👆</div>
              <div style={{ color: '#999' }}>Swipes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}