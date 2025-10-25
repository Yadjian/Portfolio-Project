'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import UsersServices from '../services/users/page';
import MovaLogo from '../components/MovaLogo';

export default function HomePage() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const router = useRouter();

  const handleLogout = () => {
    // Supprimer les tokens du localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // Rediriger vers la page de login
    router.push('/');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8f9ff 0%, #e8e9ff 100%)', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      paddingTop: 60,
      paddingBottom: 60 
    }}>
      <div style={{ 
        background: 'var(--card-background)', 
        borderRadius: 24, 
        boxShadow: '0 8px 32px rgba(73, 48, 163, 0.12)', 
        padding: '48px 40px', 
        minWidth: 400, 
        marginTop: 24, 
        marginBottom: 24, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        border: '1px solid var(--border)'
      }}>
        {/* Logo Mova */}
        <div style={{ marginBottom: 24 }}>
          <MovaLogo size={80} />
        </div>
        
        <div style={{ 
          fontSize: 36, 
          fontWeight: 700, 
          color: 'var(--primary)', 
          marginBottom: 24, 
          textAlign: 'center' 
        }}>
          Portail Admin
        </div>
        
        {/* Bouton de déconnexion */}
        <button
          style={{ 
            background: 'transparent', 
            color: 'var(--text-secondary)', 
            border: '1px solid var(--border)', 
            borderRadius: 8, 
            padding: '8px 20px', 
            fontWeight: 500, 
            cursor: 'pointer',
            fontSize: 13,
            marginBottom: 32,
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'var(--background)';
            e.currentTarget.style.borderColor = 'var(--primary)';
            e.currentTarget.style.color = 'var(--primary)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
          onClick={handleLogout}
        >
          Se déconnecter
        </button>

        {selectedSection && (
          <button
            style={{ 
              marginTop: 24, 
              background: 'var(--background)', 
              color: 'var(--primary)', 
              border: '2px solid var(--border)', 
              borderRadius: 12, 
              padding: '12px 32px', 
              fontWeight: 600, 
              cursor: 'pointer',
              fontSize: 15,
              transition: 'all 0.2s'
            }}
            onClick={() => setSelectedSection(null)}
          >
            ← Retour au menu principal
          </button>
        )}
        {!selectedSection && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 320 }}>
            {/* Boutons actifs */}
            <div style={{ marginBottom: 12 }}>
              <button 
                style={buttonStyle}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'var(--primary)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--primary)';
                }}
                onClick={() => router.push('/services/users')}
              >
                👥 Utilisateurs
              </button>
              <button 
                style={buttonStyle}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'var(--primary)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--primary)';
                }}
                onClick={() => router.push('/services/joboffers')}
              >
                💼 Offres d&apos;emploi
              </button>
            </div>
            {/* Titre et boutons floutés */}
            <div style={{ 
              marginTop: 20,
              marginBottom: 12, 
              fontWeight: 600, 
              color: 'var(--text-secondary)', 
              fontSize: 16, 
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Prochainement
            </div>
            <button style={{ ...buttonStyleDisabled }}>📄 CVs</button>
            <button style={{ ...buttonStyleDisabled }}>🤝 Matchs</button>
            <button style={{ ...buttonStyleDisabled }}>👆 Swipes</button>
          </div>
        )}

        {/* Section utilisateurs : affiche tous les services users */}
        {selectedSection === 'users' && <UsersServices />}

        {/* Ajoute ici les autres sections */}
      </div>
    </div>
  );
}

const buttonStyle = {
  width: '100%',
  height: 56,
  borderRadius: 12,
  background: 'transparent',
  color: 'var(--primary)',
  fontWeight: 600,
  fontSize: 16,
  border: '2px solid var(--primary)',
  marginBottom: 12,
  cursor: 'pointer',
  transition: 'all 0.2s',
};

const buttonStyleDisabled = {
  width: '100%',
  height: 56,
  borderRadius: 12,
  background: 'var(--border)',
  color: 'var(--text-secondary)',
  fontWeight: 600,
  fontSize: 16,
  border: 'none',
  marginBottom: 12,
  cursor: 'not-allowed',
  opacity: 0.5,
  filter: 'blur(1px)',
  pointerEvents: 'none' as const,
};