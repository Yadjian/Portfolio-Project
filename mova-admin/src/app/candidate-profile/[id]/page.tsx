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
      maxWidth: 600,
      margin: '0 auto',
      background: '#fff',
      borderRadius: 24,
      boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
      padding: 32
    }}>
      <div style={{ marginBottom: 24 }}>
        <button
          style={{
            padding: '8px 24px',
            borderRadius: 10,
            background: '#07b9ff',
            color: '#fff',
            fontWeight: 600,
            fontSize: 15,
            border: 'none',
            cursor: 'pointer'
          }}
          onClick={() => router.push('/services/users')}
        >
          ← Retour
        </button>
      </div>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <img src={candidate.avatarUrl} alt="Avatar" style={{ width: 100, height: 100, borderRadius: '50%' }} />
        <h2 style={{ color: '#6746a8', marginTop: 16 }}>Mon Profil</h2>
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
            style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
            required
          />
          <input
            type="text"
            value={candidate.lastName}
            onChange={e => setCandidate({ ...candidate, lastName: e.target.value })}
            placeholder="Nom"
            style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
            required
          />
          <input
            type="text"
            value={candidate.location}
            onChange={e => setCandidate({ ...candidate, location: e.target.value })}
            placeholder="Localisation"
            style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
          />
          <input
            type="text"
            value={candidate.job}
            onChange={e => setCandidate({ ...candidate, job: e.target.value })}
            placeholder="Métier"
            style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
          />
          <input
            type="text"
            value={candidate.experience}
            onChange={e => setCandidate({ ...candidate, experience: e.target.value })}
            placeholder="Expérience"
            style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
          />
          <input
            type="text"
            value={candidate.contractType}
            onChange={e => setCandidate({ ...candidate, contractType: e.target.value })}
            placeholder="Type de contrat"
            style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
          />
          <textarea
            value={candidate.presentation}
            onChange={e => setCandidate({ ...candidate, presentation: e.target.value })}
            placeholder="Présentation"
            style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 8, border: '1px solid #ccc', minHeight: 60 }}
          />
          <div style={{ display: 'flex', gap: 16, marginTop: 16, justifyContent: 'center' }}>
            <button
              type="submit"
              style={{
                padding: '10px 32px',
                borderRadius: 12,
                background: '#6746a8',
                color: '#fff',
                fontWeight: 600,
                fontSize: 16,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Enregistrer
            </button>
            <button
              type="button"
              style={{
                padding: '10px 32px',
                borderRadius: 12,
                background: '#999',
                color: '#fff',
                fontWeight: 600,
                fontSize: 16,
                border: 'none',
                cursor: 'pointer'
              }}
              onClick={() => setIsEditing(false)}
            >
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <>
          <div style={{ fontSize: 18, marginBottom: 8 }}><strong>Prénom :</strong> {candidate.firstName}</div>
          <div style={{ fontSize: 18, marginBottom: 8 }}><strong>Nom :</strong> {candidate.lastName}</div>
          <div style={{ fontSize: 18, marginBottom: 8 }}><strong>Localisation :</strong> {candidate.location}</div>
          <div style={{ fontSize: 18, marginBottom: 8 }}><strong>Métier :</strong> {candidate.job}</div>
          <div style={{ fontSize: 18, marginBottom: 8 }}><strong>Expérience :</strong> {candidate.experience}</div>
          <div style={{ fontSize: 18, marginBottom: 8 }}><strong>Type de contrat :</strong> {candidate.contractType}</div>
          <div style={{ fontSize: 18, marginBottom: 8 }}><strong>Présentation :</strong> {candidate.presentation}</div>
          <div style={{ display: 'flex', gap: 16, marginTop: 32, justifyContent: 'center' }}>
            <button
              style={{
                padding: '10px 32px',
                borderRadius: 12,
                background: '#6746a8',
                color: '#fff',
                fontWeight: 600,
                fontSize: 16,
                border: 'none',
                cursor: 'pointer'
              }}
              onClick={() => setIsEditing(true)}
            >
              Modifier
            </button>
            <button
              style={{
                padding: '10px 32px',
                borderRadius: 12,
                background: '#e53935',
                color: '#fff',
                fontWeight: 600,
                fontSize: 16,
                border: 'none',
                cursor: 'pointer'
              }}
              onClick={handleDelete}
            >
              Supprimer
            </button>
          </div>
        </>
      )}
    </div>
  );
}