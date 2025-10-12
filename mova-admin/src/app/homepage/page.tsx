'use client';

import React, { useState } from 'react';
import UsersServices from '../services/users';

export default function HomePage() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9ff', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 40 }}>
      <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: '32px 24px', minWidth: 350, marginTop: 24, marginBottom: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: '#6746a8', marginBottom: 32, textAlign: 'center' }}>Portail Admin</div>
        {selectedSection && (
          <button
            style={{ marginTop: 24, background: '#eaeaea', color: '#6746a8', border: 'none', borderRadius: 18, padding: '10px 32px', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => setSelectedSection(null)}
          >
            Retour au menu principal
          </button>
        )}
        {!selectedSection && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button style={buttonStyle} onClick={() => setSelectedSection('users')}>Utilisateurs</button>
            <button style={buttonStyle} onClick={() => setSelectedSection('jobOffers')}>Offres</button>
            <button style={buttonStyle} onClick={() => setSelectedSection('cvs')}>CVs</button>
            <button style={buttonStyle} onClick={() => setSelectedSection('matches')}>Matchs</button>
            <button style={buttonStyle} onClick={() => setSelectedSection('swipes')}>Swipes</button>
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
  width: 260,
  height: 48,
  borderRadius: 25,
  background: '#07b9ff',
  color: '#fff',
  fontWeight: 700,
  fontSize: 18,
  border: 'none',
  marginBottom: 18,
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
};