'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import MovaLogo from '../components/MovaLogo';

/* HomePage component - client-side dashboard that shows available admin services.
   It uses client navigation and localStorage to handle logout. */
export default function HomePage() {
  const router = useRouter();

  // Remove stored tokens and navigate back to the login page
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/');
  };

  return (
    // Page background and outer layout
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9ff 0%, #e8e9ff 100%)',
      padding: '40px 20px'
    }}>
      {/* Centered card container for the dashboard */}
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
            {/* Brand/logo component */}
            {/* MovaLogo renders the circular brand mark; size prop controls dimensions */}
            <MovaLogo size={60} />
            <div>
              {/* Title and subtitle */}
              <div style={{ fontSize: 32, fontWeight: 700, color: '#4930a3', marginBottom: 4 }}>
                Portail Administrateur
              </div>
              <div style={{ fontSize: 14, color: '#666' }}>
                Bienvenue sur le panneau d&apos;administration Mova
              </div>
            </div>
          </div>
          {/* Logout button (clears tokens and redirects to login) */}
          {/* Inline hover handlers update background color for visual feedback */}
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
            aria-label="Logout"
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
            {/* Section heading for available services */}
            Services disponibles
          </div>

          {/* Services list - action cards that navigate to management sections */}
          <div style={{ 
            display: 'flex',
            flexDirection: 'row',
            gap: 20,
            marginBottom: 48,
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {/* Users card - navigates to users management */}
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
              // navigate to users management page
              onClick={() => router.push('/services/users')}
              role="button"
              aria-label="Manage users"
            >
              <div style={{ fontSize: 48 }}>👥</div>
              <div>Utilisateurs</div>
            </div>

            {/* Job offers card - navigates to job offers management */}
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
              // navigate to job offers management page
              onClick={() => router.push('/services/joboffers')}
              role="button"
              aria-label="Manage job offers"
            >
              <div style={{ fontSize: 48 }}>💼</div>
              <div>Offres d&apos;emploi</div>
            </div>
          </div>

          {/* Upcoming features section - non-interactive placeholders */}
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
            {/* Placeholder card for CVs feature - visually disabled */}
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
              aria-hidden="true"
            >
              <div style={{ fontSize: 48 }}>📄</div>
              <div style={{ color: '#999' }}>CVs</div>
            </div>

            {/* Placeholder card for Matches feature */}
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
              aria-hidden="true"
            >
              <div style={{ fontSize: 48 }}>🤝</div>
              <div style={{ color: '#999' }}>Matchs</div>
            </div>

            {/* Placeholder card for Swipes feature */}
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
              aria-hidden="true"
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