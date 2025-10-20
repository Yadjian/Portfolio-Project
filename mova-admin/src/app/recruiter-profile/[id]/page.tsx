'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function RecruiterProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [recruiter, setRecruiter] = useState<{
  firstName: string;
  lastName: string;
  location: string;
  avatarUrl: string;
  companyName: string;
  siret: string;
  jobSeeking: string;
  experienceRequired: string;
  contractType: string;
  presentation: string;
} | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Remplace par ton vrai fetch API
    async function fetchRecruiter() {
      setRecruiter({
        firstName: 'Jean',
        lastName: 'Dupont',
        companyName: 'TechCorp Solutions',
        siret: '123 456 789 00012',
        location: 'Lyon, France',
        avatarUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
        jobSeeking: 'Développeur',
        experienceRequired: 'Intermédiaire',
        contractType: 'CDI',
        presentation: "Nous recherchons un développeur passionné pour rejoindre notre équipe dynamique et innovative !",
      });
    }
    fetchRecruiter();
  }, [id]);

  // Fonction de suppression
  const handleDelete = async () => {
    // Remplace par ton vrai appel API
    // await fetch(`/api/recruiters/${id}`, { method: 'DELETE' });
    alert('Recruteur supprimé !');
    router.push('/services/users'); // Redirige vers la liste des users
  };

  // Fonction de sauvegarde
  const handleSave = async () => {
    // Remplace par ton vrai appel API
    // await fetch(`/api/recruiters/${id}`, { method: 'PUT', body: JSON.stringify(recruiter) });
    setIsEditing(false);
    alert('Profil modifié !');
  };

  if (!recruiter) return <div>Chargement...</div>;

  return (
    <div style={{
      maxWidth: 600,
      margin: '0 auto',
      background: '#fff',
      borderRadius: 24,
      boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
      padding: 32
    }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <img src={recruiter.avatarUrl} alt="Avatar" style={{ width: 100, height: 100, borderRadius: '50%' }} />
        <h2 style={{ color: '#6746a8', marginTop: 16 }}>Mon Profil</h2>
      </div>
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
      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSave();
          }}
        >
          <input
            type="text"
            value={recruiter.firstName}
            onChange={e => setRecruiter({ ...recruiter, firstName: e.target.value })}
            placeholder="Prénom"
            style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
            required
          />
          <input
            type="text"
            value={recruiter.lastName}
            onChange={e => setRecruiter({ ...recruiter, lastName: e.target.value })}
            placeholder="Nom"
            style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
            required
          />
          <input
            type="text"
            value={recruiter.companyName}
            onChange={e => setRecruiter({ ...recruiter, companyName: e.target.value })}
            placeholder="Entreprise"
            style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
            required
          />
          <input
            type="text"
            value={recruiter.siret}
            onChange={e => setRecruiter({ ...recruiter, siret: e.target.value })}
            placeholder="SIRET"
            style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
          />
          <input
            type="text"
            value={recruiter.location}
            onChange={e => setRecruiter({ ...recruiter, location: e.target.value })}
            placeholder="Localisation"
            style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
          />
          <input
            type="text"
            value={recruiter.jobSeeking}
            onChange={e => setRecruiter({ ...recruiter, jobSeeking: e.target.value })}
            placeholder="Poste recherché"
            style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
          />
          <input
            type="text"
            value={recruiter.experienceRequired}
            onChange={e => setRecruiter({ ...recruiter, experienceRequired: e.target.value })}
            placeholder="Expérience requise"
            style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
          />
          <input
            type="text"
            value={recruiter.contractType}
            onChange={e => setRecruiter({ ...recruiter, contractType: e.target.value })}
            placeholder="Type de contrat"
            style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
          />
          <textarea
            value={recruiter.presentation}
            onChange={e => setRecruiter({ ...recruiter, presentation: e.target.value })}
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
          <div style={{ fontSize: 18, marginBottom: 8 }}><strong>Prénom :</strong> {recruiter.firstName}</div>
          <div style={{ fontSize: 18, marginBottom: 8 }}><strong>Nom :</strong> {recruiter.lastName}</div>
          <div style={{ fontSize: 18, marginBottom: 8 }}><strong>Entreprise :</strong> {recruiter.companyName}</div>
          <div style={{ fontSize: 18, marginBottom: 8 }}><strong>SIRET :</strong> {recruiter.siret}</div>
          <div style={{ fontSize: 18, marginBottom: 8 }}><strong>Localisation :</strong> {recruiter.location}</div>
          <div style={{ fontSize: 18, marginBottom: 8 }}><strong>Poste recherché :</strong> {recruiter.jobSeeking}</div>
          <div style={{ fontSize: 18, marginBottom: 8 }}><strong>Expérience requise :</strong> {recruiter.experienceRequired}</div>
          <div style={{ fontSize: 18, marginBottom: 8 }}><strong>Type de contrat :</strong> {recruiter.contractType}</div>
          <div style={{ fontSize: 18, marginBottom: 8 }}><strong>Présentation :</strong> {recruiter.presentation}</div>
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