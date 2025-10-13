'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function CreateJobOfferPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contractType, setContractType] = useState('');
  const [location, setLocation] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ajoute ici la logique pour créer l’offre (API, etc.)
    alert('Offre créée !');
    router.push('/services/joboffers');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8f9ff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 40
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 24,
        boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
        padding: '32px 24px',
        minWidth: 350,
        marginTop: 24,
        marginBottom: 24,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Titre et bouton menu principal */}
        <div style={{ fontSize: 32, fontWeight: 700, color: '#6746a8', marginBottom: 32, textAlign: 'center' }}>
          Portail Admin
        </div>
        <button
          style={{ marginBottom: 24, background: '#eaeaea', color: '#6746a8', border: 'none', borderRadius: 18, padding: '10px 32px', fontWeight: 600, cursor: 'pointer' }}
          onClick={() => router.push('/homepage')}
        >
          Retour au menu principal
        </button>
        {/* Formulaire création offre */}
        <div style={{ fontSize: 24, fontWeight: 600, color: '#6746a8', marginBottom: 24, textAlign: 'center' }}>
          Créer une offre
        </div>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <input
            type="text"
            placeholder="Titre"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
          />
          <input
            type="text"
            placeholder="Type de contrat"
            value={contractType}
            onChange={e => setContractType(e.target.value)}
            style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
            required
          />
          <input
            type="text"
            placeholder="Localisation"
            value={location}
            onChange={e => setLocation(e.target.value)}
            style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
            required
          />
          <input
            type="number"
            placeholder="Salaire minimum (€)"
            value={salaryMin}
            onChange={e => setSalaryMin(e.target.value)}
            style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
          />
          <input
            type="number"
            placeholder="Salaire maximum (€)"
            value={salaryMax}
            onChange={e => setSalaryMax(e.target.value)}
            style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
          />
          <button
            type="submit"
            style={{ background: '#07b9ff', color: '#fff', border: 'none', borderRadius: 18, padding: '10px 32px', fontWeight: 600, cursor: 'pointer', marginTop: 12 }}
          >
            Enregistrer
          </button>
        </form>
        <button
          style={{ marginTop: 24, background: '#eaeaea', color: '#6746a8', border: 'none', borderRadius: 18, padding: '10px 32px', fontWeight: 600, cursor: 'pointer' }}
          onClick={() => router.push('/services/joboffers')}
        >
          Retour à la liste
        </button>
      </div>
    </div>
  );
}