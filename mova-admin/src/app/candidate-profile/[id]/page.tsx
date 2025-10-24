'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function CandidateProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [candidate, setCandidate] = useState<{
  firstName: string;
  lastName: string;
  location: string;
  avatarUrl: string;
  job: string;
  experience: string;
  contractType: string;
  presentation: string;
} | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Remplace par ton vrai fetch API
    async function fetchCandidate() {
      // Exemple: const res = await fetch(`/api/candidates/${id}`);
      // setCandidate(await res.json());
      setCandidate({
        firstName: 'Lucas',
        lastName: 'Martin',
        location: 'Paris',
        avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
        job: 'Développeur',
        experience: 'Débutant',
        contractType: 'CDI',
        presentation: 'Je suis motivé...',
      });
    }
    fetchCandidate();
  }, [id]);

  // Fonction de suppression
  const handleDelete = async () => {
    // Remplace par ton vrai appel API
    // await fetch(`/api/candidates/${id}`, { method: 'DELETE' });
    alert('Candidat supprimé !');
    router.push('/services/users'); // Redirige vers la liste des utilisateurs
  };

  // Fonction de sauvegarde
  const handleSave = async () => {
    // Remplace par ton vrai appel API
    // await fetch(`/api/candidates/${id}`, { method: 'PUT', body: JSON.stringify(candidate) });
    setIsEditing(false);
    alert('Profil modifié !');
  };

  if (!candidate) return <div>Chargement...</div>;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9ff 0%, #e8e9ff 100%)',
      padding: '60px 20px'
    }}>
      <div style={{
        maxWidth: 700,
        margin: '0 auto',
        background: 'var(--card-background)',
        borderRadius: 24,
        boxShadow: '0 8px 32px rgba(73, 48, 163, 0.12)',
        padding: 48,
        border: '1px solid var(--border)'
      }}>
      <div style={{ marginBottom: 32 }}>
        <button
          style={{
            padding: '12px 28px',
            borderRadius: 12,
            background: 'var(--primary)',
            color: '#fff',
            fontWeight: 600,
            fontSize: 15,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(73, 48, 163, 0.3)',
            transition: 'all 0.2s'
          }}
          onClick={() => router.push('/services/users')}
        >
          ← Retour
        </button>
      </div>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <img src={candidate.avatarUrl} alt="Avatar" style={{ 
          width: 120, 
          height: 120, 
          borderRadius: '50%',
          border: '4px solid var(--primary)',
          boxShadow: '0 4px 16px rgba(73, 48, 163, 0.2)'
        }} />
        <h2 style={{ 
          color: 'var(--primary)', 
          marginTop: 20,
          fontSize: 28,
          fontWeight: 700
        }}>Profil Candidat</h2>
      </div>
      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSave();
          }}
        >
          <input
            type="text"
            value={candidate.firstName}
            onChange={e => setCandidate({ ...candidate, firstName: e.target.value })}
            placeholder="Prénom"
            style={{ 
              width: '100%', 
              marginBottom: 16, 
              padding: 14, 
              borderRadius: 12, 
              border: '2px solid var(--border)',
              fontSize: 15,
              boxSizing: 'border-box',
              background: 'var(--card-background)'
            }}
            required
          />
          <input
            type="text"
            value={candidate.lastName}
            onChange={e => setCandidate({ ...candidate, lastName: e.target.value })}
            placeholder="Nom"
            style={{ 
              width: '100%', 
              marginBottom: 16, 
              padding: 14, 
              borderRadius: 12, 
              border: '2px solid var(--border)',
              fontSize: 15,
              boxSizing: 'border-box',
              background: 'var(--card-background)'
            }}
            required
          />
          <input
            type="text"
            value={candidate.location}
            onChange={e => setCandidate({ ...candidate, location: e.target.value })}
            placeholder="Localisation"
            style={{ 
              width: '100%', 
              marginBottom: 16, 
              padding: 14, 
              borderRadius: 12, 
              border: '2px solid var(--border)',
              fontSize: 15,
              boxSizing: 'border-box',
              background: 'var(--card-background)'
            }}
          />
          <input
            type="text"
            value={candidate.job}
            onChange={e => setCandidate({ ...candidate, job: e.target.value })}
            placeholder="Métier"
            style={{ 
              width: '100%', 
              marginBottom: 16, 
              padding: 14, 
              borderRadius: 12, 
              border: '2px solid var(--border)',
              fontSize: 15,
              boxSizing: 'border-box',
              background: 'var(--card-background)'
            }}
          />
          <input
            type="text"
            value={candidate.experience}
            onChange={e => setCandidate({ ...candidate, experience: e.target.value })}
            placeholder="Expérience"
            style={{ 
              width: '100%', 
              marginBottom: 16, 
              padding: 14, 
              borderRadius: 12, 
              border: '2px solid var(--border)',
              fontSize: 15,
              boxSizing: 'border-box',
              background: 'var(--card-background)'
            }}
          />
          <input
            type="text"
            value={candidate.contractType}
            onChange={e => setCandidate({ ...candidate, contractType: e.target.value })}
            placeholder="Type de contrat"
            style={{ 
              width: '100%', 
              marginBottom: 16, 
              padding: 14, 
              borderRadius: 12, 
              border: '2px solid var(--border)',
              fontSize: 15,
              boxSizing: 'border-box',
              background: 'var(--card-background)'
            }}
          />
          <textarea
            value={candidate.presentation}
            onChange={e => setCandidate({ ...candidate, presentation: e.target.value })}
            placeholder="Présentation"
            style={{ 
              width: '100%', 
              marginBottom: 16, 
              padding: 14, 
              borderRadius: 12, 
              border: '2px solid var(--border)', 
              minHeight: 100,
              fontSize: 15,
              boxSizing: 'border-box',
              background: 'var(--card-background)',
              fontFamily: 'inherit'
            }}
          />
          <div style={{ display: 'flex', gap: 16, marginTop: 24, justifyContent: 'center' }}>
            <button
              type="submit"
              style={{
                padding: '14px 40px',
                borderRadius: 12,
                background: 'var(--primary)',
                color: '#fff',
                fontWeight: 600,
                fontSize: 16,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(73, 48, 163, 0.3)',
                transition: 'all 0.2s'
              }}
            >
              Enregistrer
            </button>
            <button
              type="button"
              style={{
                padding: '14px 40px',
                borderRadius: 12,
                background: 'var(--text-secondary)',
                color: '#fff',
                fontWeight: 600,
                fontSize: 16,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onClick={() => setIsEditing(false)}
            >
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <>
          <div style={{ 
            fontSize: 16, 
            marginBottom: 16,
            padding: 16,
            background: 'var(--background)',
            borderRadius: 12,
            border: '1px solid var(--border)'
          }}>
            <strong style={{ color: 'var(--primary)' }}>Prénom :</strong> {candidate.firstName}
          </div>
          <div style={{ 
            fontSize: 16, 
            marginBottom: 16,
            padding: 16,
            background: 'var(--background)',
            borderRadius: 12,
            border: '1px solid var(--border)'
          }}>
            <strong style={{ color: 'var(--primary)' }}>Nom :</strong> {candidate.lastName}
          </div>
          <div style={{ 
            fontSize: 16, 
            marginBottom: 16,
            padding: 16,
            background: 'var(--background)',
            borderRadius: 12,
            border: '1px solid var(--border)'
          }}>
            <strong style={{ color: 'var(--primary)' }}>Localisation :</strong> {candidate.location}
          </div>
          <div style={{ 
            fontSize: 16, 
            marginBottom: 16,
            padding: 16,
            background: 'var(--background)',
            borderRadius: 12,
            border: '1px solid var(--border)'
          }}>
            <strong style={{ color: 'var(--primary)' }}>Métier :</strong> {candidate.job}
          </div>
          <div style={{ 
            fontSize: 16, 
            marginBottom: 16,
            padding: 16,
            background: 'var(--background)',
            borderRadius: 12,
            border: '1px solid var(--border)'
          }}>
            <strong style={{ color: 'var(--primary)' }}>Expérience :</strong> {candidate.experience}
          </div>
          <div style={{ 
            fontSize: 16, 
            marginBottom: 16,
            padding: 16,
            background: 'var(--background)',
            borderRadius: 12,
            border: '1px solid var(--border)'
          }}>
            <strong style={{ color: 'var(--primary)' }}>Type de contrat :</strong> {candidate.contractType}
          </div>
          <div style={{ 
            fontSize: 16, 
            marginBottom: 16,
            padding: 16,
            background: 'var(--background)',
            borderRadius: 12,
            border: '1px solid var(--border)'
          }}>
            <strong style={{ color: 'var(--primary)' }}>Présentation :</strong> {candidate.presentation}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 32, justifyContent: 'center' }}>
            <button
              style={{
                padding: '14px 40px',
                borderRadius: 12,
                background: 'var(--primary)',
                color: '#fff',
                fontWeight: 600,
                fontSize: 16,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(73, 48, 163, 0.3)',
                transition: 'all 0.2s'
              }}
              onClick={() => setIsEditing(true)}
            >
              ✏️ Modifier
            </button>
            <button
              style={{
                padding: '14px 40px',
                borderRadius: 12,
                background: 'var(--error)',
                color: '#fff',
                fontWeight: 600,
                fontSize: 16,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                transition: 'all 0.2s'
              }}
              onClick={handleDelete}
            >
              🗑️ Supprimer
            </button>
          </div>
        </>
      )}
      </div>
    </div>
  );
}